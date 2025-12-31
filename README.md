# Mini Event Platform

A production-grade MERN application for managing events with secure authentication and safe RSVP concurrency handling.

## 🚀 Deployed URLs
- **Frontend**:https://rsvp-omega-ecru.vercel.app/
- **Backend**: https://rsvp-u5nz.onrender.com
- **API Base URL**: https://rsvp-u5nz.onrender.com/api

## 🧱 Tech Stack
- **Frontend**: React (Vite), Context API, Vanilla CSS (Responsive), Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT, BCrypt
- **Images**: Cloudinary (Multer generic upload)
- **Deployment**: Vercel (Client), Render (Server)

## 🛠 Setup Instructions (Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manoj-APJ/RSVP.git
   cd RSVP

   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create .env file based on .env.example
   npm start
   ```

   **Env Variables (`server/.env`):**
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## ⚠️ RSVP Concurrency Handling
The application uses strict concurrency control to prevent overbooking, ensuring that event capacity is never exceeded even under heavy load.

### Implementation Logic
1.  **Atomic Updates**: We do **not** rely on reading the `attendeesCount` and then updating it in two separate steps.
2.  **Constraint Query**: The update operation uses a query filter that strictly checks capacity at the moment of update:
    ```javascript
    Event.findOneAndUpdate(
       { _id: eventId, $expr: { $lt: ['$attendeesCount', '$capacity'] } },
       { $inc: { attendeesCount: 1 } }
    )
    ```
    If `attendeesCount` matches `capacity` at the DB level, this operation fails to match any document, returning `null`. This prevents race conditions where two users read "49/50" and both write "50/50".

3.  **Unique Compound Index**: A generic unique index on `RSVP` collection `{ userId: 1, eventId: 1 }` prevents the same user from spamming RSVPs.

## 🔐 Security Practices
- **JWT Auth**: Stateless authentication with bearer tokens.
- **Password Hashing**: Bcrypt with salt.
- **Input Sanitization**: Express-validator to check inputs.
- **Protected Routes**: Middleware verifies token before access.
- **Authorization**: Only event creators can edit/delete their specific events.
- **Secure Uploads**: Images are processed and stored in Cloudinary, not the server file system.

## ✨ Features
- [x] User Registration & Login
- [x] Create, Read, Update, Delete Events
- [x] Image Upload via Cloudinary
- [x] Real-time Capacity Enforcement (RSVP)
- [x] "Sold Out" Indicators
- [x] Responsive Mobile-First Design
