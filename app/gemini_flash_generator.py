"""
Gemini Flash Generator Module
Uses Gemini Flash model to generate rapid, personalized nutrition and recovery advice.
"""

import logging
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

from app.schemas import UserInput
from app.gemini_generator import get_gemini_client, GeminiAPIKeyError, GeminiServiceError

load_dotenv()
logger = logging.getLogger("fitbuddy.nutrition")

# Model identifier for fast generation
FLASH_MODEL = os.getenv("GEMINI_FLASH_MODEL", "gemini-3.8-flash")


def build_nutrition_prompt(user_input: UserInput) -> str:
    """
    Constructs the prompt for Gemini Flash to generate concise nutrition/recovery advice.
    """
    return f"""
You are FitBuddy's sports nutritionist. Provide a concise, practical nutrition and recovery tip (2 to 4 sentences maximum) tailored to this user:

USER METRICS:
- Name: {user_input.username}
- Age: {user_input.age} years old
- Body Weight: {user_input.weight} kg
- Fitness Goal: {user_input.goal}
- Intensity: {user_input.intensity}

GUIDELINES:
1. Cover key nutrition fundamentals such as daily protein target (e.g., in grams based on body weight), hydration recommendation (in liters), and pre/post-workout meal timing.
2. Address recovery and sleep.
3. DO NOT recommend extreme dieting, dangerous fasting, unverified supplements, or severe caloric deprivation.
4. Keep the output clean, motivational, concise, and ready to display in a nutrition card. Do NOT use markdown headers or greeting intros.
""".strip()


def generate_nutrition_tip_with_flash(user_input: UserInput) -> str:
    """
    Generates a concise and practical nutrition/recovery tip using Gemini Flash.
    
    Considers:
        - Goal
        - Workout intensity
        - User age and body weight
        
    Returns:
        str: Concise nutrition and recovery protocol.
        
    Raises:
        GeminiAPIKeyError: If API key is missing.
        GeminiServiceError: If Gemini Flash API fails.
    """
    client = get_gemini_client()
    prompt = build_nutrition_prompt(user_input)

    try:
        from google.genai import types

        config = types.GenerateContentConfig(
            temperature=0.5,
            system_instruction=(
                "You are FitBuddy's certified sports nutritionist. Deliver concise, safe, evidence-based "
                "dietary and recovery guidance in 2-4 sentences. Avoid extreme diets or medical prescriptions."
            )
        )

        response = client.models.generate_content(
            model=FLASH_MODEL,
            contents=prompt,
            config=config
        )

        if not response or not response.text:
            raise GeminiServiceError("Gemini Flash returned an empty nutrition response.")

        cleaned_text = response.text.strip()
        # Remove any lingering quotes or prefixes if present
        if cleaned_text.startswith('"') and cleaned_text.endswith('"'):
            cleaned_text = cleaned_text[1:-1].strip()

        return cleaned_text

    except GeminiAPIKeyError:
        raise
    except GeminiServiceError:
        raise
    except Exception as exc:
        logger.error(f"Error generating nutrition tip with Gemini Flash: {exc}")
        raise GeminiServiceError(f"Nutrition generation failed: {str(exc).splitlines()[0]}")
