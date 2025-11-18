# HaradaAI

## The Harada Method

The Harada Method is a goal-setting and achievement framework that helps you systematically break down large goals into manageable actions. Each goal is divided into:

- **1 Central Goal**: Your ambitious target
- **8 Strategic Pillars**: Key areas that support your goal
- **64 Actionable Tasks**: Specific steps within each pillar (8 tasks per pillar)

## Features

- AI-powered goal breakdown into the Harada Method framework
- Interactive 9x9 grid visualization showing your complete plan
- Public/private goal sharing with unique shareable links
- Social media integration (Twitter/X and LinkedIn)
- Export your goal grid as a PNG image
- Community inspiration gallery of public goals
- Fully responsive design with modern aesthetics

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Edge Functions
- **Icons**: Lucide React
- **Export**: html2canvas

## Prereqs

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Supabase account (for database and edge functions)

## Wanna fork it and see it yourself?

### 1. Clone the Repository

```bash
git clone <repository-url>
cd harada
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Database Setup

The database schema includes three main tables:

- `goals`: Stores user goals with sharing capabilities
- `pillars`: 8 strategic pillars for each goal
- `tasks`: 8 tasks for each pillar (64 total per goal)

Migrations are located in `supabase/migrations/` and should be applied automatically if using Supabase CLI, or manually through the Supabase dashboard.

### 5. Edge Functions

The app uses a Supabase Edge Function to generate goal breakdowns:

- `generate-harada-goal`: Takes a goal text and returns structured pillars and tasks

Edge functions are deployed separately through the Supabase dashboard or CLI.

## Development

Start the development server:

```bash
npm run dev
```

Look at terminal to see which port the application launched using.
