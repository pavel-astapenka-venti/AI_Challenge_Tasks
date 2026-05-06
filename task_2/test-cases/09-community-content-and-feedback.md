# 09 — Community Content & Feedback

## TC-COM-001: Attendee can submit post-event feedback after event ends
**Preconditions:** User attended an event that has ended (past end date).
**Steps:**
1. Navigate to the event page.
2. Submit feedback: select a star rating (1–5) and write an optional comment.
3. Submit.
**Expected:** Feedback is saved. A confirmation is shown.

## TC-COM-002: Feedback is only available after event ends
**Preconditions:** User RSVPed to an event that has not yet ended.
**Steps:**
1. Navigate to the event page.
2. Look for the feedback form.
**Expected:** Feedback form is not shown or is disabled before the event end time.

## TC-COM-003: Star rating is required; comment is optional
**Preconditions:** Event has ended. User is submitting feedback.
**Steps:**
1. Attempt to submit feedback with no star rating selected.
2. Submit feedback with a star rating but no comment.
**Expected:** Step 1: Validation error — rating is required. Step 2: Feedback is submitted successfully.

## TC-COM-004: Attendee can upload a photo to event gallery
**Preconditions:** User attended an event. Event has ended.
**Steps:**
1. Navigate to the event's gallery section.
2. Upload a photo.
**Expected:** Photo is uploaded and enters a "Pending approval" state. It is not visible publicly yet.

## TC-COM-005: Gallery uploads require Host approval
**Preconditions:** A photo has been uploaded to the gallery (pending).
**Steps:**
1. Sign in as a Host.
2. View pending gallery uploads for the event.
3. Approve the photo.
**Expected:** Photo is now visible publicly on the event gallery page.

## TC-COM-006: Host can reject a gallery upload
**Preconditions:** A photo is pending approval.
**Steps:**
1. Sign in as a Host.
2. Reject the photo.
**Expected:** Photo is not displayed publicly. The upload is removed or marked as rejected.

## TC-COM-007: Unapproved photos are not visible publicly
**Preconditions:** Photos have been uploaded but not yet approved.
**Steps:**
1. View the event gallery as an unauthenticated user.
**Expected:** Only approved photos are displayed. Pending photos are not shown.

## TC-COM-008: Any user can report an event
**Preconditions:** User is signed in. A Published event exists.
**Steps:**
1. Navigate to the event page.
2. Click the "Report" option.
3. Submit the report.
**Expected:** Report is submitted. A confirmation is shown to the user.

## TC-COM-009: Any user can report a photo
**Preconditions:** User is signed in. An approved photo is in the gallery.
**Steps:**
1. View the gallery photo.
2. Click "Report."
3. Submit.
**Expected:** Report is submitted. Confirmation shown.

## TC-COM-010: Reported items appear in a review queue
**Preconditions:** An event or photo has been reported.
**Steps:**
1. Sign in as a Host or admin.
2. Navigate to the review queue.
**Expected:** The reported item is listed with report details.

## TC-COM-011: Reported items can be hidden from public view
**Preconditions:** A reported item is in the review queue.
**Steps:**
1. Select the reported item.
2. Choose "Hide" action.
**Expected:** The item is no longer visible publicly. It remains in the review queue with a "Hidden" status.

## TC-COM-012: Non-attendees cannot submit feedback
**Preconditions:** User is signed in but did not RSVP to the event. Event has ended.
**Steps:**
1. Navigate to the event page.
2. Attempt to submit feedback.
**Expected:** Feedback form is not available or submission is rejected.

## TC-COM-013: Multiple attendees can submit feedback independently
**Preconditions:** Two users attended the same ended event.
**Steps:**
1. User A submits a 5-star rating with a comment.
2. User B submits a 3-star rating with no comment.
**Expected:** Both submissions are saved independently.

## TC-COM-014: Unauthenticated users cannot report
**Preconditions:** User is not signed in.
**Steps:**
1. View an event page or gallery photo.
2. Look for the "Report" option.
**Expected:** Report option is not available or prompts sign-in.
