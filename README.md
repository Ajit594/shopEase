# ShopEase

## Overview
This project is a React-based web application built with TypeScript, Vite, and Tailwind CSS. It features a modern UI with components for e-commerce functionality including product listings, user authentication, and profile management.

## Features
- Product catalog with detailed product pages
- User authentication including login, registration, and password recovery
- Shopping cart and checkout flow
- Responsive design using Tailwind CSS and Radix UI components
- State management with React Context and custom hooks
- API integration for backend services (assumed)

## Technologies Used
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router DOM
- React Hook Form
- ESLint and Prettier for code quality

## Project Structure
- `src/components/` - Reusable UI components organized by feature
- `src/pages/` - Page components for routing
- `src/data/` - Static data such as product listings
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React Context providers for global state
- `src/lib/` - Utility functions and API clients
- `public/` - Static assets like images and favicon

## Setup and Installation
1. Clone the repository
2. Install dependencies using `npm install` or `yarn install`
3. Run the development server with `npm run dev`
4. Open `http://localhost:3000` in your browser

## Scripts
- `dev` - Start development server
- `build` - Build production assets
- `preview` - Preview production build locally
- `lint` - Run ESLint to check code quality

## Authentication
- Login, registration, and password recovery forms are implemented.
- Password recovery sends reset instructions via email (demo logs reset code to console).

## License
Specify your project license here.
