import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function DecisionBanner({ decision, probability, riskLevel }) {
  const isApproved = decision === 'APPROVED';
  
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'MEDIUM': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'HIGH': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getGaugeColor = (prob) => {
    if (prob < 0.3) return 'stroke-emerald-600';
    if (prob < 0.7) return 'stroke-amber-600';
    return 'stroke-rose-600';
  };

  // SVG Gauge computation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  return (
    <div className={`border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
      isApproved 
        ? 'bg-[#e8f5e9]/40 border-[#a5d6a7]' 
        : 'bg-[#ffebee]/40 border-[#ef9a9a]'
    }`}>
      {/* Status Details */}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {isApproved ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          ) : (
            <XCircle className="w-12 h-12 text-rose-600" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Underwriting Assessment</span>
            <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${getRiskColor(riskLevel)}`}>
              {riskLevel} RISK
            </span>
          </div>
          <h2 className={`text-4xl font-serif font-bold tracking-tight ${isApproved ? 'text-emerald-800' : 'text-rose-800'}`}>
            Loan Decision: {decision}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mt-1">
            {isApproved 
              ? 'The applicant credit metrics comply with standard Tier-A parameters. Approval notice drafted.'
              : 'The applicant exhibits metrics exceeding acceptable subprime risk boundaries. Adverse Action notice generated.'
            }
          </p>
        </div>
      </div>

      {/* Probability Gauge */}
      <div className="flex items-center gap-6 bg-white border border-[#e2ded5] rounded-xl p-4 pr-6 flex-shrink-0 shadow-sm">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle 
              cx="56" cy="56" r={radius} 
              className="stroke-slate-100 fill-none" 
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
            <span className="text-xl font-bold font-mono text-[#0b2240]">
              {(probability * 100).toFixed(1)}%
            </span>
            <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
              Default Prob.
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="space-y-0.5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lending Threshold</div>
            <div className="text-sm font-semibold text-slate-700 font-mono">50.0%</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Auditing System</div>
            <div className="text-sm font-bold text-[#0b2240]">
              CreditLens v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
