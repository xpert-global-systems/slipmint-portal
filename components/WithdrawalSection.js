// components/WithdrawalSection.js
import { useState } from 'react'
import { requestWithdrawal } from '../lib/userService'

export default function WithdrawalSection({ userId, balance, onWithdraw }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleWithdraw = async (e, quickAmount) => {
    e?.preventDefault()
    const withdrawAmount = quickAmount || amount

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setMessage('❌ Enter a valid amount')
      return
    }

    if (parseFloat(withdrawAmount) > balance) {
      setMessage('❌ Insufficient balance')
      return
    }

    try {
      setLoading(true)
      const walletAddress = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      })

      if (!walletAddress || !walletAddress[0]) {
        setMessage('❌ Connect MetaMask first')
        setLoading(false)
        return
      }

      await requestWithdrawal(userId, withdrawAmount, walletAddress[0])
      setMessage('✓ Withdrawal request sent! Processing...')
      setAmount('')
      onWithdraw()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const quickAmounts = [10, 50, 100, 500]

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Withdraw Funds</h2>

      <div style={styles.balanceBox}>
        <p style={styles.balanceLabel}>Available Balance</p>
        <p style={styles.balanceAmount}>${balance.toFixed(2)}</p>
      </div>

      <form onSubmit={(e) => handleWithdraw(e)} style={styles.form}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to withdraw ($)"
          step="0.01"
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading || balance === 0}>
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </form>

      <p style={styles.quickLabel}>Quick amounts:</p>
      <div style={styles.quickButtons}>
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={(e) => handleWithdraw(e, quickAmount)}
            style={{
              ...styles.quickButton,
              opacity: quickAmount > balance ? 0.5 : 1,
              cursor: quickAmount > balance ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || quickAmount > balance}
          >
            ${quickAmount}
          </button>
        ))}
      </div>

      {message && (
        <p style={{
          ...styles.message,
          color: message.includes('✓') ? '#22c55e' : '#fca5a5',
          background: message.includes('✓')
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
          borderColor: message.includes('✓')
            ? 'rgba(34, 197, 94, 0.3)'
            : 'rgba(239, 68, 68, 0.3)',
        }}>
          {message}
        </p>
      )}

      <p style={styles.info}>
        Withdrawals are processed to your connected MetaMask wallet. Processing time: 1-24 hours.
      </p>
    </section>
  )
}

const styles = {
  section: {
    padding: '24px',
    background: 'linear-gradient(135deg, #13243a 0%, #0c1626 100%)',
    border: '1px solid rgba(34, 197, 94, 0.18)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  title: {
    margin: '0 0 20px',
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
  },
  balanceBox: {
    padding: '16px',
    background: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  balanceLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#b8c7d9',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  balanceAmount: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#22c55e',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '15px',
  },
  button: {
    padding: '12px 24px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  quickLabel: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#b8c7d9',
    fontWeight: 600,
  },
  quickButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  quickButton: {
    padding: '10px 16px',
    background: 'rgba(34, 197, 94, 0.15)',
    color: '#22c55e',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    fontSize: '14px',
    marginBottom: '16px',
  },
  info: {
    fontSize: '13px',
    color: '#b8c7d9',
    lineHeight: 1.6,
    margin: 0,
  },
}
