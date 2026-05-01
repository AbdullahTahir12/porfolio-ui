# Developer Portfolio · Next.js App Router

A responsive, animated portfolio for full-stack developers built on Next.js 16 (App Router), Tailwind CSS, Framer Motion, and MongoDB. All portfolio entities (skills, projects, experience, contact messages) are served through internal API routes that integrate with Mongoose models, with optional Cloudinary uploads for project imagery.

## ✨ Features

- Modular sections: hero, about, skills, projects, experience, contact
- Dark/light mode toggle powered by CSS variables + localStorage
- Framer Motion animations, sticky navigation, smooth scrolling
- Internal REST API routes (`/api/*`) backed by MongoDB via Mongoose
- Cloudinary upload endpoint for project/asset management
- Type-safe validation using Zod schemas

## 🧰 Tech Stack

- Next.js 16 · App Router · React 19
- Tailwind CSS 3 · Framer Motion · lucide-react icons
- MongoDB Atlas · Mongoose ODM
- Cloudinary storage integration

## 🚀 Getting Started

```bash
git clone <repo-url>
cd porfolio-ui
cp .env.example .env.local
# update credentials in .env.local

npm install
npm run dev
```

Visit `http://localhost:3000`.

## 🔐 Environment Variables

| Key | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_BASE_URL` | Base URL used by server components when fetching internal APIs |
| `NEXT_PUBLIC_ENABLE_ADMIN_LINK` | Optional. Set to `true` to show Admin shortcuts in nav/footer |

## 🌱 Seed Demo Content

Populate the database with sample records using the provided script:

```bash
npm run seed
```

The script clears existing collections (`skills`, `projects`, `experience`, `contactmessages`) before inserting curated demo data.

## 🛠 Internal API Routes

| Route | Methods | Description |
| --- | --- | --- |
| `/api/skills` | `GET`, `POST` | List skills or create a new record |
| `/api/skills/:id` | `GET`, `PATCH`, `DELETE` | Retrieve, update, or delete a skill |
| `/api/projects` | `GET`, `POST` | Manage projects catalogue |
| `/api/projects/:id` | `GET`, `PATCH`, `DELETE` | Single project operations |
| `/api/experience` | `GET`, `POST` | Experience timeline entries |
| `/api/experience/:id` | `GET`, `PATCH`, `DELETE` | Individual experience record |
| `/api/contact` | `POST` | Stores contact form submissions |
| `/api/upload` | `POST` | Uploads a base64/image string to Cloudinary and returns the secure URL |

All routes return JSON responses with `{ data: ... }` envelopes on success and structured error payloads on failure. Validation is enforced with Zod schemas.

## 🧾 Contact Form

The contact section submits to `/api/contact`. Successful submissions persist to MongoDB. Customize notifications or email integration by extending `app/api/contact/route.ts`.

## 📦 Deployment Notes

- Set all environment variables on your hosting provider (Vercel, Render, etc.)
- Ensure `NEXT_PUBLIC_BASE_URL` matches the deployed domain to keep server-side fetches pointing at the correct API origin
- Only set `NEXT_PUBLIC_ENABLE_ADMIN_LINK=true` if you’re comfortable exposing the `/admin` entry point in navigation (the route itself remains available directly)
- Configure Cloudinary CORS settings if using the upload endpoint from browsers

## 📚 Next Steps

- Add authentication & admin tools for managing content
- Document the API via Swagger/OpenAPI
- Integrate analytics (Plausible, GA4) for portfolio insights
- Replace the placeholder `/public/resume.pdf` with your actual CV asset

Happy shipping!
