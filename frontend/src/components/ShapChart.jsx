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
      color: item.shap_value > 0 ? '#dc2626' : '#16a34a', // JPMorgan corporate red/green
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
        <div className="bg-white border border-[#e2ded5] rounded-xl p-4 shadow-lg space-y-1.5 text-xs text-[#111111]">
          <div className="font-serif font-bold text-[#0b2240]">{data.name}</div>
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Applicant Value:</span>
            <span className="font-mono font-bold text-slate-800">{data.displayString}</span>
          </div>
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Risk Impact:</span>
            <span className={`font-mono font-bold ${isPositive ? 'text-red-650' : 'text-emerald-650'}`}>
              {isPositive ? '+' : ''}{data.value.toFixed(4)}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 italic border-t border-slate-100 pt-1.5 mt-1.5">
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
    <div className="bg-white border border-[#e2ded5] rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-serif font-semibold text-[#0b2240] flex items-center justify-between">
          <span>AI Decision Drivers (SHAP Explanations)</span>
          <span className="text-[10px] font-bold text-[#8b7355] tracking-wider uppercase bg-[#fcfbf9] border border-[#e2ded5] px-3 py-1 rounded-full font-mono">
            Base Probability: {(baseValue * 100).toFixed(1)}%
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          SHAP values represent the mathematically calculated contribution of each factor. 
          Positive values (red, right) increase the probability of default; negative values (green, left) reduce it.
        </p>
      </div>

      <div className="h-[380px] w-full pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f0ec" horizontal={false} />
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
              stroke="#0b2240" 
              fontSize={11} 
              width={160}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fcfbf9', opacity: 0.8 }} />
            <ReferenceLine x={0} stroke="#8b7355" strokeWidth={1.5} />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase border-t border-[#e2ded5] pt-4 mt-4 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#16a34a]"></span>
          Reduces Default Risk (Favors Approval)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#dc2626]"></span>
          Increases Default Risk (Favors Rejection)
        </span>
      </div>
    </div>
  );
}
