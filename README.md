# Infra Sentinel

BUILD A COMPLETE FRONTEND APPLICATION FROM THIS SPECIFICATION.

IMPORTANT:

You have NO other context about this project. Treat this entire document as the single source of truth.

Do not ask me to redefine the product structure unless something is technically impossible. Make sensible implementation decisions while strictly following the product, UX, architecture, and visual requirements below.

The backend will be developed separately by another team member using Python + FastAPI + PostgreSQL + PostGIS. Your responsibility is to build a polished, production-quality FRONTEND that can initially work with realistic mock data and later connect cleanly to the backend APIs.

============================================================

1. PRODUCT

============================================================

Product Name:

InfraSetu

Product Type:

AI-Powered Infrastructure Lifecycle & Safety Management Platform

Tagline:

Monitor. Predict. Automate. Verify.

Supporting statement:

From infrastructure development to maintenance — every asset has a digital life.

InfraSetu is a unified platform for monitoring and managing public infrastructure such as:

- Roads

- Highways

- Bridges

- Flyovers

- Tunnels

- Culverts

The system combines:

- Satellite / remote-sensing data

- GIS

- AI/computer vision results

- Citizen reports

- Infrastructure history

- Risk assessment

- Automated work orders

- Contractor workflows

- AI repair verification

- Audit trails

The core lifecycle is:

SATELLITE / GIS

        ↓

INFRASTRUCTURE ASSET

        ↓

AI DETECTION

        ↓

RISK ASSESSMENT

        ↓

AUTOMATED DECISION

        ↓

WORK ORDER

        ↓

CONTRACTOR

        ↓

REPAIR

        ↓

AI VERIFICATION

        ↓

AUDIT TRAIL

        ↓

DIGITAL INFRASTRUCTURE PASSPORT UPDATED

============================================================

2. CORE DIFFERENTIATOR

============================================================

This is NOT simply a pothole detection application.

The core concept is complete infrastructure lifecycle management.

Every infrastructure asset has a Digital Infrastructure Passport containing:

- Asset identity

- Location

- Construction information

- Contractor

- Project cost

- Current health

- Risk score

- AI detections

- Satellite development history

- Citizen complaints

- Maintenance history

- Work orders

- Repair verification

- Audit history

The system should communicate:

"The platform continuously monitors infrastructure, converts evidence into risk intelligence, automates routine maintenance workflows through transparent rules, verifies repair outcomes, and maintains a complete lifecycle history for every infrastructure asset."

============================================================

3. THREE USER ROLES

============================================================

ROLE 1:

GOVERNMENT / ADMIN

Primary desktop web interface.

Capabilities:

- Infrastructure overview

- GIS map

- Satellite intelligence

- Infrastructure health

- Risk monitoring

- Critical alerts

- Citizen complaints

- Work orders

- Contractor performance

- Analytics

- Digital Infrastructure Passport

- Audit trail

ROLE 2:

CITIZEN

Mobile-first interface.

Capabilities:

- Report infrastructure issue

- Upload/capture image

- Automatically capture location

- Track submitted report

- View nearby infrastructure

- Receive notifications

ROLE 3:

CONTRACTOR

Mobile/tablet-friendly interface.

Capabilities:

- View assigned work orders

- View infrastructure location

- View issue details

- Start repair

- Upload before evidence

- Upload after evidence

- Submit repair for AI verification

- View verification result

- Track work order status

============================================================

4. VISUAL DESIGN DIRECTION

============================================================

The attached Maharashtra Government website screenshot is ONLY a visual reference.

Use it for inspiration regarding:

- Deep navy government header

- White navigation areas

- Restrained blue accents

- Formal institutional appearance

- Strong information hierarchy

- Government/public-service feel

- Accessibility-oriented design

DO NOT COPY:

- Exact layout

- Exact images

- Government logos

- Government text

- Exact branding

- Exact navigation

- Exact content

The application must be a completely original product called InfraSetu.

Overall visual style:

MODERN GOVERNMENT + GIS INTELLIGENCE + AI COMMAND CENTER

The interface must feel:

- Trustworthy

- Institutional

- Modern

- Clean

- Technical

- Serious

- Accessible

It must NOT feel:

- Like a generic SaaS dashboard

- Like a startup template

- Like a college project

- Like a cryptocurrency application

- Like a gaming application

- Like a cyberpunk interface

============================================================

5. COLOR SYSTEM

============================================================

IMPORTANT:

DO NOT USE PURPLE AS THE PRIMARY COLOR.

DO NOT USE RED AS THE PRIMARY COLOR.

DO NOT USE NEON COLORS.

DO NOT USE LARGE GRADIENTS.

Use a restrained government/public infrastructure color system.

PRIMARY DEEP NAVY:

#062B52

SECONDARY NAVY:

#0B3A6E

PRIMARY BLUE:

#1267C7

LIGHT BLUE:

#EAF3FC

MAIN BACKGROUND:

#F6F8FB

WHITE:

#FFFFFF

BORDER:

#D9E2EC

PRIMARY TEXT:

#172B3A

SECONDARY TEXT:

#526579

MUTED TEXT:

#718096

SUBTLE GOLD / HERITAGE ACCENT:

#C99A3D

Use gold very sparingly for:

- Small accents

- Section highlights

- Infrastructure insignia

- Metadata

Do not make gold the main button color.

STATUS COLORS:

HEALTHY:

#16835B

MODERATE:

#D18A00

HIGH:

#D65A00

CRITICAL:

#B42318

IMPORTANT:

Red is ONLY for actual critical/error/danger status.

Never use red for:

- Header

- Main navigation

- Primary button

- Large decorative areas

Avoid:

- Purple-heavy interfaces

- Violet gradients

- Pink/purple SaaS themes

- Bright red UI

- Neon green

- Neon blue

- Rainbow dashboards

============================================================

6. TYPOGRAPHY

============================================================

Primary font:

Inter

Indian language fallback:

Noto Sans Devanagari

Use:

Inter, Noto Sans Devanagari, sans-serif

Typography:

Page title:

32-36px

Section title:

20-24px

Card title:

16-18px

Body:

14-15px

Metadata:

12-13px

Do not use huge marketing typography inside the dashboard.

============================================================

7. FRONTEND TECHNOLOGY

============================================================

Use:

React

TypeScript

Vite if appropriate

Tailwind CSS

shadcn/ui

Radix primitives where useful

Lucide icons

Leaflet

OpenStreetMap

Recharts

Do not introduce unnecessary UI libraries.

Maps:

Leaflet + OpenStreetMap.

Charts:

Recharts.

Use a clean reusable component architecture.

============================================================

8. API ARCHITECTURE

============================================================

Backend will use:

Python

FastAPI

PostgreSQL

PostGIS

JWT

Frontend must be backend-ready.

Create:

src/

  api/

  types/

  hooks/

  config/

  components/

  pages/

  data/

  utils/

API files:

src/api/auth.ts

src/api/assets.ts

src/api/complaints.ts

src/api/workOrders.ts

src/api/contractors.ts

src/api/ai.ts

src/api/satellite.ts

src/api/analytics.ts

src/api/audit.ts

Do NOT scatter fetch calls throughout components.

Create a centralized API layer.

============================================================

9. MOCK DATA MODE

============================================================

The frontend MUST work before backend integration.

Create a mock mode controlled by:

VITE_USE_MOCK_DATA=true

When mock mode is active:

- Dashboard works

- GIS map works

- Assets exist

- Complaints exist

- AI detections exist

- Risk scores exist

- Work orders exist

- Contractors exist

- Satellite timeline exists

- Charts work

- Audit logs work

- Citizen workflow works

- Contractor workflow works

When mock mode is disabled:

Frontend connects to FastAPI.

Do NOT require the backend for the UI to demonstrate the complete product.

============================================================

10. GLOBAL APPLICATION LAYOUT

============================================================

Government/admin desktop layout:

TOP HEADER

    ↓

LEFT SIDEBAR + MAIN CONTENT

Desktop:

---------------------------------------------------------

TOP HEADER

---------------------------------------------------------

SIDEBAR        MAIN CONTENT

               MAIN CONTENT

               MAIN CONTENT

---------------------------------------------------------

The sidebar should be dark navy.

The content area should use #F6F8FB.

Cards should be white.

============================================================

11. TOP HEADER

============================================================

Header background:

#062B52

Left:

InfraSetu logo/icon

InfraSetu

Infrastructure Intelligence Platform

Right:

Search

Notifications

Help

Language

User profile

User:

Government Administrator

Government Department

Dropdown

Keep header compact and professional.

Do not overcrowd it.

============================================================

12. SIDEBAR

============================================================

Navigation:

Dashboard

Infrastructure

GIS & Map

Satellite Intelligence

Risk & Alerts

Complaints

Work Orders

Contractors

Analytics

Audit Trail

Bottom:

Settings

Help

Use Lucide icons.

Sidebar should:

- Expand/collapse

- Animate smoothly

- Preserve active state

- Work on tablet

- Become a drawer on mobile

Expanded:

Icon + text

Collapsed:

Icon only

============================================================

13. ROUTES

============================================================

Create these routes:

/login

/admin/dashboard

/admin/assets

/admin/assets/:id

/admin/map

/admin/satellite

/admin/alerts

/admin/complaints

/admin/work-orders

/admin/work-orders/:id

/admin/contractors

/admin/contractors/:id

/admin/analytics

/admin/audit

/citizen

/citizen/report

/citizen/reports

/citizen/reports/:id

/contractor

/contractor/work-orders

/contractor/work-orders/:id

/contractor/work-orders/:id/repair

============================================================

14. LOGIN PAGE

============================================================

Create a clean enterprise/government login.

Centered login panel.

Logo:

InfraSetu

Subtitle:

Infrastructure Intelligence Platform

Fields:

User ID / Email

Password

Button:

LOGIN

Links:

Forgot Password?

Keep it minimal.

No gradients.

No flashy animations.

============================================================

15. GOVERNMENT DASHBOARD

============================================================

Route:

/admin/dashboard

This is the main hero screen of the entire product.

Header:

Infrastructure Command Center

Subtitle:

Maharashtra • Live Infrastructure Overview

KPI CARDS:

1. Total Infrastructure Assets

12,450

+2.4%

2. Healthy

8,420

67.6%

3. High Risk

890

7.1%

4. Critical

340

2.7%

5. Active Work Orders

127

6. Pending Verification

21

Use clean white cards.

Each card should contain:

- Label

- Large number

- Supporting information

- Small trend indicator where appropriate

============================================================

16. DASHBOARD MAIN CONTENT

============================================================

Use a large two-column section.

LEFT:

Infrastructure Risk Map

RIGHT:

Critical Alerts

CRITICAL ALERTS:

Road MH-001

Risk 87

Pothole detected

12 min ago

Bridge MH-021

Risk 91

Structural concern

32 min ago

Road MH-032

Risk 78

Waterlogging

1 hour ago

Below:

Infrastructure Health Distribution

Use Recharts.

Categories:

Healthy

Moderate

High

Critical

Also:

Work Order Trend

Show:

Reported

Created

Completed

Verified

Quick actions:

+ Add Infrastructure

Review Critical Assets

View Live Map

View Work Orders

View Complaints

============================================================

17. GIS MAP PAGE

============================================================

Route:

/admin/map

This is a hero feature.

Use Leaflet + OpenStreetMap.

Large map.

Markers:

Green = Healthy

Yellow = Moderate

Orange = High

Red = Critical

Cluster markers when zoomed out.

Do not use giant markers.

Map filters:

Infrastructure Type

All / Road / Bridge / Flyover / Tunnel / Culvert

Risk Level:

Healthy

Moderate

High

Critical

Layers:

Infrastructure

Risk

Complaints

Work Orders

Satellite

Environmental Risk

When a marker is clicked:

Show popup:

ROAD-MH-001

Mumbai, Maharashtra

Health:

42 / 100

Risk:

87 / 100

Issue:

Pothole

AI Confidence:

94%

Status:

Work Order Active

Buttons:

View Asset

View Work Order

============================================================

18. INFRASTRUCTURE PAGE

============================================================

Route:

/admin/assets

Title:

Infrastructure Assets

Subtitle:

Monitor and manage public infrastructure assets.

Search:

Search asset ID / location

Filters:

Asset Type

District

Health

Risk

Status

Contractor

Button:

+ Add Infrastructure

Table columns:

Asset ID

Type

Location

Health

Risk

Last Inspection

Status

Action

Example:

ROAD-MH-001

Road

Mumbai

42

87 Critical

19 Aug 2026

Repair Active

View

============================================================

19. DIGITAL INFRASTRUCTURE PASSPORT

============================================================

Route:

/admin/assets/:id

This is a major differentiating feature.

Header:

ROAD-MH-001

Mumbai, Maharashtra

CRITICAL

Risk:

87

Health:

42

Sections:

OVERVIEW

Asset Type:

Road

Construction Year:

2023

Length:

4.2 km

Project Cost:

₹8.4 Cr

Contractor:

Apex Infrastructure

CURRENT HEALTH

Large:

42 / 100

AI FINDINGS:

Pothole

94%

Crack

81%

Waterlogging

42%

SATELLITE DEVELOPMENT HISTORY

2022:

Existing road

2023:

Construction detected

2024:

Road completed

2025:

Surrounding development

2026:

Current observation

COMPLAINTS:

14 total

3 unresolved

11 resolved

MAINTENANCE HISTORY:

Inspection

Repair

Inspection

New damage

WORK ORDERS:

Show associated work orders.

AUDIT HISTORY:

Show chronological system activity.

============================================================

20. SATELLITE INTELLIGENCE

============================================================

Route:

/admin/satellite

Title:

Satellite Intelligence

Subtitle:

Monitor infrastructure development and large-scale environmental change.

Main layout:

LEFT:

Satellite map/image

RIGHT:

Selected Asset panel

Selected asset:

ROAD-MH-001

Development Status:

Completed

Change Detection:

Moderate

Environmental Risk:

High

Last Observation:

19 Aug 2026

Satellite timeline:

2022

Existing road

2023

Construction detected

2024

Road completed

2025

Surrounding development

2026

Current observation

IMPORTANT:

Do NOT claim fake imagery is real satellite data.

If real satellite imagery is not connected:

Display:

DEMO DATA

Design the UI so real satellite APIs/layers can be connected later.

============================================================

21. RISK & ALERTS

============================================================

Route:

/admin/alerts

Tabs:

All

Critical

High

Medium

Resolved

Alert card:

CRITICAL

ROAD-MH-001

Risk Score:

87

Pothole detected

AI Confidence:

94%

Recommended Action:

Urgent maintenance

Buttons:

View Asset

View Work Order

============================================================

22. COMPLAINTS

============================================================

Route:

/admin/complaints

Table:

Complaint ID

Location

Issue

Submitted By

AI Status

Risk

Status

Date

Statuses:

Reported

AI Analysed

Risk Assigned

Work Order Created

Resolved

Rejected

============================================================

23. WORK ORDERS

============================================================

Route:

/admin/work-orders

KPI row:

Total

Pending

In Progress

Verification

Completed

Table:

Work Order ID

Asset

Priority

Contractor

Status

Created

Deadline

Action

Example:

WO-1024

ROAD-MH-001

Critical

Apex Infrastructure

In Progress

============================================================

24. WORK ORDER DETAILS

============================================================

Route:

/admin/work-orders/:id

Show:

WO-1024

ROAD-MH-001

CRITICAL

Pothole

Risk:

87

Timeline:

✓ Issue Reported

✓ AI Analysed

✓ Risk Calculated

✓ Work Order Generated

✓ Contractor Assigned

● Repair In Progress

○ AI Verification

○ Completed

This timeline is extremely important.

It visually demonstrates automation.

============================================================

25. CONTRACTORS

============================================================

Route:

/admin/contractors

Table:

Contractor

Active Orders

Completed

Average Completion

Verification Rate

Performance

Example:

Apex Infrastructure

4

83

91%

94%

91

Contractor detail:

Contractor Profile

Apex Infrastructure

Eligibility:

ACTIVE

Performance Score:

91

Work Orders:

87

AI Verification:

94%

Repeat Damage:

8%

============================================================

26. ANALYTICS

============================================================

Route:

/admin/analytics

Create charts for:

Infrastructure Health Trend

Risk by District

Work Orders Over Time

Repair Verification Rate

Average Repair Time

Contractor Performance

Maintenance Expenditure

Use Recharts.

Keep charts restrained.

Do not use random colors.

Use the established blue/navy palette and status colors only when meaningful.

============================================================

27. AUDIT TRAIL

============================================================

Route:

/admin/audit

This is a critical feature.

Title:

System Audit Trail

Subtitle:

Transparent record of infrastructure decisions and actions.

Table:

Timestamp

Event

Asset

Actor

Action

System Decision

Example:

10:33

Risk Calculated

ROAD-MH-001

AUTOMATED SYSTEM

Risk = 87

10:34

Work Order Created

ROAD-MH-001

AUTOMATED SYSTEM

WO-1024

10:35

Contractor Assigned

ROAD-MH-001

SYSTEM

Apex Infrastructure

============================================================

28. AUDIT DETAIL

============================================================

Click an audit event.

Show:

EVENT #A10231

Timestamp:

19 Aug 2026 10:33:21

Asset:

ROAD-MH-001

Actor:

AUTOMATED SYSTEM

Event:

Risk Assessment

Input:

AI Severity:

91

Traffic:

High

Asset Age:

3 years

Output:

Risk:

87

Policy:

CRITICAL_RISK_V2

Action:

Urgent Work Order Created

This should make automated decisions explainable.

============================================================

29. CITIZEN APPLICATION

============================================================

Route:

/citizen

Mobile-first.

Bottom navigation:

Home

Report

My Reports

Map

Profile

HOME:

Good morning

Help keep your infrastructure safe.

Large primary button:

REPORT AN ISSUE

Nearby Infrastructure:

ROAD-MH-002

Healthy

ROAD-MH-003

High Risk

ROAD-MH-001

Critical

Your Reports:

3 Active

8 Resolved

============================================================

30. CITIZEN REPORT FLOW

============================================================

Route:

/citizen/report

Step 1:

Upload/capture image.

Step 2:

Automatically capture location.

Step 3:

Select issue type.

Options:

Pothole

Crack

Waterlogging

Damaged barrier

Road surface damage

Other

Step 4:

Description

Step 5:

Preview

Step 6:

Submit

After submission:

Your report has been submitted.

Report ID:

CIT-10294

AI analysis will begin automatically.

============================================================

31. CITIZEN TRACKING

============================================================

Route:

/citizen/reports/:id

Show:

CIT-10294

ROAD-MH-001

Timeline:

✓ Report received

✓ AI analysed

✓ Risk calculated

✓ Work order created

● Repair in progress

○ AI verification

============================================================

32. CONTRACTOR APPLICATION

============================================================

Route:

/contractor

Mobile/tablet friendly.

Dashboard:

Good morning,

Apex Infrastructure

Active Work Orders:

4

Critical:

1

High:

2

Normal:

1

============================================================

33. CONTRACTOR WORK ORDER

============================================================

Show:

WO-1024

ROAD-MH-001

CRITICAL

Pothole

Risk:

87

Location:

[Open Map]

Required Action:

Road surface repair

Button:

START WORK

============================================================

34. REPAIR EVIDENCE

============================================================

Route:

/contractor/work-orders/:id/repair

Show:

BEFORE REPAIR

Upload Photo

AFTER REPAIR

Upload Photo

Additional Notes

Button:

SUBMIT FOR AI VERIFICATION

After submission:

AI VERIFICATION

Analyzing evidence...

Detecting repaired area...

Comparing before/after...

Then:

Repair Verified ✓

Confidence:

93%

Work order submitted for completion.

============================================================

35. NOTIFICATIONS

============================================================

Notification dropdown.

Examples:

Critical infrastructure detected

Road MH-001

Work order approaching deadline

WO-1024

Repair verified

WO-1018

Satellite observation updated

Road MH-004

============================================================

36. LANGUAGE SUPPORT

============================================================

Header language selector:

English

मराठी

हिंदी

English is the primary functional language.

Structure the application so translations can be added later.

Do not manually translate every page at this stage.

============================================================

37. ACCESSIBILITY

============================================================

Must include:

- Keyboard navigation

- Visible focus states

- Accessible labels

- High contrast

- Proper button labels

- Tooltips

- Semantic HTML

- Screen-reader friendly controls

Never communicate status through color alone.

For example:

GOOD:

Red icon + "Critical"

BAD:

Only red icon.

============================================================

38. RESPONSIVE DESIGN

============================================================

Desktop optimized for:

1440x900

Also support:

1280x720

1920x1080

Tablet:

Collapsible sidebar.

Mobile:

Citizen and contractor applications must be mobile-first.

Government dashboard should remain usable on tablet.

============================================================

39. UX RULES

============================================================

Every page must clearly answer:

"Where am I?"

Use:

Page title

Subtitle

Breadcrumbs where appropriate

Every action must provide feedback.

Example:

Submitting...

Submitted ✓

Use skeleton loading.

Do not show blank screens.

Every page needs:

Loading state

Empty state

Error state

Destructive actions require confirmation.

Avoid unnecessary modals.

Use drawers or inline details when possible.

============================================================

40. LOADING STATES

============================================================

Use skeleton loaders.

For AI:

AI ANALYSIS

Analyzing infrastructure image...

Detecting damage

████████░░░░

Calculating severity...

Do not use a spinner everywhere.

============================================================

41. EMPTY STATES

============================================================

Example:

No critical alerts

All monitored infrastructure is currently within

the configured risk threshold.

[View Infrastructure]

============================================================

42. ERROR STATES

============================================================

Example:

Unable to load infrastructure data.

Please try again.

[Retry]

Never show raw backend errors.

============================================================

43. BUTTON SYSTEM

============================================================

PRIMARY:

Blue:

[ Create Work Order ]

[ Submit Report ]

[ Start Work ]

[ Login ]

SECONDARY:

White with navy border:

[ View Details ]

TERTIARY:

Text:

View All →

DANGER:

Only for destructive operations:

[ Delete Asset ]

Use critical red only here.

============================================================

44. CARD DESIGN

============================================================

Cards:

Background:

#FFFFFF

Border:

1px solid #D9E2EC

Border radius:

10-14px

Shadow:

Very subtle

Do not use huge floating cards.

Do not make every element a card.

============================================================

45. ICONS

============================================================

Use Lucide icons consistently.

Suggested icons:

LayoutDashboard

Map

Building2

Satellite

AlertTriangle

ClipboardList

Wrench

Users

BarChart3

FileClock

Bell

Settings

Search

MapPin

ShieldCheck

Activity

Clock

Upload

Camera

CheckCircle

XCircle

Do not mix random icon libraries.

============================================================

46. ANIMATION

============================================================

Animations should be subtle.

Use 150-250ms.

Allowed:

- Sidebar transition

- Dropdown

- Drawer

- Modal

- Hover

- Page transition

- Progress state

Do NOT use:

- Bouncing elements

- Excessive zooming

- Spinning decorative elements

- Animated backgrounds

- Neon effects

============================================================

47. COMPONENT ARCHITECTURE

============================================================

Use reusable components.

Suggested structure:

src/

  components/

    layout/

      AppShell

      Header

      Sidebar

      MobileNav

    dashboard/

      KPICard

      RiskMap

      AlertPanel

      HealthChart

      WorkOrderChart

    infrastructure/

      AssetTable

      AssetCard

      AssetPassport

      LifecycleTimeline

    workorders/

      WorkOrderTable

      WorkOrderTimeline

      WorkOrderStatus

    maps/

      InfrastructureMap

      MapFilters

      AssetPopup

    ui/

      Button

      Card

      Badge

      Modal

      Drawer

      Table

      Skeleton

      EmptyState

      ErrorState

  pages/

  api/

  hooks/

  types/

  data/

  utils/

  config/

============================================================

48. FRONTEND DATA TYPES

============================================================

Asset:

id

assetCode

type

name

location

latitude

longitude

district

constructionYear

contractorId

projectCost

healthScore

riskScore

status

lastInspection

Complaint:

id

assetId

citizenId

imageUrl

latitude

longitude

issueType

description

aiStatus

riskScore

status

createdAt

AI Detection:

id

assetId

imageUrl

detectionType

confidence

severity

boundingBoxes

createdAt

Risk Score:

assetId

score

level

factors

calculatedAt

Work Order:

id

assetId

complaintId

contractorId

priority

status

createdAt

deadline

beforeImage

afterImage

verificationStatus

Contractor:

id

name

licenseStatus

district

activeOrders

completedOrders

performanceScore

verificationRate

Audit Log:

id

timestamp

assetId

actorType

actorId

eventType

description

metadata

============================================================

49. EXPECTED BACKEND API CONTRACT

============================================================

Authentication:

POST /api/auth/login

GET /api/auth/me

POST /api/auth/logout

Assets:

GET /api/assets

GET /api/assets/{id}

POST /api/assets

PUT /api/assets/{id}

Complaints:

GET /api/complaints

GET /api/complaints/{id}

POST /api/complaints

AI:

POST /api/ai/analyze

GET /api/ai/detections/{assetId}

Risk:

GET /api/risk/{assetId}

GET /api/risk/critical

Work Orders:

GET /api/work-orders

GET /api/work-orders/{id}

POST /api/work-orders

PUT /api/work-orders/{id}

Contractors:

GET /api/contractors

GET /api/contractors/{id}

Satellite:

GET /api/satellite/{assetId}

GET /api/satellite/{assetId}/history

Analytics:

GET /api/analytics/overview

GET /api/analytics/health

GET /api/analytics/risk

GET /api/analytics/work-orders

Audit:

GET /api/audit

GET /api/audit/{id}

============================================================

50. DEMO DATA

============================================================

Use realistic but fictional Indian data.

Assets:

ROAD-MH-001

Mumbai

ROAD-MH-002

Thane

ROAD-MH-003

Pune

BRIDGE-MH-014

Nashik

FLYOVER-MH-007

Mumbai

Contractors:

Apex Infrastructure

Maharashtra RoadWorks

UrbanLink Projects

Shivam Infra Solutions

Do not use real contractor information.

============================================================

51. PRIMARY DEMO STORY

============================================================

The UI must support this complete story:

1. Citizen reports pothole.

2. AI analyzes image.

3. AI detects pothole with confidence.

4. Risk engine calculates risk.

5. Risk becomes CRITICAL.

6. Automated workflow creates work order.

7. Contractor receives work order.

8. Contractor starts work.

9. Contractor uploads before and after evidence.

10. AI verifies repair.

11. Work order becomes completed.

12. Infrastructure health updates.

13. Digital Infrastructure Passport updates.

14. Audit Trail records every important action.

This entire workflow must be demonstrable in MOCK MODE.

Use buttons/actions in mock mode to simulate transitions.

Example:

Citizen submits report

↓

Mock AI result generated

↓

Risk updated

↓

Work order created

↓

Contractor dashboard updates

↓

Repair submitted

↓

AI verification shown

↓

Asset status updated

↓

Audit entry created

============================================================

52. IMPORTANT SATELLITE REQUIREMENT

============================================================

Satellite data replaces the originally considered drone workflow.

The application should be designed around satellite/remote-sensing monitoring.

Use satellite intelligence for:

- Infrastructure development timeline

- Large-scale change detection

- Road development monitoring

- Surrounding land-use change

- Environmental risk context

- Infrastructure observation history

Do not build drone-specific UI.

Do not include drone management screens.

============================================================

53. AUTOMATION / HUMAN INTERVENTION

============================================================

The product's philosophy is to minimize unnecessary manual intervention.

The UI should therefore visually show:

SYSTEM DETECTION

↓

SYSTEM RISK ASSESSMENT

↓

POLICY-BASED AUTOMATION

↓

WORK ORDER

↓

CONTRACTOR

↓

AI VERIFICATION

However:

Do not claim that every government decision can legally or practically be fully automated.

The interface should describe this as:

"Automated workflow"

"Rule-based decision"

"AI-assisted assessment"

"System-generated work order"

"Exception requiring authorized review"

Use an exception/review mechanism where appropriate.

This is important for realistic government deployment.

============================================================

54. TRANSPARENCY / ANTI-BRIBERY UX

============================================================

The system should reduce discretionary manual processing through:

- Automated workflow

- Rule-based prioritization

- Transparent risk scoring

- System-generated work orders

- Digital timestamps

- Immutable-style audit history

- AI repair verification

- Contractor performance history

Do not make unsupported claims such as:

"100% corruption-proof"

Instead communicate:

"Reduced discretionary intervention"

"Transparent workflow"

"Traceable decisions"

"Automated assignment"

"Complete audit history"

============================================================

55. MOST IMPORTANT SCREENS

============================================================

Prioritize these screens if development time is limited:

1. Government Command Dashboard

2. GIS + Infrastructure Map

3. Digital Infrastructure Passport

4. Satellite Intelligence

5. Citizen Report

6. Contractor Work Order

7. AI Repair Verification

8. Audit Trail

============================================================

56. WHAT NOT TO BUILD

============================================================

Do NOT waste development time on:

- Payment gateway

- Real government authentication

- Blockchain

- Cryptocurrency

- Drone management

- IoT management

- Complex ML training interface

- Full national-scale GIS infrastructure

- Excessive citizen social features

- Complex messaging

- Unnecessary admin pages

- Excessive animations

- Huge landing page

- Generic AI chatbot

Focus on the infrastructure lifecycle.

============================================================

57. LANDING PAGE

============================================================

If a public landing page is included:

Hero:

SMARTER INFRASTRUCTURE.

SAFER COMMUNITIES.

Subtitle:

AI-powered infrastructure monitoring, risk assessment and automated maintenance management.

Buttons:

[ Explore Platform ]

[ Report an Issue ]

Feature section:

Satellite Intelligence

AI Inspection

Predictive Risk

Automated Workflows

AI Verification

Digital Asset Passport

Keep it professional and restrained.

============================================================

58. PERFORMANCE

============================================================

The frontend should:

- Lazy-load large pages

- Lazy-load maps

- Debounce search

- Paginate large tables

- Use skeleton loaders

- Compress image previews

- Avoid unnecessary API calls

- Cluster map markers

- Avoid rendering thousands of markers simultaneously

============================================================

59. FINAL DESIGN TARGET

============================================================

The final application should visually feel like:

Maharashtra Government institutional seriousness

+

Modern GIS command center

+

AI infrastructure intelligence platform

+

Clean enterprise UX

Visual hierarchy:

NAVY HEADER

        ↓

DARK NAVY SIDEBAR

        ↓

LIGHT GREY CONTENT BACKGROUND

        ↓

WHITE CONTENT CARDS

        ↓

BLUE INTERACTION

        ↓

GREEN/YELLOW/ORANGE/RED ONLY FOR MEANINGFUL STATUS

============================================================

60. FINAL IMPLEMENTATION INSTRUCTION

============================================================

Do not create a generic dashboard template.

Build a cohesive application.

Every page must belong to the same product.

Use reusable components.

Use realistic demo data.

Make all major interactions functional in mock mode.

Make the UI ready for FastAPI integration.

Make the GIS map functional with demo markers.

Make the citizen → AI → risk → work order → contractor → verification → audit workflow demonstrable.

Make the Digital Infrastructure Passport a major visual feature.

Make Satellite Intelligence a major visual feature.

Make the Audit Trail a major visual feature.

Use the established color system consistently.

DO NOT USE PURPLE.

DO NOT USE RED AS THE PRIMARY THEME.

DO NOT USE NEON COLORS.

DO NOT USE GENERIC AI-GENERATED DASHBOARD STYLING.

DO NOT OVERUSE CARDS.

DO NOT OVERUSE GRADIENTS.

DO NOT COPY THE ATTACHED GOVERNMENT WEBSITE.

Use the attached image ONLY as visual inspiration for institutional color balance and public-service design.

The final product must look like a serious government-grade infrastructure command platform suitable for an internal hackathon demonstration.

The core visual story must be:

SATELLITE

↓

INFRASTRUCTURE

↓

AI DETECTION

↓

RISK

↓

AUTOMATED WORKFLOW

↓

WORK ORDER

↓

CONTRACTOR

↓

AI VERIFICATION

↓

AUDIT

↓

DIGITAL PASSPORT UPDATED

Build this now as a polished, responsive React/TypeScript frontend with mock data and clean backend integration architecture.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55bb7bd9-5d71-426e-b113-cfa16786e687).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
