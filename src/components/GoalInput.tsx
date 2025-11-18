import { useState } from 'react';
import { Circle, Loader2 } from 'lucide-react';

interface GoalInputProps {
  onGenerateGoal: (goalText: string) => Promise<void>;
  isLoading: boolean;
}

export default function GoalInput({ onGenerateGoal, isLoading }: GoalInputProps) {
  const [goalText, setGoalText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goalText.trim() && !isLoading) {
      await onGenerateGoal(goalText.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-stone-100">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-red-800 bg-white mb-8">
            <Circle className="w-10 h-10 text-red-800" />
          </div>
          <h1 className="text-4xl font-light text-stone-900 mb-3 tracking-wider">
            原田メソッド
          </h1>
          <p className="text-lg text-stone-600 mb-2 font-light">
            The Harada Method
          </p>
          <p className="text-sm text-stone-500 font-light tracking-wide">
            Transform your goal into 8 pillars and 64 actionable tasks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="What is your one ambitious goal?"
              className="w-full px-6 py-5 text-lg border border-stone-400 focus:border-stone-900 focus:outline-none transition-all resize-none h-32 bg-white font-light"
              disabled={isLoading}
            />
            <div className="absolute bottom-4 right-4 text-xs text-stone-400 font-light">
              {goalText.length}
            </div>
          </div>

          <button
            type="submit"
            disabled={!goalText.trim() || isLoading}
            className="w-full border-2 border-stone-900 bg-stone-900 hover:bg-stone-800 text-white font-light py-5 px-8 transition-all disabled:bg-stone-300 disabled:border-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Plan...
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Generate Plan
              </>
            )}
          </button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-sm text-stone-500 mb-3 font-light tracking-wide">
            Inspired by the legendary method used by Shohei Ohtani
          </p>
          <a
            href="#gallery"
            className="text-stone-700 hover:text-stone-900 font-light text-sm transition-colors border-b border-stone-400 hover:border-stone-900"
          >
            View Example Grids
          </a>
        </div>
      </div>
    </div>
  );
}
