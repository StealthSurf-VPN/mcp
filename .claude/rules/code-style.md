# Code Style

## Communication Language

**IMPORTANT**: Always respond to the user in Russian language.

All code, comments, and documentation must be in English.

## TypeScript

### Functions

All functions must be arrow functions:

```typescript
// Correct
const getData = () => fetch("/api/data")

// Incorrect
function getData() {
  return fetch("/api/data")
}
```

### Conditional Statements

Omit curly braces for single-line `if` statements:

```typescript
if (!apiKey) throw new Error("Missing key")
```

### Variable Declarations

Add vertical spacing between variable declarations:

```typescript
const url = new URL(path, baseUrl)

const response = await fetch(url.toString())

const json = await response.json()
```

### Comments

Do not write comments unless explicitly asked.
If necessary, write in English only.

## Tool Registration Pattern

Every MCP tool follows this exact pattern:

```typescript
server.tool("domain_action", "Description of what the tool does", {
  param: z.number().int().describe("Param description"),
}, async ({ param }) => {
  try {
    const data = await api.get(`/path/${param}`)
    return toolResult(data)
  } catch (e) {
    return toolError(e)
  }
})
```

Rules:

- Tool names: `{domain}_{action}` in snake_case
- Path params go in the zod schema, destructure before API call
- Body params: destructure path params with `{ pathParam, ...body }`,
  send `body` to API
- Always wrap in try/catch with `toolResult()`/`toolError()`
- No business logic in tools — pure proxy
