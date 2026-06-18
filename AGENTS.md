# Agent Instructions & Guidelines

This document outlines the rules, conventions, and tech stack information for agents working on this project. Always adhere to these instructions.

## Critical Rules

- **Package Manager**: Always use `pnpm`. Do not use `npm` or `yarn` to run commands, add/remove dependencies, or execute scripts.
  - Correct: `pnpm install <package>`, `pnpm run dev`, `pnpm run build`
  - Incorrect: `npm install`, `npm run dev`, `yarn add`

## Project Tech Stack

- **Framework**: React 19 (using React DOM)
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin in Vite)
- **Build Tool**: Vite 8
- **UI Components**: shadcn UI v4 (using the `@fontsource-variable/geist` font, class-variance-authority, clsx, and tailwind-merge)
- **Languages**: TypeScript, HTML, CSS

## Common Commands

- **Development Server**: `pnpm run dev`
- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint`
- **Preview Production Build**: `pnpm run preview`
