import React from 'react';
import { Shield, ArrowRight, BarChart3, FileText, Brain, Scale, Database, Zap, AlertCircle, TrendingUp, Printer, ChevronRight, Lock, Activity, Eye } from 'lucide-react';
import ApplicantForm from './components/ApplicantForm';
import DecisionBanner from './components/DecisionBanner';
import ShapChart from './components/ShapChart';
import ExplanationLetter from './components/ExplanationLetter';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [modelInfo, setModelInfo] = React.useState(null);
  const [page, setPage] = React.useState('home'); // 'home' | 'evaluate' | 'results'
  const [resultsTab, setResultsTab] = React.useState('verdict');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.model_metrics) setModelInfo(data.model_metrics); })
      .catch(() => {});
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
      setPage('results');
      setResultsTab('verdict');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to reach API server.');
    } finally {
      setLoading(false);
    }
  };

  const goToEvaluate = () => {
    setPage('evaluate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── NAVBAR ───
  const Navbar = () => (
    <nav className="no-print bg-white/95 backdrop-blur-md border-b border-warm-200 sticky top-0 z-50 w-full" style={{ boxShadow: '0 1px 3px rgba(10,37,64,0.06)' }}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <button onClick={() => { setPage('home'); window.scrollTo({ top: 0 }); }} className="flex items-center gap-3 cursor-pointer text-left group">
          <div className="w-9 h-9 bg-navy-700 flex items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Shield className="w-4.5 h-4.5 text-gold-400" />
          </div>
          <div>
            <span className="text-[15px] font-bold tracking-tight text-navy-800 block leading-tight font-serif">CreditLens</span>
            <span className="text-[9px] font-semibold text-warm-400 tracking-wider uppercase block font-mono">Explainable AI</span>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPage('home'); window.scrollTo({ top: 0 }); }}
            className={`hidden md:inline-flex px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${page === 'home' ? 'text-navy-700 bg-navy-50' : 'text-warm-500 hover:text-navy-700 hover:bg-warm-100'}`}
          >
            Overview
          </button>
          <button
            onClick={goToEvaluate}
            className="px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-[0.97]"
          >
            Run Evaluation <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );

  // ─── HOME PAGE ───
  const HomePage = () => (
    <div className="w-full animate-fade-in">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.4) 0%, transparent 70%)' }} />

        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-[11px] font-semibold text-gold-300 tracking-wide">
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
              RBI & Federal Law Compliant
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-white leading-[1.1] tracking-tight">
              Transparent Credit<br />
              <span className="text-gold-400">Risk Underwriting</span>
            </h1>
            <p className="text-warm-100/90 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Evaluate default probability, decompose risk drivers with SHAP explainability, and generate regulatory-compliant disclosure notices — all in real time.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={goToEvaluate}
                className="group px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm rounded-lg transition-all cursor-pointer flex items-center gap-2 active:scale-[0.97] shadow-lg hover:shadow-xl"
              >
                Start Evaluation
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-lg transition-all cursor-pointer backdrop-blur-sm border border-white/15"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-white border-b border-warm-200">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Model AUC-ROC', value: modelInfo ? `${(modelInfo.test_auc * 100).toFixed(1)}%` : '—', sub: 'Separation capacity' },
              { label: 'Precision', value: modelInfo ? `${(modelInfo.test_precision * 100).toFixed(1)}%` : '—', sub: 'False denial rate' },
              { label: 'Recall', value: modelInfo ? `${(modelInfo.test_recall * 100).toFixed(1)}%` : '—', sub: 'Default capture' },
              { label: 'F1-Score', value: modelInfo ? `${(modelInfo.test_f1 * 100).toFixed(1)}%` : '—', sub: 'Balanced metric' },
            ].map(({ label, value, sub }, i) => (
              <div key={i} className="text-center md:text-left space-y-1">
                <div className="text-xs font-bold text-warm-600 uppercase tracking-wider font-mono">{label}</div>
                <div className="text-3xl md:text-4xl font-bold text-navy-900 font-mono">{value}</div>
                <div className="text-xs text-warm-650 font-semibold">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-b from-navy-50/50 to-transparent p-8 md:p-12 rounded-2xl border border-navy-100/70 shadow-xs">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-1 bg-gold-500 rounded-full animate-pulse-glow" style={{ animationDuration: '3s' }} />
            <h2 className="text-sm font-bold tracking-widest uppercase text-navy-800 font-mono">Executive Summary</h2>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-navy-900 leading-snug max-w-2xl mx-auto">
            Democratizing transparency and compliance in algorithmic credit decisions.
          </h3>
          
          <div className="text-warm-850 text-[17px] font-medium leading-relaxed space-y-6 max-w-3xl mx-auto text-center">
            <p>
              Under federal fair lending guidelines (specifically <strong className="text-navy-955 font-bold">RBI Guidelines & Federal Regulations</strong>), financial underwriting models are prohibited from operating as black boxes. Lenders are legally required to state the exact, principal reasons for credit denials.
            </p>
            <p>
              <strong className="text-navy-950 font-bold">CreditLens</strong> bridges this regulatory gap by pairing a high-performance LightGBM classifier with local SHAP attributions. Every decision is decomposed into exact feature vectors showing how credit parameters drove the score, allowing an LLM to auto-draft compliant disclosure notices without risk of hallucination.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-warm-200">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-navy-800 font-mono">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: FileText, title: 'Submit Application', desc: 'Enter applicant credit parameters — score, income, utilization, delinquencies, and more.' },
              { step: '02', icon: Brain, title: 'AI Risk Analysis', desc: 'LightGBM predicts default probability while SHAP decomposes the exact feature contributions.' },
              { step: '03', icon: Scale, title: 'Compliance Report', desc: 'An LLM generates a regulatory-compliant adverse action notice or approval letter grounded in SHAP math.' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={i} className="relative group">
                <div className="space-y-4 p-6 rounded-xl border border-warm-200 bg-warm-50/50 hover:bg-white hover:border-warm-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="text-[28px] font-serif text-gold-500 leading-none">{step}</span>
                    <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-navy-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-navy-900 text-[18px]">{title}</h3>
                  <p className="text-[15.5px] text-warm-700 font-medium leading-relaxed">{desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-warm-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-navy-800 font-mono">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Brain, title: 'Explainable Predictions', desc: 'SHAP calculates local Shapley values to pinpoint the exact attributes that triggered approval or rejection.' },
            { icon: Scale, title: 'Compliance Autopilot', desc: 'Generates structured legal Adverse Action memos mapping strictly to model coefficients.' },
            { icon: BarChart3, title: 'Interactive Risk Analytics', desc: 'Renders client-side feature waterfalls using clear positive and negative indicator charts.' },
            { icon: Database, title: 'Production Pipeline', desc: 'Pre-fitted StandardScalers and LightGBM model weights are preserved inside joblib schemas for consistent inference.' },
            { icon: Zap, title: 'Real-Time Inference', desc: 'FastAPI validation layers execute preprocessing, predictions, explanations, and LLM letters concurrently.' },
            { icon: TrendingUp, title: 'Operational Auditing', desc: 'Monitors real-time confusion matrices, recall curves, and split frequencies for risk managers.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="group bg-white border border-warm-200 rounded-xl p-6 hover:border-navy-200 hover:shadow-lg transition-all duration-300 cursor-default">
              <div className="w-10 h-10 bg-navy-50 text-navy-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-navy-100 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-[17px] mb-2">{title}</h3>
              <p className="text-[15px] text-warm-700 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model Stats Table */}
      <section className="bg-white border-y border-warm-200">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-navy-800 font-mono">Model Statistics & Quality Metrics</h2>
          </div>

          {modelInfo ? (
            <div className="border border-warm-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-navy-50 border-b border-warm-200 text-navy-800 font-bold uppercase tracking-wider text-xs">
                    <th className="px-5 py-3.5 font-mono">Model Metric</th>
                    <th className="px-5 py-3.5 text-right font-mono">Value (Full Test Set)</th>
                    <th className="px-5 py-3.5 font-mono">Reference Parameter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-200 text-warm-900 bg-white">
                  {[
                    { metric: 'Area Under ROC (AUC-ROC)', value: `${(modelInfo.test_auc * 100).toFixed(2)}%`, ref: 'Target separation benchmark (> 90%)' },
                    { metric: 'Model F1-Score', value: `${(modelInfo.test_f1 * 100).toFixed(2)}%`, ref: 'Class imbalance robust metric' },
                    { metric: 'Underwriting Precision', value: `${(modelInfo.test_precision * 100).toFixed(2)}%`, ref: 'Minimization of false denial defaults' },
                    { metric: 'Underwriting Recall', value: `${(modelInfo.test_recall * 100).toFixed(2)}%`, ref: 'Default capture rate' },
                  ].map(({ metric, value, ref }) => (
                    <tr key={metric} className="hover:bg-warm-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-navy-900 font-mono text-[13px]">{metric}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-navy-950 text-base font-mono">{value}</td>
                      <td className="px-5 py-3.5 text-warm-650 text-sm font-medium">{ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-warm-400 font-mono text-xs">
              <Activity className="w-5 h-5 mx-auto mb-2 animate-pulse text-warm-300" />
              Waiting for model evaluation response...
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-800">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy-700 flex items-center justify-center rounded-lg">
                <Shield className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-white font-serif">CreditLens</span>
                <span className="text-[9px] text-navy-300 block font-mono uppercase tracking-wider">XAI Credit Risk Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[10px] text-navy-300 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> RBI Compliant</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Federal Transparency</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No Prohibited Proxies</span>
            </div>
          </div>
          <div className="border-t border-navy-700 mt-6 pt-6 text-center text-[10px] text-navy-400 font-mono tracking-wide">
            CreditLens Auditing Core · Validation Document CL-2026-X79 · Built by Sumukh Bhat
          </div>
        </div>
      </footer>
    </div>
  );

  // ─── EVALUATE PAGE ───
  const EvaluatePage = () => (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-warm-400 mb-6 font-mono">
        <button onClick={() => { setPage('home'); window.scrollTo({ top: 0 }); }} className="hover:text-navy-600 cursor-pointer transition">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-700 font-semibold">Credit Evaluation</span>
      </nav>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-navy-800">Credit Evaluation Worksheet</h2>
        <p className="text-warm-500 text-sm">Enter applicant variables below to evaluate default risk and generate SHAP attributions.</p>
      </div>

      {error && (
        <div className="bg-danger-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-danger-700">Connection Failed</div>
            <div className="text-xs text-red-600 mt-0.5">{error}</div>
          </div>
        </div>
      )}

      <ApplicantForm onSubmit={handleEvaluate} loading={loading} />
    </div>
  );

  // ─── RESULTS PAGE ───
  const ResultsPage = () => (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10 animate-fade-in">

      {/* Breadcrumb */}
      <nav className="no-print flex items-center gap-1.5 text-sm text-warm-450 mb-6 font-mono">
        <button onClick={() => { setPage('home'); window.scrollTo({ top: 0 }); }} className="hover:text-navy-600 cursor-pointer transition">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => setPage('evaluate')} className="hover:text-navy-600 cursor-pointer transition">Evaluation</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-700 font-semibold">Decision Report</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-end border-b border-warm-200 pb-5 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-navy-800">Underwriting Decision Verdict</h2>
          <p className="text-warm-450 text-sm mt-1 font-mono">Report ID: CL-{result.base_value ? Math.abs(result.base_value * 10000).toFixed(0) : 'N/A'}</p>
        </div>
        <button onClick={() => window.print()} className="no-print flex items-center gap-2 px-4.5 py-3 bg-white hover:bg-warm-50 border border-warm-200 rounded-lg text-sm font-semibold active:scale-95 transition-all text-navy-700 cursor-pointer shadow-sm hover:shadow-md">
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      <div className="space-y-6">
        {/* Banner */}
        <DecisionBanner
          decision={result.decision}
          probability={result.probability_of_default}
          riskLevel={result.risk_level}
        />

        {/* Tab bar */}
        <div className="flex border-b border-warm-200 no-print">
          {[
            { id: 'verdict', label: 'Risk Drivers (SHAP)' },
            { id: 'letter', label: 'Compliance Notice' },
            { id: 'metrics', label: 'Quality Metrics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setResultsTab(tab.id)}
              className={`pb-3 px-6 text-sm font-semibold border-b-2 tracking-wide transition-all cursor-pointer ${
                resultsTab === tab.id
                  ? 'border-navy-700 text-navy-800 font-bold'
                  : 'border-transparent text-warm-400 hover:text-navy-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {resultsTab === 'verdict' && (
            <ShapChart shapValues={result.shap_values} baseValue={result.base_value} />
          )}

          {resultsTab === 'letter' && (
            <ExplanationLetter letterText={result.explanation_letter} />
          )}

          {resultsTab === 'metrics' && modelInfo && (
            <div className="bg-white border border-warm-200 rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-navy-800 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold-500" />
                Statistical Audit Metrics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Model ROC-AUC', val: `${(modelInfo.test_auc * 100).toFixed(2)}%` },
                  { label: 'Model F1-Score', val: `${(modelInfo.test_f1 * 100).toFixed(1)}%` },
                  { label: 'Precision', val: `${(modelInfo.test_precision * 100).toFixed(1)}%` },
                  { label: 'Recall', val: `${(modelInfo.test_recall * 100).toFixed(1)}%` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-warm-50 p-4 border border-warm-200 rounded-xl">
                    <div className="text-[9px] font-bold text-warm-400 uppercase tracking-widest font-mono">{label}</div>
                    <div className="text-xl font-bold font-mono text-navy-800 mt-1">{val}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-warm-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800 mb-3 font-mono">Confusion Matrix</h4>
                  <div className="bg-warm-50 rounded-xl p-5 border border-warm-200 grid grid-cols-2 gap-3 text-center font-mono">
                    {[
                      { label: 'True Negative', val: modelInfo.confusion_matrix[0][0], color: 'text-navy-800' },
                      { label: 'False Positive', val: modelInfo.confusion_matrix[0][1], color: 'text-danger-600' },
                      { label: 'False Negative', val: modelInfo.confusion_matrix[1][0], color: 'text-amber-600' },
                      { label: 'True Positive', val: modelInfo.confusion_matrix[1][1], color: 'text-success-600' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="p-3 border border-warm-200 bg-white rounded-lg hover:shadow-sm transition-shadow">
                        <div className="text-[9px] text-warm-400 uppercase font-bold tracking-wider">{label}</div>
                        <div className={`text-base font-bold mt-1 ${color}`}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-gold-500" />
                    Split Contribution Splits
                  </h4>
                  <p className="text-xs text-warm-500 leading-relaxed">
                    Displays split frequency metrics inside the decision trees of the LightGBM classifier.
                  </p>
                  <div className="max-h-[140px] overflow-y-auto border border-warm-200 rounded-xl text-xs bg-warm-50">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="border-b border-warm-200 text-warm-400 text-[9px] uppercase tracking-wider bg-navy-50">
                          <th className="p-2.5">Feature</th>
                          <th className="p-2.5 text-right">Splits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-200 text-warm-700">
                        {modelInfo.feature_importance && Object.entries(modelInfo.feature_importance).slice(0, 4).map(([feat, val]) => (
                          <tr key={feat} className="hover:bg-white transition-colors">
                            <td className="p-2.5 text-[11px]">{feat}</td>
                            <td className="p-2.5 text-right text-[11px] font-semibold text-navy-700">{val}</td>
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-50 text-warm-900 font-sans selection:bg-navy-500/10">
      <Navbar />
      {page === 'home' && <HomePage />}
      {page === 'evaluate' && <EvaluatePage />}
      {page === 'results' && result && <ResultsPage />}
    </div>
  );
}
