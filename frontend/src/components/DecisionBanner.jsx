import React from 'react';
import { CheckCircle2, XCircle, Shield } from 'lucide-react';

export default function DecisionBanner({ decision, probability, riskLevel }) {
  const isApproved = decision === 'APPROVED';

  const getRiskBadge = (level) => {
    switch (level) {
      case 'LOW': return 'text-success-700 bg-success-50 border-green-200';
      case 'MEDIUM': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'HIGH': return 'text-danger-700 bg-danger-50 border-red-200';
      default: return 'text-warm-700 bg-warm-50 border-warm-200';
    }
  };

  const getGaugeColor = (prob) => {
    if (prob < 0.3) return '#059669';  // success-600
    if (prob < 0.7) return '#D97706';  // amber-600
    return '#DC2626';                   // danger-600
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm animate-fade-in-up ${
      isApproved ? 'border-green-200' : 'border-red-200'
    }`}>
      {/* Colored accent bar at top */}
      <div className={`h-1.5 ${isApproved ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'}`} />

      <div className={`p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${
        isApproved ? 'bg-gradient-to-br from-success-50/60 to-white' : 'bg-gradient-to-br from-danger-50/60 to-white'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isApproved ? 'bg-success-50 border border-green-200' : 'bg-danger-50 border border-red-200'
          }`}>
            {isApproved
              ? <CheckCircle2 className="w-6 h-6 text-success-600" />
              : <XCircle className="w-6 h-6 text-danger-600" />
            }
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-widest uppercase text-warm-450 font-mono">Evaluation Verdict</span>
              <span className={`px-3 py-0.5 border text-xs font-bold rounded-full uppercase tracking-wider font-mono ${getRiskBadge(riskLevel)}`}>
                {riskLevel} RISK
              </span>
            </div>
            <h2 className={`text-3xl font-serif tracking-tight ${isApproved ? 'text-success-700' : 'text-danger-700'}`}>
              {decision}
            </h2>
            <p className="text-sm text-warm-550 max-w-lg leading-relaxed">
              {isApproved
                ? 'The applicant score complies with Tier-A parameters. Pre-approval ledger generated.'
                : 'The applicant profile exceeds risk limits. Adverse action disclosure notice generated.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white border border-warm-200 rounded-xl p-5 flex-shrink-0 shadow-sm">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={radius} className="fill-none stroke-warm-100" strokeWidth="7" />
              <circle
                cx="48" cy="48" r={radius}
                className="fill-none transition-all duration-1000 ease-out"
                stroke={getGaugeColor(probability)}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 48 48)"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-bold font-mono text-navy-800">{(probability * 100).toFixed(1)}%</span>
              <span className="text-[8px] font-bold text-warm-400 tracking-wider uppercase font-mono">Default</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[8px] font-bold text-warm-400 uppercase tracking-wider font-mono">Threshold</div>
              <div className="text-xs font-bold text-navy-700 font-mono">50.0%</div>
            </div>
            <div>
              <div className="text-[8px] font-bold text-warm-400 uppercase tracking-wider font-mono">Model Engine</div>
              <div className="text-xs font-bold text-navy-700 flex items-center gap-1">
                <Shield className="w-3 h-3 text-gold-500" />
                LightGBM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
