## Setup

```bash
npm install
```

## Running

**Stub mode (no model calls, free to test as much as you want):**

```bash
LLM_STUB=1 node server.js
```

**Real mode (calls the actual model — only once `callModel()` is implemented):**

```bash
node server.js
```

## Endpoint

`POST /api/v1/classify`

**Request body:**

```json
{
  "description": "string, 5–300 characters"
}
```

**Response body (200):**

```json
{
  "category": "string",
  "subject": "string",
  "confidence": 0.0,
  "needs_review": false
}
```

- `confidence` is a number between 0 and 1.
- `needs_review` defaults to `false` if omitted by the model.

**Error response (400):** returned when input validation fails, before any
model call is made.

```json
{
  "error": "invalid_input",
  "field": "description",
  "message": "Description must at least be 5 characters long"
}
```

## Testing

With the server running in stub mode (`LLM_STUB=1 node server.js`):

```bash
# Valid request — should return 200 with JSON matching OutputSchema
curl -X POST http://localhost:3000/your-thing \
  -H "Content-Type: application/json" \
  -d '{"description": "My laptop screen keeps flickering when on battery power"}'

# Broken request — description too short, should return 400 naming the field
curl -X POST http://localhost:3000/your-thing \
  -H "Content-Type: application/json" \
  -d '{"description": "hi"}'
```
