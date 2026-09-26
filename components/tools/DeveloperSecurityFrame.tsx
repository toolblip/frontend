'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import styles from './DeveloperSecurityFrame.module.css';

export function useSecurityTask() {
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  return revision;
}
export default function DeveloperSecurityFrame({children,onExample,onClear}:{children:ReactNode;onExample:()=>void;onClear:()=>void}) {
  return <div className={styles.frame}><div className="tb-v2-tool-input-head"><ToolExampleClearActions onExample={onExample} onClear={onClear}/></div>{children}</div>;
}
