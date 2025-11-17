'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { FiCreditCard, FiCheck, FiX } from 'react-icons/fi';
import styles from './page.module.css';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      '5 SEO Reports per month',
      '10 AI Content generations',
      'Basic analytics',
    ],
    notIncluded: [
      'Advanced SEO insights',
      'Priority support',
      'API access',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    popular: true,
    features: [
      'Unlimited SEO Reports',
      'Unlimited AI Content',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Export reports',
    ],
    notIncluded: [],
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Custom AI models',
      'White-label options',
    ],
    notIncluded: [],
  },
];

export default function BillingPage() {
  return (
    <div className={styles.container}>
      <SignedOut>
        <div className={styles.signedOutContainer}>
          <h1 className={styles.signedOutTitle}>Billing & Plans</h1>
          <p className={styles.signedOutText}>Sign in to manage your subscription</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FiCreditCard className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>Billing & Subscription</h1>
          </div>
          <p className={styles.subtitle}>Choose a plan that fits your needs</p>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  Popular
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
              </div>

              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <FiCheck className={`${styles.featureIcon} ${styles.featureIconCheck}`} size={18} />
                    <span className={styles.featureText}>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <li key={idx} className={`${styles.featureItem} ${styles.featureItemDisabled}`}>
                    <FiX className={`${styles.featureIcon} ${styles.featureIconCross}`} size={18} />
                    <span className={`${styles.featureText} ${styles.featureTextDisabled}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.planButton} ${plan.popular ? styles.planButtonPrimary : styles.planButtonSecondary}`}
              >
                {plan.name === 'Free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          <p className={styles.noteText}>
            <strong className={styles.noteTextStrong}>Note:</strong> To implement actual billing, integrate with Clerk's billing 
            or Stripe. This is a UI mockup. You'll need to set up webhooks and subscription management.
          </p>
        </div>
      </SignedIn>
    </div>
  );
}

