# Master Deployment Dashboard — Data Sources & Queries

Database-backed health checks and launch checklist progress. Use these queries
for your Master Deployment Dashboard and Launch Checklist Technical View.

---

## Tables

| Table                      | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `deployment_health_checks` | CI/Git/NPM check results (ingested via webhook)                      |
| `checklist_items`          | Master Launch Checklist definitions (Payment, Shipping, Theme, etc.) |
| `checklist_progress`       | Per-item status (pending/complete/failed)                            |

---

## Views (Dashboard Widgets)

| View                          | Use Case                                            |
| ----------------------------- | --------------------------------------------------- |
| `v_deployment_health_last`    | Last status per branch per check_type               |
| `v_deployment_failing_checks` | Failing checks for alerts                           |
| `v_checklist_completion`      | Completion % by category (payment, shipping, theme) |
| `v_checklist_overall`         | Overall checklist completion %                      |
| `v_master_dashboard`          | Aggregated counts for dashboard header              |

---

## Sample Queries

### Master Deployment Dashboard — Header Stats

```sql
select * from v_master_dashboard;
```

Returns: `health_checks_24h`, `failing_checks_count`, `checklist_pct`,
`last_health_check_at`

### Last Status Per Branch (Git/NPM Health)

```sql
select branch, check_type, status, created_at
from v_deployment_health_last
where branch = 'docs/deployment-flow-and-health-check'
order by check_type;
```

### Failing Checks (Alerts)

```sql
select branch, check_type, status, details, created_at
from v_deployment_failing_checks
order by created_at desc;
```

### Launch Checklist Technical View — By Category

```sql
select category, total, completed, pct_complete
from v_checklist_completion
order by category;
```

### Launch Checklist — Full Detail

```sql
select c.category, c.name, c.description,
       coalesce(p.status, 'pending') as status,
       p.notes, p.updated_at
from checklist_items c
left join checklist_progress p on p.checklist_item_id = c.id
order by c.sort_order;
```

### Overall Completion %

```sql
select total_items, completed_items, completion_pct from v_checklist_overall;
```

---

## Ingest Endpoint

**POST** `https://YOUR_PROJECT.supabase.co/functions/v1/health-checks-ingest`\
**Headers:** `Authorization: Bearer YOUR_ANON_OR_SERVICE_KEY`\
**Content-Type:** `application/json`

**Body:**

```json
{
  "branch": "docs/deployment-flow-and-health-check",
  "source": "script",
  "checks": [
    { "check_type": "lint", "status": "pass" },
    { "check_type": "test", "status": "pass" },
    { "check_type": "build", "status": "pass" },
    {
      "check_type": "git_branch",
      "status": "pass",
      "details": { "current": "docs/deployment-flow-and-health-check" }
    },
    { "check_type": "git_clean", "status": "pass" },
    {
      "check_type": "supabase_bulk",
      "status": "pass",
      "details": { "status_code": 200 }
    },
    {
      "check_type": "supabase_audit",
      "status": "pass",
      "details": { "status_code": 200 }
    }
  ]
}
```

---

## Realtime

Subscribe to live updates:

```ts
const channel = supabase
  .channel("deployment-health")
  .on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "deployment_health_checks",
  }, (payload) => {
    console.log("New health check:", payload.new);
  })
  .subscribe();
```

---

## Checklist Progress Updates

To mark an item complete:

```sql
insert into checklist_progress (checklist_item_id, status, notes)
select id, 'complete', 'COD enabled in Shopify'
from checklist_items where name = 'COD Enabled'
on conflict (checklist_item_id) do update set status = 'complete', notes = excluded.notes, updated_at = now();
```
