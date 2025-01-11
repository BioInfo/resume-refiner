# Shared PostgreSQL Database Best Practices (Supabase)

## Table of Contents

- [Introduction](#introduction)

- [Database Architecture](#database-architecture)

- [Schema Design](#schema-design)

- [Security Considerations](#security-considerations)

- [Performance Optimization](#performance-optimization)

- [Maintenance and Operations](#maintenance-and-operations)

## Introduction

  

This document outlines comprehensive best practices for managing a shared PostgreSQL database instance on Supabase across multiple applications and teams. Following these guidelines ensures scalability, security, and maintainability.

  

## Database Architecture

  

### Multi-Application Setup

- Implement separate schemas per application

- Use dedicated service roles for each application

- Maintain clear boundaries between application data

  

### Connection Management

```sql

-- Example connection pool configuration

ALTER SYSTEM SET max_connections = '100';

ALTER SYSTEM SET shared_buffers = '1GB';

```

  

## Schema Design

  

### Naming Conventions

- Use lowercase snake_case for all identifiers

- Prefix tables with application identifiers

- Consistent column naming across schemas

  

```sql

-- Example schema and table creation

CREATE SCHEMA app_one;

CREATE SCHEMA app_two;

  

CREATE TABLE app_one.users (

id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

email text UNIQUE NOT NULL,

created_at timestamptz DEFAULT now(),

updated_at timestamptz DEFAULT now()

);

```

  

### Data Types and Constraints

- Use appropriate data types (uuid, timestamptz, etc.)

- Implement CHECK constraints for data validation

- Define foreign key relationships explicitly

  

```sql

-- Example constraints

ALTER TABLE app_one.orders

ADD CONSTRAINT fk_user_id

FOREIGN KEY (user_id)

REFERENCES app_one.users(id)

ON DELETE RESTRICT;

```

  

## Security Considerations

  

### Row Level Security (RLS)

```sql

-- Example RLS policy

ALTER TABLE app_one.users ENABLE ROW LEVEL SECURITY;

  

CREATE POLICY "users_can_view_own_data" ON app_one.users

FOR SELECT

USING (auth.uid() = user_id);

```

  

### Access Control

- Implement role-based access control (RBAC)

- Use service roles with minimal required permissions

- Regular audit of access patterns

  

## Performance Optimization

  

### Indexing Strategy

```sql

-- Example index creation

CREATE INDEX idx_users_email ON app_one.users(email);

CREATE INDEX idx_orders_created_at ON app_one.orders(created_at);

```

  

### Query Optimization

- Use EXPLAIN ANALYZE for query planning

- Implement materialized views for complex queries

- Regular vacuum and analyze operations

  

## Maintenance and Operations

  

### Backup Strategy

```bash

# Example backup script

pg_dump -Fc -f backup.dump database_name

```

  

### Monitoring

- Set up alerts for:

- Connection pool exhaustion

- Long-running queries

- Index bloat

- Table bloat

  

### Version Control

- Maintain all schema changes in version control

- Use migration tools for schema updates

- Document all changes thoroughly

  

## Best Practices Checklist

  

- [ ] Implement separate schemas per application

- [ ] Enable RLS on all tables

- [ ] Set up proper indexing strategy

- [ ] Configure connection pooling

- [ ] Implement backup strategy

- [ ] Set up monitoring and alerting

- [ ] Use version control for schema changes

- [ ] Regular security audits

- [ ] Performance monitoring and optimization

  

## Appendix

  

### Useful Queries

  

```sql

-- Check table sizes

SELECT schemaname, relname, pg_size_pretty(pg_total_relation_size(relid))

FROM pg_stat_user_tables

ORDER BY pg_total_relation_size(relid) DESC;

  

-- Monitor connections

SELECT * FROM pg_stat_activity;

  

-- Index usage statistics

SELECT * FROM pg_stat_user_indexes;

```

  

### Common Issues and Solutions

  

1. Connection Pool Exhaustion

- Increase pool size

- Implement connection timeout

- Add request queuing

  

2. Slow Queries

- Review and optimize indexes

- Update table statistics

- Consider partitioning large tables

  

3. Data Consistency

- Implement constraints

- Regular data validation

- Automated testing