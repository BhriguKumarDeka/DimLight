import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { memo } from "react";

const TrendChart = memo(({ data, dataKey, label, color }) => {
  if (!data || data.length === 0) return <div className="text-xs text-textMuted flex items-center justify-center h-full">No data available</div>

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} opacity={0.5} />

          {/* XAxis */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgb(var(--text-muted))', fontSize: 10 }}
            dy={10}
            minTickGap={20}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'rgb(var(--text))',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: 'rgb(var(--text))' }}
            cursor={{ stroke: 'rgb(var(--text-muted))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
TrendChart.displayName = 'TrendChart';

export default TrendChart;