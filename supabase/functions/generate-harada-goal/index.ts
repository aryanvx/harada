import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  goalText: string;
}

interface HaradaGrid {
  pillars: Array<{
    pillar_text: string;
    position: number;
    tasks: Array<{
      task_text: string;
      position: number;
    }>;
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { goalText }: GenerateRequest = await req.json();

    if (!goalText || goalText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Goal text is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const haradaGrid = generateHaradaGrid(goalText);

    return new Response(JSON.stringify(haradaGrid), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating Harada goal:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate goal plan" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateHaradaGrid(goalText: string): HaradaGrid {
  const isMarathonGoal = goalText.toLowerCase().includes('marathon') ||
                         goalText.toLowerCase().includes('run a') ||
                         goalText.toLowerCase().includes('running');

  if (isMarathonGoal) {
    return {
      pillars: [
        {
          pillar_text: "Base Building",
          position: 1,
          tasks: [
            { task_text: "Run 3x per week, 30-45 min easy pace", position: 1 },
            { task_text: "Add 10% weekly mileage increase", position: 2 },
            { task_text: "One long run per week (progressive)", position: 3 },
            { task_text: "Complete 12-week base phase", position: 4 },
            { task_text: "Track all runs in training log", position: 5 },
            { task_text: "Build to 40+ miles per week", position: 6 },
            { task_text: "Master conversational pace running", position: 7 },
            { task_text: "Complete rest days without guilt", position: 8 }
          ]
        },
        {
          pillar_text: "Strength & Mobility",
          position: 2,
          tasks: [
            { task_text: "Strength train 2x per week", position: 1 },
            { task_text: "Focus on single-leg exercises", position: 2 },
            { task_text: "Core work 3x per week", position: 3 },
            { task_text: "Hip strengthening routine", position: 4 },
            { task_text: "Foam roll after every run", position: 5 },
            { task_text: "Dynamic stretching pre-run", position: 6 },
            { task_text: "Yoga or mobility 1x per week", position: 7 },
            { task_text: "Address imbalances early", position: 8 }
          ]
        },
        {
          pillar_text: "Speed Work",
          position: 3,
          tasks: [
            { task_text: "Weekly tempo runs (8 weeks out)", position: 1 },
            { task_text: "400m intervals at goal pace", position: 2 },
            { task_text: "800m repeats for endurance", position: 3 },
            { task_text: "Fartlek training on trails", position: 4 },
            { task_text: "Track pace at marathon goal", position: 5 },
            { task_text: "Hill repeats for power", position: 6 },
            { task_text: "Progressive long runs", position: 7 },
            { task_text: "Practice negative splits", position: 8 }
          ]
        },
        {
          pillar_text: "Nutrition & Fuel",
          position: 4,
          tasks: [
            { task_text: "3 balanced meals daily", position: 1 },
            { task_text: "Carb-load 3 days before race", position: 2 },
            { task_text: "Test race-day breakfast", position: 3 },
            { task_text: "Practice fueling on long runs", position: 4 },
            { task_text: "Hydrate 80-100oz daily", position: 5 },
            { task_text: "Find gel/chew that works", position: 6 },
            { task_text: "Protein within 30min post-run", position: 7 },
            { task_text: "Avoid new foods race week", position: 8 }
          ]
        },
        {
          pillar_text: "Recovery",
          position: 5,
          tasks: [
            { task_text: "Sleep 8+ hours every night", position: 1 },
            { task_text: "Ice bath after long runs", position: 2 },
            { task_text: "Schedule rest days weekly", position: 3 },
            { task_text: "Listen to body signals", position: 4 },
            { task_text: "Get sports massage monthly", position: 5 },
            { task_text: "Compression gear post-run", position: 6 },
            { task_text: "Active recovery walks", position: 7 },
            { task_text: "Taper 2-3 weeks before race", position: 8 }
          ]
        },
        {
          pillar_text: "Mental Prep",
          position: 6,
          tasks: [
            { task_text: "Visualize race day success", position: 1 },
            { task_text: "Practice positive self-talk", position: 2 },
            { task_text: "Break race into 4 segments", position: 3 },
            { task_text: "Prepare for tough miles 18-22", position: 4 },
            { task_text: "Create race day mantras", position: 5 },
            { task_text: "Study course elevation profile", position: 6 },
            { task_text: "Plan for various weather scenarios", position: 7 },
            { task_text: "Trust the training on race day", position: 8 }
          ]
        },
        {
          pillar_text: "Gear & Equipment",
          position: 7,
          tasks: [
            { task_text: "Get fitted for proper shoes", position: 1 },
            { task_text: "Replace shoes every 400 miles", position: 2 },
            { task_text: "Test all race day clothing", position: 3 },
            { task_text: "Anti-chafe strategy (Body Glide)", position: 4 },
            { task_text: "GPS watch for pacing", position: 5 },
            { task_text: "Hydration vest for long runs", position: 6 },
            { task_text: "Nothing new on race day", position: 7 },
            { task_text: "Pack race day bag checklist", position: 8 }
          ]
        },
        {
          pillar_text: "Race Strategy",
          position: 8,
          tasks: [
            { task_text: "Set A, B, C time goals", position: 1 },
            { task_text: "Start 15-30 seconds slower", position: 2 },
            { task_text: "Even pace first 20 miles", position: 3 },
            { task_text: "Fuel every 45 minutes", position: 4 },
            { task_text: "Water at every aid station", position: 5 },
            { task_text: "Bank energy for final 10K", position: 6 },
            { task_text: "Know mile markers for pacing", position: 7 },
            { task_text: "Run your own race, not others'", position: 8 }
          ]
        }
      ]
    };
  }

  const pillarTemplates = [
    { name: "Skills & Knowledge", tasks: [
      "Research best practices",
      "Take an online course",
      "Read 3 relevant books",
      "Find a mentor",
      "Practice daily fundamentals",
      "Join a community",
      "Attend workshops",
      "Document learnings"
    ]},
    { name: "Physical Health", tasks: [
      "Exercise 4x per week",
      "Get 8 hours of sleep",
      "Eat balanced meals",
      "Stay hydrated",
      "Stretch daily",
      "Schedule health check-ups",
      "Reduce stress",
      "Track energy levels"
    ]},
    { name: "Mental & Emotional", tasks: [
      "Practice meditation",
      "Journal daily progress",
      "Visualize success",
      "Maintain positive mindset",
      "Manage setbacks",
      "Celebrate small wins",
      "Practice gratitude",
      "Build resilience"
    ]},
    { name: "Time Management", tasks: [
      "Create daily schedule",
      "Set weekly goals",
      "Prioritize tasks",
      "Eliminate distractions",
      "Time block activities",
      "Review progress weekly",
      "Adjust plans as needed",
      "Maintain consistency"
    ]},
    { name: "Resources & Tools", tasks: [
      "Identify necessary tools",
      "Create budget plan",
      "Acquire equipment",
      "Set up workspace",
      "Organize materials",
      "Build support system",
      "Find accountability partner",
      "Track expenses"
    ]},
    { name: "Network & Support", tasks: [
      "Connect with like-minded people",
      "Share progress publicly",
      "Seek feedback regularly",
      "Help others with similar goals",
      "Attend networking events",
      "Build online presence",
      "Join relevant groups",
      "Collaborate on projects"
    ]},
    { name: "Strategy & Planning", tasks: [
      "Break down into milestones",
      "Set monthly objectives",
      "Create action plans",
      "Identify potential obstacles",
      "Develop contingency plans",
      "Track metrics",
      "Measure progress",
      "Adjust strategy"
    ]},
    { name: "Environment & Habits", tasks: [
      "Design success environment",
      "Build morning routine",
      "Create evening rituals",
      "Remove negative influences",
      "Establish accountability",
      "Track habits daily",
      "Reward consistency",
      "Maintain workspace"
    ]}
  ];

  return {
    pillars: pillarTemplates.map((template, index) => ({
      pillar_text: template.name,
      position: index + 1,
      tasks: template.tasks.map((task, taskIndex) => ({
        task_text: task,
        position: taskIndex + 1
      }))
    }))
  };
}
