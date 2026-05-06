# 08 — Check-in

## TC-CHK-001: Checker can open the check-in page for an event
**Preconditions:** User has Checker (or Host) role. A Published event exists.
**Steps:**
1. Navigate to the check-in page for the event.
**Expected:** Check-in page loads with the event name, a code entry field, and live counters.

## TC-CHK-002: Manual code entry checks in an attendee
**Preconditions:** Check-in page is open. An attendee has a valid ticket code.
**Steps:**
1. Enter the attendee's ticket code in the manual entry field.
2. Submit.
**Expected:** Attendee is marked as checked in. A success confirmation is shown. The checked-in counter increments by 1.

## TC-CHK-003: Live counters update on check-in
**Preconditions:** Check-in page is open. Some attendees are already checked in.
**Steps:**
1. Check in an additional attendee.
**Expected:** The checked-in counter updates in real time without requiring a page refresh.

## TC-CHK-004: Duplicate check-in is prevented
**Preconditions:** An attendee has already been checked in.
**Steps:**
1. Enter the same attendee's ticket code again.
2. Submit.
**Expected:** The system rejects the duplicate. An error or warning message is shown (e.g., "Already checked in"). The counter does not increment.

## TC-CHK-005: Undo last scan
**Preconditions:** An attendee has just been checked in.
**Steps:**
1. Click the "Undo" action for the last scan.
**Expected:** The attendee's check-in is reversed. The checked-in counter decrements by 1. The attendee can be checked in again.

## TC-CHK-006: Invalid code is rejected
**Preconditions:** Check-in page is open.
**Steps:**
1. Enter a random/invalid code.
2. Submit.
**Expected:** An error message is shown (e.g., "Invalid code" or "Ticket not found"). No check-in occurs.

## TC-CHK-007: Code from a different event is rejected
**Preconditions:** Two events exist. Check-in page is open for Event A. An attendee has a ticket for Event B.
**Steps:**
1. Enter the Event B ticket code on Event A's check-in page.
**Expected:** The code is rejected. An appropriate error is shown.

## TC-CHK-008: Live counters show correct totals
**Preconditions:** An event has 10 confirmed RSVPs. 3 have been checked in.
**Steps:**
1. Open the check-in page.
**Expected:** Counters show: Going = 10, Checked-in = 3 (or similar breakdown).

## TC-CHK-009: Host role can also use the check-in page
**Preconditions:** User has Host role (not just Checker).
**Steps:**
1. Open the check-in page for an event.
2. Enter a valid code and submit.
**Expected:** Check-in succeeds. Host has full access to the check-in page.

## TC-CHK-010: Undo is limited to the last scan only
**Preconditions:** Multiple attendees have been checked in sequentially.
**Steps:**
1. Click Undo.
2. Attempt to click Undo again without a new scan.
**Expected:** Only the most recent check-in is undone. A second undo without a new scan either does nothing or is disabled.
