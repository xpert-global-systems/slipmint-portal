"use client";

export default function TradeHistory({ trades }) {
  return (
    <div className="rounded-2xl bg-[#0f1b2d] p-6 border border-white/5 shadow-xl">
      <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-white/5">
              <th className="pb-3">Asset</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
              trades.map((trade, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-4 font-semibold">{trade.symbol}</td>
                  <td className={`py-4 ${trade.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.type.toUpperCase()}
                  </td>
                  <td className="py-4">${trade.price.toLocaleString()}</td>
                  <td className="py-4 text-slate-300">{trade.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-slate-500">No recent trades</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
