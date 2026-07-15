import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Printer } from 'lucide-react';

export default function ExplanationLetter({ letterText }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#e2ded5] rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Header controls */}
      <div className="bg-[#fcfbf9] px-6 py-4 flex items-center justify-between border-b border-[#e2ded5]">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#0b2240]" />
          <span className="text-sm font-semibold text-[#0b2240]">Underwriting Compliance Disclosures</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b2240] hover:bg-[#08172c] text-white rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF Document
          </button>
        </div>
      </div>

      {/* Letter Body */}
      <div className="p-8 md:p-12 overflow-y-auto max-h-[580px] bg-white text-slate-800 font-serif leading-relaxed text-base selection:bg-indigo-50/50 print:bg-white print:text-black">
        <article className="prose prose-indigo max-w-none 
          prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight 
          prose-h1:text-3xl prose-h1:text-[#0b2240] prose-h1:border-b prose-h1:border-[#e2ded5] prose-h1:pb-4 prose-h1:mb-6
          prose-h2:text-lg prose-h2:text-[#0b2240] prose-h2:uppercase prose-h2:tracking-wider prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-sm prose-h3:text-slate-600 prose-h3:mt-4 prose-h3:mb-2
          prose-p:my-4 prose-p:text-slate-700
          prose-ul:list-disc prose-ul:pl-5 prose-ul:my-3
          prose-li:my-1.5 prose-li:text-slate-700
          prose-strong:font-sans prose-strong:font-bold prose-strong:text-[#0b2240]
          prose-hr:border-[#e2ded5] prose-hr:my-6
          print:prose-headings:text-black print:prose-p:text-black print:prose-li:text-black print:prose-strong:text-black"
        >
          <ReactMarkdown>{letterText}</ReactMarkdown>
        </article>
      </div>
      
      {/* Footer warning */}
      <div className="bg-[#fcfbf9] px-6 py-4 border-t border-[#e2ded5] text-[10px] text-slate-500 font-sans flex items-center justify-between">
        <span>Grounded strictly in SHAP mathematical risk attribution</span>
        <span>Equal Credit Opportunity Act (ECOA) Regulation B Compliant</span>
      </div>
    </div>
  );
}
