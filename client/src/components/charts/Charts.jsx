/**
 * Reusable chart components built on Recharts
 */
import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Brand colour palette for charts
const COLORS = {
  primary: '#1d4ed8',
  secondary: '#10b981',
  accent: '#f97316',
  purple: '#7c3aed',
  yellow: '#d97706',
  red: '#dc2626',
  teal: '#0891b2',
  pink: '#db2777',
};

const PIE_COLORS = Object.values(COLORS);

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-card-hover px-3 py-2 text-xs">
      {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <strong>
            {formatter ? formatter(entry.value) : entry.value?.toLocaleString()}
          </strong>
        </p>
      ))}
    </div>
  );
};

// ─── Area / Line Chart ─────────────────────────────────────────────────────────
export function AreaLineChart({ data = [], lines = [], title, formatter }) {
  return (
    <div className="card">
      {title && <h3 className="section-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {lines.map((line, i) => (
              <linearGradient key={line.key} id={`grad-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color || PIE_COLORS[i]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={line.color || PIE_COLORS[i]} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {lines.map((line, i) => (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label || line.key}
              stroke={line.color || PIE_COLORS[i]}
              strokeWidth={2}
              fill={`url(#grad-${line.key})`}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────
export function BarChartComponent({ data = [], bars = [], title, formatter, layout = 'vertical' }) {
  return (
    <div className="card">
      {title && <h3 className="section-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout={layout} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          {layout === 'vertical' ? (
            <>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
            </>
          ) : (
            <>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={formatter} />
              <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label || bar.key}
              fill={bar.color || PIE_COLORS[i]}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Pie / Donut Chart ─────────────────────────────────────────────────────────
export function DonutChart({ data = [], title, dataKey = 'value', nameKey = 'label' }) {
  return (
    <div className="card">
      {title && <h3 className="section-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={entry[nameKey]} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => v?.toLocaleString()} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Funnel Chart ──────────────────────────────────────────────────────────────
export function PipelineFunnel({ data = [], title }) {
  return (
    <div className="card">
      {title && <h3 className="section-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={280}>
        <FunnelChart>
          <Tooltip formatter={(v) => v?.toLocaleString()} />
          <Funnel dataKey="value" data={data} isAnimationActive>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
            <LabelList position="center" fill="#fff" fontSize={12} fontWeight={600} dataKey="label" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

export { COLORS };
