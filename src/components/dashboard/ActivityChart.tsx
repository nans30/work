import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartDataPoint {
  day: string;
  points: number;
  weight: number;
  sleep: number;
}

const defaultWeeklyData: ChartDataPoint[] = [
  { day: 'Sen', points: 120, weight: 69.2, sleep: 6.5 },
  { day: 'Sel', points: 240, weight: 68.9, sleep: 7.0 },
  { day: 'Rab', points: 180, weight: 68.8, sleep: 7.5 },
  { day: 'Kam', points: 310, weight: 68.5, sleep: 8.0 },
  { day: 'Jum', points: 210, weight: 68.3, sleep: 6.8 },
  { day: 'Sab', points: 350, weight: 68.1, sleep: 7.8 },
  { day: 'Min', points: 420, weight: 68.0, sleep: 8.2 },
];

interface ActivityChartProps {
  data?: ChartDataPoint[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data = defaultWeeklyData }) => {
  const [metric, setMetric] = useState<'points' | 'weight' | 'sleep'>('points');

  const config = {
    points: {
      label: 'Tren Poin Mingguan',
      color: '#A855F7',
      gradientId: 'pointsGrad',
      unit: 'pts',
      domain: ['dataMin - 50', 'dataMax + 50'],
    },
    weight: {
      label: 'Tren Berat Badan',
      color: '#38BDF8',
      gradientId: 'weightGrad',
      unit: 'kg',
      domain: ['dataMin - 0.5', 'dataMax + 0.5'],
    },
    sleep: {
      label: 'Tren Durasi Tidur',
      color: '#34D399',
      gradientId: 'sleepGrad',
      unit: 'jam',
      domain: [4, 10],
    },
  };

  const activeConfig = config[metric];

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-4">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">{activeConfig.label}</h3>
            <span className="text-[10px] text-slate-500">7 Hari Terakhir</span>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMetric('points')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              metric === 'points'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Poin
          </button>
          <button
            onClick={() => setMetric('weight')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              metric === 'weight'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BB (kg)
          </button>
          <button
            onClick={() => setMetric('sleep')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              metric === 'sleep'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tidur
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-44 w-full -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={activeConfig.domain as any}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 border border-slate-700/80 px-3 py-2 rounded-xl shadow-xl text-xs">
                      <span className="text-slate-400 font-medium block">{label}</span>
                      <span className="text-white font-bold text-sm">
                        {payload[0].value} {activeConfig.unit}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={activeConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
