import React from 'react';

const PRESETS = {
  good: {
    credit_score: 780, annual_income: 120000, employment_length: 12, loan_amount: 15000,
    open_credit_lines: 6, delinquency_30_59: 0, delinquency_60_89: 0, delinquency_90_plus: 0,
    revolving_utilization: 12.5, real_estate_loans: 1, dependents: 1, age: 45,
  },
  borderline: {
    credit_score: 640, annual_income: 48000, employment_length: 3, loan_amount: 30000,
    open_credit_lines: 8, delinquency_30_59: 1, delinquency_60_89: 0, delinquency_90_plus: 0,
    revolving_utilization: 55.4, real_estate_loans: 0, dependents: 2, age: 29,
  },
  risky: {
    credit_score: 520, annual_income: 32000, employment_length: 1, loan_amount: 45000,
    open_credit_lines: 4, delinquency_30_59: 2, delinquency_60_89: 1, delinquency_90_plus: 1,
    revolving_utilization: 94.2, real_estate_loans: 0, dependents: 3, age: 24,
  }
};

const FIELD_CONFIG = [
  { name: 'credit_score', label: 'Credit Score', type: 'range', min: 300, max: 850, suffix: '', leftLabel: '300 (Subprime)', rightLabel: '850 (Prime)' },
  { name: 'annual_income', label: 'Annual Income ($)', type: 'number', min: 10000, max: 500000, step: 5000 },
  { name: 'loan_amount', label: 'Requested Loan Amount ($)', type: 'number', min: 1000, max: 100000, step: 1000 },
  { name: 'employment_length', label: 'Employment Length', type: 'range', min: 0, max: 40, suffix: ' yrs', leftLabel: '0 yrs', rightLabel: '40 yrs' },
  { name: 'revolving_utilization', label: 'Revolving Credit Utilization', type: 'range', min: 0, max: 150, step: 0.1, suffix: '%', leftLabel: '0%', rightLabel: '150%', isFloat: true },
  { name: 'open_credit_lines', label: 'Open Credit Lines & Loans', type: 'number', min: 0, max: 30 },
  { name: 'delinquency_30_59', label: '30-59 Days Late (Last 2yr)', type: 'select', options: [0,1,2,3,4,5] },
  { name: 'delinquency_60_89', label: '60-89 Days Late (Last 2yr)', type: 'select', options: [0,1,2,3,4,5] },
  { name: 'delinquency_90_plus', label: '90+ Days Late (Last 2yr)', type: 'select', options: [0,1,2,3,4,5] },
  { name: 'real_estate_loans', label: 'Real Estate Mortgages', type: 'number', min: 0, max: 10 },
  { name: 'dependents', label: 'Number of Dependents', type: 'number', min: 0, max: 10 },
  { name: 'age', label: 'Applicant Age (Years)', type: 'number', min: 21, max: 75 },
];

const inputClass = "w-full bg-warm-50 border border-warm-200 rounded-lg px-4 py-2.5 text-warm-800 placeholder-warm-400 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition-all text-xs font-semibold font-mono hover:border-warm-300";

export default function ApplicantForm({ onSubmit, loading }) {
  const [formData, setFormData] = React.useState({ ...PRESETS.good });
  const [activePreset, setActivePreset] = React.useState('good');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = FIELD_CONFIG.find(f => f.name === name);
    setFormData(prev => ({
      ...prev,
      [name]: field?.isFloat ? parseFloat(value) || 0 : parseInt(value) || 0
    }));
    setActivePreset(null);
  };

  const loadPreset = (name) => {
    setFormData({ ...PRESETS[name] });
    setActivePreset(name);
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <div className="bg-white border border-warm-200 rounded-xl shadow-sm w-full overflow-hidden">
      {/* Gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-warm-200">
          <div>
            <h2 className="text-lg font-bold text-navy-800">Underwriting Parameters</h2>
            <p className="text-xs text-warm-400 mt-1">Fill in client metrics or select a demo profile below.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-warm-400 tracking-wider uppercase mr-1.5 font-mono">Profiles:</span>
            {[
              { key: 'good', label: 'Low Risk', activeBg: 'bg-success-50', activeBorder: 'border-green-300', activeText: 'text-success-700', hoverBg: 'hover:bg-success-50' },
              { key: 'borderline', label: 'Borderline', activeBg: 'bg-amber-50', activeBorder: 'border-amber-300', activeText: 'text-amber-700', hoverBg: 'hover:bg-amber-50' },
              { key: 'risky', label: 'High Risk', activeBg: 'bg-danger-50', activeBorder: 'border-red-300', activeText: 'text-danger-700', hoverBg: 'hover:bg-danger-50' },
            ].map(({ key, label, activeBg, activeBorder, activeText, hoverBg }) => (
              <button
                key={key}
                type="button"
                onClick={() => loadPreset(key)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-all cursor-pointer active:scale-95 border ${
                  activePreset === key
                    ? `${activeBg} ${activeBorder} ${activeText}`
                    : `bg-white border-warm-200 text-warm-500 ${hoverBg} hover:border-warm-300`
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {FIELD_CONFIG.map(field => (
              <div key={field.name} className="space-y-2">
                <label className="text-[13px] font-bold text-navy-800 uppercase tracking-wider flex justify-between font-mono">
                  <span>{field.label}</span>
                  {field.type === 'range' && (
                    <span className="text-navy-700 font-mono font-bold text-xs bg-navy-50 px-2 py-0.5 rounded-md border border-navy-100">
                      {formData[field.name]}{field.suffix}
                    </span>
                  )}
                </label>

                {field.type === 'range' && (
                  <>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-warm-400 font-mono">
                      <span>{field.leftLabel}</span><span>{field.rightLabel}</span>
                    </div>
                  </>
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    className={inputClass}
                    required
                  />
                )}

                {field.type === 'select' && (
                  <select name={field.name} value={formData[field.name]} onChange={handleChange} className={inputClass}>
                    {field.options.map(v => <option key={v} value={v} className="bg-white">{v} time{v !== 1 ? 's' : ''}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t border-warm-200">
            <button type="submit" disabled={loading}
              className="group px-7 py-3.5 bg-navy-700 hover:bg-navy-800 active:scale-[0.97] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none font-mono"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Evaluating...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">Evaluate Risk Profile <span className="transition-transform group-hover:translate-x-0.5">→</span></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
