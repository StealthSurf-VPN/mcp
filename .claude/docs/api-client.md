# API Client

## Overview

`src/api-client.ts` is a thin fetch wrapper for the StealthSurf API.
It handles:

- Authorization header passthrough (`Bearer stlth_*`)
- JSON request/response
- Response envelope unwrapping (`{ status, data }` → `data`)
- Error extraction (`{ status: false, errorCode, message }` → thrown Error)

## Factory

```typescript
const api = createApiClient({
  baseUrl: "https://api.stealthsurf.app",
  apiKey: "stlth_...",
})
```

## Methods

```typescript
api.get<T>(path, query?)    // GET with optional query params
api.post<T>(path, body?)    // POST with optional JSON body
api.patch<T>(path, body?)   // PATCH with optional JSON body
api.put<T>(path, body?)     // PUT with optional JSON body
api.delete<T>(path, body?)  // DELETE with optional JSON body
```

## Query Parameters

Pass as `Record<string, string | number | undefined>`.
Undefined values are skipped:

```typescript
api.get("/configs", { limit: 10, offset: undefined })
// → /configs?limit=10
```

## Error Format

StealthSurf API returns errors as:

```json
{ "status": false, "errorCode": 1, "message": "ERROR_CODE" }
```

The client throws: `Error("API Error [1]: ERROR_CODE")`

## Response Envelope

StealthSurf API wraps all responses:

```json
{ "status": true, "statusCode": 200, "data": { ... } }
```

The client returns only `data`, unwrapping the envelope automatically.
