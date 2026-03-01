import { useMemo } from 'react';

export default function CashflowSankey({ data }) {
    // Extract data
    const totalIncome = data?.totalCredited || 5000;
    const totalSpent = data?.totalSpent || 3000;

    // Segregate expenses
    const food = data?.categoryTotals?.Food || 800;
    const shopping = data?.categoryTotals?.Shopping || 600;
    const subscriptions = data?.categoryTotals?.Subscriptions || 200;
    const travel = data?.categoryTotals?.Travel || 400;

    // Miscellaneous is everything else
    const misc = Math.max(0, totalSpent - (food + shopping + subscriptions + travel));
    const savings = totalIncome - totalSpent;

    // Calculate widths for varying stroke sizes
    const flowWidths = useMemo(() => {
        const scale = 200; // max total stroke width to divide
        if (totalIncome === 0) {
            return { food: 4, shopping: 4, subscriptions: 4, travel: 4, misc: 4, savings: 4 };
        }
        return {
            food: Math.max((food / totalIncome) * scale, 4),
            shopping: Math.max((shopping / totalIncome) * scale, 4),
            subscriptions: Math.max((subscriptions / totalIncome) * scale, 4),
            travel: Math.max((travel / totalIncome) * scale, 4),
            misc: Math.max((misc / totalIncome) * scale, 4),
            savings: Math.max((savings / totalIncome) * scale, 4)
        };
    }, [totalIncome, food, shopping, subscriptions, travel, misc, savings]);

    return (
        <div className="w-full flex-1 flex items-center justify-center p-4">
            <svg width="100%" height="400" viewBox="0 0 600 400" className="drop-shadow-2xl">
                <defs>
                    <linearGradient id="gradFood" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(249, 115, 22, 0.6)" />
                    </linearGradient>
                    <linearGradient id="gradShopping" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(236, 72, 153, 0.6)" />
                    </linearGradient>
                    <linearGradient id="gradSubs" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.6)" />
                    </linearGradient>
                    <linearGradient id="gradTravel" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.6)" />
                    </linearGradient>
                    <linearGradient id="gradMisc" x1="0%" y1="0%" x2="100%" y2="0%">
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

                {/* Income Node (Centered vertically at Y=160, H=80) */}
                <rect x="50" y="160" width="120" height="80" rx="16"
                    className="fill-primary/20 stroke-primary/40" style={{ filter: 'url(#glow)' }} />
                <text x="110" y="195" textAnchor="middle"
                    className="fill-white text-[10px] font-black uppercase tracking-widest">Income</text>
                <text x="110" y="215" textAnchor="middle"
                    className="fill-primary text-sm font-black tabular-nums tracking-widest">
                    ₹{totalIncome.toLocaleString()}
                </text>

                {/* Target Nodes */}
                {/* Food Node (Y=20) */}
                <rect x="430" y="20" width="120" height="40" rx="10" className="fill-orange-500/20 stroke-orange-500/40" />
                <text x="490" y="36" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Food</text>
                <text x="490" y="52" textAnchor="middle" className="fill-orange-500 text-xs font-black tabular-nums tracking-widest">₹{food.toLocaleString()}</text>

                {/* Shopping Node (Y=80) */}
                <rect x="430" y="80" width="120" height="40" rx="10" className="fill-pink-500/20 stroke-pink-500/40" />
                <text x="490" y="96" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Shopping</text>
                <text x="490" y="112" textAnchor="middle" className="fill-pink-500 text-xs font-black tabular-nums tracking-widest">₹{shopping.toLocaleString()}</text>

                {/* Subscriptions Node (Y=140) */}
                <rect x="430" y="140" width="120" height="40" rx="10" className="fill-indigo-500/20 stroke-indigo-500/40" />
                <text x="490" y="156" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Subscriptions</text>
                <text x="490" y="172" textAnchor="middle" className="fill-indigo-500 text-xs font-black tabular-nums tracking-widest">₹{subscriptions.toLocaleString()}</text>

                {/* Travel Node (Y=200) */}
                <rect x="430" y="200" width="120" height="40" rx="10" className="fill-cyan-500/20 stroke-cyan-500/40" />
                <text x="490" y="216" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Travel</text>
                <text x="490" y="232" textAnchor="middle" className="fill-cyan-500 text-xs font-black tabular-nums tracking-widest">₹{travel.toLocaleString()}</text>

                {/* Misc Node (Y=260) */}
                <rect x="430" y="260" width="120" height="40" rx="10" className="fill-expense/20 stroke-expense/40" />
                <text x="490" y="276" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Misc</text>
                <text x="490" y="292" textAnchor="middle" className="fill-expense text-xs font-black tabular-nums tracking-widest">₹{Math.max(0, misc).toLocaleString()}</text>

                {/* Savings Node (Y=320) */}
                <rect x="430" y="320" width="120" height="40" rx="10" className="fill-primary/20 stroke-primary/40" />
                <text x="490" y="336" textAnchor="middle" className="fill-white text-[9px] font-black uppercase tracking-widest">Savings</text>
                <text x="490" y="352" textAnchor="middle" className="fill-primary text-xs font-black tabular-nums tracking-widest">₹{Math.max(0, savings).toLocaleString()}</text>

                {/* Path Flows */}
                <path d="M 170 170 C 270 170, 300 40, 430 40" stroke="url(#gradFood)" strokeWidth={Math.max(flowWidths.food / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
                <path d="M 170 182 C 280 182, 310 100, 430 100" stroke="url(#gradShopping)" strokeWidth={Math.max(flowWidths.shopping / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
                <path d="M 170 194 C 300 194, 300 160, 430 160" stroke="url(#gradSubs)" strokeWidth={Math.max(flowWidths.subscriptions / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
                <path d="M 170 206 C 300 206, 300 220, 430 220" stroke="url(#gradTravel)" strokeWidth={Math.max(flowWidths.travel / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
                <path d="M 170 218 C 280 218, 310 280, 430 280" stroke="url(#gradMisc)" strokeWidth={Math.max(flowWidths.misc / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
                <path d="M 170 230 C 270 230, 300 340, 430 340" stroke="url(#gradSavings)" strokeWidth={Math.max(flowWidths.savings / 4, 2)} fill="none" strokeLinecap="round" className="animate-pulse" />
            </svg>
        </div>
    );
}