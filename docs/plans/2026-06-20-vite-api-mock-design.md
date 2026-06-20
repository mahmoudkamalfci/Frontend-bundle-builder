# Vite API Mocking Design

## Overview
This design outlines the approach to transition the `products.json` data from being statically imported to being fetched asynchronously via a mock API. This provides a more realistic data loading environment during development.

## 1. The Backend (Vite Configuration)
Instead of setting up a separate backend server (like Express), we will utilize Vite's internal development server. 
- We will create a custom Vite plugin inside `vite.config.ts`.
- The plugin will use the `configureServer` hook to intercept `GET /api/products` requests.
- When this endpoint is hit, the plugin will read `src/data/products.json` from the filesystem and serve it as the response with a `Content-Type: application/json` header.

## 2. Data Fetching Hook (`useBundleCart.ts`)
We will remove the synchronous import of `products.json` and replace it with standard React asynchronous state management.
- We will add three state variables: `productsData` (to hold the fetched data), `isLoading` (boolean, initial state `true`), and `error` (to capture any network or parsing errors).
- A `useEffect` hook will run on mount, calling `fetch('/api/products')`, parsing the response, and updating the state variables.
- The hook will return these new state variables alongside its existing functionality.

## 3. UI Component Updates
Components consuming `useBundleCart()` (e.g., `App.tsx` or the main bundle builder component) must be updated to handle the asynchronous nature of the data.
- They will read the `isLoading` state from the hook.
- If `isLoading` is true, a simple loading spinner or message will be displayed to prevent rendering errors.
- If `error` is present, an error message will be shown.

## 4. Documentation
We will update `README.md` to document this setup. It will explain that the API is mocked using Vite's internal server, ensuring future developers understand how the frontend fetches its initial data.
