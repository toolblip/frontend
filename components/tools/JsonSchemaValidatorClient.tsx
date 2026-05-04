'use client';

import { useState } from 'react';

interface ValidationError {
  path: string;
  message: string;
}

export default function JsonSchemaValidatorClient() {
  const [schema, setSchema] = useState('');
  const [json, setJson] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = () => {
    setErrors([]);
    setIsValid(null);

    if (!schema.trim() || !json.trim()) {
      setErrors([{ path: '', message: 'Both schema and JSON are required' }]);
      setIsValid(false);
      return;
    }

    let parsedSchema: any;
    let parsedJson: any;

    try {
      parsedSchema = JSON.parse(schema);
    } catch (e) {
      setErrors([{ path: 'schema', message: `Invalid JSON schema: ${(e as Error).message}` }]);
      setIsValid(false);
      return;
    }

    try {
      parsedJson = JSON.parse(json);
    } catch (e) {
      setErrors([{ path: 'json', message: `Invalid JSON data: ${(e as Error).message}` }]);
      setIsValid(false);
      return;
    }

    const validationErrors: ValidationError[] = [];

    // Basic JSON Schema validation (draft-07 simplified)
    const validateValue = (value: any, schema: any, path: string) => {
      if (!schema || typeof schema !== 'object') return;

      // type validation
      if (schema.type) {
        const types = Array.isArray(schema.type) ? schema.type : [schema.type];
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        
        if (value !== null && !types.includes(actualType) && actualType !== 'object') {
          validationErrors.push({
            path: path || 'root',
            message: `Expected type ${types.join(' or ')}, got ${actualType}`
          });
        }
      }

      // enum validation
      if (schema.enum && !schema.enum.includes(value)) {
        validationErrors.push({
          path,
          message: `Value must be one of: ${schema.enum.join(', ')}`
        });
      }

      // const validation
      if (schema.const && value !== schema.const) {
        validationErrors.push({
          path,
          message: `Value must be ${JSON.stringify(schema.const)}`
        });
      }

      // number/object validations
      if (typeof value === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum) {
          validationErrors.push({
            path,
            message: `Value must be >= ${schema.minimum}`
          });
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          validationErrors.push({
            path,
            message: `Value must be <= ${schema.maximum}`
          });
        }
        if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
          validationErrors.push({
            path,
            message: `Value must be > ${schema.exclusiveMinimum}`
          });
        }
        if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
          validationErrors.push({
            path,
            message: `Value must be < ${schema.exclusiveMaximum}`
          });
        }
      }

      // string validations
      if (typeof value === 'string') {
        if (schema.minLength !== undefined && value.length < schema.minLength) {
          validationErrors.push({
            path,
            message: `String must be at least ${schema.minLength} characters`
          });
        }
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
          validationErrors.push({
            path,
            message: `String must be at most ${schema.maxLength} characters`
          });
        }
        if (schema.pattern) {
          const regex = new RegExp(schema.pattern);
          if (!regex.test(value)) {
            validationErrors.push({
              path,
              message: `String must match pattern: ${schema.pattern}`
            });
          }
        }
        if (schema.format) {
          const formatRegexes: Record<string, RegExp> = {
            'email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'uri': /^https?:\/\/.+/,
            'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
            'ipv4': /^(\d{1,3}\.){3}\d{1,3}$/,
          };
          const formatRegex = formatRegexes[schema.format];
          if (formatRegex && !formatRegex.test(value)) {
            validationErrors.push({
              path,
              message: `String must be a valid ${schema.format}`
            });
          }
        }
      }

      // array validations
      if (Array.isArray(value)) {
        if (schema.minItems !== undefined && value.length < schema.minItems) {
          validationErrors.push({
            path,
            message: `Array must have at least ${schema.minItems} items`
          });
        }
        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
          validationErrors.push({
            path,
            message: `Array must have at most ${schema.maxItems} items`
          });
        }
        if (schema.uniqueItems && new Set(value.map(JSON.stringify)).size !== value.length) {
          validationErrors.push({
            path,
            message: 'Array items must be unique'
          });
        }
        if (schema.items) {
          value.forEach((item, index) => {
            validateValue(item, schema.items, `${path}[${index}]`);
          });
        }
      }

      // object validations
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const keys = Object.keys(value);
        
        if (schema.minProperties !== undefined && keys.length < schema.minProperties) {
          validationErrors.push({
            path,
            message: `Object must have at least ${schema.minProperties} properties`
          });
        }
        if (schema.maxProperties !== undefined && keys.length > schema.maxProperties) {
          validationErrors.push({
            path,
            message: `Object must have at most ${schema.maxProperties} properties`
          });
        }
        
        // required properties
        if (schema.required) {
          schema.required.forEach((prop: string) => {
            if (!(prop in value)) {
              validationErrors.push({
                path: `${path}.${prop}`,
                message: `Missing required property: ${prop}`
              });
            }
          });
        }

        // properties schema
        if (schema.properties) {
          Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
            if (key in value) {
              validateValue((value as any)[key], propSchema, `${path}.${key}`);
            }
          });
        }

        // additionalProperties
        if (schema.additionalProperties === false) {
          const allowedKeys = Object.keys(schema.properties || {});
          const extraKeys = keys.filter(k => !allowedKeys.includes(k));
          if (extraKeys.length > 0) {
            validationErrors.push({
              path,
              message: `Additional properties not allowed: ${extraKeys.join(', ')}`
            });
          }
        }
      }
    };

    validateValue(parsedJson, parsedSchema, 'root');

    setErrors(validationErrors);
    setIsValid(validationErrors.length === 0);
  };

  const formatJson = (input: string) => {
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch {
      return input;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">JSON Schema</label>
            <button
              onClick={() => setSchema(formatJson(schema))}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Format
            </button>
          </div>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder='{"type": "object", "properties": {"name": {"type": "string"}}}'
            className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">JSON Data</label>
            <button
              onClick={() => setJson(formatJson(json))}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Format
            </button>
          </div>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder='{"name": "John"}'
            className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={validate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Validate
      </button>

      {isValid !== null && (
        <div className={`p-4 rounded-lg ${isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${isValid ? '✅' : '❌'}`}>
              {isValid ? '✓' : '✗'}
            </span>
            <span className="font-medium">
              {isValid ? 'JSON is valid against the schema!' : 'Validation Failed'}
            </span>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-red-800">Errors ({errors.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-mono text-sm text-red-600">{error.path || 'root'}</div>
                <div className="text-sm text-red-700">{error.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
