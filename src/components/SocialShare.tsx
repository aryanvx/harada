import { Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  goalText: string;
  shareUrl: string;
}

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
        <Twitter className="w-4 h-4" />
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
