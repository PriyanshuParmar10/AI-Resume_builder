# AI Resume Builder

A full-stack web application that helps users create professional resumes using AI-powered content suggestions.

🔗 **Live Demo**: [ai-resume-builder-zeta-khaki.vercel.app](https://ai-resume-builder-zeta-khaki.vercel.app)

## Features

- **AI Content Suggestions** — Paste a job description and get relevant skill and experience suggestions powered by AI
- **Multiple Templates** — Choose from Classic, Minimal, Modern, and MinimalImage templates
- **Real-time Preview** — See your resume update live as you fill in the form
- **PDF Export** — Download your resume as a PDF instantly
- **Authentication** — Secure login/signup with JWT
- **Cloud Image Upload** — Profile photo upload via ImageKit

## Tech Stack

**Frontend**
- React.js, Vite, Tailwind CSS
- Redux Toolkit, React Router
- Axios

**Backend**
- Node.js, Express.js
- MongoDB + Mongoose
- JWT Authentication, bcrypt
- ImageKit, Multer

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- ImageKit account
- Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/PriyanshuParmar10/AI-Resume_builder.git
cd AI-Resume_builder
```

**Backend setup:**
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

```bash
node server.js
```

**Frontend setup:**
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

## Project Structure

```
AI-Resume_builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard, Builder, Preview, Login
│   │   ├── templates/      # Resume templates
│   │   ├── configs/        # Axios API config
│   │   └── app/            # Redux store & slices
├── server/                 # Node.js backend
│   ├── controllers/        # AI, Resume, User logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth middleware
│   └── configs/            # DB, AI, ImageKit config
└── vercel.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register user |
| POST | /api/users/login | Login user |
| GET | /api/resumes | Get all resumes |
| POST | /api/resumes | Create resume |
| PUT | /api/resumes/:id | Update resume |
| DELETE | /api/resumes/:id | Delete resume |
| POST | /api/ai/suggestions | Get AI suggestions |

## License

MIT License