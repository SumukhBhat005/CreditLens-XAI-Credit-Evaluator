import React from 'react';

const PRESETS = {
  good: {
    revolving_utilization: 12.5, age: 52, delinquency_30_59: 0,
    debt_to_income: 0.18, annual_income: 120000, open_credit_lines: 8,
    delinquency_90_plus: 0, real_estate_loans: 2, delinquency_60_89: 0,
    dependents: 1,
  },
  borderline: {
    revolving_utilization: 55.4, age: 34, delinquency_30_59: 1,
    debt_to_income: 0.65, annual_income: 48000, open_credit_lines: 12,
    delinquency_90_plus: 0, real_estate_loans: 0, delinquency_60_89: 0,
    dependents: 2,
  },
  risky: {
    revolving_utilization: 94.2, age: 27, delinquency_30_59: 3,
    debt_to_income: 2.8, annual_income: 28000, open_credit_lines: 5,
    delinquency_90_plus: 2, real_estate_loans: 0, delinquency_60_89: 1,
    dependents: 3,
  }
};

const FIELD_CONFIG = [
  { name: 'revolving_utilization', label: 'Revolving Utilization (%)', type: 'range', min: 0, max: 150, step: 0.1, suffix: '%', leftLabel: '0%', rightLabel: '150%', isFloat: true },
  { name: 'age', label: 'Borrower Age', type: 'number', min: 21, max: 109 },
  { name: 'annual_income', label: 'Annual Income ($)', type: 'number', min: 0, max: 1000000, step: 5000 },
  { name: 'debt_to_income', label: 'Debt-to-Income Ratio', type: 'range', min: 0, max: 5, step: 0.01, suffix: '', leftLabel: '0.0 (Low)', rightLabel: '5.0 (High)', isFloat: true },
  { name: 'open_credit_lines', label: 'Open Credit Lines & Loans', type: 'number', min: 0, max: 60 },
  { name: 'real_estate_loans', label: 'Real Estate Loans', type: 'number', min: 0, max: 20 },
  { name: 'delinquency_30_59', label: '30-59 Days Late (Last 2yr)', type: 'select', options: [0,1,2,3,4,5,6,7,8,9,10] },
  { name: 'delinquency_60_89', label: '60-89 Days Late (Last 2yr)', type: 'select', options: [0,1,2,3,4,5,6,7,8,9,10] },
  { name: 'delinquency_90_plus', label: '90+ Days Serious Delinquency', type: 'select', options: [0,1,2,3,4,5,6,7,8,9,10] },
  { name: 'dependents', label: 'Number of Dependents', type: 'number', min: 0, max: 15 },
];

const inputClass = "w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-350 transition-all text-xs font-semibold font-mono";

export default function ApplicantForm({ onSubmit, loading }) {
  const [formData, setFormData] = React.useState({ ...PRESETS.good });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = FIELD_CONFIG.find(f => f.name === name);
    setFormData(prev => ({
      ...prev,
      [name]: field?.isFloat ? parseFloat(value) || 0 : parseInt(value) || 0
    }));
  };

  const loadPreset = (name) => setFormData({ ...PRESETS[name] });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-slate-900">Underwriting Parameters</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">Trained on 150K real borrower records from Kaggle 'Give Me Some Credit'</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mr-1 font-mono">Presets:</span>
          <button type="button" onClick={() => loadPreset('good')} className="px-3 py-1.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] rounded-md text-[10px] font-bold tracking-wide transition cursor-pointer font-mono active:scale-95">Low Risk</button>
          <button type="button" onClick={() => loadPreset('borderline')} className="px-3 py-1.5 bg-[#fffbeb] hover:bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-md text-[10px] font-bold tracking-wide transition cursor-pointer font-mono active:scale-95">Borderline</button>
          <button type="button" onClick={() => loadPreset('risky')} className="px-3 py-1.5 bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] rounded-md text-[10px] font-bold tracking-wide transition cursor-pointer font-mono active:scale-95">High Risk</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FIELD_CONFIG.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex justify-between font-mono">
                <span>{field.label}</span>
                {field.type === 'range' && (
                  <span className="text-blue-600 font-mono font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{formData[field.name]}{field.suffix}</span>
                )}
              </label>

              {field.type === 'range' && (
                <>
                  <input type="range" min={field.min} max={field.max} step={field.step || 1} name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none border border-slate-200" />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>{field.leftLabel}</span><span>{field.rightLabel}</span>
                  </div>
                </>
              )}

              {field.type === 'number' && (
                <input type="number" name={field.name} value={formData[field.name]} onChange={handleChange} min={field.min} max={field.max} step={field.step || 1} className={inputClass} required />
              )}

              {field.type === 'select' && (
                <select name={field.name} value={formData[field.name]} onChange={handleChange} className={inputClass}>
                  {field.options.map(v => <option key={v} value={v} className="bg-white">{v} time{v !== 1 ? 's' : ''}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6 border-t border-[#e2e8f0]">
          <button type="submit" disabled={loading}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:pointer-events-none font-mono"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Evaluating...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">Evaluate Risk Profile <span>→</span></span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
