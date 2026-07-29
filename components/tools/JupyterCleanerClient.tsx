'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

interface NotebookCell {
  cell_type: string;
  execution_count?: number | null;
  outputs?: any[];
  metadata?: Record<string, any>;
  source?: string | string[];
}

interface Notebook {
  cells: NotebookCell[];
  metadata?: Record<string, any>;
  nbformat?: number;
  nbformat_minor?: number;
}

export default function JupyterCleanerClient({ tool = { name: "Jupyter Cleaner", slug: "jupyter-cleaner", description: "Remove all outputs, execution counts, and metadata from Jupyter .ipynb files. Keep only source code and markdown cells for cleaner diffs and easier version control." } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.ipynb')) {
      setError('Please upload a .ipynb file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setInput(content);
        setError('');
      } catch {
        setError('Failed to read file');
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const cleanNotebook = (notebookJson: Notebook): Notebook => {
    // Remove outputs, execution counts, and metadata from each cell
    const cleanedCells = notebookJson.cells.map(cell => {
      const cleanedCell: NotebookCell = {
        cell_type: cell.cell_type,
        metadata: cell.metadata || {},
        source: cell.source,
      };

      // Reset execution count for code cells
      if (cell.cell_type === 'code') {
        cleanedCell.execution_count = null;
        cleanedCell.outputs = [];
        // Remove execution metadata
        delete cleanedCell.metadata?.collapsed;
        delete cleanedCell.metadata?.scrolled;
        delete cleanedCell.metadata?.jupyter_outputs_outputsed;
      }

      return cleanedCell;
    });

    // Clean notebook-level metadata
    const cleanedMetadata: Record<string, any> = {};
    
    // Keep only essential metadata
    if (notebookJson.metadata?.kernelspec) {
      cleanedMetadata.kernelspec = notebookJson.metadata.kernelspec;
    }
    if (notebookJson.metadata?.language_info) {
      cleanedMetadata.language_info = {
        name: notebookJson.metadata.language_info.name,
        version: notebookJson.metadata.language_info.version,
      };
    }

    return {
      cells: cleanedCells,
      metadata: cleanedMetadata,
      nbformat: notebookJson.nbformat || 4,
      nbformat_minor: notebookJson.nbformat_minor || 5,
    };
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      setError('Please enter or upload a Jupyter notebook');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const notebook: Notebook = JSON.parse(input);
      
      // Validate it's a Jupyter notebook
      if (!notebook.cells || !Array.isArray(notebook.cells)) {
        throw new Error('Invalid notebook format: missing cells array');
      }

      const cleaned = cleanNotebook(notebook);
      const cleanedJson = JSON.stringify(cleaned, null, 2);
      setOutput(cleanedJson);
    } catch (e) {
      setError(`Failed to parse notebook: ${e instanceof Error ? e.message : 'Invalid JSON'}`);
      setOutput('');
    }

    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCleaned = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_notebook.ipynb';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
        </div>
      
      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Upload Jupyter Notebook (.ipynb)</label>
          <input
            type="file"
            accept=".ipynb"
            onChange={handleFileUpload}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
          />
        </div>

        <div className="relative">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Or paste notebook JSON</label>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 font-mono text-sm"
            placeholder='{"cells": [], "metadata": {}, "nbformat": 4, "nbformat_minor": 5}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Processing...' : 'Clean Notebook'}
        </button>
        
        {error && (
          <div className="tb-v2-banner tb-v2-banner-err">
            {error}
          </div>
        )}
        
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Cleaned Notebook</label>
              <div className="tb-v2-mode-tabs">
                <button 
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={downloadCleaned}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download .ipynb
                </button>
              </div>
            </div>
            <pre className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 font-mono text-sm overflow-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
