# HaraDaily AI Goal App

A modern web application that transforms your ambitious goals into actionable plans using the legendary Harada Method. Break down any goal into 8 strategic pillars and 64 concrete tasks, just like the system used by Shohei Ohtani.

## What is the Harada Method?

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

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Supabase account (for database and edge functions)

## Getting Started

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

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The build output will be in the `dist/` directory.

## Running Type Checks

Check TypeScript types without building:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
harada/
├── src/
│   ├── components/         # React components
│   │   ├── GoalInput.tsx          # Goal input form
│   │   ├── HaradaGrid.tsx         # 9x9 grid visualization
│   │   ├── InspirationGallery.tsx # Public goals gallery
│   │   └── SocialShare.tsx        # Social sharing buttons
│   ├── lib/
│   │   └── supabase.ts     # Supabase client and types
│   ├── utils/
│   │   └── export.ts       # Image export utilities
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
└── vite.config.ts          # Vite config
```

## How It Works

1. **Input Your Goal**: Enter any ambitious goal on the landing page
2. **AI Generation**: The app sends your goal to a Supabase Edge Function
3. **Grid Creation**: Receive 8 pillars and 64 tasks structured in the Harada Method format
4. **Visualization**: View your complete plan in an interactive 9x9 grid
5. **Share & Export**: Make your goal public, share on social media, or export as an image

## Key Features Explained

### Goal Sharing

Each goal generates a unique share token that creates a permanent shareable URL. Toggle between public and private visibility.

### Social Sharing

Direct integration with Twitter/X and LinkedIn for sharing your goals with your network.

### Export to Image

Download your Harada grid as a high-quality PNG image for printing or sharing.

### Inspiration Gallery

Browse recently created public goals from the community for inspiration and examples.

## Database Schema

### goals table
- Stores the central goal text
- Contains sharing settings (public/private)
- Auto-generated unique share tokens

### pillars table
- 8 pillars per goal
- Positioned around the central goal in the grid
- Contains descriptive text for each strategic area

### tasks table
- 8 tasks per pillar (64 total)
- Positioned around each pillar in mini-grids
- Concrete actionable steps

## Contributing

This is a production-ready application. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

Built with the Harada Method - Transform your goals into achievement.
