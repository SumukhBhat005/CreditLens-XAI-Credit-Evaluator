import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export default function ShapChart({ shapValues, baseValue }) {
  const data = shapValues
    .slice(0, 8)
    .map(item => ({
      name: item.description,
      value: item.shap_value,
      displayVal: item.value,
      color: item.shap_value > 0 ? '#B91C1C' : '#047857', // danger-700 vs success-700
      displayString: formatVal(item.description, item.value)
    }))
    .reverse();

  function formatVal(desc, val) {
    if (val == null) return 'N/A';
    if (typeof val === 'number') {
      if (desc.toLowerCase().includes('income') || desc.toLowerCase().includes('amount')) return `$${val.toLocaleString()}`;
      if (desc.toLowerCase().includes('utilization') || desc.toLowerCase().includes('ratio')) return `${val.toFixed(1)}%`;
      return val.toString();
    }
    return val;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const pos = d.value > 0;
    return (
      <div className="bg-white border border-warm-200 rounded-xl p-4 shadow-lg text-xs text-warm-800 space-y-1.5" style={{ minWidth: '200px' }}>
        <div className="font-bold text-navy-800 text-sm">{d.name}</div>
        <div className="border-t border-warm-100 pt-1.5 space-y-1">
          <div className="flex justify-between gap-6 text-warm-500 font-mono"><span>Value:</span><span className="font-bold text-navy-700">{d.displayString}</span></div>
          <div className="flex justify-between gap-6 text-warm-500 font-mono"><span>Risk Impact:</span><span className={`font-bold ${pos ? 'text-danger-600' : 'text-success-600'}`}>{pos ? '+' : ''}{d.value.toFixed(4)}</span></div>
        </div>
        <div className="text-[9px] text-warm-400 italic border-t border-warm-100 pt-1.5 mt-1 font-mono">{pos ? '↑ Increases default risk' : '↓ Decreases default risk'}</div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-warm-200 rounded-xl shadow-sm w-full overflow-hidden animate-fade-in">
      {/* Gold accent */}
      <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />

      <div className="p-5 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-navy-800">SHAP Feature Attributions</h3>
            <p className="text-sm text-warm-400 mt-1">Impact of input features on applicant score deviation.</p>
          </div>
          <span className="text-xs font-bold text-navy-600 tracking-wider uppercase bg-navy-50 border border-navy-100 px-3.5 py-2 rounded-lg font-mono">
            Base: {(baseValue * 100).toFixed(1)}%
          </span>
        </div>

        <div className="h-[380px] w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" horizontal={false} />
              <XAxis
                type="number"
                stroke="#9CA3AF"
                fontSize={10}
                tickFormatter={v => {
                  const num = Number(v);
                  return num > 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
                }}
                domain={['dataMin - 0.1', 'dataMax + 0.1']}
                fontFamily="Roboto Mono, monospace"
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#374151"
                fontSize={14}
                width={220}
                tickLine={false}
                fontFamily="Inter, sans-serif"
                style={{ letterSpacing: '0.015em' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAFBFC', opacity: 0.8 }} />
              <ReferenceLine x={0} stroke="#9CA3AF" strokeWidth={1} />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center text-xs text-warm-500 font-bold tracking-wider uppercase border-t border-warm-200 pt-3.5 mt-4 px-1 font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#047857' }} />Reduces Default Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B91C1C' }} />Increases Default Risk</span>
        </div>
      </div>
    </div>
  );
}
