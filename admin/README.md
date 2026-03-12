# Admin Panel - Appointment System

React + Vite + Firebase admin dashboard for managing the appointment system.

## Features
- Firebase Authentication for admin login
- Doctor Management (CRUD operations)
- User Management (view, delete)
- Appointments Management (view, update status)
- Feedback Management (view)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and add your Firebase credentials

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication -> Email/Password
3. Add your Firebase config to `.env` file
4. Add authorized admin emails in Firebase Authentication
