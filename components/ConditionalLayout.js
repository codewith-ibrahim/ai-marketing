'use client';

import { usePathname } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from './ConditionalLayout.module.css';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const showSidebar = !isLandingPage;

  if (showSidebar) {
    return (
      <div className={styles.container}>
        <SignedIn>
          <Sidebar />
        </SignedIn>
        <div className={styles.content}>
          <Navbar />
          <main className={styles.main}>
            {children}
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    );
  }

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

