import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = "re_X1qQXyN5_H6DeCNqGKi15DCZ6htSkcnVT";
const FROM_EMAIL = "support@larggold.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, firmName } = await req.json();

    if (!to || !firmName) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, firmName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Larg Gold</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#002a0a 0%,#004d12 100%);padding:40px 48px 32px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:900;letter-spacing:3px;color:#fcc201;font-family:'Georgia',serif;">LARG GOLD</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:1px;text-transform:uppercase;">Premium Precious Metals</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 36px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.7;">
                Dear <strong style="color:#1a1a1a;">${firmName}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:16px;color:#444;line-height:1.8;">
                On behalf of the entire team at <strong>Larg Gold</strong>, we extend to you a warm and heartfelt welcome. We are truly delighted to have you as part of our distinguished community of precious metal traders and investors.
              </p>
              <p style="margin:0 0 20px;font-size:16px;color:#444;line-height:1.8;">
                Your account has been successfully created and you now have access to our live MCX gold, silver, and metal rate platform — delivering real-time market prices with precision and reliability, tailored for professionals like yourself.
              </p>
              <p style="margin:0 0 20px;font-size:16px;color:#444;line-height:1.8;">
                Should you have any queries or require assistance, our support team is always at your service. We are committed to providing you with an exceptional experience every step of the way.
              </p>

              <!-- Quote Block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:36px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#fffbea,#fff8d6);border-left:4px solid #fcc201;border-radius:0 8px 8px 0;padding:24px 28px;">
                    <p style="margin:0;font-size:17px;font-style:italic;color:#5a4500;line-height:1.7;">
                      &ldquo;Gold is the money of kings, silver is the money of gentlemen, barter is the money of peasants — but at Larg Gold, we make the language of precious metals speak clearly to every trader, every day.&rdquo;
                    </p>
                    <p style="margin:12px 0 0;font-size:13px;color:#a07800;font-weight:700;letter-spacing:1px;text-transform:uppercase;">— The Larg Gold Team</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:16px;color:#444;line-height:1.8;">
                We look forward to a long and prosperous association with you.
              </p>
              <p style="margin:16px 0 0;font-size:16px;color:#1a1a1a;line-height:1.8;">
                Warm regards,<br />
                <strong>The Larg Gold Support Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#002a0a;padding:24px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;">
                &copy; ${new Date().getFullYear()} Larg Gold. All rights reserved.<br />
                This email was sent to you because you registered on our platform.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Larg Gold <${FROM_EMAIL}>`,
        to: [to],
        subject: "Welcome to Larg Gold — Your Account is Ready",
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
