# 01 — Authentication & Host Registration

## TC-AUTH-001: Unauthenticated user can browse events
**Preconditions:** User is not signed in.
**Steps:**
1. Navigate to the Explore page.
2. Observe the event listings.
**Expected:** Events are visible. No sign-in prompt is shown for browsing.

## TC-AUTH-002: Unauthenticated user can view past events
**Preconditions:** User is not signed in. At least one past event exists.
**Steps:**
1. Navigate to the Explore page.
2. Enable the "Include Past" toggle.
**Expected:** Past events are displayed with an "Ended" badge. RSVP option is hidden on past events.

## TC-AUTH-003: RSVP click redirects unauthenticated user to sign-in
**Preconditions:** User is not signed in. A published upcoming event exists.
**Steps:**
1. Navigate to the event page.
2. Click the RSVP button.
**Expected:** User is redirected to the sign-in page.

## TC-AUTH-004: Post-sign-in redirect returns to event page
**Preconditions:** User triggered sign-in from an event page (TC-AUTH-003).
**Steps:**
1. Complete the sign-in flow.
**Expected:** User is returned to the same event page they were viewing before sign-in.

## TC-AUTH-005: User can register as a Host via self-serve flow
**Preconditions:** User is signed in. User is not yet a Host.
**Steps:**
1. Navigate to the Host registration flow.
2. Fill in name, logo, short bio, and contact email.
3. Submit the registration.
**Expected:** Host profile is created. User can access the Host dashboard.

## TC-AUTH-006: Host profile fields are validated
**Preconditions:** User is signed in and on the Host registration page.
**Steps:**
1. Submit the form with the name field empty.
2. Submit the form with an invalid email.
**Expected:** Validation errors are shown for required/invalid fields. Form does not submit.

## TC-AUTH-007: Public Host page is accessible
**Preconditions:** A Host profile exists with name, logo, bio, and contact email.
**Steps:**
1. Navigate to the Host's public page URL.
**Expected:** Host name, logo, short bio, and contact email are displayed. Page is accessible to unauthenticated users.

## TC-AUTH-008: Host page includes social preview metadata
**Preconditions:** A Host profile exists.
**Steps:**
1. Inspect the HTML `<head>` of the Host page.
**Expected:** Open Graph and/or Twitter Card meta tags are present with the Host's name, bio, and logo.
