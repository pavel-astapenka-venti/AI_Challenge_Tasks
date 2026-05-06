# 02 — Event Creation & Management

## TC-EVT-001: Host can create a new event with all fields
**Preconditions:** User is signed in and registered as a Host.
**Steps:**
1. Navigate to event creation.
2. Fill in: title, description, start date/time, end date/time, time zone, venue address, capacity, and cover image.
3. Save the event.
**Expected:** Event is created in Draft state with all provided details saved correctly.

## TC-EVT-002: Event creation with online link instead of venue
**Preconditions:** User is a Host.
**Steps:**
1. Create a new event.
2. Provide an online link instead of a venue address.
3. Save the event.
**Expected:** Event is saved with the online link. No venue address is required.

## TC-EVT-003: Event defaults to Draft state
**Preconditions:** User is a Host.
**Steps:**
1. Create and save a new event without publishing.
**Expected:** Event status is Draft. Event is not visible on the Explore page.

## TC-EVT-004: Host can publish an event
**Preconditions:** A Draft event exists under the Host.
**Steps:**
1. Open the event management view.
2. Click the Publish action.
**Expected:** Event state changes to Published. If the event is Public, it appears on the Explore page.

## TC-EVT-005: Host can unpublish an event
**Preconditions:** A Published event exists.
**Steps:**
1. Click the Unpublish action on the event.
**Expected:** Event returns to Draft state. It is removed from the Explore page.

## TC-EVT-006: Host can duplicate an event
**Preconditions:** An event exists (Draft or Published).
**Steps:**
1. Click the Duplicate action on the event.
**Expected:** A new Draft event is created with the same details (title, description, venue, capacity, etc.). Date/time fields may be cleared or adjusted.

## TC-EVT-007: Public event is searchable on Explore page
**Preconditions:** A Published Public event exists.
**Steps:**
1. Navigate to the Explore page.
2. Search for the event by title.
**Expected:** The event appears in search results.

## TC-EVT-008: Unlisted event is not searchable but accessible via direct link
**Preconditions:** A Published Unlisted event exists.
**Steps:**
1. Search for the event on the Explore page.
2. Navigate to the event via its direct URL.
**Expected:** Step 1: Event does not appear in search results. Step 2: Event page loads correctly.

## TC-EVT-009: Free/Paid toggle is visible with Paid disabled
**Preconditions:** User is a Host in the event editor.
**Steps:**
1. Open the event editor for a new or existing event.
2. Locate the Free/Paid toggle.
3. Attempt to select the Paid option.
**Expected:** Toggle is visible. Free is selectable. Paid is disabled/grayed out. A "Coming soon" tooltip appears on hover/focus of the Paid option.

## TC-EVT-010: Event page includes social preview metadata
**Preconditions:** A Published event exists.
**Steps:**
1. Inspect the HTML `<head>` of the event page.
**Expected:** Open Graph and/or Twitter Card meta tags are present with the event's title, description, and cover image.

## TC-EVT-011: Past event page shows "Ended" and hides RSVP
**Preconditions:** An event exists whose end date/time is in the past.
**Steps:**
1. Navigate to the event page.
**Expected:** An "Ended" indicator is clearly displayed. The RSVP button is not shown.

## TC-EVT-012: Event creation validates required fields
**Preconditions:** User is a Host in the event editor.
**Steps:**
1. Attempt to save an event with the title field empty.
2. Attempt to save an event with start date/time missing.
3. Attempt to save with end date/time before start date/time.
**Expected:** Validation errors are shown for each case. Event is not saved.

## TC-EVT-013: Cover image upload works
**Preconditions:** User is a Host in the event editor.
**Steps:**
1. Upload an image file as the cover image.
2. Save the event.
3. View the event page.
**Expected:** Cover image is saved and displayed on the event page.

## TC-EVT-014: Time zone is stored and displayed correctly
**Preconditions:** User is a Host.
**Steps:**
1. Create an event with a specific time zone (e.g., America/New_York).
2. View the event page from a browser in a different time zone.
**Expected:** The event's time zone is displayed correctly on the event page.
