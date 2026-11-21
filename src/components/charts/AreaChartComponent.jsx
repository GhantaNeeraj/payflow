import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[#191919] border border-[rgba(212,175,55,0.3)] rounded-lg px-4 py-3 shadow-xl shadow-black/40">
      <p className="text-[#A1A1A1] text-xs font-medium mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#A1A1A1] text-xs">{entry.name}:</span>
          <span className="text-[#F5F5F5] text-xs font-semibold ml-auto">
            {formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#A1A1A1] text-xs font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AreaChartComponent({
  data = [],
  dataKeys = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  tooltipFormatter,
}) {
  const gradients = useMemo(
    () =>
      dataKeys.map((dk) => ({
        id: `gradient-${dk.key}`,
        color: dk.color,
      })),
    [dataKeys]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            {gradients.map((g) => (
              <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={g.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={g.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
          )}

          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#686868', fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#686868', fontSize: 11 }}
            dx={-4}
          />

          <Tooltip
            content={<CustomTooltip formatter={tooltipFormatter} />}
            cursor={{ stroke: 'rgba(212,175,55,0.15)', strokeWidth: 1 }}
          />

          {showLegend && <Legend content={<CustomLegend />} />}

          {dataKeys.map((dk) => (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color}
              strokeWidth={2}
              fill={`url(#gradient-${dk.key})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: dk.color,
                stroke: '#191919',
                strokeWidth: 2,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
