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

    // Generate Harada grid using Groq AI
    const haradaGrid = await generateHaradaGridWithAI(goalText);

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

async function generateHaradaGridWithAI(goalText: string): Promise<HaradaGrid> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  
  if (!groqApiKey) {
    console.error('GROQ_API_KEY not configured');
    throw new Error('AI service not configured');
  }

  const systemPrompt = `You are an expert in the Harada Method, a Japanese goal-achievement framework that systematically breaks down ambitious goals into actionable steps.

The Harada Method structure:
- 1 Central Goal (provided by user)
- 8 Strategic Pillars (key areas that support achieving the goal)
- 64 Actionable Tasks (8 specific tasks per pillar)

Your job is to analyze the user's goal and create a highly personalized, realistic breakdown.

RULES:
1. Create exactly 8 pillars that are directly relevant to THIS SPECIFIC goal
2. Each pillar should represent a distinct strategic area needed to achieve the goal
3. For each pillar, create exactly 8 actionable, specific tasks
4. Tasks must be concrete actions, not vague advice (e.g., "Run 3x per week" not "Exercise more")
5. Tasks should progress logically from foundational to advanced within each pillar
6. Consider the goal's context, realistic timelines, and what actually works
7. Make tasks measurable and trackable when possible
8. Pillar names should be 2-4 words, clear and specific

Respond ONLY with valid JSON matching this exact structure:
{
  "pillars": [
    {
      "pillar_text": "Pillar Name",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3",
        "Specific actionable task 4",
        "Specific actionable task 5",
        "Specific actionable task 6",
        "Specific actionable task 7",
        "Specific actionable task 8"
      ]
    }
  ]
}

Make the breakdown inspiring yet realistic. Focus on what will actually help someone achieve this specific goal.`;

  const userPrompt = `Create a Harada Method breakdown for this goal: "${goalText}"

Analyze this goal carefully. Make sure it is not offensive nor borderline offensive. If it is, render 'I cannot render this into the Harada Method. Please try again.' What are the 8 most important strategic pillars needed to achieve it? What are the specific, actionable tasks within each pillar?`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast, capable, and free!
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('AI generation failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the AI response
    const aiResponse = JSON.parse(content);

    // Validate and transform to our exact structure
    if (!aiResponse.pillars || !Array.isArray(aiResponse.pillars)) {
      throw new Error('Invalid AI response structure');
    }

    if (aiResponse.pillars.length !== 8) {
      throw new Error(`Expected 8 pillars, got ${aiResponse.pillars.length}`);
    }

    // Transform to match our HaradaGrid interface
    const haradaGrid: HaradaGrid = {
      pillars: aiResponse.pillars.map((pillar: any, index: number) => {
        if (!pillar.tasks || pillar.tasks.length !== 8) {
          throw new Error(`Pillar "${pillar.pillar_text}" must have exactly 8 tasks`);
        }

        return {
          pillar_text: pillar.pillar_text,
          position: index + 1,
          tasks: pillar.tasks.map((task: string, taskIndex: number) => ({
            task_text: task,
            position: taskIndex + 1
          }))
        };
      })
    };

    return haradaGrid;

  } catch (error) {
    console.error('Error calling Groq:', error);
    throw new Error('Failed to generate AI-powered goal breakdown');
  }
}