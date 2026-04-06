# Zorvyn Finance Intelligence Dashboard

A modern, responsive financial intelligence dashboard built with React and TypeScript, featuring real-time KPI tracking, interactive visualizations, and role-based access control.

## Live Demo

**[View Live Demo →](https://finance-dashboard-snowy-xi.vercel.app)**

Experience the full application with all features enabled. The demo includes sample financial data for exploration.

## Features

- **Real-Time KPI Cards** - Track total balance, monthly income, expenses, and savings rate with dynamic calculations
- **Interactive Charts** - Balance trend line chart, spending breakdown donut chart, and transaction activity heatmap
- **Transaction Management** - Full CRUD operations with advanced filtering, search, and sorting capabilities
- **Advanced Filtering** - Filter transactions by category, type, date range, and search query with real-time updates
- **CSV Export** - Export filtered transactions to CSV format (ADMIN role only)
- **Role-Based Access Control** - Switch between ADMIN and ANALYST roles with feature-level permissions
- **Dark Mode** - Toggle between light and dark themes with persistent user preferences
- **Responsive Design** - Optimized layouts for mobile (375px), tablet (768px), and desktop (1280px+) viewports
- **Accessibility Features** - Keyboard navigation, screen reader support, skip links, and WCAG AA compliant color contrast
- **Smooth Animations** - Subtle transitions and animations with reduced motion support for accessibility
- **Financial Insights** - AI-powered spending analysis, savings trends, and unusual spending alerts
- **LocalStorage Persistence** - All preferences and data persist across browser sessions

## Tech Stack

- **React 18** - Modern UI library with concurrent features and improved performance
- **TypeScript** - Type safety and enhanced developer experience with strict mode enabled
- **Vite** - Lightning-fast build tool with hot module replacement and optimized production builds
- **Tailwind CSS** - Utility-first CSS framework for consistent, maintainable styling
- **Zustand** - Lightweight state management with minimal boilerplate and excellent TypeScript support
- **Recharts** - Composable React charting library with responsive, accessible visualizations
- **Lucide React** - Modern icon library with tree-shakeable imports and consistent design
- **React Router** - Client-side routing with code splitting for optimal performance
- **Vitest** - Fast unit testing framework with native ESM support
- **Testing Library** - User-centric testing utilities for React components
- **Fast-check** - Property-based testing for comprehensive test coverage

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** - Version 18.x or higher ([Download](https://nodejs.org/))
- **npm** - Version 9.x or higher (comes with Node.js)

To verify your installations:

```bash
node --version  # Should output v18.x.x or higher
npm --version   # Should output 9.x.x or higher
```

## Setup Instructions

Follow these steps to run the application locally:

### 1. Clone the repository

```bash
git clone <repository-url>
cd financedashboard
```

### 2. Install dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Run the development server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is in use).

### 4. Build for production (optional)

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### 5. Preview production build (optional)

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## Available Scripts

- **`npm run dev`** - Start development server with hot module replacement
- **`npm run build`** - Create optimized production build with type checking
- **`npm run preview`** - Preview production build locally
- **`npm run test`** - Run all tests once (unit and property-based tests)
- **`npm run test:watch`** - Run tests in watch mode for development
- **`npm run lint`** - Check code for linting errors with ESLint
- **`npm run format`** - Format code with Prettier

## Role Switching

The application supports two user roles with different permission levels:

### ADMIN Role
- Full access to all features
- Can create, edit, and delete transactions
- Can export transactions to CSV
- Can view all insights and analytics

### ANALYST Role
- Read-only access to transactions
- Cannot create, edit, or delete transactions
- Cannot export to CSV (export button is hidden)
- Can view all insights and analytics

### How to Switch Roles

1. Click the **user icon** in the top navigation bar
2. Select your desired role from the dropdown menu
3. The interface will update immediately to reflect role permissions
4. Your role preference is saved in localStorage and persists across sessions

## Known Limitations

- **Mock Data** - All transaction data is simulated for demonstration purposes; no real financial data is used
- **No Backend Integration** - Data is stored in browser localStorage; no server-side persistence or API integration
- **Simulated Authentication** - Role switching is client-side only; no real authentication or authorization system
- **Browser Compatibility** - Optimized for modern browsers (Chrome, Firefox, Safari, Edge); may not work in older browsers
- **Data Limits** - Performance may degrade with extremely large datasets (10,000+ transactions)
- **No Data Import** - Currently no ability to import transactions from external sources (CSV, bank APIs, etc.)

## Project Structure

```
financedashboard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route-level page components
│   ├── store/           # Zustand state management
│   ├── utils/           # Utility functions and helpers
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Root application component
├── public/              # Static assets
├── dist/                # Production build output
└── package.json         # Project dependencies and scripts
```

## License

This project is for educational and demonstration purposes.

---

Built with using React, TypeScript, and Tailwind CSS
