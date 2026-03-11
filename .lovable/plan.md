

# Civic Issue Reporting App - Implementation Plan

## Important Note
Lovable projects use TypeScript by default and this cannot be changed. The implementation will use minimal TypeScript (simple, JS-like code in .tsx files) to keep things straightforward.

This will be a **frontend-only prototype** with mock data and localStorage for persistence. No backend/database — can be added later.

## Architecture

**Data Layer**: Mock data store using React Context + localStorage for persistence across sessions. Categories: Road Damage, Potholes, Garbage, Streetlights, Other.

**Map**: Leaflet (free, no API key needed) via CDN/npm for the map view and location picker.

**Auth**: Simple mock auth — users pick a name to "log in", admin accessed via hardcoded credentials (demo only). Stored in localStorage.

**Routing**: React Router (already installed) with 7 routes.

## File Structure

```
src/
  contexts/
    ComplaintContext.tsx    — Global state: complaints CRUD, filters
    AuthContext.tsx         — Mock auth state
  data/
    mockComplaints.ts      — Seed data (10-15 sample complaints)
  components/
    Layout.tsx             — Navbar + footer wrapper
    Navbar.tsx             — Navigation links, auth status
    ComplaintCard.tsx       — Card for list view
    StatusBadge.tsx        — Colored badge component
    StatusTimeline.tsx     — Vertical timeline for status history
    MapMarker.tsx          — Custom map marker popup
    LocationPicker.tsx     — Leaflet map for picking location
    ImageUpload.tsx        — File input with preview
    ComplaintFilters.tsx   — Search + status + category filters
  pages/
    Home.tsx               — Landing page with stats + CTA
    ReportIssue.tsx        — Report form with all fields
    ComplaintList.tsx      — Filterable card/table list
    MapView.tsx            — Leaflet map with all complaints
    ComplaintDetails.tsx   — Full details + timeline
    MyComplaints.tsx       — User's complaints dashboard
    AdminDashboard.tsx     — Admin: manage + update statuses
    Login.tsx              — Simple mock login
```

## Pages & Features

1. **Home** — Hero section, stats cards (total/pending/resolved), quick links to report or browse.

2. **Report Issue** — Form with title, description, category select, image upload (base64 preview), Leaflet location picker. Saves to context/localStorage.

3. **Complaint List** — Card grid with search bar, status filter dropdown, category filter. Each card shows image thumbnail, title, location, date, status badge.

4. **Map View** — Full-page Leaflet map. Markers for each complaint with popups showing title, image, status, date. Click popup links to details page.

5. **Complaint Details** — Full info display + vertical status timeline (Submitted → Under Review → In Progress → Resolved) with dates.

6. **My Complaints** — Filtered view of current user's complaints with timeline progress indicators.

7. **Admin Dashboard** — Table of all complaints with filters. Click to expand/view details. Status update dropdown + notes textarea. Only accessible when logged in as admin.

## Dependencies to Add
- **leaflet** + **react-leaflet** — Map components

## Design Approach
- Clean modern UI with Tailwind
- Color scheme: Blue primary for civic/government feel
- Responsive: mobile-first grid layouts
- Existing shadcn/ui components (Button, Card, Badge, Input, Select, Tabs, Dialog) used throughout

## Implementation Order
1. Data layer (contexts, mock data)
2. Layout + Navbar + Auth
3. Home page
4. Report Issue page (form + location picker + image upload)
5. Complaint List page with filters
6. Complaint Details + timeline
7. Map View page
8. My Complaints dashboard
9. Admin Dashboard
10. Update routes in App.tsx

