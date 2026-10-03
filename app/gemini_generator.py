"""
Gemini Generator Module
Handles Gemini API integration for personalized 7-day workout plan generation.
Uses Google Gemini API via the google-genai SDK.
"""

import json
import logging
import os
import re
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from app.schemas import UserInput

load_dotenv()
logger = logging.getLogger("fitbuddy.gemini")

# Default model for structured generation
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


class FitBuddyGeminiError(Exception):
    """Base exception for FitBuddy Gemini integration errors."""
    pass


class GeminiAPIKeyError(FitBuddyGeminiError):
    """Raised when the Gemini API key is missing, empty, or unconfigured."""
    pass


class GeminiServiceError(FitBuddyGeminiError):
    """Raised when the Gemini API call fails, times out, or returns invalid data."""
    pass


def get_gemini_client():
    """
    Initializes and returns a Google GenAI client using GOOGLE_API_KEY from environment.
    Raises GeminiAPIKeyError if the key is missing or a default placeholder.
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() in ("", "your_api_key_here", "your_gemini_api_key_here", "MY_GEMINI_API_KEY"):
        raise GeminiAPIKeyError(
            "Gemini API key is not configured. Please set a valid GOOGLE_API_KEY in your .env file."
        )
    
    try:
        from google import genai
        return genai.Client(api_key=api_key.strip())
    except ImportError:
        raise GeminiServiceError(
            "The 'google-genai' package is not installed. Please run: pip install -r requirements.txt"
        )
    except Exception as e:
        logger.error(f"Failed to initialize Gemini client: {e}")
        raise GeminiServiceError("Failed to initialize Google Gemini client.")


def build_workout_prompt(user_input: UserInput) -> str:
    """
    Constructs the detailed instruction prompt for Gemini to generate
    a strictly structured 7-day workout routine in JSON format.
    """
    return f"""
You are FitBuddy, an expert certified personal trainer and exercise physiologist.
Create a personalized, scientifically backed 7-day workout routine tailored to the user profile below.

USER PROFILE:
- Username: {user_input.username} (ID: {user_input.user_id})
- Age: {user_input.age} years old
- Body Weight: {user_input.weight} kg
- Primary Fitness Goal: {user_input.goal}
- Workout Intensity: {user_input.intensity}

STRICT OUTPUT REQUIREMENTS:
1. Return a JSON object with a single top-level key: "seven_day_plan".
2. "seven_day_plan" must be an array of exactly 7 objects (Day 1 through Day 7).
3. Each day object MUST have the following keys:
   - "day": string (e.g. "Day 1 – Upper Body Push", "Day 2 – Lower Body Strength")
   - "focus": string (e.g. "Chest, Shoulders & Triceps", "Active Recovery & Mobility")
   - "warm_up": string (approx 5–10 minutes of specific dynamic mobility and warm-up prep)
   - "main_workout": array of exercise objects, each containing:
       * "exercise_name": string (clear exercise name)
       * "sets": string or integer (e.g. "3" or "4")
       * "reps_or_duration": string (e.g. "10-12 reps" or "45 seconds")
       * "rest": string (e.g. "60-90 seconds" or "30 seconds")
   - "cool_down": string (stretching, foam rolling, and recovery suggestions)

4. Ensure workouts are safe, balanced, and strictly calibrated for age {user_input.age}, weight {user_input.weight}kg, goal "{user_input.goal}", and intensity "{user_input.intensity}".
5. Do NOT include any conversational filler, markdown fences, or preamble. Return ONLY valid JSON.
""".strip()


def parse_gemini_json_response(raw_text: str) -> Dict[str, Any]:
    """
    Safely extracts and parses JSON from Gemini's response text,
    stripping markdown backticks if present.
    """
    cleaned = raw_text.strip()
    
    # Strip markdown code blocks like ```json ... ``` or ``` ... ```
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
        if not isinstance(data, dict):
            raise ValueError("Expected top-level JSON object")
        return data
    except Exception as e:
        logger.error(f"JSON parsing error from Gemini output: {e}\nRaw output was: {raw_text[:300]}")
        raise GeminiServiceError("FitBuddy received an unparseable response format from Gemini AI.")


def format_days_to_text(days: List[Dict[str, Any]], user_input: UserInput) -> str:
    """
    Converts structured day list into readable text format for SQLite storage.
    """
    lines = [
        "FITBUDDY 7-DAY WORKOUT PLAN (GENERATED VIA GEMINI AI)",
        f"User: {user_input.username} (ID: {user_input.user_id})",
        f"Goal: {user_input.goal} | Intensity: {user_input.intensity}",
        "=" * 50,
        ""
    ]
    for d in days:
        day_title = d.get("day", "Day")
        focus = d.get("focus", "")
        lines.append(f"[{day_title}] - {focus}")
        lines.append(f"  Warm-up: {d.get('warm_up', '5-10 min dynamic mobility')}")
        lines.append("  Main Workout:")
        for ex in d.get("main_workout", []):
            name = ex.get("exercise_name", "Exercise")
            sets = ex.get("sets", "3")
            reps = ex.get("reps_or_duration", "10 reps")
            rest = ex.get("rest", "60s rest")
            lines.append(f"    • {name} — {sets} sets x {reps} (Rest: {rest})")
        lines.append(f"  Cool-down: {d.get('cool_down', '5 min static stretching')}")
        lines.append("-" * 40)
    return "\n".join(lines)


def generate_workout_gemini(user_input: UserInput) -> Dict[str, Any]:
    """
    Generates a personalized 7-day workout plan using the Google Gemini API.
    
    Accepts:
        user_input (UserInput): User profile including age, weight, goal, and intensity.
        
    Returns:
        dict containing:
            - user_id
            - username
            - goal
            - intensity
            - seven_day_plan (list of day dicts with warm_up, main_workout, cool_down)
            - original_plan_text (formatted string representation for database storage)
            
    Raises:
        GeminiAPIKeyError: If GOOGLE_API_KEY is missing or invalid.
        GeminiServiceError: If Gemini API fails, times out, or returns malformed output.
    """
    client = get_gemini_client()
    prompt = build_workout_prompt(user_input)
    model_name = DEFAULT_GEMINI_MODEL

    try:
        from google.genai import types

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.6,
            system_instruction=(
                "You are FitBuddy, a certified personal trainer. Always output strictly valid JSON "
                "representing a 7-day workout plan with Warm-up, Main Workout (exercise name, sets, reps, rest), "
                "and Cool-down. Never output conversational pleasantries or markdown outside of JSON."
            )
        )

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config
        )

        if not response or not response.text:
            raise GeminiServiceError("Gemini API returned an empty response.")

        parsed_data = parse_gemini_json_response(response.text)
        seven_days = parsed_data.get("seven_day_plan", [])

        if not isinstance(seven_days, list) or len(seven_days) == 0:
            raise GeminiServiceError("Gemini plan response did not contain a valid 'seven_day_plan' array.")

        # Standardize day format
        formatted_days = []
        for i, d in enumerate(seven_days, start=1):
            day_label = d.get("day", f"Day {i}")
            focus = d.get("focus", f"Session {i}")
            warm_up = d.get("warm_up", "5-10 min dynamic mobility")
            cool_down = d.get("cool_down", "5 min full-body static stretches")
            
            raw_exercises = d.get("main_workout", []) or d.get("exercises", [])
            exercises = []
            for ex in raw_exercises:
                if isinstance(ex, dict):
                    name = ex.get("exercise_name") or ex.get("name") or "Core Exercise"
                    sets = str(ex.get("sets", "3"))
                    reps = str(ex.get("reps_or_duration") or ex.get("reps") or "10-12 reps")
                    rest = str(ex.get("rest") or "60s rest")
                    exercises.append({
                        "exercise_name": name,
                        "sets": sets,
                        "reps_or_duration": reps,
                        "rest": rest
                    })
                elif isinstance(ex, str):
                    exercises.append({
                        "exercise_name": ex,
                        "sets": "3",
                        "reps_or_duration": "10-12 reps",
                        "rest": "60s"
                    })

            formatted_days.append({
                "day": day_label,
                "focus": focus,
                "warm_up": warm_up,
                "main_workout": exercises,
                "cool_down": cool_down
            })

        formatted_plan_str = format_days_to_text(formatted_days, user_input)

        return {
            "user_id": user_input.user_id,
            "username": user_input.username,
            "goal": user_input.goal,
            "intensity": user_input.intensity,
            "seven_day_plan": formatted_days,
            "original_plan_text": formatted_plan_str
        }

    except GeminiAPIKeyError:
        raise
    except GeminiServiceError:
        raise
    except Exception as exc:
        logger.error(f"Unexpected error calling Gemini API: {exc}")
        # Strip sensitive token or connection details from error message
        raise GeminiServiceError(f"Gemini API request failed: {str(exc).splitlines()[0]}")


def generate_workout_plan(user_input: UserInput) -> Dict[str, Any]:
    """
    Backwards-compatible alias for generate_workout_gemini.
    """
    return generate_workout_gemini(user_input)
