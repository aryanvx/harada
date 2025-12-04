import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, HaradaGrid } from '../lib/supabase';
import { ExternalLink, Sparkles } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

export default function InspirationGallery() {
	const [grids, setGrids] = useState<HaradaGrid[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

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
					<p className="text-lg text-slate-600 mb-8">
						Recently shared goal grids from the community
					</p>
					<p className="text-sm text-slate-500">
						Click on any card to view the full grid
					</p>
				</div>

				{/* CardSwap Component - Centered */}
				<div className="flex justify-center items-center" style={{ minHeight: '700px', position: 'relative' }}>
					<CardSwap
						width={450}
						height={500}
						cardDistance={40}
						verticalDistance={50}
						delay={4000}
						pauseOnHover={true}
						easing="elastic"
						onCardClick={(index) => {
							if (grids[index]) {
								navigate(`/grid/${grids[index].goal.share_token}`);
							}
						}}
					>
						{grids.map((grid) => (
							<Card key={grid.goal.id} customClass="cursor-pointer hover:shadow-2xl transition-shadow">
								<div className="p-8 h-full flex flex-col bg-white">
									<div className="flex items-start justify-between mb-6">
										<h3 className="text-2xl font-bold text-slate-900 line-clamp-2 flex-1">
											{grid.goal.goal_text}
										</h3>
										<ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 ml-3" />
									</div>

									<div className="space-y-3 flex-1 overflow-y-auto max-h-[320px]">
										{grid.pillars.map((pillar) => (
											<div key={pillar.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
												<Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
												<span className="text-sm text-slate-700 leading-relaxed">
													{pillar.pillar_text}
												</span>
											</div>
										))}
									</div>

									<div className="mt-6 pt-4 border-t border-slate-200">
										<div className="flex items-center justify-between text-sm">
											<span className="text-slate-500">
												{grid.pillars.length} pillars • 64 tasks
											</span>
											<span className="text-blue-600 font-medium">
												View Full Grid →
											</span>
										</div>
									</div>
								</div>
							</Card>
						))}
					</CardSwap>
				</div>

				{/* Copyright Footer */}
				<div className="mt-16 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
					© 2025 Aryan Vyahalkar • <a href="https://github.com/aryanvx/harada" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline transition-colors">GitHub</a> • MIT License
				</div>
			</div>
		</div>
	);
}