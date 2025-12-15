'use client';

import { useEffect, useState } from 'react';
import { Linkedin, Twitter, Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy url', err);
    }
  };

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      action: null,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      action: null,
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=Check out this article: ${encodeURIComponent(url)}`,
      action: null,
    },
  ];

  return (
    <div className="flex flex-row md:flex-col gap-2 items-center md:items-start">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className="p-2 text-text/60 hover:text-primary transition-colors duration-200"
        >
          <link.icon size={20} strokeWidth={1.5} />
        </a>
      ))}
      
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="p-2 text-text/60 hover:text-primary transition-colors duration-200 relative"
      >
        {copied ? (
          <Check size={20} strokeWidth={1.5} className="text-green-600" />
        ) : (
          <Copy size={20} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}