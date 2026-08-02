# ElevenLabs scheduling tool contracts

Configure these as server-side webhook tools on the AutomateMeJay ElevenLabs agent. Both tools must send the same secret value in the `x-agent-tool-secret` header. Store that value as an ElevenLabs workspace secret and as `AGENT_TOOL_SECRET` on Render; never expose it to the browser.

## `check_availability`

- Method: `POST`
- URL: `https://automatemejay.com/api/agent/calendar/availability`
- Purpose: Check one exact future 30-minute slot against both of Jason's connected calendars.
- Call this before presenting a slot as available and again through the booking tool immediately before event creation.

Request body:

```json
{
  "type": "object",
  "required": ["start_iso", "end_iso"],
  "properties": {
    "start_iso": { "type": "string", "description": "ISO 8601 start with UTC offset." },
    "end_iso": { "type": "string", "description": "Exactly 30 minutes after start_iso, with UTC offset." },
    "conversation_id": { "type": "string", "description": "Current ElevenLabs conversation ID for the audit record." }
  }
}
```

Success response includes `available`, `start_iso`, `end_iso`, and `calendars_checked`. Do not expose calendar addresses to the visitor unless useful; simply say the slot is available or unavailable.

## `schedule_introduction`

- Method: `POST`
- URL: `https://automatemejay.com/api/agent/calendar/book`
- Purpose: Re-check availability, create a 30-minute Google Meet invitation, email the guest through Google Calendar, and preserve an audit trail.
- Call only after the guest explicitly confirms the repeated name, email, date, time, and timezone.

Request body:

```json
{
  "type": "object",
  "required": ["start_iso", "end_iso", "timezone", "guest_name", "guest_email", "guest_confirmed"],
  "properties": {
    "start_iso": { "type": "string", "description": "Confirmed ISO 8601 start with UTC offset." },
    "end_iso": { "type": "string", "description": "Exactly 30 minutes after start_iso, with UTC offset." },
    "timezone": { "type": "string", "description": "Guest-confirmed IANA timezone, for example America/New_York." },
    "guest_name": { "type": "string" },
    "guest_email": { "type": "string" },
    "company_name": { "type": "string" },
    "conversation_id": { "type": "string", "description": "Current ElevenLabs conversation ID for the audit record." },
    "guest_confirmed": { "type": "boolean", "description": "Must be true only after explicit guest confirmation." }
  }
}
```

Say that the meeting is booked only when the response includes `booked: true` and `event_id`. If it fails, say scheduling is temporarily unavailable and offer `hello@automatemejay.com`.

## Required Google authorization

The production service needs offline Google Calendar access for both accounts with event/free-busy scopes:

- `jason@simplsolutions.app`
- `sirotin@ecgprod.com`

Set the two resulting refresh tokens in the Render variables documented by `.env.example`. The app intentionally reports calendar actions as unavailable until both tokens are present.
