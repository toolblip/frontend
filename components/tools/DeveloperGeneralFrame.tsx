import type { ReactNode } from 'react';
/** Group-local layout guard; does not change shared tool primitives. */
export default function DeveloperGeneralFrame({children}:{children:ReactNode}){
 return <div className="dg-tool"><style>{`
 .dg-tool {min-width:0;max-width:100%;overflow-wrap:anywhere}
 .dg-tool *, .dg-tool *::before, .dg-tool *::after {box-sizing:border-box;min-width:0}
 .dg-tool input,.dg-tool textarea,.dg-tool select,.dg-tool iframe {max-width:100%}
 .dg-tool pre {white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%;overflow-x:auto}
 .dg-tool .tb-v2-tool-input-head,.dg-tool .tb-v2-tool-output-head,.dg-tool .tb-v2-mode-tabs,.dg-tool .tb-v2-cron-row {flex-wrap:wrap;gap:8px}
 .dg-tool .tb-v2-tool-output-body {max-width:100%;overflow-x:auto}
 .dg-tool table {max-width:100%}
 .dg-tool button {white-space:normal}
 @media(max-width:480px){.dg-tool .tb-v2-grid-2,.dg-tool .tb-v2-split-view {display:grid;grid-template-columns:minmax(0,1fr)} .dg-tool .tb-v2-cron-fields {display:grid;grid-template-columns:repeat(5,minmax(0,1fr))}}
 `}</style>{children}</div>;
}
