import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export default function ShapChart({ shapValues, baseValue }) {
  // Take top 7 factors for clean visualization
  const data = shapValues
    .slice(0, 8)
    .map(item => ({
      name: item.description,
      rawFeature: item.feature,
      value: item.shap_value,
      displayVal: item.value,
      color: item.shap_value > 0 ? '#f43f5e' : '#10b981', // Rose for risk increasing, Emerald for risk decreasing
      displayString: formatVal(item.description, item.value)
    }))
    .reverse(); // Reverse so highest magnitude is on top in a vertical layout

  function formatVal(desc, val) {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'number') {
      if (desc.toLowerCase().includes('income') || desc.toLowerCase().includes('amount')) {
        return `$${val.toLocaleString()}`;
      }
      if (desc.toLowerCase().includes('utilization') || desc.toLowerCase().includes('ratio')) {
        return `${val.toFixed(1)}%`;
      }
      return val.toString();
    }
    return val;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.value > 0;
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl space-y-1.5 text-xs">
          <div className="font-semibold text-slate-200">{data.name}</div>
          <div className="flex justify-between gap-6 text-slate-400">
            <span>Applicant Value:</span>
            <span className="font-mono font-bold text-slate-100">{data.displayString}</span>
          </div>
          <div className="flex justify-between gap-6 text-slate-400">
            <span>Risk Impact:</span>
            <span className={`font-mono font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isPositive ? '+' : ''}{data.value.toFixed(4)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 italic border-t border-slate-800 pt-1.5 mt-1.5">
            {isPositive 
              ? 'Pushed model decision towards default'
              : 'Pushed model decision towards approval'
            }
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
          <span>AI Decision Drivers (SHAP Explanations)</span>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-full font-mono">
            Base Probability: {(baseValue * 100).toFixed(1)}%
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          SHAP values represent the mathematically calculated contribution of each factor. 
          Positive values (rose, right) increase the probability of default; negative values (emerald, left) reduce it.
        </p>
      </div>

      <div className="h-[380px] w-full pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#64748b" 
              fontSize={10} 
              tickFormatter={(v) => (v > 0 ? `+${v}` : v)}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#64748b" 
              fontSize={11} 
              width={160}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.3 }} />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase border-t border-slate-800 pt-4 mt-4 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
          Reduces Default Risk (Favors Approval)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
          Increases Default Risk (Favors Rejection)
        </span>
      </div>
    </div>
  );
}
