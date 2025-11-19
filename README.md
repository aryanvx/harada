# Harada.ai

**AI-powered goal setting built on the Harada Method**

This takes any big goal you have and turns it into a clear, structured 64-task plan. It’s the Harada Method, but with AI doing the heavy lifting so you can focus on the work instead of the planning.

## What is the Harada Method?

It’s a Japanese goal-setting system created by Olympic coach Takashi Harada. You start with one main goal, support it with eight pillars, and break each pillar into eight tasks. That’s your roadmap.

Essentially just:

### 1 Central Goal

### 8 Pillars

### 8 tasks per pillar

For a total of **64 Tasks**.

## Features

AI Breakdown using Groq’s Llama 3.3 70B

Clean 9×9 Grid to visualize your full plan

Goal Sharing with public/private links

Shareable to X + LinkedIn

PNG Export of your full grid

Inspiration Gallery to see what others are building

Light speed generation thanks to Groq

Responsive on both desktop and mobile

## Example goals it handles well:

Run a sub-4 marathon

Launch a SaaS

Learn Japanese

Build a solid freelance business

Write + publish a book

Each goal gets its own custom 64-task plan.

## Tech Stack

React 18 + TypeScript + Vite

Tailwind CSS

Supabase (Postgres)

Supabase Edge Functions (Deno)

Groq API

Lucide React for icons

html2canvas for export

## Installation requirements

Node 18+

npm or yarn

Supabase project

Groq API key

### See it yourself

1. Clone the repo
```sh
git clone https://github.com/aryanvx/harada.git
cd harada
```

2. Install dependencies
```sh
npm install
```

3. Add Supabase keys

Create .env.local:
```sh
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database

Tables:

goals / pillars / tasks

Push migrations:
```sh
supabase db push
```

5. Get a Groq API key

Sign up at console.groq.com, go to the "API Keys" section, name it whatever you want, hit "Create Key", and then copy it.
***Remember you can't see it again after you generate it, so write it down, and sybau you don't have photographic memory.***

6. Add the key to Supabase
```sh
supabase login
supabase secrets set GROQ_API_KEY=gsk_your_actual_key_here
```

8. Deploy the edge function
```sh
supabase functions deploy generate-harada-goal
```

10. Run the dev server
```sh
npm run dev
```

Open the localhost link from the terminal.

## Usage

Enter your goal

Generate your 64-task plan

Look through each pillar and task

Share it or download it

Start working through the roadmap

## Contributing

If you want to add something, open a PR.

Fork

Make a branch

Commit

Push

Open PR

### Roadmap

Auth

Task progress tracking

Mobile app

Language support

Goal templates

Collaboration

Analytics

Chrome extension

## Credits

Takashi Harada for the original method

Groq for the speed

Supabase for the backend

### Contact

Aryan Vyahalkar — **@aryan.vyahalkar** on Instagram, **aryanvx** on GitHub, and **https://www.linkedin.com/in/aryanxvyahalkar/** for LinkedIn.

Repo: https://github.com/aryanvx/harada
