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
import { ArrowUpRight } from 'lucide-react';

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
      color: '#7C3AED',
      unit: 'pts',
      change: '+24.5%',
    },
    weight: {
      label: 'Tren Berat Badan',
      color: '#2563EB',
      unit: 'kg',
      change: '-1.2 kg',
    },
    sleep: {
      label: 'Tren Durasi Tidur',
      color: '#10B981',
      unit: 'jam',
      change: '+1.5 jam',
    },
  };

  const activeConfig = config[metric];

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-4 transition-colors">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-0.5">Grafik Mingguan</span>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeConfig.label}</h3>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
              <ArrowUpRight className="w-3 h-3" /> {activeConfig.change}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setMetric('points')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              metric === 'points'
                ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Poin
          </button>
          <button
            onClick={() => setMetric('weight')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              metric === 'weight'
                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            BB (kg)
          </button>
          <button
            onClick={() => setMetric('sleep')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              metric === 'sleep'
                ? 'bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tidur
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 w-full -ml-3 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartThemeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Poppins' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'Poppins' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 dark:bg-slate-950 border border-slate-700 text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs font-sans">
                      <span className="text-slate-400 block text-[10px]">{label}</span>
                      <span className="font-bold text-sm text-white">
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
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#chartThemeGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
