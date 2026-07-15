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
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Applicant Details</h2>
          <p className="text-sm text-slate-400 mt-1">Enter applicant financial and credit history metrics</p>
        </div>
        
        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase mr-2">Quick Presets:</span>
          <button 
            type="button" 
            onClick={() => loadPreset('good')}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 rounded-lg text-xs font-medium transition-all"
          >
            Tier-A (Low Risk)
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('borderline')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/30 rounded-lg text-xs font-medium transition-all"
          >
            Borderline
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('risky')}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-lg text-xs font-medium transition-all"
          >
            High Risk
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Score */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex justify-between">
              <span>Credit Score</span>
              <span className="text-slate-400 font-mono font-bold">{formData.credit_score}</span>
            </label>
            <input 
              type="range" min="300" max="850" name="credit_score" 
              value={formData.credit_score} onChange={handleChange}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>300 (Poor)</span>
              <span>850 (Excellent)</span>
            </div>
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Annual Income ($)</label>
            <input 
              type="number" name="annual_income" value={formData.annual_income} onChange={handleChange}
              min="10000" max="500000" step="5000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>

          {/* Loan Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Loan Amount Requested ($)</label>
            <input 
              type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange}
              min="1000" max="100000" step="1000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>

          {/* Employment Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex justify-between">
              <span>Employment Length</span>
              <span className="text-slate-400 font-mono font-bold">{formData.employment_length} yrs</span>
            </label>
            <input 
              type="range" min="0" max="40" name="employment_length" 
              value={formData.employment_length} onChange={handleChange}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>0 yrs</span>
              <span>40 yrs</span>
            </div>
          </div>

          {/* Revolving Utilization */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex justify-between">
              <span>Credit Card Utilization</span>
              <span className="text-slate-400 font-mono font-bold">{formData.revolving_utilization}%</span>
            </label>
            <input 
              type="range" min="0" max="150" step="0.1" name="revolving_utilization" 
              value={formData.revolving_utilization} onChange={handleChange}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>0%</span>
              <span>150%</span>
            </div>
          </div>

          {/* Open Credit Lines */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Open Credit Lines & Loans</label>
            <input 
              type="number" name="open_credit_lines" value={formData.open_credit_lines} onChange={handleChange}
              min="0" max="30"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>

          {/* Delinquency 30-59 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">30-59 Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_30_59" value={formData.delinquency_30_59} onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Delinquency 60-89 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">60-89 Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_60_89" value={formData.delinquency_60_89} onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Delinquency 90+ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">90+ Days Past Due (Last 2 yrs)</label>
            <select 
              name="delinquency_90_plus" value={formData.delinquency_90_plus} onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
            >
              {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} times</option>)}
            </select>
          </div>

          {/* Real Estate Loans */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Active Real Estate Loans</label>
            <input 
              type="number" name="real_estate_loans" value={formData.real_estate_loans} onChange={handleChange}
              min="0" max="10"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>

          {/* Dependents */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Number of Dependents</label>
            <input 
              type="number" name="dependents" value={formData.dependents} onChange={handleChange}
              min="0" max="10"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Applicant Age</label>
            <input 
              type="number" name="age" value={formData.age} onChange={handleChange}
              min="21" max="75"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-semibold"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-sm font-semibold font-sans shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating Risk...
              </span>
            ) : "Submit Credit Evaluation"}
          </button>
        </div>
      </form>
    </div>
  );
}
