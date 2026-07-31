# Angular Practice

Consolidated Angular learning demos in a single Angular 17 app. Merged from 3 individual Angular practice projects.

## Demos

| Route | Demo | What It Demonstrates |
|-------|------|---------------------|
| `/` | Home | Navigation page listing all demos |
| `/crud` | CRUD Demo | User, customer, and associate management with NgRx-style state (from `auth-crud-ngrx-angular`) |
| `/blog` | Blog Demo | Blog listing with categories and post details (from `Blog-Site-ngrx`) |
| `/contact` | Contact Demo | Contact/email form with Semantic UI-style controls (from `email-Sender`) |

## Tech Stack

- **Angular 17** (NgModule, not standalone)
- **Angular Router** (routing)
- **NgRx** (`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` available)
- **Forms** (template-driven `ngModel`)

## Getting Started

```bash
npm install
npm start
```

Open http://localhost:4200 in your browser.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Start dev server (`ng serve`) |
| `npm run build` | Production build (`ng build`) |
| `npm run watch` | Rebuild on change (`ng build --watch`) |
| `npm run ng` | Angular CLI passthrough |

## Project Structure

```
src/
  app/
    app.module.ts          # Root module (declares all components)
    app-routing.module.ts  # Route definitions
    app.component.ts       # Root component with nav bar
    home/                  # Home navigation page
    demos/
      crud-demo/           # User/Customer/Associate CRUD
      blog-demo/           # Blog listing + detail
      contact-demo/        # Contact/email form
```

## Project History

This project consolidates 3 former standalone practice projects:

- `auth-crud-ngrx-angular` — Angular 17 + NgRx CRUD app
- `Blog-Site-ngrx` — Angular 16 blog site
- `email-Sender` — Angular 8 email client with Semantic UI

The original projects were merged into route-based demos here.
