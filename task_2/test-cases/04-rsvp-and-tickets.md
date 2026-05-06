# 04 — RSVP & Tickets

## TC-RSVP-001: Signed-in user can RSVP to an upcoming event
**Preconditions:** User is signed in. A Published upcoming event with available capacity exists.
**Steps:**
1. Navigate to the event page.
2. Click RSVP.
**Expected:** RSVP is confirmed. User's status for this event is "Going."

## TC-RSVP-002: RSVP generates a unique QR code ticket
**Preconditions:** User has just RSVPed successfully (TC-RSVP-001).
**Steps:**
1. After RSVP confirmation, view the ticket.
**Expected:** A ticket is displayed containing a unique QR code. The QR code encodes a unique code for this attendee–event pair.

## TC-RSVP-003: Ticket includes "Add to Calendar" option
**Preconditions:** User has a confirmed RSVP with a ticket.
**Steps:**
1. View the ticket.
2. Click "Add to Calendar."
**Expected:** A calendar file (e.g., .ics) is generated or a calendar link is opened containing the event's title, date/time, time zone, and location.

## TC-RSVP-004: Attendee can cancel their RSVP
**Preconditions:** User has a confirmed RSVP.
**Steps:**
1. Navigate to the event page or My Tickets page.
2. Cancel the RSVP.
**Expected:** RSVP is cancelled. User's status is no longer "Going." The capacity slot is freed.

## TC-RSVP-005: "My Tickets" page shows all upcoming tickets
**Preconditions:** User has RSVPed to multiple upcoming events.
**Steps:**
1. Navigate to the "My Tickets" page.
**Expected:** All upcoming event tickets are listed. Each entry shows event details and the QR ticket.

## TC-RSVP-006: "My Tickets" does not show past event tickets
**Preconditions:** User has RSVPed to events that have already ended.
**Steps:**
1. Navigate to the "My Tickets" page.
**Expected:** Past event tickets are not shown (or are in a clearly separated section).

## TC-RSVP-007: RSVP enforces capacity limit
**Preconditions:** An event has capacity set to N. N users have already RSVPed.
**Steps:**
1. Sign in as a user who has not RSVPed.
2. Attempt to RSVP.
**Expected:** User is not confirmed as "Going." User is placed on the waitlist instead.

## TC-RSVP-008: Cannot RSVP to a past event
**Preconditions:** A Published event whose end date is in the past.
**Steps:**
1. Navigate to the event page.
**Expected:** RSVP button is hidden or disabled. User cannot submit an RSVP.

## TC-RSVP-009: Each ticket has a unique code
**Preconditions:** Multiple users have RSVPed to the same event.
**Steps:**
1. Compare the QR codes / ticket codes of two different attendees.
**Expected:** Each attendee's code is unique.

## TC-RSVP-010: RSVP button not shown for unauthenticated user on past event
**Preconditions:** User is not signed in. A past event exists.
**Steps:**
1. Navigate to the past event page.
**Expected:** No RSVP button is shown. The "Ended" indicator is visible.
