import PostalMime from 'postal-mime';

interface Env {
  ASSETS: Fetcher;
  INBOX: D1Database;
  // Optional: a verified Email Routing destination that also gets a copy.
  FORWARD_TO?: string;
}

const APEX = 'mossscott.com';
// D1 rows max out around 2 MB, so very long bodies are clipped.
const MAX_BODY = 400_000;
const clip = (value?: string | null) => (value ? value.slice(0, MAX_BODY) : null);

export default {
  // The site itself: static files from ./dist, with www redirected to the apex.
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },

  // The inbox: Email Routing sends work@ and hello@ here.
  async email(message, env) {
    const raw = await new Response(message.raw).arrayBuffer();

    try {
      const parsed = await PostalMime.parse(raw);
      const attachments = (parsed.attachments ?? []).map((a) => ({
        filename: a.filename ?? null,
        mimeType: a.mimeType,
        size: typeof a.content === 'string' ? a.content.length : a.content.byteLength,
      }));

      await env.INBOX.prepare(
        `INSERT OR IGNORE INTO emails
          (mailbox, from_address, from_name, reply_to, subject, text_body, html_body,
           message_id, in_reply_to, references_header, attachments, raw_size)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          message.to,
          message.from,
          parsed.from?.name || null,
          parsed.replyTo?.[0]?.address ?? null,
          parsed.subject ?? null,
          clip(parsed.text),
          clip(parsed.html),
          parsed.messageId || message.headers.get('message-id') || null,
          parsed.inReplyTo ?? null,
          parsed.references ?? null,
          JSON.stringify(attachments),
          message.rawSize,
        )
        .run();
    } catch (error) {
      console.error('Failed to store email', { from: message.from, to: message.to, error: String(error) });
      // Without a forwarding address, fail loudly so the sender gets a bounce
      // instead of the message vanishing.
      if (!env.FORWARD_TO) throw error;
    }

    if (env.FORWARD_TO) await message.forward(env.FORWARD_TO);
  },
} satisfies ExportedHandler<Env>;
