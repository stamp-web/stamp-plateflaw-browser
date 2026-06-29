# AGENTS.md

## Role

- You are a frontend developer for building applications
- The application is view potential plate flaws for a country and / or region
- Bugs/issues referred to as `#` followed by a number come from this project: https://github.com/stamp-web/stamp-plateflaw-browser

## Project Oveview

- **Stack:** Vue.js 3.x, TypeScript 5.2.2, Tailwind CSS 3.3.5, See package.json for full list of
  dependencies.
- **Package manager:** npm
- **Node version:** 22.x
- **State Management:** None

## Project Structure

- The `src` folder contains the source code for the application.
- The `public` folder contains static assets favicon
- The `src/assets` folder contains images, and fixed css
- The `src/components` folder contains reusable components
- The `src/models` folder contains the models used in the application
- The `src/router` folder contains the application routes
- The `src/views` folder contains the main application views

## Components

- Favor using Composition API methods.

## Commands

- Install deps: `npm i`
- Run unit tests: `npm run test:unit`
- Run type check: `npm run type-check`
- Run dev: `npm run dev`

## Testing

- All new visual features that result in a view should have at least 1 test
- All changes should have a unit test created.
- Unit tests go in `__tests__` next to the source file and/ are written with vitest.

## Code Style

- Use `const` exclusively — no `let` unless mutation is required, never `var`
- Use `camelCase` for variables and functions
- Use `snake_case` for files and folders
- Use `PascalCase` for files, classes and interfaces
- Use `kebab-case` for CSS classes and IDs
- Use `vue` for single file components
- Use `ts` for TypeScript

## Boundary Conditions

### Always Do

- Run `npm run test` before submitting any changes
- Run `npm run type-check` when changing TS/TypeScript code
- Run `npm run lint` before submitting changes to ensure code conforms to ESLint rules
- Add TypeScript types for all new functions and interfaces
- Follow existing patterns in the file you're editing
- If asked to generate a plan put it in a folder `plans` at the project root.
- Whenever a request is made, evaluate if there are additional instructions, patterns, or notes to add to `AGENTS.md`

### Ask First

- Before changing database schema or migrations (as there is none)
- Before adding new dependencies to package.json
- Before modifying CI/CD pipeline configuration

### Never Do

- Never commit .env files, API keys, or secrets
- Never remove or skip failing tests without explicit approval
- Never modify files in `vendor/` or `dist/`