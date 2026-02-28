import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="container">
      <h2>SlipMint</h2>
      <nav>
        <Link href="/">Home</Link> |{" "}
        <Link href="/performance">Performance</Link> |{" "}
        <Link href="/vault">Founder Vault</Link> |{" "}
        <Link href="/faq">FAQ</Link>
      </nav>
    </div>
  )
}
