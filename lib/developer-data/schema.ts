import { parseJson } from './core';
const types = ['null', 'boolean', 'object', 'array', 'number', 'integer', 'string'];
const supported = new Set('$schema title description default examples $comment type enum const minimum maximum exclusiveMinimum exclusiveMaximum multipleOf minLength maxLength minItems maxItems uniqueItems items minProperties maxProperties required properties additionalProperties allOf anyOf oneOf not'.split(' '));
const object = (v: any) => v !== null && typeof v === 'object' && !Array.isArray(v);
export function equal(a: any, b: any): boolean { if (a === b)
    return true; if (typeof a !== typeof b || a === null || b === null)
    return false; if (Array.isArray(a))
    return Array.isArray(b) && a.length === b.length && a.every((x, i) => equal(x, b[i])); if (object(a) && object(b)) {
    const k = Object.keys(a);
    return k.length === Object.keys(b).length && k.every(x => Object.hasOwn(b, x) && equal(a[x], b[x]));
} return false; }
export function validateSchema(json: string, schemaText: string): string[] {
    const value = parseJson(json), schema = parseJson(schemaText);
    let schemaCount = 0;
    function inspect(s: any): void {
        if (++schemaCount > 500)
            throw new Error('Schema exceeds 500 subschemas.');
        if (typeof s === 'boolean')
            return;
        if (!object(s))
            throw new Error('Schema must be an object or boolean.');
        for (const k of Object.keys(s))
            if (!supported.has(k))
                throw new Error(`Unsupported schema keyword: ${k}. This validator supports a documented subset.`);
        if (s.$schema !== undefined && s.$schema !== 'http://json-schema.org/draft-07/schema#')
            throw new Error('Only the draft-07 subset is supported.');
        if (s.type !== undefined) {
            const t = Array.isArray(s.type) ? s.type : [s.type];
            if (!t.length || t.some((x: any) => !types.includes(x)))
                throw new Error('Invalid schema type.');
        }
        if (s.enum !== undefined && (!Array.isArray(s.enum) || !s.enum.length))
            throw new Error('enum must be a nonempty array.');
        for (const k of ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf'])
            if (s[k] !== undefined && (typeof s[k] !== 'number' || (k === 'multipleOf' && s[k] <= 0)))
                throw new Error('Invalid ' + k);
        for (const k of ['minLength', 'maxLength', 'minItems', 'maxItems', 'minProperties', 'maxProperties'])
            if (s[k] !== undefined && (!Number.isInteger(s[k]) || s[k] < 0))
                throw new Error('Invalid ' + k);
        if (s.uniqueItems !== undefined && typeof s.uniqueItems !== 'boolean')
            throw new Error('uniqueItems must be boolean.');
        if (s.required !== undefined && (!Array.isArray(s.required) || s.required.some((x: any) => typeof x !== 'string')))
            throw new Error('required must be an array of strings.');
        if (s.properties !== undefined) {
            if (!object(s.properties))
                throw new Error('properties must be an object.');
            Object.values(s.properties).forEach(inspect);
        }
        for (const k of ['items', 'additionalProperties', 'not'])
            if (s[k] !== undefined)
                inspect(s[k]);
        for (const k of ['allOf', 'anyOf', 'oneOf'])
            if (s[k] !== undefined) {
                if (!Array.isArray(s[k]) || !s[k].length)
                    throw new Error(k + ' must be a nonempty array.');
                s[k].forEach(inspect);
            }
    }
    inspect(schema);
    let work = 0;
    function validate(v: any, s: any, p: string): string[] {
        if (++work > 20000)
            throw new Error('Schema validation exceeds the 20,000-check limit.');
        if (s === true)
            return [];
        if (s === false)
            return [p + ': rejected by false schema'];
        const errors: string[] = [];
        const err = (m: string) => errors.push(p + ': ' + m);
        if (s.type !== undefined) {
            const actual = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;
            const ts = Array.isArray(s.type) ? s.type : [s.type];
            if (!ts.some((t: string) => t === actual || (t === 'integer' && Number.isInteger(v))))
                err('Expected ' + ts.join(' or '));
        }
        if (s.enum && !s.enum.some((x: any) => equal(v, x)))
            err('Value is not in enum');
        if (Object.hasOwn(s, 'const') && !equal(v, s.const))
            err('Value differs from const');
        if (typeof v === 'number') {
            if (s.minimum !== undefined && v < s.minimum)
                err('Below minimum');
            if (s.maximum !== undefined && v > s.maximum)
                err('Above maximum');
            if (s.exclusiveMinimum !== undefined && v <= s.exclusiveMinimum)
                err('Below exclusive minimum');
            if (s.exclusiveMaximum !== undefined && v >= s.exclusiveMaximum)
                err('Above exclusive maximum');
            if (s.multipleOf !== undefined && Math.abs(v / s.multipleOf - Math.round(v / s.multipleOf)) > 1e-10)
                err('Not a multipleOf');
        }
        const len = typeof v === 'string' ? [...v].length : Array.isArray(v) ? v.length : object(v) ? Object.keys(v).length : undefined;
        const suffix = typeof v === 'string' ? 'Length' : Array.isArray(v) ? 'Items' : 'Properties';
        if (len !== undefined) {
            if (s['min' + suffix] !== undefined && len < s['min' + suffix])
                err('Below min' + suffix);
            if (s['max' + suffix] !== undefined && len > s['max' + suffix])
                err('Above max' + suffix);
        }
        if (Array.isArray(v)) {
            if (s.uniqueItems) {
                if (v.length > 1000)
                    throw new Error('uniqueItems is limited to 1,000 items.');
                if (v.some((x, i) => v.slice(0, i).some(y => equal(x, y))))
                    err('Array items must be unique');
            }
            if (s.items !== undefined)
                v.forEach((x, i) => errors.push(...validate(x, s.items, `${p}[${i}]`)));
        }
        if (object(v)) {
            for (const k of s.required ?? [])
                if (!Object.hasOwn(v, k))
                    err('Missing required property: ' + k);
            for (const k of Object.keys(v)) {
                if (s.properties && Object.hasOwn(s.properties, k))
                    errors.push(...validate(v[k], s.properties[k], p + '.' + k));
                else if (s.additionalProperties !== undefined)
                    errors.push(...validate(v[k], s.additionalProperties, p + '.' + k));
            }
        }
        for (const k of ['allOf', 'anyOf', 'oneOf'])
            if (s[k]) {
                const successes = s[k].filter((sub: any) => validate(v, sub, p).length === 0).length;
                if (k === 'allOf' ? successes !== s[k].length : k === 'oneOf' ? successes !== 1 : successes === 0)
                    err('Failed ' + k);
            }
        if (Object.hasOwn(s, 'not') && validate(v, s.not, p).length === 0)
            err('Failed not');
        return errors;
    }
    return validate(value, schema, '$');
}
