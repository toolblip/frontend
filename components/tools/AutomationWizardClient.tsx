'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState } from 'react';
import { dump } from 'js-yaml';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  config: Record<string, string>;
}

const TRIGGER_TEMPLATES = [
  { id: 'webhook', name: 'Webhook', icon: '🪝', description: 'Receive data via HTTP request' },
  { id: 'schedule', name: 'Schedule', icon: '⏰', description: 'Run on a time interval' },
  { id: 'email', name: 'Email', icon: '📧', description: 'Trigger on new email' },
  { id: 'form', name: 'Form Submit', icon: '📝', description: 'Trigger on form submission' },
];

const ACTION_TEMPLATES = [
  { id: 'http', name: 'HTTP Request', icon: '🌐', description: 'Send HTTP request to URL' },
  { id: 'email', name: 'Send Email', icon: '📧', description: 'Send email notification' },
  { id: 'slack', name: 'Slack Message', icon: '💬', description: 'Post message to Slack' },
  { id: 'webhook', name: 'Webhook', icon: '🪝', description: 'Send data to webhook URL' },
  { id: 'transform', name: 'Transform Data', icon: '🔄', description: 'Transform data format' },
  { id: 'filter', name: 'Filter', icon: '🔍', description: 'Filter data based on conditions' },
];

const CONDITION_TEMPLATES = [
  { id: 'if', name: 'If/Else', icon: '❓', description: 'Branch based on condition' },
  { id: 'switch', name: 'Switch', icon: '🔀', description: 'Multiple condition branches' },
  { id: 'filter', name: 'Filter', icon: '🔍', description: 'Filter data items' },
];

export default function AutomationWizardClient() {
  const [stepName, setStepName] = useState('');
  const [selectedType, setSelectedType] = useState<'trigger' | 'action' | 'condition'>('trigger');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [config, setConfig] = useState<Record<string, string>>({});

  const currentTemplates = selectedType === 'trigger' ? TRIGGER_TEMPLATES
    : selectedType === 'action' ? ACTION_TEMPLATES
    : CONDITION_TEMPLATES;

  const handleAddStep = () => {
    if (!stepName.trim() || !selectedTemplate || workflowSteps.length >= 100) return;
    if (selectedType === 'trigger' && workflowSteps.some(s => s.type === 'trigger')) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: stepName,
      type: selectedType,
      config: { method: 'GET', interval: 'daily', time: '09:00', provider: 'gmail', condition: 'equals', inputFormat: 'json', outputFormat: 'json', ...config, template: selectedTemplate },
    };

    setWorkflowSteps([...workflowSteps, newStep]);
    setStepName('');
    setSelectedTemplate('');
    setConfig({});
    setShowTemplates(true);
  };

  const handleRemoveStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter(s => s.id !== id));
  };

  const handleMoveStep = (id: string, direction: 'up' | 'down') => {
    const index = workflowSteps.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === workflowSteps.length - 1) return;

    const newSteps = [...workflowSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setWorkflowSteps(newSteps);
  };

  const generateWorkflowYaml = () => dump(JSON.parse(generateWorkflowJson()));

  const generateWorkflowJson = () => {
    return JSON.stringify({
      name: 'My Automation',
      trigger: workflowSteps.find(s => s.type === 'trigger') || null,
      steps: workflowSteps.filter(s => s.type !== 'trigger'),
    }, null, 2);
  };

  return (<UtilityDesignLayout>
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-6 tb-v2-p-4">
      <ToolExampleClearActions onExample={() => { setWorkflowSteps([{id:'example-trigger',name:'Daily report',type:'trigger',config:{template:'schedule',interval:'daily',time:'09:00'}}]); }} onClear={() => { setWorkflowSteps([]); setStepName(''); setSelectedTemplate(''); setConfig({}); setShowTemplates(true); }}/>
      <div>
        <h2 className="tb-v2-text-2xl tb-v2-font-bold">Automation Wizard</h2>
        <p className="tb-v2-text-sm tb-v2-text-gray-500">Draft a workflow specification. This tool does not run actions or connect accounts.</p>
      </div>

      {/* Step Type Selection */}
      <div className="tb-v2-card">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Step Type</h3>
        <div className="tb-v2-flex tb-v2-gap-2">
          {(['trigger', 'action', 'condition'] as const).map(type => (
            <button
              key={type}
              onClick={() => { setSelectedType(type); setShowTemplates(true); }}
              className={`tb-v2-btn ${selectedType === type ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              {type === 'trigger' && '🪝 '}
              {type === 'action' && '⚡ '}
              {type === 'condition' && '❓ '}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      {showTemplates && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">
            Select {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Template
          </h3>
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-3">
            {currentTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => { setSelectedTemplate(template.id); setShowTemplates(false); }}
                className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-left tb-v2-p-3"
              >
                <span className="tb-v2-text-xl">{template.icon}</span>
                <span className="tb-v2-font-medium">{template.name}</span>
                <p className="tb-v2-text-xs tb-v2-text-gray-500">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step Configuration */}
      {!showTemplates && selectedTemplate && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Configure Step</h3>

          <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-3">
            <div>
              <label className="tb-v2-label">Step Name</label>
              <input maxLength={100000} aria-label="Step Name"
                type="text"
                value={stepName}
                onChange={(e) => setStepName(e.target.value)}
                placeholder="e.g., Get Form Data"
                className="tb-v2-input"
              />
            </div>

            {selectedTemplate === 'http' && (
              <>
                <div>
                  <label className="tb-v2-label">URL</label>
                  <input maxLength={100000} aria-label="Config url"
                    type="text"
                    value={config.url || ''}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    placeholder="https://api.example.com/endpoint"
                    className="tb-v2-input"
                  />
                </div>
                <div>
                  <label className="tb-v2-label">Method</label>
                  <select aria-label="Config method     GET"
                    value={config.method || 'GET'}
                    onChange={(e) => setConfig({ ...config, method: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </>
            )}

            {selectedTemplate === 'schedule' && (
              <>
                <div>
                  <label className="tb-v2-label">Interval</label>
                  <select aria-label="Config interval     daily"
                    value={config.interval || 'daily'}
                    onChange={(e) => setConfig({ ...config, interval: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="tb-v2-label">Time</label>
                  <input aria-label="Config time     09 00"
                    type="time"
                    value={config.time || '09:00'}
                    onChange={(e) => setConfig({ ...config, time: e.target.value })}
                    className="tb-v2-input"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'webhook' && (
              <div>
                <label className="tb-v2-label">Webhook URL</label>
                <input maxLength={100000} aria-label="Config webhook Url"
                  type="text"
                  value={config.webhookUrl || ''}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://hook.example.com/..."
                  className="tb-v2-input"
                />
              </div>
            )}

            {selectedTemplate === 'email' && selectedType === 'trigger' && (
              <>
                <div>
                  <label className="tb-v2-label">Email Provider</label>
                  <select aria-label="Config provider     gmail"
                    value={config.provider || 'gmail'}
                    onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Outlook</option>
                    <option value="custom">Custom IMAP</option>
                  </select>
                </div>
              </>
            )}

            {selectedTemplate === 'email' && selectedType === 'action' && (
              <>
                <div>
                  <label className="tb-v2-label">To</label>
                  <input aria-label="Config to"
                    type="email"
                    value={config.to || ''}
                    onChange={(e) => setConfig({ ...config, to: e.target.value })}
                    placeholder="recipient@example.com"
                    className="tb-v2-input"
                  />
                </div>
                <div>
                  <label className="tb-v2-label">Subject</label>
                  <input maxLength={100000} aria-label="Config subject"
                    type="text"
                    value={config.subject || ''}
                    onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                    placeholder="Email subject"
                    className="tb-v2-input"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'slack' && (
              <>
                <div>
                  <label className="tb-v2-label">Slack Webhook URL</label>
                  <input maxLength={100000} aria-label="Config slack Url"
                    type="text"
                    value={config.slackUrl || ''}
                    onChange={(e) => setConfig({ ...config, slackUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/..."
                    className="tb-v2-input"
                  />
                </div>
                <div>
                  <label className="tb-v2-label">Channel</label>
                  <input maxLength={100000} aria-label="Config channel"
                    type="text"
                    value={config.channel || ''}
                    onChange={(e) => setConfig({ ...config, channel: e.target.value })}
                    placeholder="#general"
                    className="tb-v2-input"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'if' && (
              <>
                <div>
                  <label className="tb-v2-label">Field</label>
                  <input maxLength={100000} aria-label="Config field"
                    type="text"
                    value={config.field || ''}
                    onChange={(e) => setConfig({ ...config, field: e.target.value })}
                    placeholder="e.g., data.status"
                    className="tb-v2-input"
                  />
                </div>
                <div>
                  <label className="tb-v2-label">Condition</label>
                  <select aria-label="Config condition     equals"
                    value={config.condition || 'equals'}
                    onChange={(e) => setConfig({ ...config, condition: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                    <option value="exists">Exists</option>
                    <option value="not_exists">Not Exists</option>
                  </select>
                </div>
                <div>
                  <label className="tb-v2-label">Value</label>
                  <input maxLength={100000} aria-label="Config value"
                    type="text"
                    value={config.value || ''}
                    onChange={(e) => setConfig({ ...config, value: e.target.value })}
                    placeholder="Value to compare"
                    className="tb-v2-input"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'transform' && (
              <>
                <div>
                  <label className="tb-v2-label">Input Format</label>
                  <select aria-label="Config input Format     json"
                    value={config.inputFormat || 'json'}
                    onChange={(e) => setConfig({ ...config, inputFormat: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="csv">CSV</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
                <div>
                  <label className="tb-v2-label">Output Format</label>
                  <select aria-label="Config output Format     json"
                    value={config.outputFormat || 'json'}
                    onChange={(e) => setConfig({ ...config, outputFormat: e.target.value })}
                    className="tb-v2-input"
                  >
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="csv">CSV</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
              </>
            )}

            <div className="tb-v2-flex tb-v2-gap-2 tb-v2-mt-2">
              <button onClick={handleAddStep} className="tb-v2-btn tb-v2-btn-primary">
                Add Step
              </button>
              <button onClick={() => setShowTemplates(true)} className="tb-v2-btn tb-v2-btn-secondary">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Preview */}
      {workflowSteps.length > 0 && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Workflow Steps</h3>
          <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className="tb-v2-flex tb-v2-items-center tb-v2-gap-3 tb-v2-p-3 tb-v2-bg-gray-50 tb-v2-rounded-lg"
              >
                <span className="tb-v2-text-2xl">
                  {step.type === 'trigger' && '🪝'}
                  {step.type === 'action' && '⚡'}
                  {step.type === 'condition' && '❓'}
                </span>
                <div className="tb-v2-flex-1">
                  <p className="tb-v2-font-medium">{step.name}</p>
                  <p className="tb-v2-text-xs tb-v2-text-gray-500">
                    {step.type} • {step.config.template}
                  </p>
                </div>
                <div className="tb-v2-flex tb-v2-gap-1">
                  <button
                    onClick={() => handleMoveStep(step.id, 'up')}
                    disabled={index === 0}
                    className="tb-v2-btn tb-v2-btn-secondary tb-v2-px-2 tb-v2-py-1"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveStep(step.id, 'down')}
                    disabled={index === workflowSteps.length - 1}
                    className="tb-v2-btn tb-v2-btn-secondary tb-v2-px-2 tb-v2-py-1"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleRemoveStep(step.id)}
                    className="tb-v2-btn tb-v2-btn-secondary tb-v2-px-2 tb-v2-py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export */}
      {workflowSteps.length > 0 && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Export Workflow</h3>
          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(generateWorkflowYaml())}
              className="tb-v2-btn tb-v2-btn-primary"
            >
              Copy YAML
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(generateWorkflowJson())}
              className="tb-v2-btn tb-v2-btn-secondary"
            >
              Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
