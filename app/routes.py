"""
FastAPI Routes for FitBuddy
Connects Pydantic validation, Gemini AI Generation, Gemini Flash Nutrition,
and SQLite persistence.
Endpoints:
- GET  /                  : Home page with user input form
- POST /generate-workout  : Generates AI 7-day routine and Flash nutrition tip, persists in DB
- POST /submit-feedback   : Revises plan via Gemini while preserving baseline plan in DB
- GET  /view-all-users    : Admin view displaying stored users, baseline plans, and revisions
"""

import logging
from typing import Optional
from fastapi import APIRouter, Depends, Request, Form, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db, UserWorkout
from app.schemas import UserInput, FeedbackRequest
from app.gemini_generator import (
    generate_workout_gemini,
    GeminiAPIKeyError,
    GeminiServiceError,
    FitBuddyGeminiError
)
from app.gemini_flash_generator import generate_nutrition_tip_with_flash
from app.updated_plan import update_workout_plan

logger = logging.getLogger("fitbuddy.routes")

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    """Renders the FitBuddy home page featuring user profile inputs."""
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "FitBuddy - AI Fitness Plan Generator"
        }
    )


@router.post("/generate-workout", response_class=HTMLResponse)
async def generate_workout(
    request: Request,
    user_id: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    weight: Optional[float] = Form(None),
    goal: Optional[str] = Form(None),
    intensity: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Receives user information, validates inputs via Pydantic, invokes Gemini for
    a 7-day workout plan, invokes Gemini Flash for nutrition advice, and stores
    the record in the SQLite database.
    """
    content_type = request.headers.get("content-type", "")
    is_json = "application/json" in content_type

    form_cache = {
        "user_id": user_id or "",
        "username": username or "",
        "age": age or "",
        "weight": weight or "",
        "goal": goal or "",
        "intensity": intensity or ""
    }

    # Step 1: Input Validation
    if is_json:
        try:
            body = await request.json()
            user_input = UserInput(**body)
        except Exception as err:
            raise HTTPException(status_code=422, detail=f"Validation error: {str(err)}")
    else:
        if not user_id or not username or age is None or weight is None or not goal or not intensity:
            return templates.TemplateResponse(
                "index.html",
                {
                    "request": request,
                    "error_message": "All fields are required. Please fill in your complete profile details.",
                    "form_data": form_cache
                },
                status_code=400
            )

        try:
            user_input = UserInput(
                user_id=user_id,
                username=username,
                age=age,
                weight=weight,
                goal=goal,
                intensity=intensity
            )
        except Exception as val_err:
            return templates.TemplateResponse(
                "index.html",
                {
                    "request": request,
                    "error_message": f"Input validation error: {str(val_err)}",
                    "form_data": form_cache
                },
                status_code=400
            )

    # Step 2: Invoke Gemini AI Workout Generator and Gemini Flash Nutrition
    try:
        workout_result = generate_workout_gemini(user_input)
        nutrition_tip = generate_nutrition_tip_with_flash(user_input)
    except GeminiAPIKeyError as key_err:
        logger.warning(f"Gemini API key error: {key_err}")
        err_msg = (
            "FitBuddy AI Service Notice: Gemini API key is not configured. "
            "Please provide your GOOGLE_API_KEY in the .env file."
        )
        if is_json:
            raise HTTPException(status_code=503, detail=err_msg)
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": err_msg,
                "form_data": form_cache
            },
            status_code=503
        )
    except GeminiServiceError as srv_err:
        logger.error(f"Gemini service error during plan generation: {srv_err}")
        err_msg = f"FitBuddy AI was unable to complete your workout request: {str(srv_err)}"
        if is_json:
            raise HTTPException(status_code=502, detail=err_msg)
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": err_msg,
                "form_data": form_cache
            },
            status_code=502
        )
    except Exception as general_err:
        logger.error(f"Unexpected error in workout generation: {general_err}")
        err_msg = "An unexpected error occurred while generating your fitness plan. Please try again."
        if is_json:
            raise HTTPException(status_code=500, detail=err_msg)
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": err_msg,
                "form_data": form_cache
            },
            status_code=500
        )

    # Step 3: Database Persistence
    try:
        new_record = UserWorkout(
            user_id=user_input.user_id,
            username=user_input.username,
            age=user_input.age,
            weight=user_input.weight,
            goal=user_input.goal,
            intensity=user_input.intensity,
            original_plan=workout_result["original_plan_text"],
            updated_plan=None,
            nutrition_tip=nutrition_tip
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
    except SQLAlchemyError as db_err:
        db.rollback()
        logger.error(f"Database error while saving workout plan: {db_err}")
        err_msg = "Failed to store workout plan in database. Please try again."
        if is_json:
            raise HTTPException(status_code=500, detail=err_msg)
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": err_msg,
                "form_data": form_cache
            },
            status_code=500
        )

    # Step 4: Return Response
    if is_json:
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "id": new_record.id,
                "user_id": new_record.user_id,
                "username": new_record.username,
                "goal": new_record.goal,
                "intensity": new_record.intensity,
                "seven_day_plan": workout_result["seven_day_plan"],
                "original_plan": workout_result["original_plan_text"],
                "nutrition_tip": nutrition_tip
            }
        )

    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "record_id": new_record.id,
            "user_id": new_record.user_id,
            "username": new_record.username,
            "age": new_record.age,
            "weight": new_record.weight,
            "goal": new_record.goal,
            "intensity": new_record.intensity,
            "seven_day_plan": workout_result["seven_day_plan"],
            "original_plan_text": workout_result["original_plan_text"],
            "updated_plan_text": None,
            "nutrition_tip": nutrition_tip,
            "feedback_applied": False
        }
    )


@router.post("/submit-feedback", response_class=HTMLResponse)
async def submit_feedback(
    request: Request,
    user_id: Optional[str] = Form(None),
    feedback: Optional[str] = Form(None),
    record_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Receives user feedback, retrieves the existing original plan from SQLite,
    invokes Gemini to generate an updated plan with safety guardrails,
    and updates `updated_plan` in SQLite while keeping `original_plan` unchanged.
    """
    content_type = request.headers.get("content-type", "")
    is_json = "application/json" in content_type

    if is_json:
        try:
            body = await request.json()
            feedback_data = FeedbackRequest(**body)
            target_user_id = feedback_data.user_id
            user_feedback = feedback_data.feedback
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Invalid JSON payload: {str(e)}")
    else:
        if not user_id or not feedback or not feedback.strip():
            raise HTTPException(status_code=400, detail="Missing user_id or feedback parameter")
        target_user_id = user_id.strip()
        user_feedback = feedback.strip()

    # Step 1: Retrieve existing record from SQLite
    query = db.query(UserWorkout)
    if record_id:
        record = query.filter(UserWorkout.id == record_id).first()
    else:
        record = query.filter(UserWorkout.user_id == target_user_id).order_by(UserWorkout.id.desc()).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No workout plan record found for user_id '{target_user_id}'."
        )

    # Step 2: Send original plan and feedback to Gemini
    try:
        user_context = {
            "username": record.username,
            "user_id": record.user_id,
            "age": record.age,
            "weight": record.weight,
            "goal": record.goal,
            "intensity": record.intensity
        }
        revised_plan_text = update_workout_plan(
            original_plan=record.original_plan,
            feedback=user_feedback,
            user_info=user_context
        )
    except GeminiAPIKeyError as key_err:
        logger.warning(f"Gemini API key error on feedback revision: {key_err}")
        err_msg = "Cannot revise plan: Gemini API key is missing. Please set GOOGLE_API_KEY in .env."
        if is_json:
            raise HTTPException(status_code=503, detail=err_msg)
        return templates.TemplateResponse(
            "result.html",
            {
                "request": request,
                "record_id": record.id,
                "user_id": record.user_id,
                "username": record.username,
                "age": record.age,
                "weight": record.weight,
                "goal": record.goal,
                "intensity": record.intensity,
                "seven_day_plan": None,
                "original_plan_text": record.original_plan,
                "updated_plan_text": record.updated_plan,
                "nutrition_tip": record.nutrition_tip,
                "error_banner": err_msg,
                "feedback_applied": False
            },
            status_code=503
        )
    except GeminiServiceError as srv_err:
        logger.error(f"Gemini error during plan revision: {srv_err}")
        err_msg = f"FitBuddy AI could not revise your plan: {str(srv_err)}"
        if is_json:
            raise HTTPException(status_code=502, detail=err_msg)
        return templates.TemplateResponse(
            "result.html",
            {
                "request": request,
                "record_id": record.id,
                "user_id": record.user_id,
                "username": record.username,
                "age": record.age,
                "weight": record.weight,
                "goal": record.goal,
                "intensity": record.intensity,
                "seven_day_plan": None,
                "original_plan_text": record.original_plan,
                "updated_plan_text": record.updated_plan,
                "nutrition_tip": record.nutrition_tip,
                "error_banner": err_msg,
                "feedback_applied": False
            },
            status_code=502
        )

    # Step 3: Save revised version separately as `updated_plan` (original is untouched)
    try:
        record.updated_plan = revised_plan_text
        db.commit()
        db.refresh(record)
    except SQLAlchemyError as db_err:
        db.rollback()
        logger.error(f"Database error saving updated plan: {db_err}")
        raise HTTPException(status_code=500, detail="Database error saving revised plan.")

    # Step 4: Render updated result page
    if is_json:
        return JSONResponse(
            content={
                "id": record.id,
                "user_id": record.user_id,
                "feedback": user_feedback,
                "original_plan": record.original_plan,
                "updated_plan": record.updated_plan,
                "nutrition_tip": record.nutrition_tip
            }
        )

    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "record_id": record.id,
            "user_id": record.user_id,
            "username": record.username,
            "age": record.age,
            "weight": record.weight,
            "goal": record.goal,
            "intensity": record.intensity,
            "seven_day_plan": None,
            "original_plan_text": record.original_plan,
            "updated_plan_text": record.updated_plan,
            "nutrition_tip": record.nutrition_tip,
            "feedback_applied": True,
            "submitted_feedback": user_feedback
        }
    )


@router.get("/view-all-users", response_class=HTMLResponse)
async def view_all_users(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Admin view: Displays all stored users, their parameters,
    original workout plans, updated plans, and nutrition tips.
    """
    records = db.query(UserWorkout).order_by(UserWorkout.created_at.desc()).all()
    
    content_type = request.headers.get("accept", "")
    if "application/json" in content_type and "text/html" not in content_type:
        return JSONResponse(
            content=[
                {
                    "id": r.id,
                    "user_id": r.user_id,
                    "username": r.username,
                    "age": r.age,
                    "weight": r.weight,
                    "goal": r.goal,
                    "intensity": r.intensity,
                    "has_updated_plan": r.updated_plan is not None,
                    "nutrition_tip": r.nutrition_tip,
                    "created_at": r.created_at.isoformat() if r.created_at else None
                }
                for r in records
            ]
        )

    return templates.TemplateResponse(
        "all_users.html",
        {
            "request": request,
            "records": records,
            "total_users": len(records)
        }
    )
