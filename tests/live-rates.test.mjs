import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const quote = {
  goldInr: 100000, silverInr: 120000, goldUsd: 3000, silverUsd: 40,
  usdInr: 85, goldChange: 1, silverChange: 2, usdInrChange: 0,
  cachedAt: '2026-10-28T06:00:00.000Z',
};
const flush = () => new Promise(resolve => setImmediate(resolve));

function compile(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8')
    .replaceAll('import.meta.env', 'testEnv'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

// Run the actual hook with deterministic timers and fake network responses.
// State setters retain values so cleanup and failed-fetch behavior are observable.
function mountHook(fetchResponse = async () => Response.json(quote)) {
  const states = [];
  const effects = [];
  const intervals = new Map();
  const timeouts = new Map();
  const requests = [];
  let id = 0;
  const react = {
    useState(initial) {
      const index = states.push(initial) - 1;
      return [initial, value => { states[index] = value; }];
    },
    useRef: current => ({ current }),
    useEffect: effect => effects.push(effect),
  };
  const context = vm.createContext({
    exports: {}, require: () => react, Date, AbortController,
    testEnv: { VITE_SUPABASE_URL: 'https://rates.example', VITE_SUPABASE_ANON_KEY: 'test' },
    fetch: async (...args) => { requests.push(args); return fetchResponse(...args); },
    setInterval: (fn, delay) => { intervals.set(++id, { fn, delay }); return id; },
    clearInterval: key => intervals.delete(key),
    setTimeout: (fn, delay) => { timeouts.set(++id, { fn, delay }); return id; },
    clearTimeout: key => timeouts.delete(key),
  });
  vm.runInContext(compile('../src/hooks/useLiveRates.ts'), context);
  context.exports.useLiveRates();
  const cleanups = effects.map(effect => effect());
  return {
    states, requests, intervals, timeouts,
    tick: () => { for (const { fn } of intervals.values()) fn(); },
    unmount: () => cleanups.forEach(cleanup => cleanup?.()),
  };
}

test('fetches immediately and every second, displaying the source fetch time', async () => {
  const hook = mountHook();
  await flush();
  assert.equal(hook.requests.length, 1);
  assert.equal([...hook.intervals.values()][0].delay, 1000);
  assert.equal(hook.states[4].toISOString(), quote.cachedAt);
  assert.equal(hook.requests[0][1].cache, 'no-store');
  hook.tick();
  await flush();
  assert.equal(hook.requests.length, 2);
  hook.unmount();
});

test('slow requests do not overlap and unmount cancels the active request', async () => {
  let resolve;
  const hook = mountHook(() => new Promise(done => { resolve = done; }));
  hook.tick();
  hook.tick();
  assert.equal(hook.requests.length, 1);
  const signal = hook.requests[0][1].signal;
  assert.ok(signal);
  hook.unmount();
  assert.equal(signal.aborted, true);
  assert.equal(hook.intervals.size, 0);
  const before = [...hook.states];
  resolve(Response.json(quote));
  await flush();
  assert.deepEqual(hook.states, before);
  assert.equal(hook.timeouts.size, 0);
});

test('retains the last quote after failure and recovers on the next second', async () => {
  let fail = false;
  const hook = mountHook(async () => {
    if (fail) throw new Error('Network unavailable');
    return Response.json(quote);
  });
  await flush();
  const previous = hook.states[0];
  fail = true;
  hook.tick();
  await flush();
  assert.equal(hook.states[0], previous);
  assert.match(hook.states[6], /Retrying/);
  fail = false;
  hook.tick();
  await flush();
  assert.equal(hook.requests.length, 3);
  assert.equal(hook.states[6], null);
  hook.unmount();
});

test('a stalled fetch times out and allows subsequent polling', async () => {
  const hook = mountHook((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Timed out')));
  }));
  const timeout = [...hook.timeouts.values()][0];
  assert.ok(timeout);
  assert.equal(timeout.delay, 10000);
  timeout.fn();
  await flush();
  hook.tick();
  assert.equal(hook.requests.length, 2);
  hook.unmount();
  await flush();
});

async function serveCachedQuote(age) {
  const fixedNow = Date.parse('2026-10-28T06:00:00Z');
  const fetchedAt = new Date(fixedNow - age).toISOString();
  let handler;
  let fetches = 0;
  const context = vm.createContext({
    exports: {}, Response, AbortSignal,
    Date: class extends Date { static now() { return fixedNow; } },
    Deno: { env: { get: () => 'test' }, serve: fn => { handler = fn; } },
    require: () => ({ createClient: () => ({ from: () => ({
      select() { return this; }, eq() { return this; },
      maybeSingle: async () => ({ data: { data: quote, fetched_at: fetchedAt } }),
    }) }) }),
    fetch: async () => { fetches++; throw new Error('Feed unavailable'); },
  });
  vm.runInContext(compile('../supabase/functions/metal-rates/index.ts'), context);
  const response = await handler(new Request('https://rates.example'));
  return { response, payload: await response.json(), fetches, fetchedAt };
}

test('server reuses a quote under one second without contacting the feed', async () => {
  const result = await serveCachedQuote(999);
  assert.equal(result.fetches, 0);
  assert.equal(result.payload.cachedAt, result.fetchedAt);
  assert.equal(result.response.headers.get('Cache-Control'), 'no-store');
});

test('server refreshes a quote older than one second and preserves stale time on failure', async () => {
  const result = await serveCachedQuote(1001);
  assert.ok(result.fetches > 0);
  assert.equal(result.payload.fromCache, true);
  assert.equal(result.payload.cachedAt, result.fetchedAt);
  assert.equal(result.payload.goldInr, quote.goldInr);
});
