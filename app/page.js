'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FiFileText, FiZap, FiTrendingUp, FiCheck, FiArrowRight } from 'react-icons/fi';
import LandingNavbar from '../components/LandingNavbar';
import styles from './page.module.css';

function RedirectToDashboard() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className={styles.redirectContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.redirectText}>Redirecting to dashboard...</p>
      <Link
        href="/dashboard"
        className={styles.redirectLink}
      >
        Go to Dashboard →
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <LandingNavbar />
      
      <SignedOut>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              AI-Powered Marketing
              <span className={styles.heroTitleAccent}> Made Simple</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Generate SEO reports, create AI content, and grow your business with our powerful marketing tools
            </p>
            <div className={styles.heroButtons}>
              <SignUpButton mode="modal">
                <button className="btn btn-primary">
                  Get Started Free
                  <FiArrowRight size={20} />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn btn-outline">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>
              Everything you need to grow
            </h2>
            <p className={styles.featuresSubtitle}>
              Powerful tools to help you succeed
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrapper} ${styles.featureIconWrapperBlue}`}>
                <FiFileText className={styles.featureIconBlue} size={32} />
              </div>
              <h3 className={styles.featureCardTitle}>SEO Reports</h3>
              <p className={styles.featureCardDescription}>
                Analyze your website's SEO performance with detailed reports and insights
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Keyword analysis</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Rank tracking</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Competitor insights</span>
                </li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrapper} ${styles.featureIconWrapperPurple}`}>
                <FiZap className={styles.featureIconPurple} size={32} />
              </div>
              <h3 className={styles.featureCardTitle}>AI Content</h3>
              <p className={styles.featureCardDescription}>
                Generate high-quality content using advanced AI technology
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Blog posts</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Social media</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Ad copy</span>
                </li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrapper} ${styles.featureIconWrapperGreen}`}>
                <FiTrendingUp className={styles.featureIconGreen} size={32} />
              </div>
              <h3 className={styles.featureCardTitle}>Analytics</h3>
              <p className={styles.featureCardDescription}>
                Track your marketing performance with detailed analytics
              </p>
              <ul className={styles.featureList}>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Performance metrics</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Growth tracking</span>
                </li>
                <li className={styles.featureListItem}>
                  <FiCheck className={styles.featureCheckIcon} size={18} />
                  <span>Custom reports</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to get started?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of businesses using AI Marketing
            </p>
            <SignUpButton mode="modal">
              <button className="btn btn-secondary" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-primary)' }}>
                Get Started Free
              </button>
            </SignUpButton>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
    </div>
  );
}
