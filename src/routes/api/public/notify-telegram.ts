import { createFileRoute } from '@tanstack/react-router'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const CHAT_ID = '8094960771'
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram'

function escapeMd(s: unknown): string {
  if (s === null || s === undefined) return '-'
  return String(s).replace(/([_*`\[\]])/g, '\\$1')
}

export const Route = createFileRoute('/api/public/notify-telegram')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const provided = request.headers.get('x-notify-secret') ?? ''
          if (!provided) return new Response('Unauthorized', { status: 401 })

          const { data: secretRow, error: secretErr } = await supabaseAdmin
            .from('app_secrets')
            .select('value')
            .eq('key', 'telegram_notify_secret')
            .single()

          if (secretErr || !secretRow?.value) {
            console.error('Failed to load notify secret:', secretErr)
            return new Response('Server misconfigured', { status: 500 })
          }
          if (provided !== secretRow.value) {
            return new Response('Unauthorized', { status: 401 })
          }

          const body = (await request.json()) as { type?: string; record?: any }
          const { type, record } = body
          if (!type || !record) {
            return new Response('Bad request', { status: 400 })
          }

          let text = ''
          if (type === 'enrollments') {
            if (record.status === 'Gift Claimed') {
              text =
                `🎁 *Gift Claimed (Partial)*\n\n` +
                `*Name:* ${escapeMd(record.name)}\n` +
                `*Mobile:* ${escapeMd(record.mobile)}\n` +
                `_Awaiting Step 2 — follow up on WhatsApp if no completion soon._`
            } else {
              text =
                `🎓 *New Enrollment*\n\n` +
                `*Name:* ${escapeMd(record.name)}\n` +
                `*Mobile:* ${escapeMd(record.mobile)}\n` +
                `*School:* ${escapeMd(record.school)}\n` +
                `*SSC Roll:* ${escapeMd(record.ssc_roll)}\n` +
                `*Course:* ${escapeMd(record.course)}\n` +
                `*Batch:* ${escapeMd(record.batch)}\n` +
                `*Tier:* ${escapeMd(record.tier)}\n` +
                `*Status:* ${escapeMd(record.status)}`
            }
          } else if (type === 'enrollment_completed') {
            text =
              `✅ *Enrollment Completed* (was Gift Claim)\n\n` +
              `*Name:* ${escapeMd(record.name)}\n` +
              `*Mobile:* ${escapeMd(record.mobile)}\n` +
              `*School:* ${escapeMd(record.school)}\n` +
              `*SSC Roll:* ${escapeMd(record.ssc_roll)}\n` +
              `*Batch:* ${escapeMd(record.batch)}\n` +
              `*Status:* ${escapeMd(record.status)}`
          } else if (type === 'gift_claims') {
            text =
              `🎁 *New Gift Claim*\n\n` +
              `*Name:* ${escapeMd(record.full_name)}\n` +
              `*WhatsApp:* ${escapeMd(record.whatsapp_number)}`
          } else {
            return new Response('Unknown type', { status: 400 })
          }

          const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY
          const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY
          if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
            console.error('Missing LOVABLE_API_KEY or TELEGRAM_API_KEY')
            return new Response('Server misconfigured', { status: 500 })
          }

          const tgRes = await fetch(`${GATEWAY_URL}/sendMessage`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              'X-Connection-Api-Key': TELEGRAM_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text,
              parse_mode: 'Markdown',
            }),
          })

          if (!tgRes.ok) {
            const errText = await tgRes.text()
            console.error('Telegram API error:', tgRes.status, errText)
            return new Response(`Telegram error: ${errText}`, { status: 502 })
          }

          return Response.json({ ok: true })
        } catch (e) {
          console.error('notify-telegram handler error:', e)
          return new Response('Internal error', { status: 500 })
        }
      },
    },
  },
})
