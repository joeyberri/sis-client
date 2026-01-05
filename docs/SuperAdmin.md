# Untitled

# Super Admin (platform-level operators)

Purpose: manage platform-level configuration, tenants (schools), billing, and high-level observability.

## Sidebar

- Dashboard
- Tenants (Schools)
    - All Schools
    - Onboarding Queue
- Users
    - All Users
    - Invite User
- Billing & Plans
- Global Settings
- Audit Logs
- Health & Monitoring
- Support & Tickets
- Integrations
- Release Notes / System Messages

---

### Dashboard (page)

- Top KPIs: active schools, active users (24h), monthly active teachers/students, queued jobs, error rate
- Charts: new schools per month, platform usage heatmap, API errors by region
- Quick actions: Create school, Invite user, View health
- Alerts area (critical system alerts)

### Tenants → All Schools (page)

- Table columns: School Name | Tenant ID | Contact (Admin) | Plan | Status | Students | Teachers | Actions
- Filters: status (trial/active/suspended), plan, region
- Row actions: View, Impersonate, Suspend, Export data
- Detail drawer: school settings snapshot, usage quotas, payment method

### Tenants → Onboarding Queue

- Cards/list of schools pending setup
- Actions: Approve onboarding, request info, schedule onboarding call

### Users → All Users

- Search (by email, name, tenant)
- Table: Name | Email | Role | Tenant | Last login | Status
- Bulk invite button
- Impersonate (for troubleshooting)
- Deactivate/reactivate

### Billing & Plans

- View subscription revenue, stripe invoices
- Adjust tenant plan, upgrade/downgrade controls
- Billing alerts & overdue list

### Global Settings

- Feature flags toggle
- Region defaults
- Supported grading templates (global default)
- SSO & OAuth provider config

### Audit Logs

- Searchable stream: actor | action | target | timestamp
- Filters: tenant, user, action type
- Export logs

### Health & Monitoring

- Service status, queue length, scheduled job statuses
- p95/p99 latency metrics
- Database replication lag

### Integrations

- Connected services (Metabase, Resend, Novu, Payment gateways)
- API keys viewer/regenerator

### Support & Tickets

- Platform support queue: view, claim, respond, escalate