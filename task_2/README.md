# Gather — Usage Guide

A walkthrough of the main flows: **Publish → RSVP → Ticket → Check-in**.

Live app: https://community-gather-box.lovable.app/

---

## 1. Register as a Host

1. Go to the homepage and click **"Start hosting"** or **"Become a host"** in the navigation bar.
2. If not signed in, you will be prompted to sign in or create an account first.
3. Fill in your Host profile: **name**, **logo URL**, **short bio**, and **contact email**.
4. Submit the form. Your public Host page is now live and accessible via a shareable link.

## 2. Create and Publish an Event

1. From the navigation bar, click **"Dashboard"**.
2. Click **"Create event"** in the dashboard header.
3. Fill in the event details:
   - **Title** and **Description**
   - **Start** and **End** date/time, and select a **time zone**
   - **Venue address** (or toggle **"Online event"** for a virtual link)
   - **Capacity** (maximum number of attendees)
   - **Visibility**: choose **Public** (searchable on Explore) or **Unlisted** (link-only)
   - Optionally add a **Cover image URL**
4. Click **"Create draft"**. The event is saved as a Draft.
5. Back on the dashboard, find your event and click **"Publish"** to make it live.
   - Published events appear on the Explore page (if Public) and are accessible via their direct link.
   - You can **Unpublish** or **Duplicate** an event at any time from the dashboard.

## 3. Discover and Share Events

1. Click **"Explore"** in the navigation bar to browse all public events.
2. Use the filters to narrow results:
   - **Search** by title or description
   - **Location** filter (city name or "online")
   - **Date range** (From / To)
   - **"Include past"** toggle to also show ended events
3. Click any event card to view its detail page.
4. Use the **"Share this event"** button to copy a link. The link includes social preview metadata (title, description, image) for sharing on social media.

## 4. RSVP and Get Your Ticket

1. Open an event page and click **"RSVP"**.
   - If you are not signed in, you will be redirected to the sign-in page and returned to the event page afterward.
2. Once confirmed, the event page shows **"You're going! 🎉"** along with your ticket:
   - A **QR code** with a unique ticket code
   - An **"Add to calendar"** button to save the event to your calendar
   - A **"Cancel RSVP"** button if you change your mind
3. If the event is at full capacity, you will see **"Join waitlist"** instead of RSVP. When a seat opens (someone cancels or the host increases capacity), the next person on the waitlist is automatically promoted.

## 5. View Your Tickets

1. Click **"My tickets"** in the navigation bar.
2. You will see all your upcoming tickets with QR codes, event details, and quick actions.
3. Switch to the **"Past"** tab to see tickets from events that have ended.

## 6. Check In Attendees at the Door

1. As a Host or Checker, go to the **Dashboard** and click **"Check-in"** next to the event.
   - Alternatively, open the check-in page from **"My events"**.
2. On the check-in page you will see:
   - **Live counters** for Going and Checked-in
   - A **search box** to find attendees by name, email, or ticket code
   - A list of all RSVPs with a **"Check in"** button next to each
3. Click **"Check in"** next to an attendee to mark them as arrived. The counter updates immediately.
   - If someone was just checked in by mistake, click **"Undo"** next to their name.
   - Already checked-in attendees show their check-in timestamp and cannot be checked in again.
4. Click **"Export CSV"** to download the attendance list with columns: name, email, RSVP status, and check-in time.

## 7. After the Event

### Leave Feedback
1. Once an event has ended, open its event page.
2. If you were a confirmed attendee, you will see a **Feedback** section with a **1–5 star rating** and an optional text comment.
3. Submit your rating. You can update it later.

### Upload Photos
1. On any event page (past or upcoming), scroll to the **Gallery** section.
2. Click **"Choose File"**, add an optional caption, and click **"Upload"**.
3. Uploads go to a moderation queue — the Host must approve them before they appear publicly.

### Report Content
1. Click the **"Report"** button on any event page or gallery photo.
2. Describe the issue and click **"Submit report"**.
3. Hosts can review reports in **Dashboard → Moderation → Reports** and choose to Hide, Resolve, or Dismiss each report.

---

## Roles

| Role | Access |
|------|--------|
| **Host** | Full management: create/edit events, approve gallery uploads, view dashboard, export CSVs, manage team members, moderate reports |
| **Checker** | Check-in page access only: scan/enter ticket codes, view live counters, undo last check-in |

Hosts can invite new team members from **Dashboard → Team** by selecting a role and generating a shareable invite link.

---

## Seeded Data

The deployed app includes the following seeded data for review:

- **1 Host**: "Test Community Host" (testuser_tc@example.com)
- **6 upcoming events** (including Public, Unlisted, Draft, and Published states)
- **2 past events** (showing "Ended" state with feedback and gallery sections)
- **6 RSVPs** on "Community Meetup Test Event" with 2 already checked in
- **1 Checker** team member assigned
