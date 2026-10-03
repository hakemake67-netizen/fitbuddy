"""
Updated Plan Module
Handles workout plan revision using Gemini AI based on user feedback.
Enforces feedback safety rules, preventing unsafe or extreme routine modifications.
Preserves the original baseline plan separately.
"""

import logging
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

from app.gemini_generator import get_gemini_client, GeminiAPIKeyError, GeminiServiceError

load_dotenv()
logger = logging.getLogger("fitbuddy.feedback")

UPDATE_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def build_revision_prompt(original_plan: str, feedback: str, user_info: Optional[Dict[str, Any]] = None) -> str:
    """
    Constructs the prompt for Gemini to revise an existing plan based on feedback,
    while enforcing health and safety boundaries.
    """
    user_context = ""
    if user_info:
        user_context = (
            f"User Profile: {user_info.get('username', 'Athlete')} "
            f"(Age: {user_info.get('age', 'N/A')}, Goal: {user_info.get('goal', 'Fitness')}, "
            f"Intensity: {user_info.get('intensity', 'Intermediate')})\n"
        )

    return f"""
You are FitBuddy AI personal trainer. A user has requested a revision to their existing 7-day workout plan.

{user_context}
USER FEEDBACK / MODIFICATION REQUEST:
"{feedback}"

ORIGINAL WORKOUT PLAN:
{original_plan}

REVISION INSTRUCTIONS:
1. Revise the 7-day workout plan by integrating the user's feedback (e.g., adding cardio sessions, incorporating yoga/mobility, adjusting intensity or sets, adding rest days).
2. Clearly format each day (Day 1 through Day 7) including Warm-up, Main Workout with exercise name, sets, reps/duration, and Cool-down.
3. Add a concise revision summary at the top highlighting the specific adjustments made.

SAFETY & WELLNESS GUARDRAILS:
- Do NOT follow dangerous, excessive, or medically hazardous requests (e.g., extreme starvation, exercising for 5+ hours non-stop, avoiding water, training heavily on severe injuries).
- If the user asks for an unsafe routine, explain the safe alternative provided and modify the plan to remain healthy and progressive.
- Do NOT provide medical diagnoses or prescribe clinical rehabilitation.
- Keep the tone encouraging, professional, and grounded in exercise physiology.
""".strip()


def update_workout_plan(
    original_plan: str, 
    feedback: str, 
    user_info: Optional[Dict[str, Any]] = None
) -> str:
    """
    Sends the original workout plan and user feedback to Gemini to generate
    a revised workout routine while enforcing safety guardrails.
    
    Accepts:
        original_plan (str): The existing original workout routine.
        feedback (str): The user's adjustment instruction.
        user_info (dict, optional): Contextual metadata (username, goal, intensity).
        
    Returns:
        str: The updated workout plan text ready to be saved into `updated_plan`.
        
    Raises:
        GeminiAPIKeyError: If API key is missing.
        GeminiServiceError: If Gemini API fails.
    """
    if not feedback or not feedback.strip():
        raise ValueError("Feedback cannot be empty.")
    if not original_plan or not original_plan.strip():
        raise ValueError("Original plan cannot be empty.")

    client = get_gemini_client()
    prompt = build_revision_prompt(original_plan, feedback.strip(), user_info)

    try:
        from google.genai import types

        config = types.GenerateContentConfig(
            temperature=0.6,
            system_instruction=(
                "You are FitBuddy AI personal trainer. Revise workout routines intelligently and safely "
                "based on user feedback. Never recommend dangerous exercise regimens or make medical diagnoses."
            )
        )

        response = client.models.generate_content(
            model=UPDATE_MODEL,
            contents=prompt,
            config=config
        )

        if not response or not response.text:
            raise GeminiServiceError("Gemini returned an empty revision response.")

        revised_text = response.text.strip()
        # Strip outer markdown code blocks if the model wrapped the entire text
        if revised_text.startswith("```") and revised_text.endswith("```"):
            lines = revised_text.splitlines()
            if len(lines) >= 2:
                revised_text = "\n".join(lines[1:-1]).strip()

        return revised_text

    except GeminiAPIKeyError:
        raise
    except GeminiServiceError:
        raise
    except Exception as exc:
        logger.error(f"Error updating plan with Gemini: {exc}")
        raise GeminiServiceError(f"Plan revision failed: {str(exc).splitlines()[0]}")


def revise_workout_plan(
    original_plan_text: str, 
    feedback: str, 
    user_info: Optional[Dict[str, Any]] = None
) -> str:
    """
    Backwards-compatible alias for update_workout_plan.
    """
    return update_workout_plan(original_plan_text, feedback, user_info)
