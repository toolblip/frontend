'use client';
import type { ReactNode } from 'react';
/** Group-local responsive rules; shared primitives and other groups are untouched. */
export default function UtilityDesignLayout({ children, inset = false }: { children: ReactNode; inset?: boolean }) {
  return <div className="utility-design-layout" style={inset ? { padding: 16 } : undefined}>{children}<style>{`
    .utility-design-layout { min-width:0; max-width:100%; overflow-wrap:anywhere; }
    .utility-design-layout * { box-sizing:border-box; min-width:0; }
    .utility-design-layout input:not([type=checkbox]):not([type=radio]), .utility-design-layout select, .utility-design-layout textarea { max-width:100%; }
    .utility-design-layout div { max-width:100%; }
    .utility-design-layout .tb-v2-flex { display:flex; flex-wrap:wrap; gap:12px; }
    .utility-design-layout .tb-v2-flex-col { flex-direction:column; }
    .utility-design-layout .tb-v2-grid { display:grid; gap:12px; }
    .utility-design-layout pre { white-space:pre-wrap; overflow-wrap:anywhere; }
    .utility-design-layout canvas, .utility-design-layout img { max-width:100%; height:auto; }
    .utility-design-layout .tb-v2-tool-input-head, .utility-design-layout .tb-v2-mode-tabs, .utility-design-layout .tb-v2-toolbar { flex-wrap:wrap; gap:8px; }
    .utility-design-layout table { width:100%; table-layout:fixed; }
    @media(max-width:480px) {
      .utility-design-layout [style*="grid-template-columns"] { grid-template-columns:minmax(0,1fr) !important; }
      .utility-design-layout .grid-cols-3, .utility-design-layout .grid-cols-2 { grid-template-columns:minmax(0,1fr); }
      .utility-design-layout .tb-v2-grid-2 { grid-template-columns:minmax(0,1fr); }
    }
  `}</style></div>;
}
