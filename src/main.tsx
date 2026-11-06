import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { getGuestNameFromPath } from './guest.ts';
import './index.css';

// The admin page is split into its own small bundle so guests never download it.
const AdminPage = lazy(() => import('./Admin.tsx'));

const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
const isAdmin = path === '/admin';

createRoot(document.getElementById('root')!).render(
  isAdmin ? (
    <Suspense fallback={null}>
      <AdminPage />
    </Suspense>
  ) : (
    <App guestName={getGuestNameFromPath(window.location.pathname)} />
  ),
);
