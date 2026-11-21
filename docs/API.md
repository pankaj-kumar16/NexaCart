# NexaCart API Guide

## Base URL (local)

The frontend is configured to use the API Gateway on:

`http://localhost:5000`

Swagger/OpenAPI UI is configured at:

`http://localhost:5000/api-docs`

Check the Gateway source/configuration if the route or base URL changes.

## Services

| Service | Local port | Scope |
|---|---:|---|
| API Gateway | 5000 | Frontend API entry point and routing |
| User Service | 5001 | Authentication and user/profile operations |
| Product Service | 5002 | Catalog/product operations |
| Cart Service | 5003 | Cart operations |
| Order Service | 5004 | Checkout and order operations |
| Notification Service | 5005 | Email notification operations |

## Endpoint groups

Endpoint paths and HTTP methods may vary by route configuration. Use Swagger UI and the route files as the authoritative reference.

| Group | Typical operations |
|---|---|
| Authentication | Register, login |
| User | Get/update profile, change password, delete account |
| Products | List/view catalog, product operations |
| Cart | Get cart, add/update/remove items |
| Orders | Place order, view user's orders, view order details, cancel order |
| Notifications | Internal notification/email requests |

## Authentication

Protected user routes require a JWT token in the authentication header, according to the middleware configuration. Do not share or publish real tokens.

## Example request header

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## API testing

Recommended workflow:

1. Start MongoDB and required services.
2. Start the API Gateway.
3. Open the Swagger UI.
4. Register/login to obtain a token.
5. Authorize protected routes with the token.
6. Test product, cart, checkout, and order operations.
7. Test notification operations only with safe test configuration.

This guide is intentionally high-level. Swagger/OpenAPI and the actual Express route files are the source of truth for exact endpoint paths, request bodies, and responses.
