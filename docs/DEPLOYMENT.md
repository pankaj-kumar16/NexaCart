# NexaCart Deployment Guide

This document outlines a deployment path. It is not a claim that NexaCart has already been deployed to a public production environment.

## Local prerequisites

- Node.js and npm
- MongoDB (local or hosted)
- Docker Desktop (optional, for container-based execution)
- Environment configuration for each service

## Local development

1. Clone the repository.
2. Create service-specific `.env` files locally.
3. Install dependencies for the frontend and each backend service.
4. Confirm MongoDB is reachable.
5. Run services using the scripts defined in each `package.json`, or use Docker Compose after checking its configuration.
6. Run the frontend using its development script.
7. Confirm Gateway routes and API docs are reachable.

## Docker Compose

The repository contains Dockerfiles and a Compose file. From the project root, review service names, environment configuration, port mappings, volume mounts, and dependencies first.

If the Compose file is configured for your environment:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

## Production deployment checklist

- [ ] Choose a hosting provider and configure network access
- [ ] Use managed MongoDB or secured database hosting
- [ ] Configure environment variables/secrets through the host's secret manager
- [ ] Do not use development JWT/service secrets
- [ ] Configure HTTPS and trusted CORS origins
- [ ] Use production payment credentials only after payment setup is verified
- [ ] Configure logs, health checks, monitoring, and alerting
- [ ] Set up backups and restore testing
- [ ] Configure resource limits and restart policies
- [ ] Run dependency/security audits
- [ ] Test checkout, cancellation, stock updates, and notification behavior
- [ ] Document rollback strategy

## Suggested future CI/CD

A GitHub Actions pipeline can be added to:

1. Install dependencies
2. Run linting
3. Run automated tests
4. Build the frontend
5. Build container images
6. Deploy only after checks pass

CI/CD is a planned improvement unless a workflow file is present and verified.
