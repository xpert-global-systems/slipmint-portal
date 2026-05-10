<form onSubmit={handleSignup} style={styles.form}>
  <label style={styles.label}>Full Name</label>
  <input
    type="text"
    placeholder="Full Name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    style={styles.input}
    required
  />

  <label style={styles.label}>Phone Number</label>
  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    style={styles.input}
    required
  />

  <label style={styles.label}>Occupation</label>
  <input
    type="text"
    placeholder="Occupation"
    value={occupation}
    onChange={(e) => setOccupation(e.target.value)}
    style={styles.input}
    required
  />

  <label style={styles.label}>Email</label>
  <input
    type="email"
    placeholder="Email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={styles.input}
    required
  />

  <label style={styles.label}>Password</label>
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={styles.input}
    required
  />

  <label style={styles.label}>Referral Code (optional)</label>
  <input
    type="text"
    placeholder="Referral Code"
    value={referral}
    onChange={(e) => setReferral(e.target.value)}
    style={styles.input}
  />

  <button type="submit" style={styles.button}>
    Sign Up
  </button>
</form>
