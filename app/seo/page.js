'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FiFileText, FiSearch, FiTrendingUp } from 'react-icons/fi';
import styles from './page.module.css';

export default function SEOPage() {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim() && !url.trim()) {
      toast.error('Please enter a keyword or URL');
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const response = await fetch('/api/serpstack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, url }),
      });

      const data = await response.json();

      if (response.ok) {
        setReport(data);
        toast.success('SEO report generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate SEO report');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <SignedOut>
        <div className={styles.signedOutContainer}>
          <h1 className={styles.signedOutTitle}>SEO Reports</h1>
          <p className={styles.signedOutText}>Sign in to generate SEO reports</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.pageCard}>
          <div className={styles.header}>
            <FiFileText className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>SEO Report Generator</h1>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Search Keyword
              </label>
              <div className={styles.inputGroup}>
                <FiSearch className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword to analyze"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Website URL (Optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={styles.urlInput}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className={styles.searchButton}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Analyzing...
              </>
            ) : (
              <>
                <FiTrendingUp size={18} />
                Generate SEO Report
              </>
            )}
          </button>
        </div>

        {report && (
          <div className={styles.reportCard}>
            <h2 className={styles.reportTitle}>SEO Report Results</h2>
            <div className="space-y-4">
              {report.type === 'serp' && report.data ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Search Results</h3>
                    <p className="text-blue-700">
                      Query: <strong>{report.data.query}</strong>
                    </p>
                    {report.data.organic_results && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Top Results ({report.data.organic_results.length})
                        </p>
                        <div className="space-y-2">
                          {report.data.organic_results.slice(0, 5).map((result, idx) => (
                            <div key={idx} className="bg-white rounded p-3 border border-blue-100">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {result.title}
                              </a>
                              <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{JSON.stringify(report, null, 2)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}

