# NexaCart Security Notes

## Secrets and environment variables

Service configuration is stored in local `.env` files, which are ignored by Git. Never commit:

- MongoDB connection strings or credentials
- JWT signing secrets
- Internal service keys
- Razorpay secret keys
- Gmail SMTP credentials or app passwords
- API tokens

Commit placeholder-only environment templates (`.env.example`) if you choose to provide them.

## Authentication

- JWT is used for user authentication.
- Protected routes should validate the token on every request.
- Never log tokens or password values.
- Use strong, unique secrets outside development.

## Internal service access

Internal service authentication is implemented/configured in parts of the backend. Keep service credentials private, rotate them if exposed, and avoid exposing internal-only endpoints publicly.

## Payments

Razorpay is configured for test mode in the project. Use test credentials and test transactions while developing. Do not claim production payment readiness until production keys, webhook verification, environment setup, and payment failure cases are validated.

## Production checklist

- [ ] HTTPS enabled
- [ ] Strong production secrets configured
- [ ] Secrets managed outside source control
- [ ] CORS restricted to approved origins
- [ ] Rate limiting configured and reviewed
- [ ] Input validation and error handling reviewed
- [ ] Password hashing verified in User Service
- [ ] Payment callbacks/webhooks verified if used
- [ ] Database access restricted and backups enabled
- [ ] Logs do not contain secrets or personal sensitive data
- [ ] Dependency vulnerabilities reviewed
