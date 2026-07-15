import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, Printer } from 'lucide-react';

export default function ExplanationLetter({ letterText }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Header controls */}
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-850">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-slate-200">Compliance &amp; adverse Action Disclosures</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Letter Body */}
      <div className="p-8 md:p-12 overflow-y-auto max-h-[580px] bg-slate-900/40 text-slate-300 font-serif leading-relaxed text-sm selection:bg-indigo-500/30 selection:text-white print:bg-white print:text-black">
        <article className="prose prose-invert prose-indigo max-w-none 
          prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-2xl prose-h1:text-indigo-400 prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-4 prose-h1:mb-6
          prose-h2:text-base prose-h2:text-slate-200 prose-h2:uppercase prose-h2:tracking-wider prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-sm prose-h3:text-slate-400 prose-h3:mt-4 prose-h3:mb-2
          prose-p:my-3 prose-p:text-slate-300
          prose-ul:list-disc prose-ul:pl-5 prose-ul:my-3
          prose-li:my-1.5 prose-li:text-slate-300
          prose-strong:font-sans prose-strong:font-bold prose-strong:text-slate-100
          prose-hr:border-slate-800 prose-hr:my-6
          print:prose-headings:text-black print:prose-p:text-black print:prose-li:text-black print:prose-strong:text-black"
        >
          <ReactMarkdown>{letterText}</ReactMarkdown>
        </article>
      </div>
      
      {/* Footer warning */}
      <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-850 text-[11px] text-slate-500 font-sans flex items-center justify-between">
        <span>Grounded strictly in SHAP mathematical attribution</span>
        <span>Equal Credit Opportunity Act (ECOA) Compliant</span>
      </div>
    </div>
  );
}
