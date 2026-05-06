# 03 — Discovery & Explore Page

## TC-DSC-001: Explore page loads with upcoming events by default
**Preconditions:** Multiple Published Public events exist, some upcoming and some past.
**Steps:**
1. Navigate to the Explore page without any filters.
**Expected:** Only upcoming events are shown. Past events are not displayed. The date range filter defaults to "Upcoming."

## TC-DSC-002: Text search filters events by title/description
**Preconditions:** Multiple Published Public events exist with distinct titles.
**Steps:**
1. Navigate to the Explore page.
2. Enter a search term matching one event's title.
**Expected:** Only events matching the search term are shown.

## TC-DSC-003: Date range filter works
**Preconditions:** Events exist across multiple dates.
**Steps:**
1. Set the date range filter to a specific range that includes some events and excludes others.
**Expected:** Only events within the selected date range are displayed.

## TC-DSC-004: Location filter works
**Preconditions:** Events exist in different locations.
**Steps:**
1. Apply a location filter for a specific city or area.
**Expected:** Only events matching the location are displayed.

## TC-DSC-005: "Include Past" toggle shows past events
**Preconditions:** At least one past event exists.
**Steps:**
1. Navigate to the Explore page (past events hidden by default).
2. Enable the "Include Past" toggle.
**Expected:** Past events appear in the listing alongside upcoming events. Past events display an "Ended" badge.

## TC-DSC-006: Past events hide RSVP on Explore page
**Preconditions:** "Include Past" is enabled. Past events are visible.
**Steps:**
1. Observe a past event card on the Explore page.
**Expected:** No RSVP button or link is shown for past events.

## TC-DSC-007: Unlisted events do not appear on Explore page
**Preconditions:** A Published Unlisted event exists.
**Steps:**
1. Browse the Explore page with no filters.
2. Search for the Unlisted event's title.
**Expected:** The Unlisted event does not appear in either case.

## TC-DSC-008: Combining multiple filters
**Preconditions:** Multiple events exist with varied attributes.
**Steps:**
1. Apply text search, date range, and location filters simultaneously.
**Expected:** Only events matching all applied filters are displayed. Results update correctly as filters change.

## TC-DSC-009: No results state
**Preconditions:** None.
**Steps:**
1. Search for a term that matches no events.
**Expected:** A clear "No events found" or similar empty state message is shown.

## TC-DSC-010: Draft events do not appear on Explore page
**Preconditions:** An event exists in Draft state.
**Steps:**
1. Browse and search the Explore page.
**Expected:** Draft events are never shown to any user on the Explore page.
