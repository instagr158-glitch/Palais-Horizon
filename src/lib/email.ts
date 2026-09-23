import { Resend } from "resend";
import type { Locale } from "@/i18n";

const apiKey = process.env.RESEND_API_KEY;
export const emailConfigured = !!apiKey;

const resend = apiKey ? new Resend(apiKey) : null;

// Resend's shared sending domain works with no DNS setup — swap in your own
// verified domain (EMAIL_FROM) once you have one, for better deliverability.
const FROM = process.env.EMAIL_FROM ?? "Palais Horizon <onboarding@resend.dev>";

const COPY: Record<
  Locale,
  {
    subject: string;
    preheader: string;
    title: string;
    body: string;
    cta: string;
    fallback: string;
    footer: string;
  }
> = {
  en: {
    subject: "Continue on Palais Horizon",
    preheader: "Open Palais Horizon to finish creating your account.",
    title: "Continue on Palais Horizon",
    body: "Tap the button below to open Palais Horizon in your browser and finish creating your account.",
    cta: "Open Palais Horizon",
    fallback: "If the button doesn't work, copy this link into your browser:",
    footer: "Didn't request this? You can safely ignore this email.",
  },
  fr: {
    subject: "Continuez sur Palais Horizon",
    preheader: "Ouvrez Palais Horizon pour finaliser la création de votre compte.",
    title: "Continuez sur Palais Horizon",
    body: "Appuyez sur le bouton ci-dessous pour ouvrir Palais Horizon dans votre navigateur et finaliser la création de votre compte.",
    cta: "Ouvrir Palais Horizon",
    fallback: "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :",
    footer: "Vous n'êtes pas à l'origine de cette demande ? Ignorez simplement cet e-mail.",
  },
  de: {
    subject: "Weiter auf Palais Horizon",
    preheader: "Öffnen Sie Palais Horizon, um Ihr Konto fertig einzurichten.",
    title: "Weiter auf Palais Horizon",
    body: "Tippen Sie unten, um Palais Horizon in Ihrem Browser zu öffnen und die Einrichtung Ihres Kontos abzuschließen.",
    cta: "Palais Horizon öffnen",
    fallback: "Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
    footer: "Diese Anfrage stammt nicht von Ihnen? Ignorieren Sie diese E-Mail einfach.",
  },
};

function checkoutEmailHtml(siteUrl: string, locale: Locale): string {
  const c = COPY[locale];
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#0b0b0c;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;">${c.preheader}</span>
    <table role="presentation" width="100%" style="background-color:#0b0b0c;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" style="max-width:480px;background-color:#141416;border:1px solid #2a2a2e;border-radius:6px;padding:32px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <span style="font-size:20px;font-weight:700;letter-spacing:0.14em;color:#f3f2ee;">PALAIS <span style="color:#d4af37;">HORIZON</span></span>
              </td>
            </tr>
            <tr>
              <td>
                <h1 style="color:#f3f2ee;font-size:22px;margin:0 0 12px;text-align:center;font-weight:600;">${c.title}</h1>
                <p style="color:#c7c9cc;font-size:14px;line-height:1.6;text-align:center;margin:0 0 28px;">${c.body}</p>
                <table role="presentation" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:28px;">
                      <a href="${siteUrl}" style="display:inline-block;background-image:linear-gradient(135deg,#f6d98a,#d4af37 55%,#a9801e);color:#101010;font-weight:600;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">${c.cta}</a>
                    </td>
                  </tr>
                </table>
                <p style="color:#7a7a7d;font-size:12px;line-height:1.5;margin:0 0 4px;">${c.fallback}</p>
                <p style="color:#a6a6a2;font-size:12px;line-height:1.5;word-break:break-all;margin:0 0 24px;">${siteUrl}</p>
                <hr style="border:none;border-top:1px solid #2a2a2e;margin:0 0 20px;" />
                <p style="color:#7a7a7d;font-size:11px;line-height:1.5;text-align:center;margin:0;">${c.footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendCheckoutEmail(opts: {
  to: string;
  siteUrl: string;
  locale: Locale;
}): Promise<void> {
  if (!resend) throw new Error("Email is not configured.");
  // The SDK never throws on an API-level failure — it resolves to
  // { data, error } either way — so a rejected send (e.g. the shared
  // onboarding@resend.dev domain refusing an unverified recipient) would
  // otherwise look identical to success unless we check `error` ourselves.
  const { error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: COPY[opts.locale].subject,
    html: checkoutEmailHtml(opts.siteUrl, opts.locale),
  });
  if (error) {
    throw new Error(error.message ?? "Resend failed to send the email.");
  }
}
