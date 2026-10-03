/**
 * FITBUDDY Client Logic
 * Professional UI • Clean State • Restrained Feedback
 */

let currentSpotlightDay = 1;
let planDays = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Generation Form Submission & System Status Progress
    const workoutForm = document.getElementById("workoutForm");
    const systemLoadingOverlay = document.getElementById("systemLoadingOverlay");
    const overlayStatusMsg = document.getElementById("overlayStatusMsg");
    const overlayProgressFill = document.getElementById("overlayProgressFill");

    if (workoutForm && systemLoadingOverlay) {
        workoutForm.addEventListener("submit", () => {
            systemLoadingOverlay.classList.add("active");

            const stages = [
                { time: 100, text: "Analyzing profile", progress: "25%" },
                { time: 1800, text: "Creating weekly structure", progress: "55%" },
                { time: 3800, text: "Balancing training load", progress: "80%" },
                { time: 5800, text: "Preparing recovery guidance", progress: "95%" }
            ];

            stages.forEach(stage => {
                setTimeout(() => {
                    if (overlayStatusMsg) overlayStatusMsg.textContent = stage.text;
                    if (overlayProgressFill) overlayProgressFill.style.width = stage.progress;
                }, stage.time);
            });
        });
    }

    // 2. Feedback Form Submission & System Status Progress
    const feedbackForm = document.getElementById("feedbackForm");
    const revisionLoadingOverlay = document.getElementById("revisionLoadingOverlay");
    const revisionStatusMsg = document.getElementById("revisionStatusMsg");
    const revisionProgressFill = document.getElementById("revisionProgressFill");

    if (feedbackForm && revisionLoadingOverlay) {
        feedbackForm.addEventListener("submit", () => {
            revisionLoadingOverlay.classList.add("active");

            const stages = [
                { time: 100, text: "Reviewing your request", progress: "30%" },
                { time: 1600, text: "Rebalancing weekly schedule", progress: "70%" },
                { time: 3400, text: "Preserving your original plan", progress: "95%" }
            ];

            stages.forEach(stage => {
                setTimeout(() => {
                    if (revisionStatusMsg) revisionStatusMsg.textContent = stage.text;
                    if (revisionProgressFill) revisionProgressFill.style.width = stage.progress;
                }, stage.time);
            });
        });
    }

    // 3. Initialize Dashboard Data if present
    const planScript = document.getElementById("sevenDayPlanData");
    if (planScript) {
        try {
            planDays = JSON.parse(planScript.textContent || "[]");
        } catch (e) {
            console.error("Unable to parse program data:", e);
            planDays = [];
        }

        initProgressTracking();
    }

    // 4. Initialize Cinematic Motion Graphics Background
    initCinematicMotionCanvas();

    // 5. Initialize Scrolltide.co Scroll Kinetics & Random Color Engine
    initRandomColor();
    initScrolltide();
    initInteractiveSpotlight();
});

// Interactive Accent RGB Global State
window.currentAccentRgb = "142, 230, 193";
window.scrollVelocity = 0;

let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let lastScrollTime = Date.now();

window.addEventListener("scroll", () => {
    const now = Date.now();
    const dt = Math.max(now - lastScrollTime, 16);
    const dy = window.scrollY - lastScrollY;
    window.scrollVelocity = dy / dt;
    lastScrollY = window.scrollY;
    lastScrollTime = now;
}, { passive: true });

/**
 * Curated Spectrum of High-End Athletic & Tech Palettes
 */
const RANDOM_PALETTES = [
    { name: "Mint Emerald", hex: "#8ee6c1", rgb: "142, 230, 193" },
    { name: "Cyan Pulse", hex: "#22d3ee", rgb: "34, 211, 238" },
    { name: "Electric Cobalt", hex: "#38bdf8", rgb: "56, 189, 248" },
    { name: "Hyper Violet", hex: "#c084fc", rgb: "192, 132, 252" },
    { name: "Solar Amber", hex: "#fbbf24", rgb: "251, 191, 36" },
    { name: "Crimson Apex", hex: "#fb7185", rgb: "251, 113, 133" },
    { name: "Neon Lime", hex: "#a3e635", rgb: "163, 230, 53" },
    { name: "Luminous Fuchsia", hex: "#e879f9", rgb: "232, 121, 249" },
    { name: "Plasma Orange", hex: "#fb923c", rgb: "251, 146, 60" },
    { name: "Electric Teal", hex: "#2dd4bf", rgb: "45, 212, 191" },
    { name: "Deep Azure", hex: "#60a5fa", rgb: "96, 165, 250" },
    { name: "Radiant Coral", hex: "#f43f5e", rgb: "244, 63, 94" },
    { name: "Aurora Green", hex: "#34d399", rgb: "52, 211, 153" },
    { name: "Laser Gold", hex: "#facc15", rgb: "250, 204, 21" }
];

let currentPaletteIndex = 0;
let shuffleRotation = 0;

/**
 * Changes UI color randomly across the curated athletic palette
 */
function changeRandomColor() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * RANDOM_PALETTES.length);
    } while (nextIndex === currentPaletteIndex && RANDOM_PALETTES.length > 1);

    currentPaletteIndex = nextIndex;
    const palette = RANDOM_PALETTES[nextIndex];
    applyColorPalette(palette);

    shuffleRotation += 180;
    const icon = document.getElementById("randomColorIcon");
    if (icon) {
        icon.style.transform = `rotate(${shuffleRotation}deg)`;
    }

    const label = document.getElementById("randomColorLabel");
    if (label) {
        label.textContent = palette.name;
    }
}

function applyColorPalette(palette) {
    window.currentAccentRgb = palette.rgb;

    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.setProperty("--accent", palette.hex);
    document.documentElement.style.setProperty("--accent-rgb", palette.rgb);
    document.documentElement.style.setProperty("--accent-hover", palette.hex);
    document.documentElement.style.setProperty("--accent-soft", `rgba(${palette.rgb}, 0.14)`);
    document.documentElement.style.setProperty("--accent-border", `rgba(${palette.rgb}, 0.35)`);
    document.documentElement.style.setProperty("--accent-glow", `rgba(${palette.rgb}, 0.25)`);

    const indicator = document.getElementById("randomColorIndicator");
    if (indicator) {
        indicator.style.backgroundColor = palette.hex;
        indicator.style.boxShadow = `0 0 10px ${palette.hex}`;
    }

    try {
        localStorage.setItem("fitbuddy_random_color", JSON.stringify(palette));
    } catch (e) {}
}

function initRandomColor() {
    try {
        const saved = localStorage.getItem("fitbuddy_random_color");
        if (saved) {
            const parsed = JSON.parse(saved);
            applyColorPalette(parsed);
            const label = document.getElementById("randomColorLabel");
            if (label && parsed.name) label.textContent = parsed.name;
            return;
        }
    } catch (e) {}
    applyColorPalette(RANDOM_PALETTES[0]);
}

/**
 * Scrolltide.co Signature Scroll Dynamics
 */
function initScrolltide() {
    const progressBar = document.getElementById("scrolltideProgressBar");
    const scrollCue = document.getElementById("scrolltideCue");
    const heroVisual = document.querySelector(".ai-core-container");

    function onScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (scrollCue) {
            if (scrollY > 70) {
                scrollCue.classList.add("hidden");
            } else {
                scrollCue.classList.remove("hidden");
            }
        }

        if (heroVisual && scrollY < 700) {
            const rotY = Math.sin(scrollY * 0.005) * 6;
            const rotX = Math.cos(scrollY * 0.005) * 4;
            heroVisual.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${scrollY * 0.06}px)`;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });

        document.querySelectorAll(".scrolltide-reveal").forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll(".scrolltide-reveal").forEach(el => el.classList.add("in-view"));
    }
}

/**
 * Interactive card specular spotlight that follows cursor
 */
function initInteractiveSpotlight() {
    const cards = document.querySelectorAll(".glass-panel, .day-card, .spotlight-card, .choice-card, .nutrition-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }, { passive: true });
    });
}

/**
 * Cinematic Motion Graphics Canvas: Parametric Biometric Harmonic Curves & Drifting Nodes
 */
function initCinematicMotionCanvas() {
    const canvas = document.getElementById("cinematicMotionCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    let width = 0;
    let height = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let mouse = { x: width * 0.5, y: height * 0.3, targetX: width * 0.5, targetY: height * 0.3 };
    window.addEventListener("mousemove", (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    }, { passive: true });

    const particles = Array.from({ length: 28 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.6,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
    }));

    let time = 0;

    function render() {
        const scrollBoost = Math.min(Math.abs(window.scrollVelocity || 0) * 0.015, 0.035);
        time += 0.007 + scrollBoost;

        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;

        ctx.clearRect(0, 0, width, height);

        // Biometric harmonic flowing curve lines with Scrolltide responsiveness
        const waveCount = 3;
        const scrollAmpBoost = 1 + Math.min(Math.abs(window.scrollVelocity || 0) * 0.08, 0.35);
        for (let w = 0; w < waveCount; w++) {
            ctx.beginPath();
            const yOffset = height * (0.32 + w * 0.18) + Math.sin(time * 0.5 + w) * 18;
            const amp = (28 + w * 14) * scrollAmpBoost;
            const freq = 0.002 - w * 0.0003;

            ctx.moveTo(0, yOffset);
            for (let x = 0; x <= width; x += 20) {
                const distToMouse = Math.hypot(x - mouse.x, yOffset - mouse.y);
                const mouseInfluence = Math.max(0, 1 - distToMouse / 380) * 16 * Math.sin(time * 1.8);
                const y = yOffset + Math.sin(x * freq + time + w) * amp + mouseInfluence;
                ctx.lineTo(x, y);
            }

            const rgb = window.currentAccentRgb || "142, 230, 193";
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, `rgba(${rgb}, 0)`);
            gradient.addColorStop(0.3, `rgba(${rgb}, ${0.1 - w * 0.025})`);
            gradient.addColorStop(0.7, `rgba(${rgb}, ${0.06 - w * 0.015})`);
            gradient.addColorStop(1, `rgba(${rgb}, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        // Drifting ambient nodes
        const rgbNodes = window.currentAccentRgb || "142, 230, 193";
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgbNodes}, ${p.alpha * 0.55})`;
            ctx.fill();
        }

        requestAnimationFrame(render);
    }

    render();
}

/**
 * Local Storage State for Session Progress
 */
function getTrainingState() {
    const raw = localStorage.getItem("fitbuddy_training_state");
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            // Reset if corrupt
        }
    }
    return {
        completedDays: [],
        checkedExercises: {}
    };
}

function saveTrainingState(state) {
    try {
        localStorage.setItem("fitbuddy_training_state", JSON.stringify(state));
    } catch (e) {
        console.warn("Unable to save training state:", e);
    }
}

/**
 * Initializes progress indicators based on actual user activity (No Fake Data)
 */
function initProgressTracking() {
    const state = getTrainingState();
    updateProgressUI(state);
    syncTimelineDots(state);
}

function updateProgressUI(state) {
    const completedCount = state.completedDays.length;
    const totalDays = 7;
    const percent = Math.round((completedCount / totalDays) * 100);

    const sessionCountText = document.getElementById("sessionCountText");
    const sessionPercentText = document.getElementById("sessionPercentText");
    const progressFillBar = document.getElementById("progressFillBar");

    if (sessionCountText) sessionCountText.textContent = `${completedCount} / ${totalDays} sessions`;
    if (sessionPercentText) sessionPercentText.textContent = `(${percent}%)`;
    if (progressFillBar) progressFillBar.style.width = `${percent}%`;

    const dayNumberText = document.getElementById("currentDayNumberText");
    if (dayNumberText) dayNumberText.textContent = currentSpotlightDay;
}

function syncTimelineDots(state) {
    for (let i = 1; i <= 7; i++) {
        const step = document.getElementById(`timelineStep-${i}`);
        if (!step) continue;

        if (state.completedDays.includes(i)) {
            step.classList.add("completed");
        } else {
            step.classList.remove("completed");
        }

        if (i === currentSpotlightDay) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
    }
}

/**
 * Switches the active day in the Today's Workout Spotlight
 */
function switchSpotlightDay(dayNumber) {
    if (!planDays || planDays.length === 0) return;
    if (dayNumber < 1 || dayNumber > planDays.length) return;

    currentSpotlightDay = dayNumber;
    const target = planDays[dayNumber - 1];
    if (!target) return;

    // Update tab bar
    for (let i = 1; i <= planDays.length; i++) {
        const tab = document.getElementById(`dayTab-${i}`);
        if (tab) {
            if (i === dayNumber) {
                tab.classList.add("active");
                tab.setAttribute("aria-selected", "true");
            } else {
                tab.classList.remove("active");
                tab.setAttribute("aria-selected", "false");
            }
        }
    }

    // Update headline & body
    const titleEl = document.getElementById("spotlightTitle");
    const tagEl = document.getElementById("spotlightTag");
    const warmUpEl = document.getElementById("spotlightWarmUp");
    const coolDownEl = document.getElementById("spotlightCoolDown");
    const exerciseListEl = document.getElementById("spotlightExerciseList");

    if (tagEl) tagEl.textContent = `Day ${dayNumber} Focus`;
    if (titleEl) titleEl.textContent = `${target.day} — ${target.focus}`;
    if (warmUpEl) warmUpEl.textContent = target.warm_up;
    if (coolDownEl) coolDownEl.textContent = target.cool_down;

    // Render exercises for selected day
    if (exerciseListEl && target.main_workout) {
        const state = getTrainingState();
        exerciseListEl.innerHTML = "";

        target.main_workout.forEach((ex, idx) => {
            const exIndex = idx + 1;
            const key = `d${dayNumber}-ex${exIndex}`;
            const isDone = !!state.checkedExercises[key];

            const li = document.createElement("li");
            li.className = `exercise-item ${isDone ? "completed" : ""}`;
            li.id = `exItem-${dayNumber}-${exIndex}`;

            li.innerHTML = `
                <label class="exercise-label" for="exCheck-${dayNumber}-${exIndex}">
                    <input 
                        type="checkbox" 
                        id="exCheck-${dayNumber}-${exIndex}" 
                        class="exercise-checkbox" 
                        ${isDone ? "checked" : ""}
                        onchange="toggleExercise(this, ${dayNumber}, ${exIndex})"
                    >
                    <span class="exercise-name">${ex.exercise_name}</span>
                </label>
                <span class="exercise-metrics">${ex.sets} × ${ex.reps_or_duration}</span>
            `;
            exerciseListEl.appendChild(li);
        });
    }

    const state = getTrainingState();
    syncTimelineDots(state);

    const dayNumberText = document.getElementById("currentDayNumberText");
    if (dayNumberText) dayNumberText.textContent = dayNumber;
}

/**
 * Handles individual exercise check-off
 */
function toggleExercise(checkbox, dayNum, exIndex) {
    const item = document.getElementById(`exItem-${dayNum}-${exIndex}`);
    const state = getTrainingState();
    const key = `d${dayNum}-ex${exIndex}`;

    if (checkbox.checked) {
        if (item) item.classList.add("completed");
        state.checkedExercises[key] = true;
    } else {
        if (item) item.classList.remove("completed");
        delete state.checkedExercises[key];
    }

    // Check if entire day is complete
    const targetDay = planDays[dayNum - 1];
    if (targetDay && targetDay.main_workout) {
        const total = targetDay.main_workout.length;
        let done = 0;
        for (let i = 1; i <= total; i++) {
            if (state.checkedExercises[`d${dayNum}-ex${i}`]) done++;
        }

        const wasComplete = state.completedDays.includes(dayNum);
        if (done === total && !wasComplete) {
            state.completedDays.push(dayNum);
            saveTrainingState(state);
            updateProgressUI(state);
            syncTimelineDots(state);
            showCompletionModal(dayNum, state.completedDays.length);
            return;
        } else if (done < total && wasComplete) {
            state.completedDays = state.completedDays.filter(d => d !== dayNum);
        }
    }

    saveTrainingState(state);
    updateProgressUI(state);
    syncTimelineDots(state);
}

/**
 * Completion Dialog (Professional, No Confetti)
 */
function showCompletionModal(dayNum, totalCompleted) {
    const modal = document.getElementById("completionModal");
    const title = document.getElementById("modalTitle");
    const desc = document.getElementById("modalDesc");
    const sessions = document.getElementById("modalCompletedSessions");
    const adherence = document.getElementById("modalAdherencePct");

    const pct = Math.round((totalCompleted / 7) * 100);

    if (title) title.textContent = `Day 0${dayNum} Completed`;
    if (desc) desc.textContent = `All scheduled exercises for Day 0${dayNum} have been logged into your training log. Weekly consistency updated.`;
    if (sessions) sessions.textContent = `${totalCompleted} / 7`;
    if (adherence) adherence.textContent = `${pct}%`;

    if (modal) modal.classList.add("active");
}

function closeCompletionModal() {
    const modal = document.getElementById("completionModal");
    if (modal) modal.classList.remove("active");
}

/**
 * Goal card selection
 */
function selectGoal(card, value) {
    const all = document.querySelectorAll(".choice-card");
    // Only deselect cards in the goal grid
    const goalGrid = card.closest(".selector-grid");
    if (goalGrid) {
        goalGrid.querySelectorAll(".choice-card").forEach(c => c.classList.remove("selected"));
    }
    card.classList.add("selected");

    const input = document.getElementById("goalInput");
    if (input) input.value = value;
}

/**
 * Intensity card selection
 */
function selectIntensity(card, value) {
    const intensityGrid = card.closest(".selector-grid");
    if (intensityGrid) {
        intensityGrid.querySelectorAll(".choice-card").forEach(c => c.classList.remove("selected"));
    }
    card.classList.add("selected");

    const input = document.getElementById("intensityInput");
    if (input) input.value = value;
}

/**
 * Sets preset suggestion text into the feedback textarea
 */
function setFeedback(text) {
    const textarea = document.getElementById("feedback");
    if (textarea) {
        textarea.value = text;
        textarea.focus();
    }
}

/**
 * Filter Admin Records by search query
 */
function filterAdminRecords() {
    const input = document.getElementById("adminSearchInput");
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".admin-record-card");

    cards.forEach(card => {
        const text = (card.getAttribute("data-searchable") || "").toLowerCase();
        if (!query || text.includes(query)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

/**
 * Built-in Workout Rest Interval Timer & Stopwatch Engine
 */
let htmlTimerMode = 'countdown';
let htmlTimerSeconds = 60;
let htmlTimerDuration = 60;
let htmlTimerInterval = null;
let htmlTimerRunning = false;
let htmlActiveExercise = null;

function formatHtmlTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateHtmlTimerDisplay() {
    const disp = document.getElementById("htmlTimerDisplay");
    if (disp) disp.textContent = formatHtmlTime(htmlTimerSeconds);

    const badge = document.getElementById("timerStatusBadge");
    if (badge) {
        if (htmlTimerRunning) {
            badge.textContent = htmlTimerMode === 'countdown' ? 'Resting...' : 'Timing Set...';
        } else {
            badge.textContent = 'Standby';
        }
    }
}

function setHtmlTimerMode(mode) {
    htmlTimerMode = mode;
    stopHtmlTimer();
    const btnCount = document.getElementById("btnTimerModeCountdown");
    const btnStop = document.getElementById("btnTimerModeStopwatch");

    if (mode === 'countdown') {
        htmlTimerSeconds = htmlTimerDuration;
        if (btnCount) btnCount.classList.add("active");
        if (btnStop) btnStop.classList.remove("active");
    } else {
        htmlTimerSeconds = 0;
        if (btnCount) btnCount.classList.remove("active");
        if (btnStop) btnStop.classList.add("active");
    }
    updateHtmlTimerDisplay();
}

function startHtmlRestTimer(exerciseName, restStr) {
    const match = String(restStr).match(/(\d+)/);
    const secs = match ? parseInt(match[1], 10) : 60;

    htmlActiveExercise = exerciseName;
    htmlTimerDuration = secs;
    htmlTimerSeconds = secs;
    htmlTimerMode = 'countdown';

    const lbl = document.getElementById("timerTargetExerciseLabel");
    if (lbl) {
        lbl.innerHTML = `Resting for: <strong style="color: var(--text-primary);">${exerciseName}</strong> (${secs}s)`;
    }

    const btnCount = document.getElementById("btnTimerModeCountdown");
    const btnStop = document.getElementById("btnTimerModeStopwatch");
    if (btnCount) btnCount.classList.add("active");
    if (btnStop) btnStop.classList.remove("active");

    startHtmlTimer();
}

function startHtmlTimer() {
    if (htmlTimerRunning) return;
    htmlTimerRunning = true;
    const btn = document.getElementById("btnToggleTimer");
    if (btn) btn.textContent = "Pause";

    htmlTimerInterval = setInterval(() => {
        if (htmlTimerMode === 'countdown') {
            if (htmlTimerSeconds <= 1) {
                htmlTimerSeconds = 0;
                stopHtmlTimer();
                updateHtmlTimerDisplay();
                playHtmlBeep();
                const lbl = document.getElementById("timerTargetExerciseLabel");
                if (lbl) {
                    lbl.innerHTML = `<span style="color: var(--accent); font-weight: bold;">Rest Complete! Next set ready for ${htmlActiveExercise || 'exercise'}.</span>`;
                }
                return;
            }
            htmlTimerSeconds--;
        } else {
            htmlTimerSeconds++;
        }
        updateHtmlTimerDisplay();
    }, 1000);
    updateHtmlTimerDisplay();
}

function stopHtmlTimer() {
    if (htmlTimerInterval) {
        clearInterval(htmlTimerInterval);
        htmlTimerInterval = null;
    }
    htmlTimerRunning = false;
    const btn = document.getElementById("btnToggleTimer");
    if (btn) btn.textContent = "Start";
    updateHtmlTimerDisplay();
}

function toggleHtmlTimer() {
    if (htmlTimerRunning) {
        stopHtmlTimer();
    } else {
        if (htmlTimerMode === 'countdown' && htmlTimerSeconds === 0) {
            htmlTimerSeconds = htmlTimerDuration;
        }
        startHtmlTimer();
    }
}

function resetHtmlTimer() {
    stopHtmlTimer();
    if (htmlTimerMode === 'countdown') {
        htmlTimerSeconds = htmlTimerDuration;
    } else {
        htmlTimerSeconds = 0;
    }
    updateHtmlTimerDisplay();
}

function playHtmlBeep() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1175, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
}

