'use client';

import { useState, useEffect } from 'react';

type Algorithm = 'bubble' | 'selection' | 'insertion';

const ALGO_INFO: Record<Algorithm, { name: string; desc: string; complexity: string }> = {
  bubble: {
    name: 'Bubble Sort',
    desc: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    complexity: 'Time: O(n²) | Space: O(1)',
  },
  selection: {
    name: 'Selection Sort',
    desc: 'Divides the list into a sorted and unsorted region, repeatedly finds the smallest element in the unsorted region, and moves it to the end of the sorted region.',
    complexity: 'Time: O(n²) | Space: O(1)',
  },
  insertion: {
    name: 'Insertion Sort',
    desc: 'Builds the sorted list one item at a time, taking each element and inserting it into its correct position among the already sorted elements.',
    complexity: 'Time: O(n²) | Space: O(1)',
  },
};

export default function AlgorithmVisualizerClient() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('bubble');
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateBubbleSortSteps = (arr: number[]): number[][] => {
    const steps: number[][] = [[...arr]];
    const a = [...arr];
    const n = a.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push([...a]);
        }
      }
    }
    steps.push([...a]);
    return steps;
  };

  const generateSelectionSortSteps = (arr: number[]): number[][] => {
    const steps: number[][] = [[...arr]];
    const a = [...arr];
    const n = a.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        steps.push([...a]);
      }
    }
    steps.push([...a]);
    return steps;
  };

  const generateInsertionSortSteps = (arr: number[]): number[][] => {
    const steps: number[][] = [[...arr]];
    const a = [...arr];
    const n = a.length;

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
        steps.push([...a]);
      }
      a[j + 1] = key;
      steps.push([...a]);
    }
    return steps;
  };

  const startSort = () => {
    const generator =
      algorithm === 'bubble' ? generateBubbleSortSteps :
      algorithm === 'selection' ? generateSelectionSortSteps :
      generateInsertionSortSteps;
    const sortSteps = generator(array);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const displayArray = steps.length > 0 ? steps[currentStep] : array;
  const maxValue = Math.max(...displayArray);

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-mode-tabs">
        {(Object.keys(ALGO_INFO) as Algorithm[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => { setAlgorithm(key); reset(); }}
            disabled={isPlaying}
            className={`tb-v2-mode-tab ${algorithm === key ? 'on' : ''}`}
          >
            {ALGO_INFO[key].name}
          </button>
        ))}
      </div>

      <div>
        <label className="tb-v2-tool-label">Array Values (comma-separated)</label>
        <input
          type="text"
          value={array.join(', ')}
          onChange={(e) => setArray(e.target.value.split(',').map(n => parseInt(n.trim()) || 0))}
          disabled={isPlaying}
          className="tb-v2-input"
          placeholder="64, 34, 25, 12, 22, 11, 90"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={startSort} disabled={isPlaying} className="tb-v2-btn tb-v2-btn-primary">
          Start {ALGO_INFO[algorithm].name}
        </button>
        <button type="button" onClick={reset} className="tb-v2-btn-sm">
          Reset
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-600 dark:text-gray-400">Speed:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="tb-v2-input w-auto"
          >
            <option value="1000">Slow</option>
            <option value="500">Normal</option>
            <option value="200">Fast</option>
            <option value="50">Very Fast</option>
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-body">
        <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Step {currentStep + 1} of {steps.length || 1}
          {steps.length > 0 && currentStep === steps.length - 1 && (
            <span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ Sorted!</span>
          )}
        </div>

        <div className="flex items-end justify-center gap-1 h-48">
          {displayArray.map((value, index) => {
            const height = (value / maxValue) * 100;
            const isDone = steps.length > 0 && currentStep === steps.length - 1;
            const isSwapping = !isDone && steps.length > 0 && currentStep < steps.length - 1 &&
              steps[currentStep + 1]?.[index] !== value;

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 rounded-t transition-all duration-200 ${
                    isDone
                      ? 'bg-green-500'
                      : isSwapping
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ height: `${height}%`, minHeight: '20px' }}
                />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Swapping</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Sorted</span>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-body">
        <span className="tb-v2-tool-label">{ALGO_INFO[algorithm].name}</span>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {ALGO_INFO[algorithm].desc}
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 font-mono">
          <p>{ALGO_INFO[algorithm].complexity}</p>
        </div>
      </div>
    </div>
  );
}
