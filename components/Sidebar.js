'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiFileText, 
  FiZap, 
  FiCreditCard,
  FiMenu,
  FiX 
} from 'react-icons/fi';
import { useState } from 'react';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'SEO Reports', href: '/seo', icon: FiFileText },
  { name: 'AI Content', href: '/ai-content', icon: FiZap },
  { name: 'Billing', href: '/billing', icon: FiCreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.mobileMenuButton}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <div className={styles.sidebarContent}>
          <h1 className={styles.logo}>AI Marketing</h1>
          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                  <Icon className={styles.icon} size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
