# API Reference

Base URL: `/api`. All responses are JSON in camelCase.

## Post

```ts
type Post = {
  id: number;
  name: string;        // product being promoted, 1-50 chars
  description: string; // post copy, 1-250 chars
  createdAt: string;   // ISO 8601
};
```

## Endpoints

| Method | Path         | Success              | Errors                       |
| ------ | ------------ | -------------------- | ---------------------------- |
| GET    | /health      | 200 `{ status: "ok" }` | 500                        |
| GET    | /posts       | 200 `Post[]`, newest first | 500                    |
| POST   | /posts       | 201 created `Post`   | 400 validation, 409 duplicate |
| DELETE | /posts/:id   | 200 deleted `Post`   | 400 invalid id, 404 not found |

### Create a post

```http
POST /api/posts
Content-Type: application/json

{ "name": "Full-Body Harness", "description": "Trust your gear." }
```

A post is a duplicate when the same product and copy already exist (case-insensitive).
The same copy for a different product is allowed.

## Errors

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": [{ "field": "name", "message": "Product is required" }]
  }
}
```

Codes: `VALIDATION_ERROR` (400), `DUPLICATE_POST` (409), `NOT_FOUND` (404), `INTERNAL_ERROR` (500).