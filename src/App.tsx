import { useEffect, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import GoalInput from './components/GoalInput';
import HaradaGrid from './components/HaradaGrid';
import InspirationGallery from './components/InspirationGallery';
import { supabase, HaradaGrid as HaradaGridType } from './lib/supabase';
import { exportAsImage, getShareUrl, copyToClipboard } from './utils/export';

function HomePage() {
  const navigate = useNavigate();

  const handleGenerateGoal = async (goalText: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-harada-goal`;
      console.log('Calling API:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalText }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Failed to generate goal: ${response.status} ${errorText}`);
      }

      const generatedData = await response.json();
      console.log('Generated data:', generatedData);

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

      // Navigate to the grid page
      navigate(`/grid/${goal.share_token}`);
    } catch (error) {
      console.error('Error generating goal:', error);
      alert('Failed to generate goal. Please try again.');
    }
  };

  return (
    <>
      <GoalInput onGenerateGoal={handleGenerateGoal} />
      <InspirationGallery />
    </>
  );
}

function GridPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const navigate = useNavigate();
  const [currentGrid, setCurrentGrid] = useState<HaradaGridType | null>(null);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shareToken) {
      loadSharedGrid(shareToken);
    }
  }, [shareToken]);

  const loadSharedGrid = async (token: string) => {
    try {
      setLoading(true);
      const { data: goal, error } = await supabase
        .from('goals')
        .select('*')
        .eq('share_token', token)
        .maybeSingle();

      if (error) throw error;
      if (!goal) {
        navigate('/');
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
      }
    } catch (error) {
      console.error('Error loading shared grid:', error);
      navigate('/');
    } finally {
      setLoading(false);
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
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">Loading grid...</div>
      </div>
    );
  }

  if (!currentGrid) {
    return null;
  }

  return (
    <div ref={gridRef} data-grid>
      <HaradaGrid
        gridData={currentGrid}
        onBack={handleBack}
        onExportImage={handleExportImage}
        onTogglePublic={handleTogglePublic}
        onCopyShareLink={handleCopyShareLink}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/grid/:shareToken" element={<GridPage />} />
    </Routes>
  );
}

export default App;