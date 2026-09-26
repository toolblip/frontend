/** Format source without transpiling away TypeScript types or rewriting literals. */
export function formatScript(ts: typeof import('typescript'), input: string, typescript: boolean, indentSize: number, useTabs: boolean) {
  if (input.length > 100000) throw new Error('Limit: 100,000 characters');
  const fileName = typescript ? 'input.ts' : 'input.js';
  const service = ts.createLanguageService({
    getCompilationSettings: () => ({ allowJs: true, target: ts.ScriptTarget.Latest, noLib: true }),
    getScriptFileNames: () => [fileName],
    getScriptVersion: () => input,
    getScriptSnapshot: name => name === fileName ? ts.ScriptSnapshot.fromString(input) : undefined,
    getCurrentDirectory: () => '',
    getDefaultLibFileName: () => '',
    fileExists: name => name === fileName,
    readFile: name => name === fileName ? input : undefined,
  });
  try {
    const diagnostic = service.getSyntacticDiagnostics(fileName)[0];
    if (diagnostic) throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    // The printer expands compact blocks; formatting edits then apply the chosen indentation.
    const source = ts.createSourceFile(fileName, input, ts.ScriptTarget.Latest, true, typescript ? ts.ScriptKind.TS : ts.ScriptKind.JS);
    const expanded = ts.transform(source, [context => root => {
      const visit = (node: import('typescript').Node): import('typescript').Node => {
        const visited = ts.visitEachChild(node, visit, context);
        return ts.isBlock(visited)
          ? ts.setTextRange(ts.setOriginalNode(ts.factory.createBlock(visited.statements, true), node), node)
          : visited;
      };
      return ts.visitNode(root, visit) as import('typescript').SourceFile;
    }]);
    try { input = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(expanded.transformed[0]); }
    finally { expanded.dispose(); }
    const edits = service.getFormattingEditsForDocument(fileName, {
      indentSize, tabSize: indentSize, convertTabsToSpaces: !useTabs,
      newLineCharacter: '\n', indentStyle: ts.IndentStyle.Smart,
      insertSpaceAfterCommaDelimiter: true,
      insertSpaceAfterSemicolonInForStatements: true,
      insertSpaceBeforeAndAfterBinaryOperators: true,
      insertSpaceAfterKeywordsInControlFlowStatements: true,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
      placeOpenBraceOnNewLineForFunctions: false,
      placeOpenBraceOnNewLineForControlBlocks: false,
    });
    let output = input;
    for (const edit of edits.sort((a, b) => b.span.start - a.span.start)) {
      output = output.slice(0, edit.span.start) + edit.newText + output.slice(edit.span.start + edit.span.length);
    }
    return output;
  } finally {
    service.dispose();
  }
}

/** Compact token trivia while retaining TypeScript declarations and ASI line breaks. */
export function compactTypeScript(ts: typeof import('typescript'), input: string, typescript = true) {
  if (input.length > 100000) throw new Error('Limit: 100,000 characters');
  const kind = typescript ? ts.ScriptKind.TS : ts.ScriptKind.JS;
  const parse = (text: string) => ts.createSourceFile(typescript ? 'input.ts' : 'input.js', text, ts.ScriptTarget.Latest, true, kind);
  const source = parse(input);
  const diagnostics = (source as typeof source & { parseDiagnostics: readonly import('typescript').Diagnostic[] }).parseDiagnostics;
  if (diagnostics.length) throw new Error(ts.flattenDiagnosticMessageText(diagnostics[0].messageText, '\n'));
  const printed = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true }).printFile(source);
  // Compact only trivia between parsed tokens. Preserve line breaks (ASI) and
  // every literal byte, including regexes and multiline templates.
  const output = parse(printed);
  const tokens: import('typescript').Node[] = [];
  const collect = (node: import('typescript').Node) => {
    const children = node.getChildren(output);
    if (children.length) children.forEach(collect);
    else if (node.kind !== ts.SyntaxKind.EndOfFileToken && node.end > node.getStart(output)) tokens.push(node);
  };
  collect(output);
  const shebang = printed.match(/^#![^\r\n]*/)?.[0] ?? '';
  let result = shebang, end = shebang.length;
  for (const token of tokens) {
    const start = token.getStart(output), gap = printed.slice(end, start);
    if (result && gap) result += gap.includes('\n') ? '\n' : ' ';
    result += printed.slice(start, token.end);
    end = token.end;
  }
  return result;
}
