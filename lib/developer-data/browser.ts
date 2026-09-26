import { marked } from 'marked';
import { bounded } from './core';
export function xmlDocument(text: string) {
    bounded(text);
    if (/<!DOCTYPE/i.test(text))
        throw new Error('DTD declarations are not supported.');
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    const error = doc.getElementsByTagNameNS('http://www.mozilla.org/newlayout/xml/parsererror.xml', 'parsererror')[0];
    if (error || doc.documentElement?.nodeName === 'parsererror')
        throw new Error(error?.textContent || 'Invalid XML');
    return doc;
}
export function formatXml(text: string, indent = 2) {
    const doc = xmlDocument(text), serializer = new XMLSerializer();
    function render(node: Node, depth: number): string {
        if (node.nodeType !== 1)
            return serializer.serializeToString(node);
        const el = node as Element;
        // Mixed content, CDATA and xml:space must retain their exact content order and spacing.
        if (el.getAttribute('xml:space') === 'preserve' || Array.from(el.childNodes).some(n => n.nodeType === 3 && !!n.textContent?.trim() || n.nodeType === 4))
            return serializer.serializeToString(el);
        const children = Array.from(el.childNodes).filter(n => n.nodeType !== 3 || !!n.textContent?.trim());
        if (!children.length)
            return serializer.serializeToString(el);
        const shell = el.cloneNode(false) as Element;
        const opening = serializer.serializeToString(shell).replace(/\s*\/>$/, '>').replace(new RegExp('</' + el.tagName + '>$'), '');
        return opening + '\n' + children.map(n => ' '.repeat((depth + 1) * indent) + render(n, depth + 1)).join('\n') + '\n' + ' '.repeat(depth * indent) + `</${el.tagName}>`;
    }
    return Array.from(doc.childNodes).map(n => render(n, 0)).join('\n');
}
const allowed = new Set('P BR HR H1 H2 H3 H4 H5 H6 UL OL LI BLOCKQUOTE PRE CODE STRONG EM DEL A IMG TABLE THEAD TBODY TR TH TD DIV SPAN SUP SUB'.split(' '));
export function safeHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    function clean(parent: Element) {
        for (const el of Array.from(parent.children)) {
            if (!allowed.has(el.tagName)) {
                el.remove();
                continue;
            }
            for (const attr of Array.from(el.attributes)) {
                const name = attr.name.toLowerCase();
                const url = (name === 'href' && el.tagName === 'A') || (name === 'src' && el.tagName === 'IMG');
                if (url) {
                    if (!/^(https?:\/\/|mailto:|#)/i.test(attr.value))
                        el.removeAttribute(attr.name);
                }
                else if (!['alt', 'title', 'colspan', 'rowspan'].includes(name))
                    el.removeAttribute(attr.name);
            }
            clean(el);
        }
    }
    clean(doc.body);
    return doc.body.innerHTML;
}
export function markdownHtml(text: string) { return safeHtml(marked.parse(bounded(text), { async: false, gfm: true }) as string); }
export function previewDocument(html: string) { return '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src https: data:"><style>body{font:16px system-ui;line-height:1.6;overflow-wrap:anywhere}pre{white-space:pre-wrap}img,table{max-width:100%}</style></head><body>' + html + '</body></html>'; }
export function htmlToJsx(text: string) {
    bounded(text);
    const doc = new DOMParser().parseFromString(text, 'text/html');
    if (doc.querySelector('script,style,iframe,object,embed'))
        throw new Error('Executable or embedded content is not supported.');
    const aliases: Record<string, string> = { autofocus: 'autoFocus', autoplay: 'autoPlay', formaction: 'formAction', formenctype: 'formEncType', formmethod: 'formMethod', formnovalidate: 'formNoValidate', formtarget: 'formTarget', inputmode: 'inputMode', spellcheck: 'spellCheck', datetime: 'dateTime', usemap: 'useMap', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', cellpadding: 'cellPadding', cellspacing: 'cellSpacing', strokeLinecap: 'strokeLinecap', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'stroke-miterlimit': 'strokeMiterlimit', class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete', novalidate: 'noValidate', srcset: 'srcSet', contenteditable: 'contentEditable', acceptcharset: 'acceptCharset', 'http-equiv': 'httpEquiv', crossorigin: 'crossOrigin', viewbox: 'viewBox', fillrule: 'fillRule', cliprule: 'clipRule' };
    const bool = new Set('disabled checked selected multiple required autofocus readonly hidden novalidate controls loop muted autoplay open'.split(' '));
    function render(n: Node): string {
        if (n.nodeType === 3)
            return `{${JSON.stringify(n.textContent)}}`;
        if (n.nodeType === 8)
            return `{/*${(n.textContent || '').replace(/\*\//g, '* /')}*/}`;
        if (n.nodeType !== 1)
            return '';
        const el = n as HTMLElement, tag = el.namespaceURI === 'http://www.w3.org/2000/svg' ? el.localName : el.tagName.toLowerCase();
        if (['script', 'style', 'iframe', 'object', 'embed'].includes(tag))
            throw new Error('Executable or embedded content is not supported.');
        const attrs = Array.from(el.attributes).map(a => {
            if (/^on/i.test(a.name))
                throw new Error('Inline event handlers cannot be converted safely. Replace them with React functions.');
            if (['href', 'src', 'action'].includes(a.name) && /^\s*javascript:/i.test(a.value))
                throw new Error('JavaScript URLs are not supported.');
            if (a.name === 'style') {
                if (Array.from(el.style).some(k => el.style.getPropertyPriority(k)))
                    throw new Error('CSS !important cannot be represented in a React style object.');
                const style: Record<string, string> = {};
                for (const k of Array.from(el.style))
                    style[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^Ms/, 'ms')] = el.style.getPropertyValue(k).trim();
                return 'style={' + JSON.stringify(style) + '}';
            }
            const name = aliases[a.name] ?? a.name.replace(/^(stroke|fill|clip)-([a-z])/g, (_, p, c) => p + c.toUpperCase());
            return bool.has(a.name) ? `${name}={true}` : `${name}={${JSON.stringify(a.value)}}`;
        }).join(' ');
        const opening = '<' + tag + (attrs ? ' ' + attrs : '');
        return /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag) ? opening + ' />' : opening + '>' + Array.from(el.childNodes).map(render).join('') + `</${tag}>`;
    }
    return '<>' + Array.from(doc.body.childNodes).map(render).join('') + '</>';
}
export function minifyXml(text: string) {
    const doc = xmlDocument(text);
    function strip(el: Element) {
        if (el.getAttribute('xml:space') === 'preserve')
            return;
        const mixed = Array.from(el.childNodes).some(n => n.nodeType === 4 || n.nodeType === 3 && !!n.textContent?.trim());
        if (!mixed && el.children.length)
            for (const n of Array.from(el.childNodes))
                if (n.nodeType === 3 && !n.textContent?.trim())
                    n.remove();
        for (const child of Array.from(el.children))
            strip(child);
    }
    strip(doc.documentElement);
    return new XMLSerializer().serializeToString(doc);
}
