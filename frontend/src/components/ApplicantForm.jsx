import React from 'react';

const PRESETS = {
  good: {
    credit_score: 780,
    annual_income: 120000,
    employment_length: 12,
    loan_amount: 15000,
    open_credit_lines: 6,
    delinquency_30_59: 0,
    delinquency_60_89: 0,
    delinquency_90_plus: 0,
    revolving_utilization: 12.5,
    real_estate_loans: 1,
    dependents: 1,
    age: 45,
  },
  borderline: {
    credit_score: 640,
    annual_income: 48000,
    employment_length: 3,
    loan_amount: 30000,
    open_credit_lines: 8,
    delinquency_30_59: 1,
    delinquency_60_89: 0,
    delinquency_90_plus: 0,
    revolving_utilization: 55.4,
    real_estate_loans: 0,
    dependents: 2,
    age: 29,
  },
  risky: {
    credit_score: 520,
    annual_income: 32000,
    employment_length: 1,
    loan_amount: 45000,
    open_credit_lines: 4,
    delinquency_30_59: 2,
    delinquency_60_89: 1,
    delinquency_90_plus: 1,
    revolving_utilization: 94.2,
    real_estate_loans: 0,
    dependents: 3,
    age: 24,
  }
};

export default function ApplicantForm({ onSubmit, loading }) {
  const [formData, setFormData] = React.useState({ ...PRESETS.good });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'revolving_utilization' ? parseFloat(value) || 0 : parseInt(value) || 0
    }));
  };

  const loadPreset = (presetName) => {
    setFormData({ ...PRESETS[presetName] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border border-[#e2ded5] rounded-2xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e2ded5]">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#0b2240]">Applicant Profile</h2>
          <p className="text-xs text-slate-500 mt-1">Enter applicant credit history and financial details for risk audit.</p>
        </div>
        
        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#8b7355] tracking-widest uppercase mr-2">Profile Presets:</span>
          <button 
            type="button" 
            onClick={() => loadPreset('good')}
            className="px-3 py-1.5 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] border border-[#a5d6a7] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Tier-A Profile
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('borderline')}
            className="px-3 py-1.5 bg-[#fff8e1] hover:bg-[#ffe082] text-[#f57f17] border border-[#ffe082] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Borderline Profile
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('risky')}
            className="px-3 py-1.5 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#c62828] border border-[#ef9a9a] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Subprime Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Score */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Credit Score</span>
              <span className="text-[#0b2240] font-mono font-bold">{formData.credit_score}</span>
            </label>
            <input 
              type="range" min="300" max="850" name="credit_score" 
              value={formData.credit_score} onChange={handleChange}
              className="w-full accent-[#0b2240] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>300 (Subprime)</span>
              <span>850 (Prime)</span>
            </div>
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Income ($)</label>
            <input 
              type="number" name="annual_income" value={formData.annual_income} onChange={handleChange}
              min="10000" max="500000" step="5000"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>

          {/* Loan Amount */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Loan Amount ($)</label>
            <input 
              type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange}
              min="1000" max="100000" step="1000"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>

          {/* Employment Length */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Employment Length</span>
              <span className="text-[#0b2240] font-mono font-bold">{formData.employment_length} yrs</span>
            </label>
            <input 
              type="range" min="0" max="40" name="employment_length" 
              value={formData.employment_length} onChange={handleChange}
              className="w-full accent-[#0b2240] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 yrs</span>
              <span>40 yrs</span>
            </div>
          </div>

          {/* Revolving Utilization */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Revolving Utilization</span>
              <span className="text-[#0b2240] font-mono font-bold">{formData.revolving_utilization}%</span>
            </label>
            <input 
              type="range" min="0" max="150" step="0.1" name="revolving_utilization" 
              value={formData.revolving_utilization} onChange={handleChange}
              className="w-full accent-[#0b2240] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span>150%</span>
            </div>
          </div>

          {/* Open Credit Lines */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Credit Lines &amp; Loans</label>
            <input 
              type="number" name="open_credit_lines" value={formData.open_credit_lines} onChange={handleChange}
              min="0" max="30"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>

          {/* Delinquency 30-59 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">30-59 Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_30_59" value={formData.delinquency_30_59} onChange={handleChange}
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Delinquency 60-89 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">60-89 Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_60_89" value={formData.delinquency_60_89} onChange={handleChange}
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Delinquency 90+ */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">90+ Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_90_plus" value={formData.delinquency_90_plus} onChange={handleChange}
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Real Estate Loans */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Mortgages &amp; RE Loans</label>
            <input 
              type="number" name="real_estate_loans" value={formData.real_estate_loans} onChange={handleChange}
              min="0" max="10"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>

          {/* Dependents */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Dependents</label>
            <input 
              type="number" name="dependents" value={formData.dependents} onChange={handleChange}
              min="0" max="10"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Age</label>
            <input 
              type="number" name="age" value={formData.age} onChange={handleChange}
              min="21" max="75"
              className="w-full bg-[#fcfbf9] border border-[#e2ded5] rounded-xl px-4 py-2.5 text-[#111111] focus:outline-none focus:border-[#0b2240] focus:ring-1 focus:ring-[#0b2240] transition-all text-sm font-semibold"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-[#e2ded5]">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-[#0b2240] hover:bg-[#08172c] active:scale-[0.98] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating Risk Metrics...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Run Underwriting Audit
                <span>→</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
