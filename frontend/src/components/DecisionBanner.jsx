import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

export default function DecisionBanner({ decision, probability, riskLevel }) {
  const isApproved = decision === 'APPROVED';
  
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HIGH': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getGaugeColor = (prob) => {
    if (prob < 0.3) return 'stroke-emerald-500';
    if (prob < 0.7) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  // SVG Gauge computation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  return (
    <div className={`border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
      isApproved 
        ? 'bg-emerald-950/20 border-emerald-500/20' 
        : 'bg-rose-950/20 border-rose-500/20'
    }`}>
      {/* Status Details */}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {isApproved ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-pulse" />
          ) : (
            <XCircle className="w-12 h-12 text-rose-500 animate-pulse" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Model Decision</span>
            <span className={`px-2 py-0.5 border text-xs font-semibold rounded-full ${getRiskColor(riskLevel)}`}>
              {riskLevel} RISK
            </span>
          </div>
          <h2 className={`text-4xl font-extrabold tracking-tight ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
            {decision}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mt-1">
            {isApproved 
              ? 'The applicant risk profile meets our underwriting guidelines. Pre-approval notice generated.'
              : 'The applicant exhibits factors exceeding acceptable credit risk thresholds. Adverse Action notice generated.'
            }
          </p>
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="flex items-center gap-6 bg-slate-950/50 border border-slate-900 rounded-xl p-4 pr-6 flex-shrink-0">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle 
              cx="56" cy="56" r={radius} 
              className="stroke-slate-800 fill-none" 
              strokeWidth="8" 
            />
            {/* Gauge progress */}
            <circle 
              cx="56" cy="56" r={radius} 
              className={`fill-none transition-all duration-1000 ease-out ${getGaugeColor(probability)}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono text-slate-100">
              {(probability * 100).toFixed(1)}%
            </span>
            <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
              Default Risk
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classification Threshold</div>
            <div className="text-sm font-semibold text-slate-300 font-mono">50.0%</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Underwriting Verdict</div>
            <div className={`text-sm font-bold ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isApproved ? 'Approved' : 'Rejected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
