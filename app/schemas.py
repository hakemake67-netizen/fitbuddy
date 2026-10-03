from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


class UserInput(BaseModel):
    """
    Schema for receiving user profile and workout parameters.
    Used for validation during workout generation requests.
    """
    user_id: str = Field(..., min_length=2, max_length=64, description="Unique user or member ID")
    username: str = Field(..., min_length=2, max_length=100, description="Display name of the user")
    age: int = Field(..., ge=12, le=120, description="User age in years (12-120)")
    weight: float = Field(..., ge=20.0, le=400.0, description="User weight in kilograms")
    goal: str = Field(..., min_length=2, max_length=100, description="Primary fitness goal")
    intensity: str = Field(..., min_length=2, max_length=50, description="Workout intensity level")

    @field_validator("username", "user_id", "goal", "intensity")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Field cannot be empty or whitespace only")
        return v_stripped


class FeedbackRequest(BaseModel):
    """
    Schema for receiving user feedback to revise an existing workout plan.
    Examples: 'Add more cardio', 'Include yoga', 'Reduce workout intensity'.
    """
    user_id: str = Field(..., min_length=1, max_length=64, description="Target user ID")
    feedback: str = Field(..., min_length=3, max_length=500, description="Revision instruction or feedback")

    @field_validator("feedback", "user_id")
    @classmethod
    def strip_feedback(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Field cannot be empty")
        return v_stripped


class ExerciseItem(BaseModel):
    """Schema representing an individual exercise item."""
    name: str
    sets_reps_or_duration: str


class DayWorkoutPlan(BaseModel):
    """Schema representing a single day in the 7-day workout plan."""
    day: str
    focus: str
    warm_up: str
    exercises: List[ExerciseItem]
    cool_down: str


class WorkoutPlanResponse(BaseModel):
    """Schema for returning structured workout plan results."""
    user_id: str
    username: str
    goal: str
    intensity: str
    seven_day_plan: List[DayWorkoutPlan]
    nutrition_tip: str
    updated_plan: Optional[str] = None


class UserRecordResponse(BaseModel):
    """Schema for displaying stored records in the admin view."""
    id: int
    user_id: str
    username: str
    age: int
    weight: float
    goal: str
    intensity: str
    original_plan: str
    updated_plan: Optional[str] = None
    nutrition_tip: str
    created_at: datetime

    class Config:
        from_attributes = True
