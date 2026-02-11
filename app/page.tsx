import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>KO Rental Software</h1>
        <p className="tagline">Professional Bounce House Business Management</p>
      </header>

      <main>
        <section className="features">
          <h2>Streamline Your Party Rental Business</h2>
          <ul>
            <li>📅 Easy Booking Management</li>
            <li>💰 Automated Invoicing & Payments</li>
            <li>📦 Inventory Tracking</li>
            <li>📱 Mobile-Friendly Dashboard</li>
            <li>📧 Automated Customer Communications</li>
            <li>📊 Business Analytics & Reports</li>
          </ul>
        </section>

        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of rental businesses using KO Rental Software</p>
          <Link href="/signup" className="cta-button">
            Sign Up Now
          </Link>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} KO Rental Software. All rights reserved.</p>
      </footer>
    </div>
  )
}
