import React from 'react';
import { Shield, LayoutDashboard, BarChart3, FileText, CheckCircle2, History, AlertCircle, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* ─── Header ─── */}
      <header className="bg-slate-900/40 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100">CreditLens</h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Explainable AI Credit Risk Evaluator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all active:scale-95 ${
                activeTab === 'form'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              New Evaluation
            </button>
            {result && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all active:scale-95 ${
                  activeTab === 'results'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
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
          <div className="max-w-4xl mx-auto mb-6 bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-400">Connection Error</div>
              <div className="text-xs text-rose-300/80 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* ─── Tab Content: Form ─── */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                Explainable Underwriting Decisioning
              </h2>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Provide applicant financial credentials to assess default probability. 
                Our pipeline replaces opaque models with SHAP-based feature attributions and compliance generation.
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

            {/* Inner navigation tabs */}
            <div className="flex border-b border-slate-900 pb-px">
              <button 
                onClick={() => setResultsTab('verdict')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  resultsTab === 'verdict'
                    ? 'border-indigo-500 text-slate-100'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Risk Explanation (SHAP)
              </button>
              <button 
                onClick={() => setResultsTab('letter')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  resultsTab === 'letter'
                    ? 'border-indigo-500 text-slate-100'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Compliance letter
              </button>
              <button 
                onClick={() => setResultsTab('metrics')}
                className={`pb-3 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  resultsTab === 'metrics'
                    ? 'border-indigo-500 text-slate-100'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Model validation
              </button>
            </div>

            {/* Sub-tab 1: Risk Explanations */}
            {resultsTab === 'verdict' && (
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <ShapChart shapValues={result.shap_values} baseValue={result.base_value} />
              </div>
            )}

            {/* Sub-tab 2: Letter */}
            {resultsTab === 'letter' && (
              <ExplanationLetter letterText={result.explanation_letter} />
            )}

            {/* Sub-tab 3: Metrics */}
            {resultsTab === 'metrics' && modelInfo && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl space-y-8">
                
                {/* Metric Summary Cards */}
                <div>
                  <h3 className="text-base font-bold text-slate-200 mb-4 uppercase tracking-wider">Model Performance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test AUC-ROC</div>
                      <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{(modelInfo.test_auc * 100).toFixed(2)}%</div>
                    </div>
                    <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">F1-Score</div>
                      <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{(modelInfo.test_f1 * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Precision</div>
                      <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{(modelInfo.test_precision * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Recall</div>
                      <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{(modelInfo.test_recall * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* Confusion Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-850">
                  <div>
                    <h4 className="text-sm font-bold text-slate-350 mb-4">Confusion Matrix</h4>
                    <div className="bg-slate-950 rounded-xl p-6 border border-slate-900 grid grid-cols-2 gap-4 text-center font-mono">
                      <div className="p-3 border border-slate-850 bg-slate-900/40 rounded-lg">
                        <div className="text-xs text-slate-500">True Negative (TN)</div>
                        <div className="text-lg font-bold text-slate-300 mt-1">{modelInfo.confusion_matrix[0][0]}</div>
                      </div>
                      <div className="p-3 border border-slate-850 bg-slate-900/40 rounded-lg">
                        <div className="text-xs text-slate-500">False Positive (FP)</div>
                        <div className="text-lg font-bold text-rose-500/80 mt-1">{modelInfo.confusion_matrix[0][1]}</div>
                      </div>
                      <div className="p-3 border border-slate-850 bg-slate-900/40 rounded-lg">
                        <div className="text-xs text-slate-500">False Negative (FN)</div>
                        <div className="text-lg font-bold text-amber-500/80 mt-1">{modelInfo.confusion_matrix[1][0]}</div>
                      </div>
                      <div className="p-3 border border-slate-850 bg-slate-900/40 rounded-lg">
                        <div className="text-xs text-slate-500">True Positive (TP)</div>
                        <div className="text-lg font-bold text-emerald-500/80 mt-1">{modelInfo.confusion_matrix[1][1]}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-350 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      Global Feature Importance
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Features ranked by split frequency across LightGBM trees. 
                      Shows global predictive drivers vs. local applicant-specific SHAP evaluations.
                    </p>
                    <div className="max-h-[160px] overflow-y-auto border border-slate-855 rounded-xl text-xs bg-slate-950/40">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                            <th className="p-3">Feature Column</th>
                            <th className="p-3 text-right">Split Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-mono text-slate-300">
                          {modelInfo.feature_importance && Object.entries(modelInfo.feature_importance).slice(0, 5).map(([feat, val]) => (
                            <tr key={feat} className="hover:bg-slate-900/20">
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
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-sans mt-auto">
        <p>© 2026 CreditLens · Compliant AI Credit Risk Model Validation Platform · Built with LightGBM, SHAP &amp; React</p>
      </footer>

    </div>
  );
}
