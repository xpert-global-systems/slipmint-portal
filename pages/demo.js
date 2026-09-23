import Head from "next/head";

export default function DemoPage() {
  const quickActions = [
    { label: "Deposit", primary: true, icon: "deposit" },
    { label: "Withdraw", primary: false, icon: "withdraw" },
    { label: "Transfer", primary: false, icon: "transfer" },
    { label: "History", primary: false, icon: "history" },
  ];

  const activity = [
    {
      name: "Deposit received",
      date: "Today, 9:15 AM",
      amount: "+$500",
      amountType: "pos",
      icon: "deposit",
    },
    {
      name: "Signal: XAUUSD Buy",
      date: "Today, 8:02 AM — TP1 hit",
      amount: "+$189.50",
      amountType: "pos",
      icon: "signal",
    },
    {
      name: "Transfer out",
      date: "Yesterday, 6:30 PM",
      amount: "−$200",
      amountType: "neg",
      icon: "withdraw",
    },
    {
      name: "Signal: XAUUSD Sell",
      date: "Yesterday, 2:44 PM",
      amount: "−$42.00",
      amountType: "neg",
      icon: "signal",
    },
    {
      name: "Subscription renewed",
      date: "Sep 20, 12:00 AM",
      amount: "−$29.00",
      amountType: "neu",
      icon: "transfer",
    },
  ];

  const navItems = [
    { label: "Home", active: true, icon: "home" },
    { label: "Signals", active: false, icon: "signals" },
    { label: "History", active: false, icon: "history" },
    { label: "Account", active: false, icon: "account" },
  ];

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="demo-shell">
        <header className="topbar">
          <div className="topbar-logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" fill="#080C12" />
                <path d="M9 5L12 7V11L9 13L6 11V7L9 5Z" fill="#F59E0B" />
              </svg>
            </div>
            <span className="logo-name">SlipMint</span>
          </div>

          <div className="topbar-right">
            <div className="icon-btn" aria-label="Notifications">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#8A94A8"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot" />
            </div>

            <div className="avatar" aria-label="User profile">
              HL
            </div>
          </div>
        </header>

        <main className="scroll">
          <div className="greeting">
            <div className="greeting-label">Wednesday, Sep 23</div>
            <div className="greeting-name">Good afternoon, Hassan</div>
          </div>

          <div className="balance-card">
            <div className="balance-label">Portfolio balance</div>

            <div className="balance-amount">
              <span className="currency">$</span>
              12,450
              <span className="cents">.00</span>
            </div>

            <div className="balance-change">
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              +$310.50 today
            </div>

            <div className="balance-stats">
              <div className="bstat">
                <div className="bstat-val positive">+2.56%</div>
                <div className="bstat-lbl">Today</div>
              </div>

              <div className="balance-divider" />

              <div className="bstat">
                <div className="bstat-val">$14,820</div>
                <div className="bstat-lbl">This month</div>
              </div>

              <div className="balance-divider" />

              <div className="bstat">
                <div className="bstat-val warning">7</div>
                <div className="bstat-lbl">Active signals</div>
              </div>
            </div>
          </div>

          <div className="signals-strip" aria-label="Live signal panel">
            <div className="signals-left">
              <div className="signal-pulse" />
              <div>
                <div className="signals-text">Live signals active</div>
                <div className="signals-sub">XAUUSD — Buy signal fired 4m ago</div>
              </div>
            </div>

            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>

          <div className="section-head">Quick actions</div>

          <div className="actions-row">
            {quickActions.map(({ label, primary, icon }) => (
              <div
                key={label}
                className={`action-btn ${primary ? "primary" : ""}`}
                aria-label={label}
              >
                <div className="action-icon">{renderIcon(icon)}</div>
                <span className="action-lbl">{label}</span>
              </div>
            ))}
          </div>

          <div className="section-head section-head-activity">Recent activity</div>

          <div className="activity-list">
            {activity.map(({ name, date, amount, amountType, icon }) => (
              <div key={`${name}-${date}`} className="tx">
                <div className={`tx-icon ${icon}`}>{renderIcon(icon)}</div>

                <div className="tx-info">
                  <div className="tx-name">{name}</div>
                  <div className="tx-date">{date}</div>
                </div>

                <div className={`tx-amount ${amountType}`}>{amount}</div>
              </div>
            ))}
          </div>

          <div className="section-head section-head-plan">Your plan</div>

          <div className="plan-banner">
            <div className="plan-icon">
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>

            <div className="plan-info">
              <div className="plan-name">
                SlipMint Pro <span className="plan-badge">ACTIVE</span>
              </div>
              <div className="plan-sub">
                Renews Oct 20, 2026 · 7 signals/day
              </div>
            </div>

            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#505870"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </main>

        <nav className="bottom-nav" aria-label="Main navigation">
          {navItems.map(({ label, active, icon }) => (
            <div
              key={label}
              className={`nav-item ${active ? "active" : ""}`}
              aria-label={label}
            >
              {renderNavIcon(icon)}
              <span className={`nav-lbl ${active ? "active" : ""}`}>{label}</span>
              {active && <span className="nav-active-dot" />}
            </div>
          ))}
        </nav>
      </div>

      <style jsx>{`
        :root {
          --bg: #080c12;
          --surface: #0f1520;
          --surface-2: #161e2e;
          --surface-3: #1c2638;
          --border: rgba(255, 255, 255, 0.07);
          --border-strong: rgba(255, 255, 255, 0.13);
          --amber: #f59e0b;
          --amber-dim: rgba(245, 158, 11, 0.12);
          --amber-glow: rgba(245, 158, 11, 0.06);
          --text: #f0f4ff;
          --text-2: #8a94a8;
          --text-3: #505870;
          --green: #10b981;
          --green-dim: rgba(16, 185, 129, 0.1);
          --red: #ef4444;
          --red-dim: rgba(239, 68, 68, 0.1);
          --blue: #3b82f6;
          --blue-dim: rgba(59, 130, 246, 0.1);
          --radius: 14px;
          --font: "Space Grotesk", system-ui, sans-serif;
          --mono: "Space Mono", monospace;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          min-height: 100dvh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .demo-shell {
          max-width: 430px;
          margin: 0 auto;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--text);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 12px;
          padding-top: calc(18px + env(safe-area-inset-top, 0px));
        }

        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--amber);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-name {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }

        .notif-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--amber);
          border: 1.5px solid var(--bg);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--amber-dim);
          border: 1px solid var(--amber);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--amber);
          cursor: pointer;
        }

        .scroll {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0 20px 24px;
        }

        .greeting {
          margin-bottom: 24px;
        }

        .greeting-label {
          font-size: 13px;
          color: var(--text-3);
          font-weight: 500;
          margin-bottom: 2px;
        }

        .greeting-name {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        .balance-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .balance-card::before {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .balance-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          line-height: 1;
          margin-bottom: 4px;
          font-family: var(--mono);
        }

        .currency {
          font-size: 24px;
          color: var(--text-2);
          font-weight: 400;
          margin-right: 2px;
        }

        .cents {
          font-size: 28px;
          color: var(--text-2);
          font-weight: 400;
        }

        .balance-change {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--green);
          background: var(--green-dim);
          padding: 3px 9px;
          border-radius: 20px;
          margin-top: 10px;
        }

        .balance-divider {
          width: 1px;
          height: 36px;
          background: var(--border-strong);
          margin: 0 4px;
        }

        .balance-stats {
          display: flex;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .bstat {
          flex: 1;
          text-align: center;
        }

        .bstat-val {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          font-family: var(--mono);
        }

        .bstat-val.positive {
          color: var(--green);
        }

        .bstat-val.warning {
          color: var(--amber);
        }

        .bstat-lbl {
          font-size: 11px;
          color: var(--text-3);
          margin-top: 2px;
          font-weight: 500;
        }

        .section-head {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 12px;
          margin-top: 24px;
        }

        .section-head-activity {
          margin-top: 28px;
        }

        .section-head-plan {
          margin-top: 28px;
        }

        .actions-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          padding: 4px 0;
        }

        .action-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.primary .action-icon {
          background: var(--amber);
          border-color: var(--amber);
        }

        .action-lbl {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-2);
          text-align: center;
        }

        .signals-strip {
          background: var(--amber-dim);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
          cursor: pointer;
        }

        .signals-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .signal-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--amber);
          position: relative;
        }

        .signal-pulse::after {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.3);
          animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(2);
          }
        }

        .signals-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--amber);
        }

        .signals-sub {
          font-size: 11px;
          color: rgba(245, 158, 11, 0.6);
          margin-top: 1px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tx {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 12px;
          cursor: pointer;
        }

        .tx-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tx-icon.deposit {
          background: var(--green-dim);
        }

        .tx-icon.withdraw {
          background: var(--red-dim);
        }

        .tx-icon.signal {
          background: var(--amber-dim);
        }

        .tx-icon.transfer {
          background: var(--blue-dim);
        }

        .tx-info {
          flex: 1;
          min-width: 0;
        }

        .tx-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tx-date {
          font-size: 12px;
          color: var(--text-3);
          margin-top: 2px;
          font-weight: 500;
        }

        .tx-amount {
          font-size: 15px;
          font-weight: 700;
          font-family: var(--mono);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .tx-amount.pos {
          color: var(--green);
        }

        .tx-amount.neg {
          color: var(--red);
        }

        .tx-amount.neu {
          color: var(--text-2);
        }

        .plan-banner {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }

        .plan-icon {
          width: 44px;
          height: 44px;
          background: var(--amber-dim);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .plan-info {
          flex: 1;
        }

        .plan-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .plan-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--amber);
          background: var(--amber-dim);
          border: 1px solid rgba(245, 158, 11, 0.25);
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }

        .plan-sub {
          font-size: 12px;
          color: var(--text-3);
          margin-top: 2px;
          font-weight: 500;
        }

        .bottom-nav {
          background: var(--surface);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 10px 0 calc(10px + env(safe-area-inset-bottom, 0px));
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
          cursor: pointer;
          position: relative;
        }

        .nav-lbl {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-3);
        }

        .nav-item.active .nav-lbl,
        .nav-lbl.active {
          color: var(--amber);
        }

        .nav-active-dot {
          position: absolute;
          bottom: -2px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--amber);
        }
      `}</style>
    </>
  );
}

function renderIcon(icon) {
  switch (icon) {
    case "deposit":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      );
    case "withdraw":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      );
    case "transfer":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M14 9l3 3-3 3" />
        </svg>
      );
    case "history":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#8A94A8"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "signal":
      return (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    default:
      return null;
  }
}

function renderNavIcon(icon) {
  switch (icon) {
    case "home":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
            strokeLinejoin="round"
          />
          <path d="M9 21V12h6v9" strokeLinejoin="round" />
        </svg>
      );
    case "signals":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#505870"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "history":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#505870"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "account":
      return (
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#505870"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      );
    default:
      return null;
  }
}
