export default function Demo() {
  return (
    <div>
      <h1>Dashboard Preview</h1>
      <dl>
        <dt>Balance</dt>
        <dd>$12,450</dd>
      </dl>

      <h3>Recent Activity</h3>
      <ul>
        <li>
          <span aria-label="Deposit of 500 dollars">+ $500 deposit</span>
        </li>
        <li>
          <span aria-label="Transfer of 200 dollars">- $200 transfer</span>
        </li>
      </ul>
    </div>
  );
}
