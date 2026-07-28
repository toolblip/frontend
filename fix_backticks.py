# Read the file
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Fix the markdown-preview code example - escape backticks
old = '```js\\nconsole.log("Hello!");\\n``` '
new = '\\`\\`\\`js\\nconsole.log("Hello!");\\n\\`\\`\\`'
content = content.replace(old, new)

# Write back
with open('data/tool-content.ts', 'w') as f:
    f.write(content)

print('Fixed markdown-preview backticks')
