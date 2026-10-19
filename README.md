# Lithilexicon - Ληθιλεξικόν

🌐 Visit the live app: https://lithilexicon.gr

Ληθιλεξικόν is an online dictionary-like platform built with React and Firebase that aims to collect and preserve old, rare, or forgotten Greek words and phrases. Users can explore the collection, submit their own entries, and engage with the growing database of linguistic treasures.

## Local development

Use Node.js 20 and install the locked dependencies:

```bash
npm ci
npm start
```

Open http://localhost:3000. Stop the server with Ctrl+C.

The local file `src/utils/firebase.js` is ignored by Git and must export `auth`
and `db` using the existing Firebase project configuration. This checkout has
been configured locally. Authentication and dictionary data require internet access.

## Core Features

1. User Accounts: Visitors can create an account to track and manage their submissions.
2. Phrase Submission System: Users can submit a phrase and its meaning. Before final submission, the app checks the Firestore database for similar entries and warns the user if any are found.
3. Moderation Workflow: Submissions are not published immediately. Admins must review and approve (or reject) each new entry to maintain content quality.
4. User Dashboard: Authenticated users can view all the phrases they have submitted and their moderation status.
5. Alphabetical Navigation & Search: The app includes an A–Ω navigation menu and search functionality to make browsing the dictionary more intuitive.

## Tech Stack

1. Frontend: React (Create React App)
2. Backend & Auth: Firebase (Auth, Firestore)
3. PDF Generation (for ESG module): pdf-lib and custom utilities
4. Hosting: Firebase Hosting
5. Admin Logic: Role-based access with Firestore rule-based permissions

## Motivation & Next Steps

The project began as a collaborative effort but faced limited participation. As a result, the phrase database remains small. Going forward, I plan to:

1. Improve the visual design and user experience to attract more visitors.
2. Add user profile customization (e.g., bio and profile picture).
3. Introduce community features like commenting and voting.
4. Add automated similarity checks and duplicate detection on the client.
5. Open the project to community contributions via GitHub.

## Open Source
This project is now public on GitHub to allow others to follow its development, suggest improvements, and contribute if they’re interested in digital preservation, language, or React/Firebase applications.