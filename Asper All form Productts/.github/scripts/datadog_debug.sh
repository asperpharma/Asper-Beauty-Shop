#!/usr/bin/env bash
set -euo pipefail

# Datadog debug script
# Outputs a single JSON object at the end:
# {"unauth_ok": true/false, "auth_ok": true/false, "notes": "..."}

# Configurable via env:
# DATADOG_SITE (e.g., datadoghq.com or datadoghq.eu) - optional, default datadoghq.com
# DATADOG_API_KEY, DATADOG_APP_KEY - optional (if present will run authenticated checks)
# DD_ATTEMPTS - attempts per check (default 3)
# DD_BACKOFF - base backoff seconds (default 2)
# DD_JITTER_MAX - max jitter seconds (default 1)
# DD_TIMEOUT - curl timeout seconds per request (default 10)

readonly DATADOG_SITE="${DATADOG_SITE:-datadoghq.com}"
readonly DATADOG_API_KEY="${DATADOG_API_KEY:-}"
readonly DATADOG_APP_KEY="${DATADOG_APP_KEY:-}"
readonly DD_ATTEMPTS="${DD_ATTEMPTS:-3}"
readonly DD_BACKOFF="${DD_BACKOFF:-2}"
readonly DD_JITTER_MAX="${DD_JITTER_MAX:-1}"
readonly DD_TIMEOUT="${DD_TIMEOUT:-10}"

# endpoints used for health check (HEAD)
UNAUTH_URL="https://api.${DATADOG_SITE}/"
AUTH_URL="https://api.${DATADOG_SITE}/api/v1/validate"

timestamp() { date --utc +"%Y-%m-%dT%H:%M:%SZ"; }

log() { printf '%s %s\n' "$(timestamp)" "$*"; }

# retry helper: attempt a command up to N times with exponential backoff + jitter
# usage: retry <attempts> <base_backoff> <max_jitter> <cmd...>
retry() {
  local attempts=$1
  shift
  local base=$1
  shift
  local max_jitter=$1
  shift
  local i=1
  local rc=0
  while [ "$i" -le "$attempts" ]; do
    if [ "$i" -gt 1 ]; then
      local backoff=$(( base ** (i - 1) ))
      local jitter=0
      if [ "$max_jitter" -gt 0 ]; then
        jitter=$(( RANDOM % (max_jitter + 1) ))
      fi
      local sleep_time=$(( backoff + jitter ))
      log "Retry $i/$attempts - sleeping ${sleep_time}s before attempt"
      sleep "$sleep_time"
    fi

    set +e
    "$@"
    rc=$?
    set -e

    if [ $rc -eq 0 ]; then
      return 0
    fi

    log "Attempt $i failed with exit $rc"
    i=$(( i + 1 ))
  done

  return $rc
}

# Perform an unauthenticated HEAD to the base API to check connectivity
check_unauth() {
  log "Starting unauthenticated check -> $UNAUTH_URL"
  retry "$DD_ATTEMPTS" "$DD_BACKOFF" "$DD_JITTER_MAX" curl \
    --silent --show-error --head --fail --location \
    --max-time "$DD_TIMEOUT" \
    "$UNAUTH_URL" >/dev/null
}

# Perform an authenticated HEAD to /api/v1/validate using keys
check_auth() {
  if [ -z "$DATADOG_API_KEY" ] && [ -z "$DATADOG_APP_KEY" ]; then
    log "No DATADOG_API_KEY/DATADOG_APP_KEY supplied; skipping authenticated check"
    return 2  # special code to indicate "skipped"
  fi

  log "Starting authenticated check -> $AUTH_URL (headers masked)"

  retry "$DD_ATTEMPTS" "$DD_BACKOFF" "$DD_JITTER_MAX" curl \
    --silent --show-error --head --fail --location \
    --max-time "$DD_TIMEOUT" \
    -H "DD-API-KEY: ${DATADOG_API_KEY}" \
    -H "DD-APPLICATION-KEY: ${DATADOG_APP_KEY}" \
    "$AUTH_URL" >/dev/null
}

# Main execution
unauth_ok=false
auth_ok=false
notes_arr=()

if check_unauth; then
  unauth_ok=true
  notes_arr+=("unauth:ok")
else
  notes_arr+=("unauth:failed")
fi

if check_auth; then
  auth_ok=true
  notes_arr+=("auth:ok")
else
  rc=$?
  if [ "$rc" -eq 2 ]; then
    notes_arr+=("auth:skipped")
    auth_ok=false
  else
    notes_arr+=("auth:failed")
    auth_ok=false
  fi
fi

notes="$(IFS='; '; echo "${notes_arr[*]}")"

log "Datadog debug summary: unauth_ok=${unauth_ok}, auth_ok=${auth_ok}"
log "Notes: $notes"

json=$(cat <<EOF
{
  "unauth_ok": ${unauth_ok},
  "auth_ok": ${auth_ok},
  "notes": "$(echo "$notes" | sed 's/"/\\"/g')"
}
EOF
)
echo "$json"

# Exit 1 only if auth keys were provided but auth failed
if [ "$auth_ok" = "false" ] && { [ -n "${DATADOG_API_KEY:-}" ] || [ -n "${DATADOG_APP_KEY:-}" ]; }; then
  exit 1
fi

exit 0
