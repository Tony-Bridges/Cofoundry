# CoFoundry API Documentation

## Overview

This document provides comprehensive information about the CoFoundry API endpoints, request formats, response structures, and authentication requirements. This API allows developers to integrate with the CoFoundry platform and build applications that leverage its features.

## Base URL

All API requests should be made to:

```
https://api.cofoundry.com/v1
```

For development and testing:

```
https://api-dev.cofoundry.com/v1
```

## Authentication

### Authentication Methods

The API supports these authentication methods:

1. **Session Authentication**: Used for browser-based applications where users log in directly.
2. **API Key Authentication**: Used for server-to-server integrations.
3. **OAuth 2.0**: Used for third-party applications to access user data with permission.

### API Key Authentication

For API key authentication, include your API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

API keys can be generated in the admin panel under API Management.

### OAuth 2.0 Authentication

To authenticate with OAuth 2.0:

1. Register your application in the CoFoundry Developer Portal
2. Implement the OAuth 2.0 authorization flow
3. Use the obtained access token in the Authorization header:

```
Authorization: Bearer ACCESS_TOKEN
```

## Rate Limiting

API requests are subject to rate limiting:

- 100 requests per minute for authenticated requests
- 20 requests per minute for unauthenticated requests

When rate limited, the API will return:

```
HTTP/1.1 429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded",
  "retry_after": 30
}
```

## Endpoints

### User Endpoints

#### Get Current User

```
GET /api/user
```

Response:

```json
{
  "id": 123,
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "userType": "founder",
  "bio": "Entrepreneur and developer",
  "avatar": "https://example.com/avatar.jpg",
  "isPremium": true,
  "role": "user",
  "createdAt": "2023-04-15T10:30:45Z"
}
```

#### Get User by Username

```
GET /api/users/:username
```

Response: Same as Get Current User

#### Get User Posts

```
GET /api/users/:username/posts
```

Parameters:
- `limit` (optional): Number of posts to return (default: 20)
- `offset` (optional): Offset for pagination (default: 0)

Response:

```json
[
  {
    "id": 456,
    "userId": 123,
    "content": "Just launched our beta product!",
    "type": "milestone",
    "milestoneTitle": "Beta Launch",
    "milestoneDate": "2023-04-10",
    "createdAt": "2023-04-10T14:22:37Z",
    "likes": 42,
    "comments": 7,
    "user": {
      "id": 123,
      "username": "johndoe",
      "displayName": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  // More posts...
]
```

#### Follow User

```
POST /api/users/:userId/follow
```

Response:

```json
{
  "success": true,
  "followersCount": 153
}
```

#### Unfollow User

```
DELETE /api/users/:userId/follow
```

Response:

```json
{
  "success": true,
  "followersCount": 152
}
```

### Post Endpoints

#### Get Posts

```
GET /api/posts
```

Parameters:
- `limit` (optional): Number of posts to return (default: 20)
- `offset` (optional): Offset for pagination (default: 0)
- `type` (optional): Filter by post type (regular, milestone, sos, launch, live)

Response:

```json
[
  {
    "id": 456,
    "userId": 123,
    "content": "Just launched our beta product!",
    "type": "milestone",
    "milestoneTitle": "Beta Launch",
    "milestoneDate": "2023-04-10",
    "createdAt": "2023-04-10T14:22:37Z",
    "likes": 42,
    "comments": 7,
    "user": {
      "id": 123,
      "username": "johndoe",
      "displayName": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  // More posts...
]
```

#### Create Post

```
POST /api/posts
```

Request body:

```json
{
  "content": "Excited to share our progress!",
  "type": "regular",
  "mediaUrl": "https://example.com/image.jpg"
}
```

For milestone posts:

```json
{
  "content": "We've reached 10,000 users!",
  "type": "milestone",
  "milestoneTitle": "10k Users",
  "milestoneDate": "2023-04-01",
  "mediaUrl": "https://example.com/celebration.jpg"
}
```

For SOS posts:

```json
{
  "content": "Need help with scaling our database",
  "type": "sos",
  "pressureGauge": 8
}
```

Response: The created post object

#### Get Post by ID

```
GET /api/posts/:postId
```

Response: Detailed post object

#### Like Post

```
POST /api/posts/:postId/likes
```

Response:

```json
{
  "success": true,
  "likesCount": 43
}
```

#### Unlike Post

```
DELETE /api/posts/:postId/likes
```

Response:

```json
{
  "success": true,
  "likesCount": 42
}
```

#### Get Post Comments

```
GET /api/posts/:postId/comments
```

Response:

```json
[
  {
    "id": 789,
    "userId": 456,
    "postId": 123,
    "content": "Great progress!",
    "createdAt": "2023-04-12T09:15:22Z",
    "user": {
      "id": 456,
      "username": "janedoe",
      "displayName": "Jane Doe",
      "avatar": "https://example.com/jane.jpg"
    }
  },
  // More comments...
]
```

#### Add Comment to Post

```
POST /api/posts/:postId/comments
```

Request body:

```json
{
  "content": "This is a great achievement!"
}
```

Response: The created comment object

### Startup Endpoints

#### Get Startup by ID

```
GET /api/startups/:startupId
```

Response:

```json
{
  "id": 234,
  "name": "TechStartup Inc.",
  "description": "Building the future of technology",
  "logo": "https://example.com/logo.png",
  "website": "https://techstartup.com",
  "industry": "SaaS",
  "stage": "seed",
  "founderId": 123,
  "createdAt": "2022-10-15T08:30:12Z",
  "founder": {
    "id": 123,
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### Get Startup by Founder ID

```
GET /api/startups/founder/:founderId
```

Response: Same as Get Startup by ID

#### Create Startup

```
POST /api/startups
```

Request body:

```json
{
  "name": "NewStartup Inc.",
  "description": "Innovative solutions for modern problems",
  "logo": "https://example.com/newlogo.png",
  "website": "https://newstartup.com",
  "industry": "FinTech",
  "stage": "ideation",
  "founderId": 123
}
```

Response: The created startup object

#### Update Startup

```
PATCH /api/startups/:startupId
```

Request body: Fields to update

Response: Updated startup object

### Fundraising Endpoints

#### Get Campaign by ID

```
GET /api/campaigns/:campaignId
```

Response:

```json
{
  "id": 345,
  "startupId": 234,
  "title": "Seed Round",
  "description": "Raising funds for market expansion",
  "goal": 500000,
  "raised": 350000,
  "currency": "USD",
  "startDate": "2023-03-01T00:00:00Z",
  "endDate": "2023-05-01T00:00:00Z",
  "status": "active",
  "createdAt": "2023-02-15T10:25:36Z",
  "startup": {
    "id": 234,
    "name": "TechStartup Inc.",
    "logo": "https://example.com/logo.png"
  }
}
```

#### Create Campaign

```
POST /api/campaigns
```

Request body:

```json
{
  "startupId": 234,
  "title": "Series A",
  "description": "Scaling our operations globally",
  "goal": 2000000,
  "currency": "USD",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-08-01T00:00:00Z"
}
```

Response: The created campaign object

#### Update Campaign

```
PATCH /api/campaigns/:campaignId
```

Request body: Fields to update

Response: Updated campaign object

### Financial Endpoints

#### Get Capital Expenditures

```
GET /api/financials/capex/:startupId
```

Response:

```json
[
  {
    "id": 456,
    "startupId": 234,
    "title": "Server Infrastructure",
    "amount": 15000,
    "currency": "USD",
    "date": "2023-02-10T00:00:00Z",
    "category": "technology",
    "description": "AWS server costs for Q1",
    "createdAt": "2023-02-10T14:22:37Z"
  },
  // More items...
]
```

#### Add Capital Expenditure

```
POST /api/financials/capex
```

Request body:

```json
{
  "startupId": 234,
  "title": "Office Space",
  "amount": 25000,
  "currency": "USD",
  "date": "2023-03-15T00:00:00Z",
  "category": "facilities",
  "description": "Monthly rent for headquarters"
}
```

Response: The created expenditure object

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    // Additional error information (optional)
  }
}
```

Common error codes:

- `authentication_required`: Authentication is required for this endpoint
- `invalid_credentials`: Provided credentials are invalid
- `insufficient_permissions`: User lacks necessary permissions
- `resource_not_found`: Requested resource does not exist
- `validation_error`: Request validation failed
- `rate_limit_exceeded`: Rate limit has been exceeded
- `server_error`: An unexpected server error occurred

## Webhook Integration

CoFoundry supports webhooks for real-time updates:

1. Register a webhook URL in the developer portal
2. Select the events you want to receive
3. Implement a webhook handler at your specified URL
4. We'll send POST requests with event data to your URL

Example webhook payload:

```json
{
  "event": "post.created",
  "timestamp": "2023-04-15T10:30:45Z",
  "data": {
    "post": {
      "id": 456,
      "userId": 123,
      "content": "Just launched our beta product!",
      "type": "milestone",
      "createdAt": "2023-04-15T10:30:45Z"
    }
  }
}
```

## SDK and Libraries

Official SDKs are available for:

- JavaScript/TypeScript
- Python
- Ruby
- PHP
- Java
- .NET

Visit our [Developer Portal](https://developers.cofoundry.com) for SDK documentation and sample code.

## Support

For API support and questions:

- Developer forum: https://developers.cofoundry.com/forum
- GitHub issues: https://github.com/cofoundry/api-issues
- Email: api-support@cofoundry.com