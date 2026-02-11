'use client'

import { useState, FormEvent } from 'react'
import { getSignupUrl, getSignupSource, getPlatformUrl } from '@/lib/config'

export default function SignupForm() {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(getSignupUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessName,
          email,
          password,
          signupSource: getSignupSource()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred during signup')
        setIsSubmitting(false)
        return
      }

      // Redirect to tenant subdomain
      if (data.tenant && data.tenant.slug) {
        const platformUrl = getPlatformUrl()
        const domain = platformUrl.replace('https://', '')
        window.location.assign(`https://${data.tenant.slug}.${domain}/onboarding`)
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label htmlFor="businessName">Business Name</label>
        <input
          type="text"
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={isSubmitting}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
