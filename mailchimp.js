// pages/api/subscribe/mailchimp.js
// Wires the SlipMint homepage subscribe form to Mailchimp
// Requires: MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX in .env.local
// Server prefix = the letters+numbers before .api.mailchimp.com in your API endpoint e.g. "us21"

import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX // e.g. "us21"

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('Missing Mailchimp environment variables')
    return res.status(500).json({ error: 'Server configuration error. Please try again later.' })
  }

  // Mailchimp uses MD5 hash of lowercase email as member ID
  const emailHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex')

  try {
    // Use PUT /members/{hash} so existing subscribers are updated, not duplicated
    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Mailchimp uses HTTP Basic Auth — username is arbitrary, password is API key
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'subscribed', // new contacts go straight in (change to 'pending' for double opt-in)
          status: 'subscribed',
          merge_fields: {
            SOURCE: 'slipmint-homepage',
          },
          tags: ['homepage-signup'],
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return res.status(200).json({ success: true, message: "You're on the list!" })
    }

    // Handle "already subscribed" as a soft success
    if (data.title === 'Member Exists') {
      return res.status(200).json({ success: true, message: "You're already subscribed!" })
    }

    console.error('Mailchimp API error:', data)
    return res.status(400).json({ error: data.detail || 'Subscription failed. Please try again.' })
  } catch (err) {
    console.error('Mailchimp fetch error:', err)
    return res.status(500).json({ error: 'Network error. Please try again.' })
  }
}
