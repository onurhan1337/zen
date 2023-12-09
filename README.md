# Zen

### What is Zen?

Zen is a robust project management tool designed to streamline the process of managing projects, tasks. Built with modern technologies, Zen provides an intuitive and efficient way to organize your work.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) & [Prisma](https://www.prisma.io/) & [Upstash Redis](https://upstash.com/)
- **Authentication**: [Next Auth](https://next-auth.js.org/)
- **Drag and Drop**: [Dnd Kit](https://dndkit.com/)
- **Deployment**: [Vercel](https://vercel.com)
- **Form Handling**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) & [Radix Themes](https://www.radix-ui.com/themes/docs/overview/getting-started)

## Overview

- `pages/api/*` - [API Routes](https://nextjs.org/docs/api-routes/introduction)
- `pages/` - Contains all the page components. Each file corresponds to a route based on its name.
- `components/` - Contains all project components with reusable React components.
- `prisma/` - Contains your Prisma schema and migrations.
- `public/` - Contains static files like images, which can be accessed directly via URL.
- `styles/` - Contains global styles. The application primarily uses Tailwind CSS for styling.
- `lib/` - Contains utility functions, custom hooks and libraries that are used across the project.

## Demo

```bash
https://zen-orcin.vercel.app/
```

## Running Locally

This application requires Node.js v16.13+.

```bash
git clone https://github.com/onurhan1337/zen.git
cd zen
pnpm install
pnpm run dev
```

Create a `.env` file similar to [`.env.example`](https://github.com/onurhan1337/zen/blob/master/.env.example). You need to fill them out for the site to work.

## Cloning / Forking

Please review the [license](https://github.com/onurhan1337/my-website/blob/master/LICENSE.txt) and remove all of my personal information (resume, blog posts, images, etc.).
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
