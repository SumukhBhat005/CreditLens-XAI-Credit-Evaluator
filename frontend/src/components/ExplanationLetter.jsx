import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Printer, Shield } from 'lucide-react';

export default function ExplanationLetter({ letterText }) {
  return (
    <div className="bg-white border border-warm-200 rounded-xl shadow-sm overflow-hidden w-full animate-fade-in">
      {/* Header bar */}
      <div className="bg-navy-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-navy-600 rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-gold-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Compliance Letter</span>
            <span className="text-[9px] text-navy-300 block font-mono uppercase tracking-wider">Generated Document</span>
          </div>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm">
          <Printer className="w-3.5 h-3.5" />Print / Save PDF
        </button>
      </div>

      {/* Letter body */}
      <div className="p-8 md:p-12 overflow-y-auto max-h-[620px] bg-white">
        <article className="compliance-letter-container text-justify">
          <ReactMarkdown>{letterText}</ReactMarkdown>
        </article>
      </div>

      {/* Footer bar */}
      <div className="bg-warm-50 px-6 py-3 border-t border-warm-200 text-[10px] text-warm-400 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-gold-500" />
          Grounded in SHAP mathematical attribution — no hallucinated factors
        </span>
        <span>RBI Fair Practices Code Compliant Format</span>
      </div>
    </div>
  );
}
