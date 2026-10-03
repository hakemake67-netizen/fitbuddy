# FITBUDDY — AI Fitness Plan Generator using Gemini Models
### Naan Mudhalvan SkillWallet Team Project Activity (Professional Glassmorphic Redesign)

**FitBuddy** is an intelligent, full-stack fitness plan generator powered by Google Gemini Models. It collects biometric metrics and fitness goals, generates a structured 7-day personalized periodization routine (complete with dynamic warm-ups, exercises with sets/reps/duration and rest intervals, cool-downs, and evidence-based nutrition/recovery advice), supports iterative feedback revisions while strictly preserving the original baseline plan, provides professional session consistency tracking (completion percentage and weekly schedule adherence), and offers an administrative console for inspecting all stored user routines in a persistent SQLite database via SQLAlchemy.

---

## 1. Complete Technology Stack

- **Backend Framework**: Python 3.10+, FastAPI (High-performance asynchronous web framework)
- **ASGI Server**: Uvicorn (`uvicorn app.main:app --reload`)
- **Templating Engine**: Jinja2 (Dynamic server-rendered HTML5 pages)
- **Database & ORM**: SQLite with SQLAlchemy ORM (`UserWorkout` model, persistent database `fitbuddy.db`)
- **Data Validation & Typing**: Pydantic v2 (`UserInput`, `FeedbackRequest`, `DayWorkoutPlan`)
- **AI Models & SDK**: Google Gemini API via `@google/genai` and `google-genai` Python SDK
  - **Workout Generation & Revision Engine**: `gemini-2.5-flash` (Structured JSON periodization)
  - **Nutrition & Recovery Protocol**: `gemini-2.5-flash` (Concise dietary advice)
- **Frontend Architecture**:
  - Semantic HTML5 & CSS3 with custom properties and responsive dark glassmorphic aesthetic
  - Restrained palette: Near-black background (`#07090d`), charcoal glass, translucent white borders, muted cool gray typography, and sage-mint accent (`#8ee6c1`)
  - No emojis, no cartoon badges, no fake XP/level gamification
  - Subtle architectural visual motion using pure CSS keyframes
  - Vanilla JavaScript for staged system status overlays, interactive exercise checklists, and day switching
  - LocalStorage persistence for authentic workout session tracking
- **API Documentation**: Automated OpenAPI documentation (`/docs` Swagger UI and `/redoc`)

---

## 2. Project Architecture & Directory Layout

```
FitBuddy/
│
├── app/
│   ├── __init__.py               # Package initializer
│   ├── main.py                   # FastAPI initialization, static file mounting, lifespan DB setup
│   ├── routes.py                 # Endpoints: GET /, POST /generate-workout, POST /submit-feedback, GET /view-all-users
│   ├── database.py               # SQLite connection, SessionLocal, UserWorkout SQLAlchemy model
│   ├── schemas.py                # Pydantic models: UserInput, FeedbackRequest, DayWorkoutPlan
│   ├── gemini_generator.py       # Prompt builder and 7-day workout generator with Google Gemini API
│   ├── gemini_flash_generator.py # Gemini Flash engine for rapid nutrition and recovery advice
│   ├── updated_plan.py           # Feedback revision engine with safety guardrails (preserves original baseline)
│   │
│   └── templates/
│       ├── index.html            # Hero welcome, architectural glass visual, and onboarding form
│       ├── result.html           # 7-day dashboard, spotlight hero, nutrition card, feedback panel, progress
│       └── all_users.html        # Admin console table displaying stored users/plans with instant search
│
├── static/
│   ├── css/
│   │   └── style.css             # Refactored professional glassmorphism design system & micro-interactions
│   └── js/
│       └── app.js                # System status overlays, day switching, authentic session progress logic
│
├── .env.example                  # Template for required environment variables
├── .env                          # Local environment configuration (GOOGLE_API_KEY, HOST, PORT)
├── .gitignore                    # Python bytecode, virtual environments, SQLite DB ignores
├── requirements.txt              # Production Python dependencies
├── package.json                  # AI Studio preview runtime dependencies
└── README.md                     # Comprehensive project documentation & testing manual
```

---

## 3. Installation & Local Setup

### Step 1: Clone or Open the Repository
```bash
git clone <repository_url>
cd FitBuddy
```

### Step 2: Create and Activate a Python Virtual Environment
- **Linux / macOS**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- **Windows (PowerShell)**:
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- **Windows (Command Prompt)**:
  ```cmd
  python -m venv venv
  .\venv\Scripts\activate.bat
  ```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env` (or verify `.env`):
```bash
cp .env.example .env
```
Ensure your Gemini API key is configured:
```env
# Google Gemini API Key
GOOGLE_API_KEY=your_actual_gemini_api_key_here

# Model Selection
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FLASH_MODEL=gemini-2.5-flash

# Server Configuration
HOST=127.0.0.1
PORT=8000
```

---

## 4. Running the Application

### Start the FastAPI Server with Uvicorn:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Or directly using Python:
```bash
python -m app.main
```

### Access Points:
| Service | URL | Description |
| :--- | :--- | :--- |
| **FitBuddy Home Page** | `http://127.0.0.1:8000/` | Interactive biometric form & architectural visual |
| **Admin Console** | `http://127.0.0.1:8000/view-all-users` | SQLite registry of all user workouts |
| **Interactive API Docs (Swagger UI)** | `http://127.0.0.1:8000/docs` | Live testing of all endpoints |
| **Alternative API Docs (ReDoc)** | `http://127.0.0.1:8000/redoc` | OpenAPI reference documentation |

---

## 5. Endpoints & API Testing Manual

### 1. Home Page (`GET /`)
- Displays the FitBuddy landing interface.
- Includes architectural glass visual with quiet rotation and subtle float motion.
- Form inputs: `user_id`, `username`, `age`, `weight`, `goal`, `intensity`.

### 2. Generate Workout (`POST /generate-workout`)
- Accepts multipart form data or JSON payload.
- Validates data via Pydantic (`UserInput`).
- Invokes `generate_workout_gemini()` to generate a structured 7-day periodization plan.
- Invokes `generate_nutrition_tip_with_flash()` to generate dietary guidance.
- Saves record into SQLite `UserWorkout` table (`original_plan` populated, `updated_plan = None`).
- Renders `result.html` with interactive checklists and day switching.

**Curl Test Command (JSON):**
```bash
curl -X POST "http://127.0.0.1:8000/generate-workout" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "FB-TEST-1",
    "username": "Jordan Lee",
    "age": 26,
    "weight": 72.0,
    "goal": "Muscle Gain",
    "intensity": "Intermediate"
  }'
```

### 3. Submit Feedback (`POST /submit-feedback`)
- Accepts `user_id` and `feedback` (e.g., *"reduce lower-body volume and add one recovery session"*).
- Retrieves original plan from SQLite.
- Invokes `update_workout_plan()` to revise the routine with health & safety guardrails.
- **Critical Requirement**: Saves revised plan into `updated_plan` **without overwriting `original_plan`**.
- Renders `result.html` displaying both the revised plan and the original baseline for comparison.

**Curl Test Command:**
```bash
curl -X POST "http://127.0.0.1:8000/submit-feedback" \
  -d "user_id=FB-TEST-1" \
  -d "feedback=reduce lower-body volume and add one recovery session"
```

### 4. Admin View (`GET /view-all-users`)
- Queries all stored records from SQLite via SQLAlchemy session.
- Displays biometric stats, status badges (`Baseline` vs `Revised`), nutrition advice, and expandable original and updated workout routines.
- Includes client-side real-time search filtering.

**Curl Test Command:**
```bash
curl -X GET "http://127.0.0.1:8000/view-all-users"
```

---

## 6. Professional UI Redesign Principles

1. **Restrained Color & Glassmorphic System**: Near-black background (`#07090d`), charcoal glass panels (`rgba(255, 255, 255, 0.035)`), translucent white borders (`rgba(255, 255, 255, 0.08)`), and a single refined sage-mint accent (`#8ee6c1`).
2. **Zero Emojis Everywhere**: All emojis have been removed across templates, scripts, buttons, and styles, replaced with clean typography and minimal geometric vectors.
3. **No Fake Gamification**: Removed artificial XP numbers, streak flames, levels (Warrior/Titan), and confetti. Replaced with authentic session adherence tracking (`4 / 7 sessions • 57%`).
4. **Quiet, Cinematic Motion**: Smooth ease-out transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) and subtle floating motion that pauses on hover.
5. **Generous Spacing & High-End Typography**: Plus Jakarta Sans with crisp font weights and clear hierarchy from primary headers to metadata.
