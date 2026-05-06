# 07 — Host Dashboard & Operations

## TC-DASH-001: Dashboard lists upcoming events
**Preconditions:** Host has multiple upcoming events.
**Steps:**
1. Navigate to the Host dashboard.
**Expected:** Upcoming events are listed.

## TC-DASH-002: Dashboard lists past events
**Preconditions:** Host has past events.
**Steps:**
1. Navigate to the Host dashboard.
**Expected:** Past events are listed in a separate section or tab.

## TC-DASH-003: Per-event stats show Going count
**Preconditions:** An event has confirmed RSVPs.
**Steps:**
1. View the event on the dashboard.
**Expected:** The "Going" count matches the number of confirmed RSVPs.

## TC-DASH-004: Per-event stats show Waitlist count
**Preconditions:** An event has waitlisted users.
**Steps:**
1. View the event on the dashboard.
**Expected:** The "Waitlist" count matches the number of waitlisted users.

## TC-DASH-005: Per-event stats show Checked-in count
**Preconditions:** An event has attendees who have been checked in.
**Steps:**
1. View the event on the dashboard.
**Expected:** The "Checked-in" count matches the number of checked-in attendees.

## TC-DASH-006: CSV export for RSVPs contains correct columns
**Preconditions:** An event has RSVPs.
**Steps:**
1. Export the RSVP CSV for the event.
2. Open the CSV file.
**Expected:** Columns are: name, email, RSVP status, check-in time. Each RSVP has a row.

## TC-DASH-007: CSV export opens correctly in Excel
**Preconditions:** A CSV has been exported.
**Steps:**
1. Open the exported CSV in Microsoft Excel.
**Expected:** Columns are properly separated. Data is readable. No encoding issues with special characters.

## TC-DASH-008: CSV export opens correctly in Google Sheets
**Preconditions:** A CSV has been exported.
**Steps:**
1. Import the exported CSV into Google Sheets.
**Expected:** Columns are properly separated. Data is readable. No encoding issues.

## TC-DASH-009: CSV includes waitlisted and checked-in data
**Preconditions:** An event has Going, Waitlisted, and Checked-in attendees.
**Steps:**
1. Export the CSV.
**Expected:** All attendees appear with correct RSVP status ("Going", "Waitlisted", etc.) and check-in time (populated for checked-in, empty for others).

## TC-DASH-010: "My Events" page shows all events where user holds a role
**Preconditions:** User has Host role in Organization A and Checker role in Organization B. Both have events.
**Steps:**
1. Navigate to "My Events."
**Expected:** Events from both organizations are listed.

## TC-DASH-011: "My Events" filter by Host
**Preconditions:** User has roles in multiple Host organizations.
**Steps:**
1. Navigate to "My Events."
2. Filter by a specific Host organization.
**Expected:** Only events from the selected Host are shown.

## TC-DASH-012: "My Events" filter by date range
**Preconditions:** User has events across multiple dates.
**Steps:**
1. Apply a date range filter.
**Expected:** Only events within the date range are shown.

## TC-DASH-013: "My Events" text search
**Preconditions:** User has multiple events.
**Steps:**
1. Search by event title.
**Expected:** Only matching events are shown.

## TC-DASH-014: "My Events" shows role-appropriate quick actions
**Preconditions:** User has Host role for some events and Checker role for others.
**Steps:**
1. View "My Events."
**Expected:** Events where user is Host show management actions (Edit, Publish, etc.). Events where user is Checker show only check-in access.

## TC-DASH-015: "My Events" is only visible to users with roles
**Preconditions:** User is signed in but has no roles in any Host organization.
**Steps:**
1. Look for "My Events" in navigation.
**Expected:** "My Events" link/page is not visible or accessible.
