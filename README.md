# Tow

Tow is a modern educational platform designed to connect students with expert
tutors and counselors. The application facilitates learning through various
teaching methods including online, offline, and hybrid sessions. It serves as a
comprehensive solution for finding tutors, scheduling sessions, and managing the
educational journey.

## Tech Stack

This project is built using a modern, robust, and scalable technology stack:

### Frontend

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - The React
  Framework for the Web.
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Typed superset
  of JavaScript.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
  framework.
- **UI Components:**
  - [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components.
  - [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
- **Animations:**
  - [Framer Motion](https://www.framer.com/motion/) - Production-ready motion
    library for React.
  - [Lenis](https://lenis.darkroom.engineering/) - Smooth scrolling library.
  - `tw-animate-css` - Tailwind CSS animations.
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`,
  `date-fns`, `zod`.

### Backend & Services

- **BaaS (Backend-as-a-Service):** [Appwrite](https://appwrite.io/) - Secure
  backend server for Web, Mobile & Flutter developers.
  - Authentication
  - Database
  - Storage
- **Authentication:** Appwrite Auth & Custom JWT implementation (`jose`).

## Key Features

- **Public Landing Page:** A visually appealing landing page showcasing the
  platform's philosophy, testimonials, counselor journeys, and pricing.
- **Authentication & Onboarding:** Secure login and comprehensive onboarding
  flows for different user roles.
- **Dashboard:** Personalized dashboards for managing activities.
- **Tutor Discovery:** Browse and search for tutors by subject (e.g.,
  Mathematics, Physics, Computer Science) and teaching method.
- **Booking System:** Integrated booking functionality for scheduling sessions.
- **Calendar Integration:** Manage and view scheduled sessions.
- **Profile Management:** User profile customization and management.
- **File Uploads:** Secure file handling via Appwrite Storage.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (managed via `nvm` recommended)
- Package Manager: `npm`, `yarn`, `pnpm`, or `bun`.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd tow
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up Environment Variables:**

   Create a `.env.local` file in the root directory and add the following
   variables. You will need to set up an Appwrite project to get these values.

   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 # or your self-hosted endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
   APPWRITE_API_KEY=your_server_api_key
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_USER_META_COLLECTION_ID=your_collection_id
   JWT_SECRET=your_jwt_secret_min_32_chars
   ```

4. **Database Setup:**

   This project likely includes a script to initialize the Appwrite database
   schema. Check the `scripts` folder.

   ```bash
   # Example usage (check package.json scripts if available or run directly)
   npx tsx scripts/setup-db.ts
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## Project Structure

```bash
/
├── app/                  # Next.js App Router directory
│   ├── (app)/            # Protected application routes (Dashboard, Booking, etc.)
│   ├── (auth)/           # Authentication routes (Login, Onboarding)
│   ├── api/              # API Routes
│   ├── globals.css       # Global styles
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                  # Utility functions, Appwrite config, types
├── public/               # Static assets
└── scripts/              # Setup and maintenance scripts
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
