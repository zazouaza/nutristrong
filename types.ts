export enum GoalType {
  LOSE_FAT = 'Lose Fat',
  MAINTAIN = 'Maintain',
  GAIN_MUSCLE = 'Gain Muscle',
  ATHLETIC_PERFORMANCE = 'Athletic Performance'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: GoalType;
  activityLevel: string; // "Sedentary", "Active", etc.
  dietaryRestrictions: string;
  allergies: string;
}

export interface MacroSplit {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  name: string;
  calories: number;
  macros: MacroSplit;
  ingredients: string[];
}

export interface DailyMealPlan {
  dayName: string;
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack: MealItem;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
}

export interface DailyWorkout {
  dayName: string;
  focus: string; // e.g., "Push Day", "Cardio", "Rest"
  durationMinutes: number;
  exercises: Exercise[];
}

export interface ComprehensivePlan {
  summary: string;
  dailyCalories: number;
  macroTarget: MacroSplit;
  weeklyMeals: DailyMealPlan[];
  weeklyWorkouts: DailyWorkout[];
  shoppingList: string[];
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ONBOARDING = 'ONBOARDING',
  LOADING = 'LOADING', // Generation Phase
  PLAN_PREVIEW = 'PLAN_PREVIEW',
  DASHBOARD = 'DASHBOARD',
  MEALS = 'MEALS',
  WORKOUTS = 'WORKOUTS',
  SHOPPING = 'SHOPPING',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
  ACTIVE_SESSION = 'ACTIVE_SESSION'
}