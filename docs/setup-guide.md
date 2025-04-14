# CoFoundry Setup and Deployment Guide

## Overview

This guide provides instructions for setting up, configuring, and deploying the CoFoundry platform. It's intended for developers and system administrators responsible for installation and maintenance.

## System Requirements

### Minimum Requirements

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Storage**: 5GB+ (excluding user uploads)
- **Memory**: 4GB RAM
- **CPU**: 2 cores

### Recommended Requirements

- **Node.js**: v20.0.0 or higher
- **PostgreSQL**: v15.0 or higher
- **Storage**: 20GB+ (excluding user uploads)
- **Memory**: 8GB RAM
- **CPU**: 4 cores
- **CDN**: For media delivery

## Local Development Setup

### Prerequisites

1. Install Node.js and npm
2. Install PostgreSQL
3. Clone the repository: `git clone https://github.com/cofoundry/platform.git`
4. Navigate to the project directory: `cd platform`

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cofoundry

# Authentication
SESSION_SECRET=your_session_secret_here

# Storage (Choose one option)
# For local storage:
STORAGE_TYPE=local
STORAGE_PATH=./uploads

# For S3 storage:
STORAGE_TYPE=s3
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Stripe (Optional, for payment processing)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Email (Optional, for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@cofoundry.com
```

### Installation

1. Install dependencies: `npm install`
2. Set up the database: `npm run setup:db`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:5000`

## Database Configuration

### Schema Setup

The database schema is automatically created during the setup process (`npm run setup:db`). This command:

1. Creates necessary tables
2. Adds indexes for performance
3. Sets up initial constraints
4. Creates an admin user

### Migrations

To run database migrations:

```bash
npm run migrate:latest
```

To create a new migration:

```bash
npm run migrate:create -- --name your_migration_name
```

### Backup and Restore

To back up the database:

```bash
pg_dump -U username -d cofoundry > backup.sql
```

To restore from backup:

```bash
psql -U username -d cofoundry < backup.sql
```

## Configuration Options

Edit `config.js` to modify platform behavior:

### Security Settings

```javascript
// config.js
module.exports = {
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionDuration: 86400, // 24 hours in seconds
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    }
  }
  // other settings...
}
```

### Storage Configuration

```javascript
// config.js
module.exports = {
  storage: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    imageSizes: {
      thumbnail: { width: 200, height: 200, fit: 'cover' },
      medium: { width: 800, height: 600, fit: 'inside' },
      large: { width: 1920, height: 1080, fit: 'inside' }
    }
  }
  // other settings...
}
```

### Email Templates

Email templates are stored in `templates/emails/` and use Handlebars for templating. Customize these templates to match your branding.

## Production Deployment

### Preparing for Production

1. Build the frontend: `npm run build`
2. Set up environment variables for production
3. Ensure database is properly secured
4. Configure proper monitoring and logging

### Deployment Options

#### Option 1: Traditional Server Deployment

1. Set up a Linux server (Ubuntu/Debian recommended)
2. Install Node.js, npm, and PostgreSQL
3. Clone the repository and check out the release tag
4. Install dependencies: `npm ci --production`
5. Build the application: `npm run build`
6. Set up environment variables
7. Start the application with PM2:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "cofoundry"
   ```
8. Set up Nginx as a reverse proxy

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t cofoundry .
   ```

2. Run the container:
   ```bash
   docker run -d -p 5000:5000 --env-file .env --name cofoundry cofoundry
   ```

#### Option 3: Cloud Deployment

##### AWS Deployment

1. Set up an RDS PostgreSQL instance
2. Configure an EC2 instance or Elastic Beanstalk
3. Set up an S3 bucket for file storage
4. Deploy using the traditional method or Docker

##### Heroku Deployment

1. Create a new Heroku app
2. Add the PostgreSQL add-on
3. Set environment variables in the Heroku dashboard
4. Deploy with Git:
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

## Scaling Considerations

### Horizontal Scaling

The application supports horizontal scaling by:

1. Using stateless authentication with JWT
2. Storing session data in Redis or the database
3. Separating media storage to S3 or similar storage

### Database Scaling

For database scaling:

1. Consider read replicas for high read load
2. Implement connection pooling
3. Set up proper indexes
4. Monitor query performance

### Media Content

For scaling media delivery:

1. Use a CDN like CloudFront or Cloudflare
2. Implement image optimization and caching
3. Consider on-demand image resizing

## Monitoring and Maintenance

### Health Checks

The application exposes a health check endpoint at `/api/health` that reports:

- API status
- Database connectivity
- Storage access
- Memory usage
- CPU load

### Logging

Logs are written to:

- Console (stdout/stderr) in development
- Log files in `logs/` directory in production
- Can be configured to send to external logging services

### Monitoring Tools

Recommended monitoring tools:

- Prometheus for metrics collection
- Grafana for visualization
- Sentry for error tracking
- New Relic or Datadog for performance monitoring

### Backup Strategy

Implement a comprehensive backup strategy:

1. Database backups (daily)
2. User uploads backup (continuous or daily)
3. Configuration backups (after changes)
4. Off-site backup storage

## Troubleshooting

### Common Issues

#### Database Connection Issues

- Check PostgreSQL service is running
- Verify connection string in environment variables
- Check network access and firewall rules

#### Application Startup Failures

- Check for syntax errors in configuration files
- Verify all required environment variables are set
- Check log files for detailed error messages

#### Performance Issues

- Monitor database query performance
- Check server resource utilization
- Consider scaling vertically or horizontally

### Support Resources

- GitHub Issues: https://github.com/cofoundry/platform/issues
- Documentation: https://docs.cofoundry.com
- Community Forum: https://community.cofoundry.com
- Email Support: support@cofoundry.com