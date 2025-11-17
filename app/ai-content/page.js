'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { FiZap, FiCopy, FiCheck } from 'react-icons/fi';
import styles from './page.module.css';

export default function AIContentPage() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('content');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setContent('');

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent(data.content);
        toast.success('Content generated successfully!');
      } else {
        // Show more detailed error message
        const errorMsg = data.error || data.details || 'Failed to generate content';
        
        // Special handling for quota errors
        if (response.status === 429 || errorMsg.includes('quota')) {
          toast.error(
            'OpenAI API Quota Exceeded. Please add credits to your account at platform.openai.com/account/billing',
            {
              autoClose: 8000,
            }
          );
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Content copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <SignedOut>
        <div className={styles.signedOutContainer}>
          <h1 className={styles.signedOutTitle}>AI Content Generator</h1>
          <p className={styles.signedOutText}>Sign in to generate AI-powered content</p>
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
            <FiZap className={styles.headerIcon} size={24} />
            <h1 className={styles.title}>AI Content Generator</h1>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Content Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.select}
            >
              <option value="content">General Content</option>
              <option value="blog">Blog Post</option>
              <option value="social">Social Media Post</option>
              <option value="ad">Ad Copy</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your content prompt here... e.g., 'Write a blog post about AI in marketing'"
              className={styles.textarea}
              rows={4}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={styles.generateButton}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Generating...
              </>
            ) : (
              <>
                <FiZap size={18} />
                Generate Content
              </>
            )}
          </button>

          {content && (
            <div className={styles.contentSection}>
              <div className={styles.contentHeader}>
                <label className={styles.contentLabel}>
                  Generated Content
                </label>
                <button
                  onClick={handleCopy}
                  className={styles.copyButton}
                >
                  {copied ? (
                    <>
                      <FiCheck size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className={styles.contentBox}>
                <pre className={styles.contentText}>
                  {content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}

