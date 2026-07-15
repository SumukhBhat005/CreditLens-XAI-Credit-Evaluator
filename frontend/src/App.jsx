import React from 'react';
import { Shield, LayoutDashboard, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import ApplicantForm from './components/ApplicantForm';
import DecisionBanner from './components/DecisionBanner';
import ShapChart from './components/ShapChart';
import ExplanationLetter from './components/ExplanationLetter';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [modelInfo, setModelInfo] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('form'); // 'form', 'results'
  const [resultsTab, setResultsTab] = React.useState('verdict'); // 'verdict', 'letter', 'metrics'
  const [error, setError] = React.useState(null);

  // Fetch model metrics on startup
  React.useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => {
        if (!res.ok) throw new Error("Backend not responding");
        return res.json();
      })
      .then(data => {
        if (data.model_metrics) {
          setModelInfo(data.model_metrics);
        }
      })
      .catch(err => {
        console.warn("Could not fetch model metrics from backend:", err.message);
      });
  }, []);

  const handleEvaluate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Prediction failed');
      }
      const data = await res.json();
      setResult(data);
      setActiveTab('results');
      setResultsTab('verdict');
    } catch (err) {
      setError(err.message || 'Failed to reach API server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#111111] flex flex-col font-sans selection:bg-indigo-500/10">
      
      {/* ─── Header (JPMorgan Style: Clean, Light, Serif Logo) ─── */}
      <header className="bg-white border-b border-[#e2ded5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0b2240] rounded flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold tracking-wide text-[#0b2240]">CreditLens</h1>
              <p className="text-[9px] text-[#8b7355] font-semibold uppercase tracking-widest mt-0.5">J.P. Morgan Risk Division</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border transition-all active:scale-95 rounded-full cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#0b2240] text-white border-[#0b2240] shadow-sm'
                  : 'bg-white hover:bg-[#f6f4f0] text-[#111111] border-[#e2ded5]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              New Evaluation
            </button>
            {result && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border transition-all active:scale-95 rounded-full cursor-pointer ${
                  activeTab === 'results'
                    ? 'bg-[#0b2240] text-white border-[#0b2240] shadow-sm'
                    : 'bg-white hover:bg-[#f6f4f0] text-[#111111] border-[#e2ded5]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Latest Result
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Workspace ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Error alert */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-red-950">Connection Error</div>
              <div className="text-xs text-red-700 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* ─── Tab Content: Form ─── */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[11px] font-bold text-[#8b7355] tracking-widest uppercase block mb-3">Institutional Risk Management</span>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-[#0b2240] mb-4">
                Explainable Loan Underwriting
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
                Submit applicant financials to perform compliance-grounded credit risk assessments. 
                Leverage local SHAP feature explanations and automated adverse action reporting.
              </p>
            </div>

            <ApplicantForm onSubmit={handleEvaluate} loading={loading} />
          </div>
        )}

        {/* ─── Tab Content: Results ─── */}
        {activeTab === 'results' && result && (
          <div className="space-y-6">
            
            {/* Top Overview verdict */}
            <DecisionBanner 
              decision={result.decision} 
              probability={result.probability_of_default} 
              riskLevel={result.risk_level} 
            />

            {/* Inner navigation tabs (JPMorgan Style: clean text with lines) */}
            <div className="flex border-b border-[#e2ded5] pb-px">
              <button 
                onClick={() => setResultsTab('verdict')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  resultsTab === 'verdict'
                    ? 'border-[#0b2240] text-[#0b2240]'
                    : 'border-transparent text-slate-500 hover:text-[#111111]'
                }`}
              >
                Risk Explanation (SHAP)
              </button>
              <button 
                onClick={() => setResultsTab('letter')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  resultsTab === 'letter'
                    ? 'border-[#0b2240] text-[#0b2240]'
                    : 'border-transparent text-slate-500 hover:text-[#111111]'
                }`}
              >
                Compliance letter
              </button>
              <button 
                onClick={() => setResultsTab('metrics')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  resultsTab === 'metrics'
                    ? 'border-[#0b2240] text-[#0b2240]'
                    : 'border-transparent text-slate-500 hover:text-[#111111]'
                }`}
              >
                Model validation
              </button>
            </div>

            {/* Sub-tab 1: Risk Explanations */}
            {resultsTab === 'verdict' && (
              <div className="grid grid-cols-1 gap-6">
                <ShapChart shapValues={result.shap_values} baseValue={result.base_value} />
              </div>
            )}

            {/* Sub-tab 2: Letter */}
            {resultsTab === 'letter' && (
              <ExplanationLetter letterText={result.explanation_letter} />
            )}

            {/* Sub-tab 3: Metrics */}
            {resultsTab === 'metrics' && modelInfo && (
              <div className="bg-white border border-[#e2ded5] rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-sm space-y-8">
                
                {/* Metric Summary Cards */}
                <div>
                  <h3 className="text-base font-serif font-bold text-[#0b2240] mb-4 uppercase tracking-wider">Model Performance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#fcfbf9] p-4 border border-[#e2ded5] rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test AUC-ROC</div>
                      <div className="text-2xl font-bold font-mono text-[#0b2240] mt-1">{(modelInfo.test_auc * 100).toFixed(2)}%</div>
                    </div>
                    <div className="bg-[#fcfbf9] p-4 border border-[#e2ded5] rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">F1-Score</div>
                      <div className="text-2xl font-bold font-mono text-slate-700 mt-1">{(modelInfo.test_f1 * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-[#fcfbf9] p-4 border border-[#e2ded5] rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Precision</div>
                      <div className="text-2xl font-bold font-mono text-slate-700 mt-1">{(modelInfo.test_precision * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-[#fcfbf9] p-4 border border-[#e2ded5] rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Recall</div>
                      <div className="text-2xl font-bold font-mono text-slate-700 mt-1">{(modelInfo.test_recall * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* Confusion Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#e2ded5]">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0b2240] mb-4">Confusion Matrix</h4>
                    <div className="bg-[#fcfbf9] rounded-xl p-6 border border-[#e2ded5] grid grid-cols-2 gap-4 text-center font-mono">
                      <div className="p-3 border border-[#e2ded5] bg-white rounded-lg">
                        <div className="text-xs text-slate-500">True Negative (TN)</div>
                        <div className="text-lg font-bold text-slate-800 mt-1">{modelInfo.confusion_matrix[0][0]}</div>
                      </div>
                      <div className="p-3 border border-[#e2ded5] bg-white rounded-lg">
                        <div className="text-xs text-slate-500">False Positive (FP)</div>
                        <div className="text-lg font-bold text-red-600 mt-1">{modelInfo.confusion_matrix[0][1]}</div>
                      </div>
                      <div className="p-3 border border-[#e2ded5] bg-white rounded-lg">
                        <div className="text-xs text-slate-500">False Negative (FN)</div>
                        <div className="text-lg font-bold text-amber-600 mt-1">{modelInfo.confusion_matrix[1][0]}</div>
                      </div>
                      <div className="p-3 border border-[#e2ded5] bg-white rounded-lg">
                        <div className="text-xs text-slate-500">True Positive (TP)</div>
                        <div className="text-lg font-bold text-emerald-600 mt-1">{modelInfo.confusion_matrix[1][1]}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-[#0b2240] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#8b7355]" />
                      Global Feature Importance
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Features ranked by split frequency across LightGBM decision trees. 
                      Integrates global predictive power constraints with applicant local explainability features.
                    </p>
                    <div className="max-h-[160px] overflow-y-auto border border-[#e2ded5] rounded-xl text-xs bg-white">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[#e2ded5] text-slate-500 text-[10px] uppercase font-bold tracking-wider bg-[#fcfbf9]">
                            <th className="p-3">Feature Column</th>
                            <th className="p-3 text-right">Split Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2ded5] font-mono text-slate-700">
                          {modelInfo.feature_importance && Object.entries(modelInfo.feature_importance).slice(0, 5).map(([feat, val]) => (
                            <tr key={feat} className="hover:bg-slate-50">
                              <td className="p-3 font-semibold">{feat}</td>
                              <td className="p-3 text-right">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-[#e2ded5] py-8 text-center text-xs text-slate-500 font-sans mt-auto">
        <p className="text-slate-400">© 2026 CreditLens · J.P. Morgan Chase &amp; Co. Proprietary Risk Model Validation Platform · Underwriting Division</p>
      </footer>

    </div>
  );
}
