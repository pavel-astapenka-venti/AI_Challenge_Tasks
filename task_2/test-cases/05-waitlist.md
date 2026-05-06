# 05 — Waitlist

## TC-WL-001: User is placed on waitlist when event is at capacity
**Preconditions:** An event with capacity N has N confirmed RSVPs.
**Steps:**
1. Sign in as a new user.
2. RSVP to the event.
**Expected:** User is not confirmed. User is placed on the waitlist. A waitlist status is shown to the user.

## TC-WL-002: Waitlist follows FIFO order
**Preconditions:** An event is at capacity. Three users join the waitlist in sequence: User A, then User B, then User C.
**Steps:**
1. Cancel one confirmed attendee's RSVP.
**Expected:** User A (first in queue) is promoted to "Going." Users B and C remain on the waitlist.

## TC-WL-003: Automatic promotion on cancellation
**Preconditions:** Event is at capacity. At least one user is on the waitlist.
**Steps:**
1. A confirmed attendee cancels their RSVP.
**Expected:** The next waitlisted user is automatically promoted to "Going" without manual intervention. The promoted user receives a ticket with a QR code.

## TC-WL-004: Automatic promotion on capacity increase
**Preconditions:** Event is at capacity with waitlisted users. Host increases the event capacity.
**Steps:**
1. Host edits the event and increases capacity by 2.
**Expected:** The next 2 users on the waitlist (FIFO) are automatically promoted to "Going."

## TC-WL-005: Promotion is visible in-app to the promoted attendee
**Preconditions:** A user is on the waitlist and gets promoted (TC-WL-003 or TC-WL-004).
**Steps:**
1. Sign in as the promoted user.
2. Check in-app notifications or the event page.
**Expected:** The user sees an in-app notification or status change indicating they have been promoted from the waitlist to "Going."

## TC-WL-006: Promoted user receives a valid ticket
**Preconditions:** A waitlisted user has been promoted.
**Steps:**
1. Sign in as the promoted user.
2. View the ticket for the event.
**Expected:** A ticket with a unique QR code is available. "Add to Calendar" option is present.

## TC-WL-007: Cancelling a waitlist spot does not trigger promotion
**Preconditions:** Event is at capacity. Multiple users are on the waitlist.
**Steps:**
1. A waitlisted user cancels their waitlist spot.
**Expected:** No promotions occur. The remaining waitlisted users move up in order.

## TC-WL-008: Multiple cancellations promote multiple waitlisted users
**Preconditions:** Event is at capacity. 3 users are on the waitlist. 2 confirmed attendees cancel.
**Steps:**
1. Confirmed attendee 1 cancels.
2. Confirmed attendee 2 cancels.
**Expected:** The first 2 waitlisted users are promoted in FIFO order.
