import React from 'react';
import { TrendingDown, TrendingUp, DollarSign, Users, Radio, X } from 'lucide-react';

/**
 * WeeklySummaryModal - Popup showing detailed weekly breakdown after advancing week
 * Displays: expenses breakdown, revenue streams, fan growth, net change, trend notes
 */
export function WeeklySummaryModal({ isOpen, data, onClose }) {
  if (!isOpen || !data) return null;

  const { weekNumber, expenses, revenue, fans, money, trendNotes } = data;
  const fmt = (n) => (n ?? 0).toLocaleString();
  const netPositive = (money?.netChange ?? 0) >= 0;

  const expenseRows = [
    ['Base', expenses?.breakdown?.base],
    ['Member salaries', expenses?.breakdown?.memberSalaries],
    ['Equipment', expenses?.breakdown?.equipment],
    ['Transport', expenses?.breakdown?.transport],
    ['Staff', expenses?.breakdown?.staff],
    ['Label', expenses?.breakdown?.label]
  ].filter(([, v]) => v != null && v > 0);

  const revenueRows = [
    { label: 'Song streaming', value: revenue?.streaming },
    { label: 'Radio plays', value: revenue?.radio, suffix: revenue?.radioPlays != null ? ` (${revenue.radioPlays} plays)` : '' },
    { label: 'Album revenue', value: revenue?.album },
    { label: 'Merchandise', value: revenue?.merchandise, suffix: revenue?.itemsSold != null ? ` (${revenue.itemsSold} items)` : '' },
    ...(revenue?.labelRoyaltySplit > 0 ? [{ label: 'Label royalty split', value: -revenue.labelRoyaltySplit, suffix: '' }] : [])
  ].filter((r) => r.value != null);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-summary-title"
    >
      <div
        className="bg-[var(--card)] border-2 border-[var(--primary)]/30 rounded-xl max-w-lg w-[90%] max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-4 border-b border-[var(--border)] bg-[var(--card)]">
          <h2 id="weekly-summary-title" className="text-xl font-bold text-[var(--foreground)] m-0">
            Week {weekNumber} Summary
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Net change highlight */}
          <div
            className={`flex items-center justify-between gap-4 p-4 rounded-lg ${
              netPositive ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-red-500/15 border border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {netPositive ? <TrendingUp className="text-emerald-500" size={24} /> : <TrendingDown className="text-red-500" size={24} />}
              <span className="font-semibold text-[var(--foreground)]">Net this week</span>
            </div>
            <span className={`text-lg font-bold ${netPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {netPositive ? '+' : ''}${fmt(money?.netChange)}
            </span>
          </div>

          {/* Expenses */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
              <TrendingDown size={16} /> Expenses
            </h3>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 overflow-hidden">
              {expenseRows.length > 0 ? (
                <ul className="divide-y divide-[var(--border)]">
                  {expenseRows.map(([label, value]) => (
                    <li key={label} className="flex justify-between items-center px-3 py-2 text-sm">
                      <span className="text-[var(--foreground)]">{label}</span>
                      <span className="text-[var(--muted-foreground)]">-${fmt(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex justify-between items-center px-3 py-2 bg-[var(--muted)]/50 font-medium text-[var(--foreground)]">
                <span>Total</span>
                <span>-${fmt(expenses?.total)}</span>
              </div>
            </div>
          </section>

          {/* Revenue */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
              <DollarSign size={16} /> Revenue
            </h3>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 overflow-hidden">
              {revenueRows.map((r) => {
                const isNegative = typeof r.value === 'number' && r.value < 0;
                return (
                  <div key={r.label} className="flex justify-between items-center px-3 py-2 text-sm border-b border-[var(--border)] last:border-b-0">
                    <span className="text-[var(--foreground)]">{r.label}{r.suffix ?? ''}</span>
                    <span className={isNegative ? 'text-red-500' : 'text-[var(--muted-foreground)]'}>
                      {isNegative ? '-' : '+'}${fmt(Math.abs(r.value))}
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between items-center px-3 py-2 bg-[var(--muted)]/50 font-medium text-[var(--foreground)]">
                <span>Net revenue</span>
                <span>+${fmt(revenue?.net)}</span>
              </div>
            </div>
          </section>

          {/* Fans */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
              <Users size={16} /> Fans
            </h3>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2 flex justify-between items-center">
              <span className="text-[var(--foreground)]">
                {fmt(fans?.old)} → {fmt(fans?.new)} <span className="text-[var(--muted-foreground)]">(+{fmt(fans?.growth)})</span>
              </span>
            </div>
          </section>

          {/* Balance */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
              <DollarSign size={16} /> Balance
            </h3>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2 flex justify-between items-center">
              <span className="text-[var(--foreground)]">New balance</span>
              <span className="font-semibold text-[var(--foreground)]">${fmt(money?.new)}</span>
            </div>
          </section>

          {/* Trend notes */}
          {trendNotes && trendNotes.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
                <Radio size={16} /> Trends
              </h3>
              <ul className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 divide-y divide-[var(--border)]">
                {trendNotes.map((note, i) => (
                  <li key={i} className="px-3 py-2 text-sm text-[var(--foreground)]">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
