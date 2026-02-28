import { useMemo } from 'react';

export default function CashflowSankey({ data }) {
    // Extract data from summary or use defaults
    const totalIncome = data?.totalCredited || 5000;
    const totalSpent = data?.totalSpent || 3000;
    const alimony = data?.categoryTotals?.Alimony || 1500;
    const otherExpenses = totalSpent - alimony;
    const savings = totalIncome - totalSpent;

    // Calculate widths based on income percentage
    const flowWidths = useMemo(() => {
        const scale = 200; // max width in pixels
        return {
            total: scale,
            alimony: (alimony / totalIncome) * scale,
            other: (otherExpenses / totalIncome) * scale,
            savings: Math.max((savings / totalIncome) * scale, 10)
        };
    }, [totalIncome, alimony, otherExpenses, savings]);

    return (
        <div className="w-full flex-1 flex items-center justify-center p-4">
            <svg width="100%" height="240" viewBox="0 0 600 240" className="drop-shadow-2xl">
                <defs>
                    <linearGradient id="gradAlimony" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.6)" />
                    </linearGradient>
                    <linearGradient id="gradExpenses" x1="0%" y1="0%" x2="100%" y2="0%">
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

                {/* Nodes */}
                {/* Source: Total Income */}
                <rect x="50" y="80" width="120" height="80" rx="16" className="fill-primary/20 stroke-primary/40" style={{ filter: 'url(#glow)' }} />
                <text x="110" y="115" textAnchor="middle" className="fill-white text-[10px] font-black uppercase tracking-widest">Income</text>
                <text x="110" y="135" textAnchor="middle" className="fill-primary text-sm font-black tabular-nums tracking-widest">${totalIncome.toLocaleString()}</text>

                {/* Targets */}
                {/* Alimony */}
                <rect x="430" y="20" width="120" height="50" rx="12" className="fill-alimony/20 stroke-alimony/40" />
                <text x="490" y="40" textAnchor="middle" className="fill-white text-[10px] font-black uppercase tracking-widest">Alimony</text>
                <text x="490" y="60" textAnchor="middle" className="fill-alimony text-sm font-black tabular-nums tracking-widest">${alimony.toLocaleString()}</text>

                {/* Expenses */}
                <rect x="430" y="90" width="120" height="50" rx="12" className="fill-expense/20 stroke-expense/40" />
                <text x="490" y="110" textAnchor="middle" className="fill-white text-[10px] font-black uppercase tracking-widest">Expenses</text>
                <text x="490" y="130" textAnchor="middle" className="fill-expense text-sm font-black tabular-nums tracking-widest">${Math.max(0, otherExpenses).toLocaleString()}</text>

                {/* Savings */}
                <rect x="430" y="160" width="120" height="50" rx="12" className="fill-primary/20 stroke-primary/40" />
                <text x="490" y="180" textAnchor="middle" className="fill-white text-[10px] font-black uppercase tracking-widest">Savings</text>
                <text x="490" y="200" textAnchor="middle" className="fill-primary text-sm font-black tabular-nums tracking-widest">${Math.max(0, savings).toLocaleString()}</text>

                {/* Flow Paths (Curves) */}
                {/* Income -> Alimony */}
                <path
                    d="M 170 100 C 300 100, 300 45, 430 45"
                    stroke="url(#gradAlimony)"
                    strokeWidth={Math.max(flowWidths.alimony / 4, 4)}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                />
                {/* Income -> Expenses */}
                <path
                    d="M 170 120 C 300 120, 300 115, 430 115"
                    stroke="url(#gradExpenses)"
                    strokeWidth={Math.max(flowWidths.other / 4, 4)}
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                />
                {/* Income -> Savings */}
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
