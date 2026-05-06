# 06 — Roles & Permissions

## TC-ROLE-001: Host organization supports Host and Checker roles
**Preconditions:** A Host organization exists.
**Steps:**
1. View the Host organization's member management page.
**Expected:** Two roles are available: Host and Checker.

## TC-ROLE-002: Host can invite a member with Host role via copyable link
**Preconditions:** User is a Host.
**Steps:**
1. Navigate to the member/invite management section.
2. Generate an invite link with the Host role selected.
3. Copy the link.
**Expected:** A unique invite link is generated and can be copied. The link is associated with the Host role.

## TC-ROLE-003: Host can invite a member with Checker role via copyable link
**Preconditions:** User is a Host.
**Steps:**
1. Generate an invite link with the Checker role selected.
2. Copy the link.
**Expected:** A unique invite link is generated for the Checker role.

## TC-ROLE-004: Invited user accepts Host role invite
**Preconditions:** An invite link for Host role exists.
**Steps:**
1. Sign in as a different user.
2. Open the invite link.
3. Accept the invitation.
**Expected:** User is added to the Host organization with the Host role.

## TC-ROLE-005: Invited user accepts Checker role invite
**Preconditions:** An invite link for Checker role exists.
**Steps:**
1. Sign in as a different user.
2. Open the invite link.
3. Accept the invitation.
**Expected:** User is added with the Checker role.

## TC-ROLE-006: Host role can create and manage events
**Preconditions:** User has Host role in the organization.
**Steps:**
1. Create a new event.
2. Publish the event.
3. Edit the event.
**Expected:** All actions succeed.

## TC-ROLE-007: Host role can approve gallery uploads
**Preconditions:** User has Host role. An event has pending gallery uploads.
**Steps:**
1. View pending gallery uploads.
2. Approve an upload.
**Expected:** The upload is approved and displayed publicly.

## TC-ROLE-008: Host role can view dashboard and export CSV
**Preconditions:** User has Host role.
**Steps:**
1. Navigate to the Host dashboard.
2. Export a CSV for an event.
**Expected:** Dashboard is accessible. CSV downloads successfully.

## TC-ROLE-009: Checker role can access check-in page
**Preconditions:** User has Checker role. An event exists under the Host.
**Steps:**
1. Navigate to the check-in page for the event.
**Expected:** Check-in page loads. User can enter codes and view counters.

## TC-ROLE-010: Checker role cannot create or manage events
**Preconditions:** User has only the Checker role.
**Steps:**
1. Attempt to access event creation.
2. Attempt to edit an existing event.
3. Attempt to access the Host dashboard.
**Expected:** All actions are denied or the UI elements are not visible.

## TC-ROLE-011: Checker role cannot approve gallery uploads
**Preconditions:** User has only the Checker role.
**Steps:**
1. Attempt to access gallery approval.
**Expected:** Access is denied or not visible.

## TC-ROLE-012: Checker role cannot export CSV
**Preconditions:** User has only the Checker role.
**Steps:**
1. Attempt to export a CSV.
**Expected:** Access is denied or export option is not visible.

## TC-ROLE-013: Regular user without a role cannot access Host management
**Preconditions:** User is signed in but has no role in any Host organization.
**Steps:**
1. Attempt to access a Host dashboard or event management.
**Expected:** Access is denied or pages are not accessible.
