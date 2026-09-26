'use client';
import { useEffect, useRef, useState } from 'react';
export function useDataClipboard(text: string) {
    const [copied, setCopied] = useState(false), [copyError, setError] = useState('');
    const version = useRef(0);
    function reset(_unused?: boolean) { version.current++; setCopied(false); setError(''); }
    useEffect(() => { reset(); return () => { version.current++; }; }, [text]);
    async function copy() { if (!text)
        return; const v = version.current; try {
        await navigator.clipboard.writeText(text);
        if (v === version.current) {
            setCopied(true);
            setError('');
        }
    }
    catch {
        if (v === version.current) {
            setCopied(false);
            setError('Copy failed. Select the result and copy it manually.');
        }
    } }
    return { copied, copyError, copy, reset };
}
