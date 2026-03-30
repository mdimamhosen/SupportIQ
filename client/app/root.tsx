import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Manrope:wght@200..800&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="AI, customer support, dashboard, SaaS, helpdesk, chatbot, automation, SupportIQ, Liquidmorphic, smart support, ticketing, live chat"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SupportIQ | Smarter Support" />
        <meta
          property="og:description"
          content="AI-powered customer support dashboard with Liquidmorphic design."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://supportiq.example.com/" />
        <meta property="og:image" content="/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SupportIQ | Smarter Support" />
        <meta
          name="twitter:description"
          content="AI-powered customer support dashboard with Liquidmorphic design."
        />
        <meta name="twitter:image" content="/favicon.ico" />
        <link rel="canonical" href="https://supportiq.example.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SupportIQ',
              url: 'https://supportiq.example.com/',
              description: 'AI-powered customer support dashboard with Liquidmorphic design.',
            }),
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
