'use client';

import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './LandingNavbar.module.css';

export default function LandingNavbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            AI Marketing
          </Link>
        </div>
        
        <div className={styles.actions}>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-outline">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/dashboard"
              className="btn btn-outline"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
