export default function Footer() {
  return (
    <div className="container">
      <hr />
      <p style={{ marginTop: "1rem" }}>
        © {new Date().getFullYear()} SlipMint. All rights reserved.
      </p>
    </div>
  )
}
