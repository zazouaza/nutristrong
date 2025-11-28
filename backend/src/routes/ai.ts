import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { geminiModel } from '../lib/gemini';

// Minimal fallback only used if Google Gemini API fails completely (Timeout/Quota)
// This ensures the frontend doesn't crash if the AI service is unreachable.
const FALLBACK_PLAN = {
  summary: "AI Service unavailable. Displaying emergency protocol.",
  dailyCalories: 2500,
  macroTarget: { protein: 180, carbs: 250, fats: 80 },
  weeklyMeals: [], 
  weeklyWorkouts: [],
  shoppingList: ["System Offline - Please Retry Generation"]
};

export async function aiRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/generate-plan',
    {
      schema: {
        body: z.object({
          age: z.coerce.number().optional().default(25),
          gender: z.string().optional().default('Male'),
          heightCm: z.coerce.number().optional().default(175),
          weightKg: z.coerce.number().optional().default(75),
          goal: z.string().optional().default('Lose Fat'),
          activityLevel: z.string().optional().default('Active'),
          dietaryRestrictions: z.string().nullable().optional().default(''),
          allergies: z.string().nullable().optional().default(''),
        }),
      },
    },
    async (request, reply) => {
      const profile = request.body;

      try {
        const systemPrompt = `
          You are NutriStrong, an advanced AI Fitness Coach Engine specialized in hypertrophy and body recomposition.
          
          USER PROFILE:
          - Age: ${profile.age}
          - Gender: ${profile.gender}
          - Height: ${profile.heightCm}cm
          - Weight: ${profile.weightKg}kg
          - Goal: ${profile.goal} (Adjust calories/macros accordingly)
          - Activity: ${profile.activityLevel}
          - Diet Constraints: ${profile.dietaryRestrictions || "None"}
          - Allergies: ${profile.allergies || "None"}

          USER TRAINING PREFERENCE (Hypertrophy Style):
          - The user prefers high-stimulus, hypertrophy-focused training.
          - Example exercises they like: Dumbbell Incline Press (3x8), Pec Deck Fly (3x8), Incline Curls (3x8), Bayesian Curls (3x8), Overhead Extensions (3x8).
          - USE THIS STYLE for the generated workouts. Focus on controlled eccentrics, full range of motion, and muscle isolation mixed with compound movements.

          YOUR TASKS:
          1. CALCULATION: Calculate BMR and TDEE based on stats. Set daily calorie target for their goal (Deficit for fat loss, Surplus for muscle).
          2. MACROS: Set High Protein (approx 2g per kg of bodyweight). Split remaining calories between Carbs and Fats suitable for training fuel.
          3. MEAL PLAN (7 DAYS):
             - Generate a UNIQUE meal plan for Monday through Sunday. 
             - DO NOT REPEAT MEALS. Every day must have different recipes to prevent boredom.
             - 4 meals per day: Breakfast, Lunch, Dinner, Snack.
          4. WORKOUT PLAN (5-DAY SPLIT):
             - Schedule: Monday (Push), Tuesday (Pull), Wednesday (Legs), Thursday (Upper Body), Friday (Lower Body), Saturday (Rest), Sunday (Rest).
             - Volume: 5-7 exercises per workout.
             - Rep Ranges: 8-12 for hypertrophy, 12-15 for isolation.
          5. SHOPPING LIST: Consolidate ingredients for the generated meals.

          OUTPUT FORMAT (Strict JSON, no markdown, no text):
          {
            "summary": "Short 1-sentence analysis of the plan strategy.",
            "daily_calories": Number,
            "macros": { "protein": Number, "carbs": Number, "fats": Number },
            "weekly_workouts": [
              {
                "day_name": "Monday",
                "focus": "Push (Chest/Shoulders/Triceps)",
                "duration_minutes": 75,
                "exercises": [
                  { "name": "Exercise Name", "sets": Number, "reps": "String (e.g. 3x8)", "description": "Form cue" }
                ]
              }
              ... (Repeat for Tue-Sun)
            ],
            "weekly_meals": [
              {
                "day_name": "Monday",
                "breakfast": { "name": "Meal Name", "calories": Number, "macros": {"protein": 0, "carbs": 0, "fats": 0}, "ingredients": ["Item 1", "Item 2"] },
                "lunch": { ... },
                "dinner": { ... },
                "snack": { ... }
              }
              ... (Repeat for Tue-Sun with UNIQUE meals)
            ],
            "shopping_list": ["Item 1", "Item 2", ...]
          }
        `;

        const responseText = await geminiModel.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
          config: {
            responseMimeType: "application/json"
          }
        });
        
        if (!responseText) {
          throw new Error("Empty response from AI");
        }

        // Remove any markdown code block formatting if present
        const cleanJson = responseText.replace(/^```json\n?|\n?```$/g, '').trim();
        const aiData = JSON.parse(cleanJson);

        // Map AI snake_case to Frontend camelCase
        const mappedPlan = {
          summary: aiData.summary,
          dailyCalories: aiData.daily_calories,
          macroTarget: aiData.macros,
          weeklyWorkouts: aiData.weekly_workouts?.map((w: any) => ({
            dayName: w.day_name,
            focus: w.focus,
            durationMinutes: w.duration_minutes,
            exercises: w.exercises
          })) || [],
          weeklyMeals: aiData.weekly_meals?.map((m: any) => ({
            dayName: m.day_name,
            breakfast: m.breakfast,
            lunch: m.lunch,
            dinner: m.dinner,
            snack: m.snack
          })) || [],
          shoppingList: aiData.shopping_list || []
        };

        // Standardized API Response Wrapper
        return reply.send({ success: true, data: mappedPlan });

      } catch (error) {
        request.log.error(error);
        // Return fallback in standard wrapper to prevent frontend crash
        return reply.send({ success: true, data: FALLBACK_PLAN });
      }
    }
  );
}