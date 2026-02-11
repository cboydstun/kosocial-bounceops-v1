import SignupForm from '@/components/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="container">
      <header>
        <h1>Sign Up for KO Rental Software</h1>
        <p className="tagline">Start managing your bounce house business today</p>
      </header>

      <main>
        <div className="signup-container">
          <SignupForm />
          <p className="back-link">
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} KO Rental Software. All rights reserved.</p>
      </footer>
    </div>
  )
}
