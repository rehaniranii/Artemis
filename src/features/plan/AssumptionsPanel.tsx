import { ASSET_CLASSES, INFLATION_RATE, RETURN_ASSUMPTIONS } from '@/data/assumptions';
import { formatPercent } from '@/lib/format';

/** "What are we assuming?" — the same disclosure everywhere projections appear. */
export function AssumptionsPanel({ open = false }: { open?: boolean }) {
  return (
    <details open={open} className="rounded-2xl ink-outline bg-white p-5 text-sm">
      <summary className="font-medium">What are we assuming?</summary>
      <div className="mt-4 space-y-4 text-xs leading-relaxed text-muted-foreground">
        <div>
          <p className="mb-2 font-medium text-foreground">Illustrative yearly returns (low · central · high)</p>
          <table className="w-full text-left">
            <tbody>{ASSET_CLASSES.map(c => <tr key={c.id} className="border-t"><th scope="row" className="py-1.5 font-normal">{c.name}</th><td className="py-1.5 tabular-nums">{formatPercent(RETURN_ASSUMPTIONS[c.id].low * 100)} · {formatPercent(RETURN_ASSUMPTIONS[c.id].mid * 100)} · {formatPercent(RETURN_ASSUMPTIONS[c.id].high * 100)}</td></tr>)}</tbody>
          </table>
        </div>
        <p><strong className="text-foreground">Inflation:</strong> {formatPercent(INFLATION_RATE * 100)} a year, used for “today’s money” figures.</p>
        <p><strong className="text-foreground">Fees:</strong> returns are treated as after typical fund costs. Higher-fee funds would do slightly worse. Taxes are not included.</p>
        <p><strong className="text-foreground">Market uncertainty:</strong> projections assume the same return every year. Real markets rise and fall unevenly — see Reality Lab for bad years.</p>
        <p><strong className="text-foreground">Limitations:</strong> contributions are monthly at month-end, the allocation is kept constant, and nothing here predicts or guarantees results. These are not forecasts or historical returns.</p>
      </div>
    </details>
  );
}
