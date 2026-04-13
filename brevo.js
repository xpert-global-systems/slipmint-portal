// pages/api/subscribe/brevo.js
// Wires the SlipMint homepage subscribe form to Brevo (formerly Sendinblue)
// Requires: BREVO_API_KEY and BREVO_LIST_ID in your .env.local

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = parseInt(process.env.BREVO_LIST_ID, 10)

  if (!apiKey || !listId) {
    console.error('Missing BREVO_API_KEY or BREVO_LIST_ID in environment variables')
    return res.status(500).json({ error: 'Server configuration error. Please try again later.' })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true, // re-adds if they previously unsubscribed
        attributes: {
          SOURCE: 'slipmint-homepage',
          SIGNUP_DATE: new Date().toISOString().split('T')[0],
        },
      }),
    })

    // 201 = created, 204 = already exists (updated)
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true, message: "You're on the list!" })
    }

    const data = await response.json()

    // Brevo returns 400 with code "duplicate_parameter" if contact already exists
    // and updateEnabled didn't trigger — treat it as success for UX
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true, message: "You're already subscribed!" })
    }

    console.error('Brevo API error:', data)
    return res.status(400).json({ error: data.message || 'Subscription failed. Please try again.' })
  } catch (err) {
    console.error('Brevo fetch error:', err)
    return res.status(500).json({ error: 'Network error. Please try again.' })
  }
}
