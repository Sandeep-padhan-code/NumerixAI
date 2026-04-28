"use client";

import { BlockMath, InlineMath } from "react-katex";

function renderSegment(segment: string, index: number) {
  if (segment.startsWith("\\[") && segment.endsWith("\\]")) {
    return <BlockMath key={index} math={segment.slice(2, -2)} />;
  }

  if (segment.startsWith("\\(") && segment.endsWith("\\)")) {
    return <InlineMath key={index} math={segment.slice(2, -2)} />;
  }

  if (segment.startsWith("$$") && segment.endsWith("$$")) {
    return <BlockMath key={index} math={segment.slice(2, -2)} />;
  }

  if (segment.startsWith("$") && segment.endsWith("$")) {
    return <InlineMath key={index} math={segment.slice(1, -1)} />;
  }

  return <span key={index}>{segment}</span>;
}

export function MathRenderer({ value }: { value: string }) {
  const parts = value.split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g);

  return (
    <div className="math-content whitespace-pre-wrap text-sm text-slate-200">
      {parts.map((part, index) => renderSegment(part, index))}
    </div>
  );
}
