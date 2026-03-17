# Feedback Service

The Feedback Service manages user feedback and ratings for doctors in the Appointment System.

## Functionality

- Submit feedback for completed appointments
- Rate doctors (1-5 stars)
- View feedback by doctor or user
- Calculate average doctor ratings
- Receive appointment completion notifications

## Endpoints

### Feedback Management
- `POST /feedback` - Submit new feedback
- `GET /feedback` - List all feedback
- `GET /feedback/:id` - Get feedback by ID
- `PUT /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback

### Filter & Analytics
- `GET /feedback/doctor/:doctorId` - Get feedback for a specific doctor
- `GET /feedback/user/:userId` - Get feedback submitted by a user
- `GET /feedback/doctor/:doctorId/average` - Get average rating for doctor

### Integration
- `POST /feedback/notify-appointment` - Called by Appointment Service when appointment completes

## Database

MongoDB collection: `feedbacks`

Fields:
- `_id` - MongoDB document ID
- `appointmentId` - Reference to appointment
- `userId` - Reference to user who left feedback
- `doctorId` - Reference to doctor being reviewed
- `rating` - Rating from 1-5
- `comment` - Optional comment (max 1000 chars)
- `status` - Status (pending/submitted/archived)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Integration Points

- **Called by:** Appointment Service (when appointment is completed)
- **Calls:** Doctor Service (to verify doctor exists)

## Setup

```bash
npm install
```

## Environment Variables

See `.env.example` for required variables:
- `PORT` - Service port (default: 3004)
- `MONGO_URI` - MongoDB connection string
- `DOCTOR_SERVICE_URL` - URL of Doctor Service
- `NODE_ENV` - Environment (development/production)

## Running

```bash
npm start          # Production
npm run dev        # Development with nodemon
npm test           # Run tests
```
