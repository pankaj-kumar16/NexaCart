# NexaCart — Project Overview

## Problem

A conventional e-commerce application needs multiple capabilities—account management, catalog browsing, cart handling, checkout, order lifecycle management, payment, and customer communication. NexaCart brings these flows together in a single web application while separating backend responsibilities into services.

## Goals

- Deliver a responsive storefront experience
- Provide authentication and profile management
- Support product discovery and cart operations
- Handle checkout and order workflows
- Support Cash on Delivery and Razorpay test payment flow
- Provide order history, cancellation, and tracking interface
- Send order-related email notifications
- Keep backend domains separated into services

## User-facing features

- Register and login
- Product catalog and browsing
- Cart management
- Checkout
- COD and Razorpay test payment
- Order confirmation
- Order history
- Order cancellation
- Order tracking UI
- Profile update
- Password change
- Account deletion

## Service boundaries

- User Service: identity and profile
- Product Service: catalog and product data
- Cart Service: cart state
- Order Service: purchase/order workflow
- Notification Service: email communication
- API Gateway: routing entry point

## Current limitations / status to communicate honestly

- Payment integration is configured in test mode; this is not production payment certification.
- Automated test coverage and production deployment status should be verified independently.
- Exact API paths and schema details should be taken from the live Swagger setup and model files.
- Screenshots and deployment URL can be added after capturing/hosting the application.
