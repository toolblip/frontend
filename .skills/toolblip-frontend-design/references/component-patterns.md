# Toolblip Component Patterns

## Tool Card
```tsx
<Link href={`/tools/${slug}`}
  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
    hover:border-green-500 dark:hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-md">
  <span className="text-2xl">{emoji}</span>
  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600
    dark:group-hover:text-green-400 truncate text-sm">
    {name}
  </h3>
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{description}</p>
</Link>
```

## Category Pill
```tsx
<button onClick={() => setActive(cat)}
  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
    active === cat
      ? 'bg-green-600 text-white'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
         hover:bg-gray-200 dark:hover:bg-gray-700'
  }`}>
  {cat}
</button>
```

## Callout Banner
```tsx
<div className="bg-gradient-to-br from-green-50 to-green-100
  dark:from-green-950/50 dark:to-gray-900
  border border-green-200 dark:border-green-800/50 rounded-2xl p-6">
  {/* content */}
</div>
```

## Form Input
```tsx
<input
  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
    text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm
    focus:outline-none focus:border-green-500 transition-colors
    placeholder-gray-400 dark:placeholder-gray-500"
/>
```

## API Endpoint Row
```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
  rounded-xl p-4 flex items-center gap-4">
  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
    text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0">
    GET
  </span>
  <code className="text-gray-700 dark:text-gray-300 text-xs font-mono shrink-0">/tools</code>
  <span className="text-gray-500 dark:text-gray-400 text-xs flex-1">{description}</span>
</div>
```
