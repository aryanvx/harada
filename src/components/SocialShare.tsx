import { Linkedin } from 'lucide-react';

interface SocialShareProps {
  goalText: string;
  shareUrl: string;
}

// Custom X (Twitter) logo component
const XLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function SocialShare({ goalText, shareUrl }: SocialShareProps) {
  const handleTwitterShare = () => {
    const text = `I just mapped out my goal using the Harada Method! 🎯\n\n"${goalText}"\n\n8 pillars, 64 actionable tasks. Check it out:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
        title="Share on X (Twitter)"
      >
        <XLogo className="w-4 h-4" />
        <span className="hidden sm:inline">Share on X</span>
      </button>

      <button
        onClick={handleLinkedInShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-all"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">Share on LinkedIn</span>
      </button>
    </div>
  );
}