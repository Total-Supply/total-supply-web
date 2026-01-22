type RecaptchaVerification = {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

export async function verifyRecaptcha(token: string | undefined, ip?: string) {
  const secret =
    process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET

  if (!secret) {
    return { success: true, skipped: true }
  }

  if (!token) {
    return { success: false, reason: 'MISSING_TOKEN' }
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (ip) {
    body.append('remoteip', ip)
  }

  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  )

  const data = (await response.json()) as RecaptchaVerification
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5)

  if (!data.success) {
    return { success: false, reason: 'FAILED', data }
  }

  if (typeof data.score === 'number' && data.score < minScore) {
    return { success: false, reason: 'LOW_SCORE', data }
  }

  return { success: true, data }
}
