'use client';

import { useState, useMemo } from 'react';

interface ListItem {
  value: string;
  index: number;
}

export default function ListComparatorClient() {
  const [list1, setList1] = useState('');
  const [list2, setList2] = useState('');

  const comparison = useMemo(() => {
    const items1 = list1.split(/[\n,]/).map(item => item.trim()).filter(item => item.length > 0);
    const items2 = list2.split(/[\n,]/).map(item => item.trim()).filter(item => item.length > 0);

    const set1 = new Set(items1.map(i => i.toLowerCase()));
    const set2 = new Set(items2.map(i => i.toLowerCase()));

    const onlyInList1 = items1.filter(item => !set2.has(item.toLowerCase()));
    const onlyInList2 = items2.filter(item => !set1.has(item.toLowerCase()));
    const inBoth = items1.filter(item => set2.has(item.toLowerCase()));

    const list1Unique = [...new Set(onlyInList1)];
    const list2Unique = [...new Set(onlyInList2)];
    const common = [...new Set(inBoth)];

    return {
      list1Count: items1.length,
      list2Count: items2.length,
      onlyInList1: list1Unique,
      onlyInList2: list2Unique,
      inBoth: common,
      similarity: items1.length > 0 && items2.length > 0 
        ? Math.round((common.length / Math.max(items1.length, items2.length)) * 100) 
        : 0,
    };
  }, [list1, list2]);

  const handleCopyOnly1 = () => {
    navigator.clipboard.writeText(comparison.onlyInList1.join('\n'));
  };

  const handleCopyOnly2 = () => {
    navigator.clipboard.writeText(comparison.onlyInList2.join('\n'));
  };

  const handleCopyCommon = () => {
    navigator.clipboard.writeText(comparison.inBoth.join('\n'));
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6">List Comparator</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>List 1</label>
          <textarea
            value={list1}
            onChange={(e) => setList1(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter first list (one item per line or comma separated)..."
          />
          <p className="text-xs text-gray-500 mt-1">{comparison.list1Count} items</p>
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>List 2</label>
          <textarea
            value={list2}
            onChange={(e) => setList2(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter second list (one item per line or comma separated)..."
          />
          <p className="text-xs text-gray-500 mt-1">{comparison.list2Count} items</p>
        </div>
      </div>

      {list1 && list2 && (
        <>
          <div className="tb-v2-banner tb-v2-banner-info">
            <div className="flex items-center justify-between">
              <span className="text-sm">Similarity Score</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {comparison.similarity}%
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${comparison.similarity}%` }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-red-600 dark:text-red-400">
                  Only in List 1 ({comparison.onlyInList1.length})
                </label>
                {comparison.onlyInList1.length > 0 && (
                  <button
                    onClick={handleCopyOnly1}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 h-48 overflow-y-auto">
                {comparison.onlyInList1.length === 0 ? (
                  <p className="text-sm text-gray-500">None</p>
                ) : (
                  <ul className="space-y-1">
                    {comparison.onlyInList1.map((item, i) => (
                      <li key={i} className="text-sm font-mono">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-green-600 dark:text-green-400">
                  In Both Lists ({comparison.inBoth.length})
                </label>
                {comparison.inBoth.length > 0 && (
                  <button
                    onClick={handleCopyCommon}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 h-48 overflow-y-auto">
                {comparison.inBoth.length === 0 ? (
                  <p className="text-sm text-gray-500">None</p>
                ) : (
                  <ul className="space-y-1">
                    {comparison.inBoth.map((item, i) => (
                      <li key={i} className="text-sm font-mono">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Only in List 2 ({comparison.onlyInList2.length})
                </label>
                {comparison.onlyInList2.length > 0 && (
                  <button
                    onClick={handleCopyOnly2}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 h-48 overflow-y-auto">
                {comparison.onlyInList2.length === 0 ? (
                  <p className="text-sm text-gray-500">None</p>
                ) : (
                  <ul className="space-y-1">
                    {comparison.onlyInList2.map((item, i) => (
                      <li key={i} className="text-sm font-mono">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {list1 && !list2 && (
        <div className="tb-v2-banner tb-v2-banner-warn">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Enter a second list to compare
          </p>
        </div>
      )}

      {!list1 && list2 && (
        <div className="tb-v2-banner tb-v2-banner-warn">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Enter a first list to compare
          </p>
        </div>
      )}

      {!list1 && !list2 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p>Enter two lists to compare them</p>
        </div>
      )}

      <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
        <h3 className="font-medium mb-2">Use Cases:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Find differences between two datasets</li>
          <li>• Identify common items in two lists</li>
          <li>• Track unique items in each list</li>
          <li>• Compare inventory, subscribers, or any two sets</li>
        </ul>
      </div>
    </div>
  );
}
