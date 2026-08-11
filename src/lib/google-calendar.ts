import { randomUUID } from "node:crypto";
import { getGoogleCalendarConfig } from "@/lib/env";

type CalendarAccount = {
  email: string;
  refreshToken: string;
};

type BusyPeriod = { start: string; end: string };

async function getAccessToken(refreshToken: string) {
  const config = getGoogleCalendarConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google OAuth refresh failed (${response.status}).`);
  const body = await response.json() as { access_token?: string };
  if (!body.access_token) throw new Error("Google OAuth did not return an access token.");
  return body.access_token;
}

async function getBusy(account: CalendarAccount, timeMin: string, timeMax: string) {
  const accessToken = await getAccessToken(account.refreshToken);
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google Calendar availability failed for ${account.email} (${response.status}).`);
  const body = await response.json() as { calendars?: Record<string, { busy?: BusyPeriod[]; errors?: unknown[] }> };
  const primary = body.calendars?.primary;
  if (primary?.errors?.length) throw new Error(`Google Calendar access failed for ${account.email}.`);
  return primary?.busy ?? [];
}

export async function checkJasonAvailability(timeMin: string, timeMax: string) {
  const config = getGoogleCalendarConfig();
  const accounts: CalendarAccount[] = [
    { email: config.simplSolutionsCalendarId, refreshToken: config.simplSolutionsRefreshToken },
    { email: config.ecgCalendarId, refreshToken: config.ecgRefreshToken },
  ];
  const results = await Promise.all(accounts.map(async (account) => ({ account: account.email, busy: await getBusy(account, timeMin, timeMax) })));
  return {
    available: results.every((result) => result.busy.length === 0),
    calendarsChecked: results.map((result) => result.account),
    conflicts: results.flatMap((result) => result.busy.map((busy) => ({ calendar: result.account, ...busy }))),
  };
}

export async function bookJasonIntroduction(input: {
  start: string;
  end: string;
  timeZone: string;
  guestName: string;
  guestEmail: string;
  companyName?: string;
}) {
  const config = getGoogleCalendarConfig();
  const accessToken = await getAccessToken(config.simplSolutionsRefreshToken);
  const query = new URLSearchParams({ conferenceDataVersion: "1", sendUpdates: "all" });
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.bookingCalendarId)}/events?${query}`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({
      summary: `30-minute introduction — ${input.guestName}`,
      description: [
        "Introduction meeting scheduled by the AutomateMeJay AI assistant after checking Jason's connected calendars.",
        input.companyName ? `Company: ${input.companyName}` : null,
        "The risk-free first week is a paid $350 one-week trial with a full service-fee money-back guarantee, no automatic conversion, and a short SOW reviewed before payment. The seven-day period does not begin until Jason confirms activation.",
      ].filter(Boolean).join("\n"),
      start: { dateTime: input.start, timeZone: input.timeZone },
      end: { dateTime: input.end, timeZone: input.timeZone },
      attendees: [{ email: input.guestEmail, displayName: input.guestName }],
      conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google Calendar booking failed (${response.status}).`);
  const body = await response.json() as { id?: string; htmlLink?: string; hangoutLink?: string; start?: { dateTime?: string }; end?: { dateTime?: string } };
  if (!body.id) throw new Error("Google Calendar did not return an event ID.");
  return body;
}
