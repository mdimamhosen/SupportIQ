import type { Route } from './+types/home';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Header } from '../components/Header';

import { DashboardLayout } from '../components/DashboardLayout';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'SupportIQ | Smarter Support' },
    {
      name: 'description',
      content:
        'SupportIQ is an AI-powered customer support dashboard with Liquidmorphic design, offering smart ticketing, live chat, automation, and seamless customer experience for modern businesses.',
    },
    {
      name: 'faq',
      content:
        'How does SupportIQ use AI? What is Liquidmorphic design? Does SupportIQ support live chat? Is SupportIQ suitable for SaaS businesses?',
    },
    {
      property: 'og:locale',
      content: 'en_US',
    },
    {
      name: 'twitter:creator',
      content: '@supportiq',
    },
  ];
}

if (typeof document !== 'undefined') {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does SupportIQ use AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SupportIQ leverages advanced AI to automate ticket routing, provide instant responses, and analyze customer interactions for improved support.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Liquidmorphic design?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Liquidmorphic design blends fluid, glass-like UI elements for a modern, visually appealing, and user-friendly experience.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does SupportIQ support live chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, SupportIQ includes a real-time live chat feature for seamless customer communication.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is SupportIQ suitable for SaaS businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! SupportIQ is designed for SaaS and modern digital businesses seeking to enhance their customer support with AI.',
        },
      },
    ],
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(faqJsonLd);
  document.head.appendChild(script);
}

export default function Home() {
  return (
    <>
      <BackgroundBlobs />
      <DashboardLayout />
    </>
  );
}
