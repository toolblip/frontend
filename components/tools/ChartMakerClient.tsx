'use client';

import { useState, useRef, useEffect } from 'react';

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export default function ChartMakerClient() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('My Chart');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { label: 'January', value: 100 },
    { label: 'February', value: 80 },
    { label: 'March', value: 120 },
    { label: 'April', value: 90 },
    { label: 'May', value: 110 }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawChart();
  }, [chartType, dataPoints, title, showGrid]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 30);

    if (chartType === 'bar') {
      drawBarChart(ctx, width, height, padding);
    } else if (chartType === 'line') {
      drawLineChart(ctx, width, height, padding);
    } else if (chartType === 'pie' || chartType === 'doughnut') {
      drawPieChart(ctx, width, height, padding, chartType === 'doughnut');
    }
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number) => {
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / dataPoints.length * 0.7;
    const gap = chartWidth / dataPoints.length * 0.3;

    const maxValue = Math.max(...dataPoints.map(d => d.value));
    const scale = chartHeight / maxValue;

    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        ctx.fillStyle = '#6b7280';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxValue * (1 - i / 5)).toString(), padding - 10, y + 4);
      }
    }

    // Draw bars
    dataPoints.forEach((point, i) => {
      const x = padding + i * (barWidth + gap) + gap / 2;
      const barHeight = point.value * scale;
      const y = padding + chartHeight - barHeight;

      ctx.fillStyle = point.color || COLORS[i % COLORS.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x + barWidth / 2, height - padding + 20);

      // Draw value
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 8);
    });
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number) => {
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...dataPoints.map(d => d.value));
    const scale = chartHeight / maxValue;

    const pointSpacing = chartWidth / (dataPoints.length - 1 || 1);

    // Draw grid lines
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        ctx.fillStyle = '#6b7280';
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxValue * (1 - i / 5)).toString(), padding - 10, y + 4);
      }
    }

    // Draw line
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth = 3;
    ctx.beginPath();

    dataPoints.forEach((point, i) => {
      const x = padding + i * pointSpacing;
      const y = padding + chartHeight - point.value * scale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    dataPoints.forEach((point, i) => {
      const x = padding + i * pointSpacing;
      const y = padding + chartHeight - point.value * scale;

      ctx.fillStyle = COLORS[0];
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x, height - padding + 20);

      // Draw value
      ctx.fillText(point.value.toString(), x, y - 15);
    });
  };

  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: number, doughnut: boolean) => {
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 2 - padding - 20;
    const innerRadius = doughnut ? radius * 0.5 : 0;

    const total = dataPoints.reduce((sum, d) => sum + d.value, 0);
    let startAngle = -Math.PI / 2;

    dataPoints.forEach((point, i) => {
      const sliceAngle = (point.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.fillStyle = point.color || COLORS[i % COLORS.length];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      if (doughnut) {
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      }
      ctx.closePath();
      ctx.fill();

      // Draw label outside
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius + 30;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      ctx.fillStyle = '#374151';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = labelX > centerX ? 'left' : 'right';
      ctx.fillText(`${point.label} (${point.value})`, labelX, labelY);

      startAngle = endAngle;
    });

    // Draw center text for doughnut
    if (doughnut) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(total.toString(), centerX, centerY + 8);
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Total', centerX, centerY + 28);
    }
  };

  const addDataPoint = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    
    setDataPoints([...dataPoints, { 
      label: newLabel.trim(), 
      value: parseFloat(newValue) || 0 
    }]);
    setNewLabel('');
    setNewValue('');
  };

  const removeDataPoint = (index: number) => {
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };

  const downloadChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Chart Maker</span>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label className="tb-v2-hint">Chart Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chart title"
          className="tb-v2-tool-input"
          aria-label="Chart title"
        />
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginBottom: '0.5rem' }}>
        <span className="tb-v2-tool-label">Chart Type</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {(['bar', 'line', 'pie', 'doughnut'] as ChartType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setChartType(type)}
            className={`tb-v2-btn ${chartType === type ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-options" style={{ marginBottom: '0.75rem' }}>
        <label className="tb-v2-checkbox-label">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          Show grid lines
        </label>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginBottom: '0.5rem' }}>
        <span className="tb-v2-tool-label">Data Points</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Label"
          className="tb-v2-tool-input"
          aria-label="Data label"
        />
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          className="tb-v2-tool-input"
          aria-label="Data value"
        />
        <button
          type="button"
          onClick={addDataPoint}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Add
        </button>
      </div>

      <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '0.75rem' }}>
        {dataPoints.map((point, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.25rem 0',
              borderBottom: '1px solid var(--tb-border-color, #e5e7eb)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: point.color || COLORS[i % COLORS.length]
                }}
              />
              <span>{point.label}: {point.value}</span>
            </div>
            <button
              type="button"
              onClick={() => removeDataPoint(i)}
              className="tb-v2-btn tb-v2-btn-secondary"
              style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ margin: '0.75rem 0' }}>
        <button
          type="button"
          onClick={downloadChart}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Download Chart
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--tb-border-color, #e5e7eb)', borderRadius: '0.5rem' }}
        />
      </div>
    </div>
  );
}
