'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FiFileText, FiZap, FiTrendingUp, FiUser, FiMail, FiCalendar, FiLogOut } from 'react-icons/fi';
import { SignOutButton } from '@clerk/nextjs';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.welcomeText}>Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
      </div>

      {/* User Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className={styles.userName}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || 'User'
                }
              </h2>
              <p className={styles.userEmail}>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
          <SignOutButton>
            <button className={styles.logoutButton}>
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </SignOutButton>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <div className={`${styles.detailIconWrapper} ${styles.detailIconWrapperBlue}`}>
              <FiUser className={styles.detailIconBlue} size={20} />
            </div>
            <div>
              <p className={styles.detailLabel}>Full Name</p>
              <p className={styles.detailValue}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || 'Not set'
                }
              </p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={`${styles.detailIconWrapper} ${styles.detailIconWrapperGreen}`}>
              <FiMail className={styles.detailIconGreen} size={20} />
            </div>
            <div>
              <p className={styles.detailLabel}>Email</p>
              <p className={styles.detailValue}>
                {user?.emailAddresses[0]?.emailAddress || 'Not available'}
              </p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={`${styles.detailIconWrapper} ${styles.detailIconWrapperPurple}`}>
              <FiCalendar className={styles.detailIconPurple} size={20} />
            </div>
            <div>
              <p className={styles.detailLabel}>Member Since</p>
              <p className={styles.detailValue}>
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {user?.imageUrl && (
          <div className={styles.profilePictureSection}>
            <p className={styles.profilePictureLabel}>Profile Picture</p>
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className={styles.profilePicture}
            />
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className={styles.featureCards}>
        <div className={styles.featureCard}>
          <div className={styles.featureCardHeader}>
            <div className={`${styles.featureCardIconWrapper} ${styles.featureCardIconWrapperBlue}`}>
              <FiFileText className={styles.featureCardIconBlue} size={24} />
            </div>
            <h3 className={styles.featureCardTitle}>SEO Reports</h3>
          </div>
          <p className={styles.featureCardDescription}>
            Analyze your website's SEO performance with detailed reports
          </p>
          <Link 
            href="/seo"
            className={styles.featureCardLink}
          >
            View Reports →
          </Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureCardHeader}>
            <div className={`${styles.featureCardIconWrapper} ${styles.featureCardIconWrapperPurple}`}>
              <FiZap className={styles.featureCardIconPurple} size={24} />
            </div>
            <h3 className={styles.featureCardTitle}>AI Content</h3>
          </div>
          <p className={styles.featureCardDescription}>
            Generate high-quality content using AI
          </p>
          <Link 
            href="/ai-content"
            className={styles.featureCardLink}
          >
            Create Content →
          </Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureCardHeader}>
            <div className={`${styles.featureCardIconWrapper} ${styles.featureCardIconWrapperGreen}`}>
              <FiTrendingUp className={styles.featureCardIconGreen} size={24} />
            </div>
            <h3 className={styles.featureCardTitle}>Billing</h3>
          </div>
          <p className={styles.featureCardDescription}>
            Manage your subscription and billing
          </p>
          <Link 
            href="/billing"
            className={styles.featureCardLink}
          >
            Manage Plan →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
        <div className={styles.quickActionsButtons}>
          <Link
            href="/seo"
            className={`${styles.quickActionButton} ${styles.quickActionButtonPrimary}`}
          >
            Generate SEO Report
          </Link>
          <Link
            href="/ai-content"
            className={`${styles.quickActionButton} ${styles.quickActionButtonPrimary}`}
          >
            Create AI Content
          </Link>
          <Link
            href="/billing"
            className={`${styles.quickActionButton} ${styles.quickActionButtonSecondary}`}
          >
            View Billing
          </Link>
        </div>
      </div>
    </div>
  );
}

