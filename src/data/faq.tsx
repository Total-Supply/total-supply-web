import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'How long does account approval take?',
      a: (
        <>
          Most approvals are completed within a few hours. You will receive an
          email once your account is approved.
        </>
      ),
    },
    {
      q: 'How do I reset my password?',
      a: 'Use the “Forgot password” link on the login screen to request a reset email.',
    },
    {
      q: 'Do I need to verify my email?',
      a: 'Yes. We require email verification before the admin approval step.',
    },
    {
      q: 'What if I need help?',
      a: 'Reach out to support and we will help you with onboarding and usage.',
    },
  ],
}

export default faq
