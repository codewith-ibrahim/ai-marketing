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
  const [isComplete, setIsComplete] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setContent('');
    setIsComplete(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type, stream: true }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          const errorMsg = errorData.error || errorData.details || 'Failed to generate content';
          
          // Special handling for quota errors
          if (response.status === 429 || errorMsg.includes('quota')) {
            toast.error(
              'Gemini API Quota Exceeded. Please check your usage at makersuite.google.com/app/apikey',
              {
                autoClose: 8000,
              }
            );
          } else {
            toast.error(errorMsg);
          }
        } catch (e) {
          toast.error('Failed to generate content');
        }
        setLoading(false);
        return;
      }

      // Handle streaming response
      if (!response.body) {
        toast.error('No response body received');
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // Process any remaining buffer data
            if (buffer.trim()) {
              const lines = buffer.split('\n\n').filter(line => line.trim());
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    
                    if (data.error) {
                      toast.error(data.error);
                      setLoading(false);
                      return;
                    }
                    
                    if (data.content) {
                      setContent(prev => prev + data.content);
                    }
                    
                    if (data.done) {
                      setIsComplete(true);
                      setLoading(false);
                      toast.success('Content generated successfully!');
                      return;
                    }
                  } catch (e) {
                    console.error('Error parsing SSE data:', e);
                  }
                }
              }
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.error) {
                  toast.error(data.error);
                  setLoading(false);
                  return;
                }
                
                if (data.content) {
                  setContent(prev => prev + data.content);
                }
                
                if (data.done) {
                  setIsComplete(true);
                  setLoading(false);
                  toast.success('Content generated successfully!');
                  return;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e, 'Line:', line);
              }
            }
          }
        }
        
        // If we reach here, stream ended without done signal
        setIsComplete(true);
        setLoading(false);
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred. Please try again.');
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

          {(loading || content) && (
            <div className={styles.contentSection}>
              <div className={styles.contentHeader}>
                <label className={styles.contentLabel}>
                  {loading ? 'Generating Content...' : 'Generated Content'}
                </label>
                {isComplete && content && (
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
                )}
              </div>
              <div className={styles.contentBox}>
                <pre className={styles.contentText}>
                  {content || (loading && 'Generating...')}
                  {loading && content && (
                    <span className={styles.typingIndicator}>|</span>
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}

