'use client';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import styles from './DeveloperSecurityFrame.module.css';

export function useSecurityTask() {
  const revision = useRef(0);
  useEffect(()=>()=>{revision.current++;},[]);
  // Methods, not the raw ref, so callers never mutate a hook return value.
  return useMemo(()=>({bump:()=>++revision.current,get:()=>revision.current}),[]);
}
export default function DeveloperSecurityFrame({children,onExample,onClear}:{children:ReactNode;onExample:()=>void;onClear:()=>void}) {
  return <div className={styles.frame}><div className="tb-v2-tool-input-head"><ToolExampleClearActions onExample={onExample} onClear={onClear}/></div>{children}</div>;
}
