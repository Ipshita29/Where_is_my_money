import { useMemo } from 'react';

export default function CashflowSankey({ data }) {
    // Extract data
    const totalIncome = data?.totalCredited || 5000;
    const totalSpent = data?.totalSpent || 3000;

    // RENAMED
    const majorExpenses = data?.categoryTotals?.MajorExpenses || 1500;
    const otherExpenses = totalSpent - majorExpenses;

    const savings = totalIncome - totalSpent;

    // Calculate widths
    const flowWidths = useMemo(() => {
        const scale = 200;

        if (totalIncome === 0) {
            return {
                total: scale,
                majorExpenses: 10,
                otherExpenses: 10,
                savings: 10
            };
        }

        return {
            total: scale,
            majorExpenses: (majorExpenses / totalIncome) * scale,
            otherExpenses: (otherExpenses / totalIncome) * scale,
            savings: Math.max((savings / totalIncome) * scale, 10)
        };
    }, [totalIncome, majorExpenses, otherExpenses, savings]);

    return (
        <div className="w-full flex-1 flex items-center justify-center p-4">
            <svg width="100%" height="240" viewBox="0 0 600 240" className="drop-shadow-2xl">
                <defs>
                    <linearGradient id="gradMajor" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.6)" />
                    </linearGradient>

                    <linearGradient id="gradOther" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(248, 113, 113, 0.6)" />
                    </linearGradient>

                    <linearGradient id="gradSavings" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.8)" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Income Node */}
                <rect x="50" y="80" width="120" height="80" rx="16"
                      className="fill-primary/20 stroke-primary/40" style={{ filter: 'url(#glow)' }} />
                <text x="110" y="115" textAnchor="middle"
                      className="fill-white text-[10px] font-black uppercase tracking-widest">Income</text>
                <text x="110" y="135" textAnchor="middle"
                      className="fill-primary text-sm font-black tabular-nums tracking-widest">
                    ₹{totalIncome.toLocaleString()}
                </text>

                {/* Major Expenses Node */}
                <rect x="430" y="20" width="120" height="50" rx="12"
                      className="fill-yellow-500/20 stroke-yellow-500/40" />
                <text x="490" y="40" textAnchor="middle"
                      className="fill-white text-[10px] font-black uppercase tracking-widest">Major Expenses</text>
                <text x="490" y="60" textAnchor="middle"
                      className="fill-yellow-500 text-sm font-black tabular-nums tracking-widest">
                    ₹{majorExpenses.toLocaleString()}
                </text>

                {/* Other Expenses Node */}
                <rect x="430" y="90" width="120" height="50" rx="12"
                      className="fill-expense/20 stroke-expense/40" />
                <text x="490" y="110" textAnchor="middle"
                      className="fill-white text-[10px] font-black uppercase tracking-widest">Other Expenses</text>
                <text x="490" y="130" textAnchor="middle"
                      className="fill-expense text-sm font-black tabular-nums tracking-widest">
                    ₹{Math.max(0, otherExpenses).toLocaleString()}
                </text>

                {/* Savings Node */}
                <rect x="430" y="160" width="120" height="50" rx="12"
                      className="fill-primary/20 stroke-primary/40" />
                <text x="490" y="180" textAnchor="middle"
                      className="fill-white text-[10px] font-black uppercase tracking-widest">Savings</text>
                <text x="490" y="200" textAnchor="middle"
                      className="fill-primary text-sm font-black tabular-nums tracking-widest">
                    ₹{Math.max(0, savings).toLocaleString()}
                </text>

                {/* Flows */}
                {/* Income → Major Expenses */}
                <path
                    d="M 170 100 C 300 100, 300 45, 430 45"
                    stroke="url(#gradMajor)"
                    strokeWidth={Math.max(flowWidths.majorExpenses / 4, 4)}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                />

                {/* Income → Other Expenses */}
                <path
                    d="M 170 120 C 300 120, 300 115, 430 115"
                    stroke="url(#gradOther)"
                    strokeWidth={Math.max(flowWidths.otherExpenses / 4, 4)}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                />

                {/* Income → Savings */}
                <path
                    d="M 170 140 C 300 140, 300 185, 430 185"
                    stroke="url(#gradSavings)"
                    strokeWidth={Math.max(flowWidths.savings / 4, 4)}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                />
            </svg>
        </div>
    );
}