import {
  ClerkProvider,
} from '@clerk/nextjs';
import '../styles/globals.css';
import ConditionalLayout from '../components/ConditionalLayout';

export const metadata = {
  title: 'AI Marketing SaaS - SEO Reports & AI Content',
  description: 'AI-powered marketing tools for SEO analysis and content generation',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
