# Tournament App

A modern tournament management web application built with Vue.js and MongoDB.

## Features

- **4 Game Types**: Table Tennis, Krunker, Chess, and Programming (IAPC)
- **Tournament Management**: Group stages, semi-finals, and finals
- **Real Player Images**: Displays actual player photos
- **Admin Interface**: Password-protected dashboard for updating match results
- **Game-Specific Results**:
  - Table Tennis: Winner + Score
  - Krunker: Kills and Damage stats for each player
  - Chess/Programming: Winner only

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- RESTful API

### Frontend
- Vue 3 + Vite
- Tailwind CSS
- Vue Router

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Seed the database:
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Admin Access

- URL: `http://localhost:5173/admin`
- Password: `hulk#1497`

## Project Structure

```
tournament-app/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeding script
│   └── server.js        # Express server
└── frontend/
    ├── public/
    │   └── avatars/     # Player images
    ├── src/
    │   ├── components/  # Vue components
    │   ├── router/      # Vue Router config
    │   └── views/       # Page views
    └── tailwind.config.js
```

## Tournament Format

- **Table Tennis**: 2 groups of 9, round-robin → top 2 advance → semis → final
- **Krunker**: 2 groups, 4-player battles → top 2 advance → final 4
- **Chess**: 2 groups, round-robin → semis → final
- **Programming**: 2 groups, round-robin → semis → final

## License

MIT
