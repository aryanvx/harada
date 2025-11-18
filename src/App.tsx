import { useState, useEffect, useRef } from 'react';
import GoalInput from './components/GoalInput';
import HaradaGrid from './components/HaradaGrid';
import InspirationGallery from './components/InspirationGallery';
import { supabase, HaradaGrid as HaradaGridType } from './lib/supabase';
import { exportAsImage, getShareUrl, copyToClipboard } from './utils/export';

type ViewMode = 'input' | 'grid' | 'shared';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [currentGrid, setCurrentGrid] = useState<HaradaGridType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/grid\/([^/]+)$/);

    if (match) {
      const shareToken = match[1];
      loadSharedGrid(shareToken);
    }
  }, []);

  const loadSharedGrid = async (shareToken: string) => {
    try {
      const { data: goal, error } = await supabase
        .from('goals')
        .select('*')
        .eq('share_token', shareToken)
        .maybeSingle();

      if (error) throw error;
      if (!goal) {
        setViewMode('input');
        return;
      }

      const { data: pillars } = await supabase
        .from('pillars')
        .select('*')
        .eq('goal_id', goal.id)
        .order('position');

      if (pillars) {
        const pillarsWithTasks = await Promise.all(
          pillars.map(async (pillar) => {
            const { data: tasks } = await supabase
              .from('tasks')
              .select('*')
              .eq('pillar_id', pillar.id)
              .order('position');

            return { ...pillar, tasks: tasks || [] };
          })
        );

        setCurrentGrid({ goal, pillars: pillarsWithTasks });
        setViewMode('shared');
      }
    } catch (error) {
      console.error('Error loading shared grid:', error);
      setViewMode('input');
    }
  };

  const handleGenerateGoal = async (goalText: string) => {
    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-harada-goal`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalText }),
      });

      if (!response.ok) throw new Error('Failed to generate goal');

      const generatedData = await response.json();

      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .insert({ goal_text: goalText })
        .select()
        .single();

      if (goalError) throw goalError;

      const pillarsWithTasks = await Promise.all(
        generatedData.pillars.map(async (pillarData: any) => {
          const { data: pillar, error: pillarError } = await supabase
            .from('pillars')
            .insert({
              goal_id: goal.id,
              pillar_text: pillarData.pillar_text,
              position: pillarData.position,
            })
            .select()
            .single();

          if (pillarError) throw pillarError;

          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .insert(
              pillarData.tasks.map((taskData: any) => ({
                pillar_id: pillar.id,
                task_text: taskData.task_text,
                position: taskData.position,
              }))
            )
            .select();

          if (tasksError) throw tasksError;

          return { ...pillar, tasks: tasks || [] };
        })
      );

      setCurrentGrid({ goal, pillars: pillarsWithTasks });
      setViewMode('grid');
      window.history.pushState({}, '', `/grid/${goal.share_token}`);
    } catch (error) {
      console.error('Error generating goal:', error);
      alert('Failed to generate goal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportImage = async () => {
    if (!gridRef.current) return;

    const gridElement = gridRef.current.querySelector('[data-grid]') as HTMLElement;
    if (!gridElement) return;

    try {
      await exportAsImage(gridElement, `harada-${currentGrid?.goal.goal_text.slice(0, 30)}.png`);
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    }
  };

  const handleTogglePublic = async () => {
    if (!currentGrid) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({ is_public: !currentGrid.goal.is_public })
        .eq('id', currentGrid.goal.id);

      if (error) throw error;

      setCurrentGrid({
        ...currentGrid,
        goal: { ...currentGrid.goal, is_public: !currentGrid.goal.is_public },
      });
    } catch (error) {
      console.error('Error toggling public:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleCopyShareLink = async () => {
    if (!currentGrid) return;

    try {
      const shareUrl = getShareUrl(currentGrid.goal.share_token);
      await copyToClipboard(shareUrl);
    } catch (error) {
      console.error('Error copying link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handleBack = () => {
    setViewMode('input');
    setCurrentGrid(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div ref={gridRef}>
      {viewMode === 'input' && (
        <>
          <GoalInput onGenerateGoal={handleGenerateGoal} isLoading={isGenerating} />
          <InspirationGallery />
        </>
      )}

      {(viewMode === 'grid' || viewMode === 'shared') && currentGrid && (
        <div data-grid>
          <HaradaGrid
            gridData={currentGrid}
            onBack={handleBack}
            onExportImage={handleExportImage}
            onTogglePublic={handleTogglePublic}
            onCopyShareLink={handleCopyShareLink}
          />
        </div>
      )}
    </div>
  );
}

export default App;
