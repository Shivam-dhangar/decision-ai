import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactModal } from '@/components/contact/ContactModal';

export const metadata: Metadata = {
  title: 'DecisionLens AI — Turn difficult decisions into clear, explainable choices',
  description:
    'A professional AI-assisted decision-support platform. Compare options, understand trade-offs, run sensitivity analysis, and see what actually changes your decision.',
  keywords: [
    'decision support',
    'decision intelligence',
    'AI decision maker',
    'multi-criteria decision analysis',
    'trade-off analysis',
    'what-if simulation',
    'sensitivity analysis',
  ],
  authors: [{ name: 'DecisionLens AI Team' }],
  openGraph: {
    title: 'DecisionLens AI — Turn difficult decisions into clear, explainable choices',
    description:
      'Compare your options, understand trade-offs, and see what actually changes your decision with transparent mathematical ranking and AI insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <ContactModal />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
