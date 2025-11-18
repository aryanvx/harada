import { useEffect, useState } from 'react';
import { supabase, HaradaGrid } from '../lib/supabase';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function InspirationGallery() {
  const [grids, setGrids] = useState<HaradaGrid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicGrids();
  }, []);

  const loadPublicGrids = async () => {
    try {
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      if (goals) {
        const gridsData = await Promise.all(
          goals.map(async (goal) => {
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

              return { goal, pillars: pillarsWithTasks };
            }

            return null;
          })
        );

        setGrids(gridsData.filter((g) => g !== null) as HaradaGrid[]);
      }
    } catch (error) {
      console.error('Error loading public grids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (grids.length === 0) {
    return null;
  }

  return (
    <div id="gallery" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Inspiration Gallery
          </h2>
          <p className="text-lg text-slate-600">
            Recently shared goal grids from the community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grids.map((grid) => (
            <a
              key={grid.goal.id}
              href={`/grid/${grid.goal.share_token}`}
              className="group block bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                  {grid.goal.goal_text}
                </h3>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
              </div>

              <div className="space-y-2 mb-4">
                {grid.pillars.slice(0, 3).map((pillar) => (
                  <div key={pillar.id} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-slate-600 line-clamp-1">
                      {pillar.pillar_text}
                    </span>
                  </div>
                ))}
                {grid.pillars.length > 3 && (
                  <p className="text-xs text-slate-400 pl-6">
                    +{grid.pillars.length - 3} more pillars
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>8 pillars • 64 tasks</span>
                <span className="group-hover:text-blue-600 transition-colors font-medium">
                  View Grid →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}