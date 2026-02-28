import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function DailySpendingBar({ data }) {
    // Mock data generation if real data is missing or incomplete
    const processData = () => {
        if (!data || Object.keys(data).length === 0) {
            return Array.from({ length: 31 }, (_, i) => ({
                day: i + 1,
                amount: Math.floor(Math.random() * 500)
            }));
        }

        // Transform { "YYYY-MM-DD": amount } to [ { day: DD, amount: X } ]
        const days = Object.entries(data).map(([date, amount]) => ({
            day: new Date(date).getDate(),
            amount: Math.abs(amount)
        })).sort((a, b) => a.day - b.day);

        return days;
    };

    const chartData = processData();
    const threshold = 1000; // Variable threshold highlight

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="spikeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F87171" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#F87171" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: '#1A1C23',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#10B981' }}
                    />
                    <ReferenceLine
                        y={threshold}
                        stroke="#F87171"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Threshold',
                            fill: '#F87171',
                            fontSize: 10,
                            fontWeight: 900,
                            position: 'right',
                            offset: 10
                        }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.amount > threshold ? 'url(#spikeGradient)' : 'url(#barGradient)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
