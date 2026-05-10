// components/InvestmentsList.js
import { useState } from 'react'
import { addInvestment } from '../lib/userService'

export default function InvestmentsList({ userId, investments, onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [cryptoType, setCryptoType] = useState('BTC')
  const [loading, setLoading] = useState(false)

  const handleAddInvestment = async (e) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      alert('❌ Enter a valid amount')
      return
    }

    try {
      setLoading(true)
      await addInvestment(userId, amount, cryptoType)
      setAmount('')
      setCryptoType('BTC')
      setShowForm(false)
      onAdd()
    } catch (error) {
      alert('❌ Error adding investment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Investments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? '✕ Cancel' : '+ Add Investment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddInvestment} style={styles.form}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount ($)"
            step="0.01"
            style={styles.input}
            disabled={loading}
          />
          <select
            value={cryptoType}
            onChange={(e) => setCryptoType(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option>BTC</option>
            <option>ETH</option>
            <option>USDT</option>
            <option>Other</option>
          </select>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Adding...' : 'Confirm Investment'}
          </button>
        </form>
      )}

      <div style={styles.list}>
        {investments && investments.length > 0 ? (
          investments.map((inv) => (
            <div key={inv.id} style={styles.item}>
              <div style={styles.itemContent}>
                <div>
                  <p style={styles.itemCrypto}>{inv.cryptoType}</p>
                  <p style={styles.itemDate}>
                    {new Date(inv.date?.toDate?.() || inv.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p style={styles.itemAmount}>${inv.amount.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p style={styles.empty}>No investments yet. Add your first one!</p>
        )}
      </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
  },
  addButton: {
    padding: '10px 16px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '14px',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '14px',
  },
  submitButton: {
    padding: '12px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    padding: '16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  itemCrypto: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#22c55e',
  },
  itemDate: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#b8c7d9',
  },
  itemAmount: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
  },
  empty: {
    textAlign: 'center',
    color: '#b8c7d9',
    fontSize: '14px',
    padding: '20px',
    margin: 0,
  },
}
