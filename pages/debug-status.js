export default function Debug() {
  return (
    <div style={{ padding: 20 }}>
      <h1>System Health Check</h1>

      <ul>
        <li>Frontend: OK</li>
        <li>Auth System: Test login/signup</li>
        <li>API: Visit /api/test</li>
        <li>Firebase: Check console logs</li>
      </ul>
    </div>
  );
}
