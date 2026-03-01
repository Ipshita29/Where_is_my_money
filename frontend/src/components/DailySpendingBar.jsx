import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function DailySpendingBar({ data }) {
    // Mock data generation if real data is missing or incomplete
    // Dynamic date generation for the last 31 days
    const processData = () => {
        const result = [];
        const today = new Date();

        // Find max date in data if available, otherwise use today
        let endDate = today;
        if (data && Object.keys(data).length > 0) {
            const dates = Object.keys(data).map(d => new Date(d).getTime());
            endDate = new Date(Math.max(...dates));
        }

        for (let i = 30; i >= 0; i--) {
            const d = new Date(endDate);
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];

            // Format for display (e.g. 'Feb 15')
            const displayDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            let amount = 0;
            if (data && data[dateString]) {
                amount = Math.abs(data[dateString]);
            } else if (!data || Object.keys(data).length === 0) {
                // only mock if there is no data at all
                amount = Math.floor(Math.random() * 500);
            }

            result.push({
                day: displayDate, // 'day' key holds the formatted date label
                amount: amount,
                fullDate: dateString
            });
        }
        return result;
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
                        tick={{ fill: '#64748B', fontSize: 9, fontWeight: 700 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        dy={5}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `₹${value}`}
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
