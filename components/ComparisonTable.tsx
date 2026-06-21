export function ComparisonTable({ rows }: { rows: { feature: string; left: string; right: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-pink-100 bg-white">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead className="bg-pink-50 text-left">
          <tr>
            <th className="p-4">Feature</th>
            <th className="p-4">Option A</th>
            <th className="p-4">Option B</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-t border-pink-100">
              <td className="p-4 font-semibold">{row.feature}</td>
              <td className="p-4 text-ink/70">{row.left}</td>
              <td className="p-4 text-ink/70">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
