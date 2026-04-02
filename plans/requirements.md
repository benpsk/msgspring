# Task
- Build a "Request a Demo" full website using Figma as a full-stack application.
- Figma URL 
  - https://www.figma.com/design/6ucie9nrg9dqFMv2mjmdUF/Interview--Copy-?node-id=0-1&p=f&t=2RCD6vGuyLw6j4V0-0
  - You can copy images to the project and use same styles
- Stack: Next.js (App Router) + NestJS + PostgreSQL
- The form collects: Full Name, Email, Country, Message (optional).

## Requirements
1. Form submissions must be saved to PostgreSQL
2. The form must be resilient and secure
3. Proper validation
4. Best UI/ UX experience for the customer

## Frontend Checklist
- [ ] Rebuild the landing page from the Figma design in Next.js App Router
- [ ] Make the page responsive for desktop and mobile
- [ ] Replace starter metadata with project-specific title and description
- [ ] Bring Figma images/assets into the frontend and optimize them for production use
- [ ] Set up the final typography, spacing, colors, and visual styling to match the design direction
- [ ] Build an accessible "Request a Demo" form with proper labels, helper copy, and button states
- [ ] Add client-side validation for full name, email, country, and optional message
- [ ] Show useful loading, success, and error states during form submission
- [ ] Connect the form submission flow to the backend API
- [ ] Verify the frontend passes lint and production build

## Backend Checklist
- [x] Add PostgreSQL configuration and environment variable handling
- [x] Define the data model for contact requests: full name, email, country, message, timestamps
- [x] Create the persistence setup for storing submissions in PostgreSQL
- [x] Add a `POST` endpoint for request-demo submissions
- [x] Add server-side validation and input normalization
- [x] Add security protections for malformed payloads and unexpected input
- [x] Return clear API responses for success and validation failure cases
- [x] Add tests for the submission flow and validation rules
- [x] Confirm the backend builds and the relevant tests pass

## Cross-Cutting Checklist
- [ ] Align frontend and backend validation rules so the UX and API behavior match
- [ ] Document local setup, environment variables, database setup, and run commands in the README
- [ ] Add a short explanation of the implementation approach and tradeoffs
- [ ] If time allows, prepare AWS EC2 + GitHub Actions deployment notes for the bonus requirement

## Bonus
- Deploy on AWS [EC2 instance] with CI/CD (GitHub Actions)

## Docs
1. README with setup instructions
2. Brief explanation your approach
