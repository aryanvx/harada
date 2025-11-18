import { HaradaGrid as HaradaGridType } from '../lib/supabase';
import { Share2, Download, Globe, ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import SocialShare from './SocialShare';
import { getShareUrl } from '../utils/export';

interface HaradaGridProps {
  gridData: HaradaGridType;
  onBack: () => void;
  onExportImage: () => void;
  onTogglePublic: () => void;
  onCopyShareLink: () => void;
}

export default function HaradaGrid({
  gridData,
  onBack,
  onExportImage,
  onTogglePublic,
  onCopyShareLink,
}: HaradaGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    onCopyShareLink();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sortedPillars = [...gridData.pillars].sort((a, b) => a.position - b.position);

  const renderPillarGrid = (pillar: typeof sortedPillars[0]) => {
    const sortedTasks = [...pillar.tasks].sort((a, b) => a.position - b.position);

    return (
      <div className="grid grid-cols-3 gap-0 border border-stone-400">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const isPillarCenter = index === 4;

          if (isPillarCenter) {
            return (
              <div
                key={`pillar-${pillar.id}-center`}
                className="border border-stone-400 bg-stone-900 text-white p-3 flex items-center justify-center text-center min-h-[100px]"
              >
                <h3 className="font-medium text-sm leading-tight tracking-wide">
                  {pillar.pillar_text}
                </h3>
              </div>
            );
          }

          const taskIndex = index < 4 ? index : index - 1;
          const task = sortedTasks[taskIndex];

          return (
            <div
              key={`pillar-${pillar.id}-task-${index}`}
              className="border border-stone-400 bg-stone-50 p-2 flex items-center justify-center text-center min-h-[100px]"
            >
              <p className="text-xs leading-relaxed text-stone-700">
                {task?.task_text || ''}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCenterGoal = () => {
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-0 border-2 border-red-800 h-full">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div
            key={`center-${index}`}
            className="border border-stone-400 bg-amber-50 h-[100px] flex items-center justify-center"
          >
            {index === 4 && (
              <div className="text-center p-4">
                <p className="text-xs text-stone-500 mb-2 uppercase tracking-widest font-light">
                  目標
                </p>
                <h2 className="font-medium text-base leading-snug text-stone-900">
                  {gridData.goal.goal_text}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New Goal
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onTogglePublic}
              className={`flex items-center gap-2 px-4 py-2 border font-light transition-all ${
                gridData.goal.is_public
                  ? 'border-stone-400 bg-stone-900 text-white hover:bg-stone-800'
                  : 'border-stone-400 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              {gridData.goal.is_public ? 'Public' : 'Private'}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 border border-stone-400 bg-white text-stone-700 font-light hover:bg-stone-50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink ? 'Link Copied!' : 'Share Link'}
            </button>

            <button
              onClick={onExportImage}
              className="flex items-center gap-2 px-4 py-2 border border-stone-400 bg-stone-900 text-white font-light hover:bg-stone-800 transition-all"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <SocialShare
            goalText={gridData.goal.goal_text}
            shareUrl={getShareUrl(gridData.goal.share_token)}
          />
        </div>

        <div ref={gridRef} className="bg-white shadow-sm p-8 md:p-12 overflow-x-auto">
          <div className="text-center mb-10">
            <h1 className="text-xl md:text-2xl font-light text-stone-900 mb-1 tracking-wide">
              原田メソッド
            </h1>
            <p className="text-xs text-stone-500 font-light tracking-wider">8 Pillars × 8 Tasks = 64 Actions</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-2 min-w-[900px]">
              {sortedPillars[0] && (
                <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
                  {renderPillarGrid(sortedPillars[0])}
                </div>
              )}

              {sortedPillars[1] && (
                <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
                  {renderPillarGrid(sortedPillars[1])}
                </div>
              )}

              {sortedPillars[2] && (
                <div style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
                  {renderPillarGrid(sortedPillars[2])}
                </div>
              )}

              {sortedPillars[7] && (
                <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
                  {renderPillarGrid(sortedPillars[7])}
                </div>
              )}

              <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
                {renderCenterGoal()}
              </div>

              {sortedPillars[3] && (
                <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
                  {renderPillarGrid(sortedPillars[3])}
                </div>
              )}

              {sortedPillars[6] && (
                <div style={{ gridColumn: '1 / 2', gridRow: '3 / 4' }}>
                  {renderPillarGrid(sortedPillars[6])}
                </div>
              )}

              {sortedPillars[5] && (
                <div style={{ gridColumn: '2 / 3', gridRow: '3 / 4' }}>
                  {renderPillarGrid(sortedPillars[5])}
                </div>
              )}

              {sortedPillars[4] && (
                <div style={{ gridColumn: '3 / 4', gridRow: '3 / 4' }}>
                  {renderPillarGrid(sortedPillars[4])}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-stone-400 font-light tracking-wider">
            <p>原田メソッド</p>
          </div>
        </div>
      </div>
    </div>
  );
}
