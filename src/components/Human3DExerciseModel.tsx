import React, { useRef, useEffect } from 'react';

export type ExerciseType = 
  | 'SQUAT'
  | 'PUSH_UP'
  | 'LUNGE'
  | 'PLANK'
  | 'BICEP_CURL'
  | 'SHOULDER_PRESS'
  | 'GLUTE_BRIDGE'
  | 'CRUNCH'
  | 'JUMPING_JACK'
  | 'MOUNTAIN_CLIMBER'
  | 'DEADLIFT'
  | 'PULL_UP'
  | 'DUMBBELL_ROW'
  | 'UNKNOWN';

export function normalizeExerciseTitle(title: string): ExerciseType {
  if (!title) return 'UNKNOWN';
  const clean = title.toLowerCase().replace(/[-_]/g, ' ').trim();

  // Strict Matching Rules (Title controls Demo)
  if (clean.includes('plank')) return 'PLANK';
  if (clean.includes('push up') || clean.includes('pushup')) return 'PUSH_UP';
  if (clean.includes('lunge') || clean.includes('split squat')) return 'LUNGE';
  if (clean.includes('squat')) return 'SQUAT';
  if (clean.includes('curl')) return 'BICEP_CURL';
  if (clean.includes('shoulder press') || clean.includes('overhead press') || clean.includes('military press')) return 'SHOULDER_PRESS';
  if (clean.includes('bridge') || clean.includes('thrust')) return 'GLUTE_BRIDGE';
  if (clean.includes('crunch') || clean.includes('sit up') || clean.includes('situp')) return 'CRUNCH';
  if (clean.includes('jumping jack') || clean.includes('star jump')) return 'JUMPING_JACK';
  if (clean.includes('mountain climber') || clean.includes('climber')) return 'MOUNTAIN_CLIMBER';
  if (clean.includes('deadlift') || clean.includes('rdl') || clean.includes('romanian')) return 'DEADLIFT';
  if (clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin up') || clean.includes('chinup')) return 'PULL_UP';
  if (clean.includes('row')) return 'DUMBBELL_ROW';

  return 'UNKNOWN';
}

interface Human3DExerciseModelProps {
  exerciseTitle: string;
  isPlaying?: boolean;
  className?: string;
  showFloorGrid?: boolean;
  viewAngle?: 'side' | 'three_quarter' | 'front';
}

export default function Human3DExerciseModel({
  exerciseTitle,
  isPlaying = true,
  className = 'w-full h-auto aspect-[16/9]',
  showFloorGrid = true,
}: Human3DExerciseModelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animTimeRef = useRef<number>(0);

  const exerciseType = normalizeExerciseTitle(exerciseTitle);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (isPlaying) {
        animTimeRef.current += 0.038;
      }
      const t = animTimeRef.current;

      const w = (canvas.width = 680);
      const h = (canvas.height = 380);

      // 1. Dark Gym Environment Backdrop
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, w, h);

      // Subtle atmospheric gym rim glow
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2 - 30, 20, w / 2, h / 2, 280);
      bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      bgGrad.addColorStop(0.6, 'rgba(6, 78, 59, 0.03)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Gym Floor & Horizon Plane
      const floorY = h * 0.82;
      if (showFloorGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, floorY);
        ctx.lineTo(w - 30, floorY);
        ctx.stroke();

        // Subtle floor depth lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = -4; i <= 4; i++) {
          ctx.beginPath();
          ctx.moveTo(w / 2 + i * 40, floorY);
          ctx.lineTo(w / 2 + i * 90, h - 5);
          ctx.stroke();
        }
      }

      // Smooth mathematical cycle [0 to 1] with continuous sinusoidal easing
      const cycle = (Math.sin(t) + 1) / 2;
      const cosCycle = (Math.cos(t) + 1) / 2;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // -----------------------------------------------------------------------
      // HELPER: DRAW REALISTIC 3D ANATOMICAL LIMB (Volumetric Shading & Contours)
      // -----------------------------------------------------------------------
      const draw3DLimb = (
        x1: number, 
        y1: number, 
        x2: number, 
        y2: number, 
        radius1: number, 
        radius2: number, 
        colorBase: string = '#cbd5e1', 
        colorShadow: string = '#334155',
        highlightColor?: string
      ) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const perp = angle + Math.PI / 2;

        const p1x = x1 + Math.cos(perp) * radius1;
        const p1y = y1 + Math.sin(perp) * radius1;
        const p2x = x2 + Math.cos(perp) * radius2;
        const p2y = y2 + Math.sin(perp) * radius2;
        const p3x = x2 - Math.cos(perp) * radius2;
        const p3y = y2 - Math.sin(perp) * radius2;
        const p4x = x1 - Math.cos(perp) * radius1;
        const p4y = y1 - Math.sin(perp) * radius1;

        // Volumetric gradient across limb width for true 3D curvature
        const grad = ctx.createLinearGradient(p1x, p1y, p4x, p4y);
        grad.addColorStop(0, highlightColor || '#f8fafc');
        grad.addColorStop(0.3, colorBase);
        grad.addColorStop(0.85, colorShadow);
        grad.addColorStop(1, '#0f172a');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.arc(x2, y2, radius2, perp, perp + Math.PI);
        ctx.lineTo(p4x, p4y);
        ctx.arc(x1, y1, radius1, perp + Math.PI, perp);
        ctx.closePath();
        ctx.fill();

        // Subtle specular highlight line along the limb
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1 + Math.cos(perp) * (radius1 * 0.4), y1 + Math.sin(perp) * (radius1 * 0.4));
        ctx.lineTo(x2 + Math.cos(perp) * (radius2 * 0.4), y2 + Math.sin(perp) * (radius2 * 0.4));
        ctx.stroke();
      };

      // -----------------------------------------------------------------------
      // HELPER: DRAW REALISTIC HEAD & TORSO WITH MUSCLE CONTOURS
      // -----------------------------------------------------------------------
      const draw3DHead = (x: number, y: number, facing: 'left' | 'right' | 'front' = 'right') => {
        // Head shadow and skin gradient
        const headGrad = ctx.createRadialGradient(x - 3, y - 4, 3, x, y, 16);
        headGrad.addColorStop(0, '#f8fafc');
        headGrad.addColorStop(0.65, '#cbd5e1');
        headGrad.addColorStop(1, '#334155');

        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.ellipse(x, y, 13, 16, facing === 'left' ? -0.1 : 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Athletic hair contour
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(x, y - 5, 12, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();

        // Jawline definition
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const jawOffsetX = facing === 'left' ? -5 : 5;
        ctx.moveTo(x, y + 2);
        ctx.lineTo(x + jawOffsetX, y + 10);
        ctx.stroke();
      };

      const draw3DTorso = (
        shoulderX: number, 
        shoulderY: number, 
        hipX: number, 
        hipY: number, 
        chestWidth: number = 28, 
        waistWidth: number = 20,
        chestGlow: boolean = false
      ) => {
        const dx = hipX - shoulderX;
        const dy = hipY - shoulderY;
        const angle = Math.atan2(dy, dx);
        const perp = angle + Math.PI / 2;

        const p1x = shoulderX + Math.cos(perp) * chestWidth;
        const p1y = shoulderY + Math.sin(perp) * chestWidth;
        const p2x = hipX + Math.cos(perp) * waistWidth;
        const p2y = hipY + Math.sin(perp) * waistWidth;
        const p3x = hipX - Math.cos(perp) * waistWidth;
        const p3y = hipY - Math.sin(perp) * waistWidth;
        const p4x = shoulderX - Math.cos(perp) * chestWidth;
        const p4y = shoulderY - Math.sin(perp) * chestWidth;

        // Torso gradient (Athletic compression top with dark charcoal / emerald trim)
        const torsoGrad = ctx.createLinearGradient(p1x, p1y, p4x, p4y);
        torsoGrad.addColorStop(0, '#334155');
        torsoGrad.addColorStop(0.3, '#1e293b');
        torsoGrad.addColorStop(0.8, '#0f172a');
        torsoGrad.addColorStop(1, '#020617');

        ctx.fillStyle = torsoGrad;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);
        ctx.lineTo(p4x, p4y);
        ctx.closePath();
        ctx.fill();

        // FitBuddy Athletic Contour Line (Natural emerald accent)
        ctx.strokeStyle = chestGlow ? '#10b981' : 'rgba(16, 185, 129, 0.45)';
        ctx.lineWidth = chestGlow ? 3 : 1.5;
        if (chestGlow) {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.moveTo((p1x + p4x) / 2, (p1y + p4y) / 2 + 5);
        ctx.lineTo((p2x + p3x) / 2, (p2y + p3y) / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      const drawFoot = (x: number, y: number, length: number = 18, facing: number = 1) => {
        // Athletic shoe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 6, length * facing, 8, 3);
        ctx.fill();
        // Emerald sole
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x - 4, y + 1, length * facing, 2);
      };

      const centerX = w / 2;

      // =======================================================================
      // 1. SQUAT (Standing -> Hips down/back -> Knees 90 deg -> Stand up)
      // =======================================================================
      if (exerciseType === 'SQUAT') {
        const squatDepth = cycle * 68; // Smooth lowering
        const hipX = centerX - 12 - cycle * 22;
        const hipY = floorY - 145 + squatDepth;
        const shoulderX = hipX + 16 + cycle * 10;
        const shoulderY = hipY - 70;
        const headX = shoulderX + 4;
        const headY = shoulderY - 24;

        const footX = centerX + 15;
        const footY = floorY - 3;
        const kneeX = footX + 10 - cycle * 8;
        const kneeY = floorY - 65 + squatDepth * 0.55;

        // Contact floor shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(footX, floorY + 4, 35, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rear Leg
        draw3DLimb(hipX - 10, hipY, kneeX - 8, kneeY, 14, 11, '#64748b', '#1e293b');
        draw3DLimb(kneeX - 8, kneeY, footX - 8, footY, 11, 7, '#64748b', '#1e293b');
        drawFoot(footX - 8, footY, 20, 1);

        // Torso & Head
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 17);
        draw3DHead(headX, headY, 'right');

        // Front Arm (Clasped in front of chest for balance)
        const elbowX = shoulderX + 28 - cycle * 5;
        const elbowY = shoulderY + 28;
        const handX = shoulderX + 38;
        const handY = shoulderY + 18;
        draw3DLimb(shoulderX, shoulderY, elbowX, elbowY, 9, 8, '#cbd5e1', '#334155');
        draw3DLimb(elbowX, elbowY, handX, handY, 8, 6, '#cbd5e1', '#334155');

        // Front Working Leg (Highlighted Quadriceps & Gluteus)
        draw3DLimb(hipX, hipY, kneeX, kneeY, 17, 13, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(kneeX, kneeY, footX, footY, 13, 8, '#cbd5e1', '#334155');
        drawFoot(footX, footY, 22, 1);

        // Technical HUD Telemetry
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`KNEE FLEXION: ${Math.round(175 - cycle * 85)}°`, kneeX + 22, kneeY);
        ctx.fillText(`MOVEMENT: CONTROLLED HIP HINGE & ECCENTRIC DESCENT`, 35, 30);
      }

      // =======================================================================
      // 2. PUSH-UP (Plank -> Elbows bend 90 deg -> Chest near floor -> Press up)
      // =======================================================================
      else if (exerciseType === 'PUSH_UP') {
        const pushDepth = cycle * 50;
        const feetX = centerX - 130;
        const feetY = floorY - 8;
        const shoulderX = centerX + 65;
        const shoulderY = floorY - 75 + pushDepth;
        const headX = shoulderX + 26;
        const headY = shoulderY - 4;
        const hipX = (feetX + shoulderX) / 2;
        const hipY = (feetY + shoulderY) / 2;

        const handX = shoulderX - 8;
        const handY = floorY;
        const elbowX = (shoulderX + handX) / 2 - 18 * (1 - cycle);
        const elbowY = (shoulderY + handY) / 2 - 12 * cycle;

        // Floor Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(centerX - 10, floorY + 4, 140, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rear Leg
        draw3DLimb(feetX, feetY, hipX, hipY, 9, 15, '#64748b', '#1e293b');
        // Torso
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 24, 18, true);
        draw3DHead(headX, headY, 'right');

        // Front Arm (Shoulder -> Elbow -> Hand)
        draw3DLimb(shoulderX, shoulderY, elbowX, elbowY, 11, 9, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(elbowX, elbowY, handX, handY, 9, 7, '#cbd5e1', '#334155');

        // Hand contact
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(handX, handY - 2, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`ELBOW ANGLE: ${Math.round(90 + (1 - cycle) * 75)}°`, elbowX - 40, elbowY - 14);
        ctx.fillText(`MOVEMENT: RIGID KINETIC PLANK & CHEST PRESS`, 35, 30);
      }

      // =======================================================================
      // 3. LUNGE (Standing -> Step Back -> Rear Knee drops to 1 inch -> Return)
      // =======================================================================
      else if (exerciseType === 'LUNGE') {
        const lungeDepth = cycle * 48;
        const frontFootX = centerX + 60;
        const frontFootY = floorY - 3;
        const frontKneeX = frontFootX + 8;
        const frontKneeY = floorY - 45;

        const rearFootX = centerX - 85;
        const rearFootY = floorY - 3;
        const rearKneeX = centerX - 25;
        const rearKneeY = floorY - 45 + lungeDepth;

        const hipX = centerX;
        const hipY = floorY - 95 + lungeDepth;
        const shoulderX = hipX;
        const shoulderY = hipY - 72;
        const headX = shoulderX;
        const headY = shoulderY - 24;

        // Floor Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(frontFootX, floorY + 4, 30, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(rearFootX, floorY + 4, 25, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rear Leg (Dropping knee)
        draw3DLimb(hipX, hipY, rearKneeX, rearKneeY, 15, 11, '#64748b', '#1e293b');
        draw3DLimb(rearKneeX, rearKneeY, rearFootX, rearFootY, 11, 7, '#64748b', '#1e293b');
        drawFoot(rearFootX, rearFootY, 16, 1);

        // Torso & Head (Upright posture)
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 17);
        draw3DHead(headX, headY, 'right');

        // Front Working Leg (90 Degree Bend)
        draw3DLimb(hipX, hipY, frontKneeX, frontKneeY, 17, 13, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(frontKneeX, frontKneeY, frontFootX, frontFootY, 13, 8, '#cbd5e1', '#334155');
        drawFoot(frontFootX, frontFootY, 20, 1);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`FRONT KNEE: 90° TUCK`, frontKneeX + 15, frontKneeY);
        ctx.fillText(`MOVEMENT: UNILATERAL KNEE DRIVE & HIP INTEGRITY`, 35, 30);
      }

      // =======================================================================
      // 4. PLANK (STATIC RIGID CORE HOLD - NOT ANIMATED LIKE PUSH-UP)
      // =======================================================================
      else if (exerciseType === 'PLANK') {
        // Small organic breathing vibration rather than push-up motion
        const breathe = Math.sin(t * 1.5) * 2;
        const feetX = centerX - 135;
        const feetY = floorY - 8;
        const elbowX = centerX + 60;
        const elbowY = floorY - 38;
        const headX = elbowX + 30;
        const headY = floorY - 38 + breathe;
        const hipX = centerX - 30;
        const hipY = floorY - 45 + breathe;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(centerX - 20, floorY + 4, 135, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        draw3DLimb(feetX, feetY, hipX, hipY, 10, 16, '#64748b', '#1e293b');
        // Torso (Solid Core with active emerald glow)
        draw3DTorso(elbowX, elbowY, hipX, hipY, 22, 17, true);
        draw3DHead(headX, headY, 'right');

        // Forearm on Floor
        draw3DLimb(elbowX, elbowY, elbowX + 24, floorY - 2, 9, 7, '#cbd5e1', '#334155');

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`ABDOMINAL TENSION: CONTINUOUS ISOMETRIC HOLD`, centerX - 110, floorY - 65);
        ctx.fillText(`MOVEMENT: STATIC POSTERIOR PELVIC TILT`, 35, 30);
      }

      // =======================================================================
      // 5. BICEP CURL (Arms at sides -> Forearms curl up -> Squeeze -> Lower)
      // =======================================================================
      else if (exerciseType === 'BICEP_CURL') {
        const curlAngle = cycle * 120; // 0 to 120 degrees curl
        const shoulderX = centerX - 25;
        const shoulderY = floorY - 170;
        const hipX = centerX - 25;
        const hipY = floorY - 100;
        const headX = centerX - 25;
        const headY = shoulderY - 25;

        const footX = centerX - 25;
        const footY = floorY - 3;

        // Legs & Torso
        draw3DLimb(hipX, hipY, footX, footY, 16, 10, '#64748b', '#1e293b');
        drawFoot(footX, footY, 22, 1);
        draw3DTorso(shoulderX + 15, shoulderY, hipX, hipY, 24, 18);
        draw3DHead(headX, headY, 'front');

        // Bicep Arm (Upper arm locked, forearm curls with dumbbell)
        const elbowX = shoulderX + 22;
        const elbowY = shoulderY + 45;
        const rad = ((180 - curlAngle) * Math.PI) / 180;
        const handX = elbowX + Math.sin(rad) * 42;
        const handY = elbowY + Math.cos(rad) * 42;

        draw3DLimb(shoulderX + 15, shoulderY, elbowX, elbowY, 12, 10, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(elbowX, elbowY, handX, handY, 10, 8, '#cbd5e1', '#334155');

        // Dumbbell in Hand
        ctx.fillStyle = '#10b981';
        ctx.fillRect(handX - 8, handY - 12, 16, 24);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(handX - 4, handY - 4, 8, 8);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`ELBOW POSITION: LOCKED TO TORSO`, centerX + 30, elbowY);
        ctx.fillText(`MOVEMENT: ISOLATED BICEPS BRACHII CONTRACTION`, 35, 30);
      }

      // =======================================================================
      // 6. SHOULDER PRESS (Weights near shoulders -> Press overhead -> Return)
      // =======================================================================
      else if (exerciseType === 'SHOULDER_PRESS') {
        const pressHeight = cycle * 65; // Overhead press extension
        const shoulderX = centerX;
        const shoulderY = floorY - 165;
        const hipX = centerX;
        const hipY = floorY - 95;
        const headX = centerX;
        const headY = shoulderY - 24;

        // Legs & Torso
        draw3DLimb(hipX - 12, hipY, centerX - 18, floorY - 3, 16, 9, '#64748b', '#1e293b');
        draw3DLimb(hipX + 12, hipY, centerX + 18, floorY - 3, 16, 9, '#64748b', '#1e293b');
        drawFoot(centerX - 18, floorY - 3, 20, -1);
        drawFoot(centerX + 18, floorY - 3, 20, 1);
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 26, 18, true);
        draw3DHead(headX, headY, 'front');

        // Both Arms Pressing Overhead
        const leftElbowX = shoulderX - 35 + cycle * 12;
        const leftElbowY = shoulderY + 15 - pressHeight * 0.7;
        const leftHandX = shoulderX - 35 + cycle * 15;
        const leftHandY = shoulderY - 5 - pressHeight;

        const rightElbowX = shoulderX + 35 - cycle * 12;
        const rightElbowY = shoulderY + 15 - pressHeight * 0.7;
        const rightHandX = shoulderX + 35 - cycle * 15;
        const rightHandY = shoulderY - 5 - pressHeight;

        draw3DLimb(shoulderX - 18, shoulderY, leftElbowX, leftElbowY, 11, 9, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(leftElbowX, leftElbowY, leftHandX, leftHandY, 9, 7, '#cbd5e1', '#334155');

        draw3DLimb(shoulderX + 18, shoulderY, rightElbowX, rightElbowY, 11, 9, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(rightElbowX, rightElbowY, rightHandX, rightHandY, 9, 7, '#cbd5e1', '#334155');

        // Dumbbells in hands
        ctx.fillStyle = '#10b981';
        ctx.fillRect(leftHandX - 14, leftHandY - 6, 28, 12);
        ctx.fillRect(rightHandX - 14, rightHandY - 6, 28, 12);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`VERTICAL PATH: ALIGNED OVER EARS`, centerX - 85, shoulderY - 80);
        ctx.fillText(`MOVEMENT: OVERHEAD ANTERIOR & LATERAL DELTOID DRIVE`, 35, 30);
      }

      // =======================================================================
      // 7. GLUTE BRIDGE (Supine on mat -> Hips drive up -> Lockout -> Return)
      // =======================================================================
      else if (exerciseType === 'GLUTE_BRIDGE') {
        const hipLift = cycle * 44;
        const shoulderX = centerX - 95;
        const shoulderY = floorY - 14;
        const feetX = centerX + 65;
        const feetY = floorY - 3;
        const kneeX = centerX + 50;
        const kneeY = floorY - 48;
        const hipX = centerX - 12;
        const hipY = floorY - 16 - hipLift;

        // Floor Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(centerX - 10, floorY + 4, 120, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head & Torso
        draw3DHead(shoulderX - 18, shoulderY - 2, 'right');
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 18, true);

        // Working Glutes & Hamstrings
        draw3DLimb(hipX, hipY, kneeX, kneeY, 17, 13, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(kneeX, kneeY, feetX, feetY, 13, 8, '#cbd5e1', '#334155');
        drawFoot(feetX, feetY, 18, 1);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`PELVIC DRIVE: FULL HIP EXTENSION`, centerX - 80, floorY - 75);
        ctx.fillText(`MOVEMENT: POSTERIOR CHAIN RECRUITMENT`, 35, 30);
      }

      // =======================================================================
      // 8. CRUNCH (Supine -> Knees Bent -> Thoracic Flexion -> Lower)
      // =======================================================================
      else if (exerciseType === 'CRUNCH') {
        const curlUp = cycle * 24;
        const shoulderX = centerX - 80 + curlUp * 0.4;
        const shoulderY = floorY - 16 - curlUp;
        const hipX = centerX - 15;
        const hipY = floorY - 14;
        const headX = shoulderX - 16;
        const headY = shoulderY - 12;
        const feetX = centerX + 60;
        const feetY = floorY - 3;
        const kneeX = centerX + 45;
        const kneeY = floorY - 46;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(centerX - 5, floorY + 4, 110, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        draw3DLimb(hipX, hipY, kneeX, kneeY, 16, 12, '#64748b', '#1e293b');
        draw3DLimb(kneeX, kneeY, feetX, feetY, 12, 8, '#64748b', '#1e293b');
        drawFoot(feetX, feetY, 18, 1);

        // Torso Curling Upward
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 17, true);
        draw3DHead(headX, headY, 'right');

        // Hands behind head
        draw3DLimb(shoulderX, shoulderY, headX - 6, headY + 2, 8, 6, '#cbd5e1', '#334155');

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`THORACIC FLEXION: STERNUM TO RIBCAGE`, centerX - 90, floorY - 65);
        ctx.fillText(`MOVEMENT: RECTUS ABDOMINIS CONTRACTION`, 35, 30);
      }

      // =======================================================================
      // 9. JUMPING JACK (Feet jump out + arms overhead -> Return together)
      // =======================================================================
      else if (exerciseType === 'JUMPING_JACK') {
        const jumpSpread = cycle;
        const footSpread = jumpSpread * 45;
        const armSpread = jumpSpread * 140; // 0 to 140 deg overhead
        const bounce = Math.sin(t * 2) * 8;

        const shoulderX = centerX;
        const shoulderY = floorY - 165 - bounce;
        const hipX = centerX;
        const hipY = floorY - 95 - bounce;
        const headX = centerX;
        const headY = shoulderY - 24;

        // Legs jumping out
        draw3DLimb(hipX - 10, hipY, centerX - 12 - footSpread, floorY - 3, 15, 9, '#64748b', '#1e293b');
        draw3DLimb(hipX + 10, hipY, centerX + 12 + footSpread, floorY - 3, 15, 9, '#64748b', '#1e293b');
        drawFoot(centerX - 12 - footSpread, floorY - 3, 18, -1);
        drawFoot(centerX + 12 + footSpread, floorY - 3, 18, 1);

        // Torso & Head
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 24, 18);
        draw3DHead(headX, headY, 'front');

        // Arms Sweeping Overhead
        const armAngleRad = (armSpread * Math.PI) / 180;
        const leftHandX = shoulderX - 18 - Math.sin(armAngleRad) * 45;
        const leftHandY = shoulderY + 40 - Math.cos(armAngleRad) * 65;
        const rightHandX = shoulderX + 18 + Math.sin(armAngleRad) * 45;
        const rightHandY = shoulderY + 40 - Math.cos(armAngleRad) * 65;

        draw3DLimb(shoulderX - 16, shoulderY, leftHandX, leftHandY, 10, 7, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(shoulderX + 16, shoulderY, rightHandX, rightHandY, 10, 7, '#e2e8f0', '#334155', '#10b981');

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`CADENCE: RHYTHMIC FULL BODY COORDINATION`, centerX - 110, shoulderY - 80);
        ctx.fillText(`MOVEMENT: CARDIOVASCULAR METABOLIC ENDURANCE`, 35, 30);
      }

      // =======================================================================
      // 10. MOUNTAIN CLIMBER (Plank position -> Alternating knees drive to chest)
      // =======================================================================
      else if (exerciseType === 'MOUNTAIN_CLIMBER') {
        const drive1 = cycle * 55; // Left leg drive
        const drive2 = (1 - cycle) * 55; // Right leg drive

        const feetBaseX = centerX - 130;
        const feetY = floorY - 8;
        const shoulderX = centerX + 65;
        const shoulderY = floorY - 75;
        const headX = shoulderX + 26;
        const headY = shoulderY - 4;
        const hipX = centerX - 25;
        const hipY = floorY - 50;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(centerX - 10, floorY + 4, 130, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Alternating Legs
        // Right Leg (Extended or driving)
        draw3DLimb(hipX, hipY, feetBaseX + drive2 * 0.7, feetY - drive2 * 0.3, 14, 8, '#64748b', '#1e293b');

        // Torso & Head
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 17, true);
        draw3DHead(headX, headY, 'right');

        // Left Leg (Driving to chest with emerald highlight)
        const leftKneeX = hipX + drive1 * 0.8;
        const leftKneeY = hipY + 12 - drive1 * 0.2;
        draw3DLimb(hipX, hipY, leftKneeX, leftKneeY, 16, 12, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(leftKneeX, leftKneeY, leftKneeX - 25, floorY - 8, 12, 7, '#cbd5e1', '#334155');

        // Rigid Arms Supporting Front Body
        draw3DLimb(shoulderX, shoulderY, shoulderX - 10, floorY, 10, 8, '#cbd5e1', '#334155');

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`KNEE DRIVE: ALTERNATING TO STERNUM`, centerX - 85, floorY - 75);
        ctx.fillText(`MOVEMENT: ANTERIOR CORE & HIP FLEXOR SPEED`, 35, 30);
      }

      // =======================================================================
      // 11. DEADLIFT (Hip Hinge -> Bar along shins -> Posterior lockout)
      // =======================================================================
      else if (exerciseType === 'DEADLIFT') {
        const hinge = cycle; // 0: Lockout, 1: Bar near floor
        const hipX = centerX - 30 - hinge * 32;
        const hipY = floorY - 100 + hinge * 35;
        const kneeX = centerX - 5 - hinge * 5;
        const kneeY = floorY - 50;
        const footX = centerX;
        const shoulderX = hipX + 35 + hinge * 32;
        const shoulderY = hipY - 60 + hinge * 45;
        const barX = footX + 15;
        const barY = floorY - 100 + hinge * 82;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(footX + 10, floorY + 4, 45, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        draw3DLimb(hipX, hipY, kneeX, kneeY, 17, 13, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(kneeX, kneeY, footX, floorY - 3, 13, 8, '#cbd5e1', '#334155');
        drawFoot(footX, floorY - 3, 22, 1);

        // Torso & Head
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 24, 18);
        draw3DHead(shoulderX + 12, shoulderY - 16, 'right');

        // Arms holding barbell
        draw3DLimb(shoulderX, shoulderY, barX, barY, 10, 8, '#cbd5e1', '#334155');

        // Barbell & Olympic Plates
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(barX - 70, barY);
        ctx.lineTo(barX + 70, barY);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.fillRect(barX - 65, barY - 25, 12, 50);
        ctx.fillRect(barX + 53, barY - 25, 12, 50);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`LUMBAR SPINE: NEUTRAL HIP HINGE`, centerX - 85, floorY - 130);
        ctx.fillText(`MOVEMENT: GLUTEUS MAXIMUS & HAMSTRING EXTENSION`, 35, 30);
      }

      // =======================================================================
      // 12. PULL-UP (Vertical Bar Pull -> Chin over bar -> Controlled hang)
      // =======================================================================
      else if (exerciseType === 'PULL_UP') {
        const pull = 1 - cycle; // 1 = chin over bar, 0 = hang
        const barY = floorY - 160;
        const headY = barY + 30 - pull * 52;
        const shoulderY = headY + 16;
        const hipY = shoulderY + 68;
        const feetY = hipY + 55;

        // Pull-Up Bar
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX - 130, barY);
        ctx.lineTo(centerX + 130, barY);
        ctx.stroke();

        // Legs
        draw3DLimb(centerX - 8, hipY, centerX - 8, feetY, 14, 8, '#64748b', '#1e293b');
        draw3DLimb(centerX + 8, hipY, centerX + 8, feetY, 14, 8, '#64748b', '#1e293b');

        // Torso & Head
        draw3DTorso(centerX, shoulderY, centerX, hipY, 26, 18, true);
        draw3DHead(centerX, headY, 'front');

        // Arms to Bar
        const elbowSpread = 32 + (1 - pull) * 18;
        const elbowY = (shoulderY + barY) / 2 + (1 - pull) * 12;
        draw3DLimb(centerX - 18, shoulderY, centerX - elbowSpread, elbowY, 11, 9, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(centerX - elbowSpread, elbowY, centerX - 55, barY, 9, 7, '#cbd5e1', '#334155');

        draw3DLimb(centerX + 18, shoulderY, centerX + elbowSpread, elbowY, 11, 9, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(centerX + elbowSpread, elbowY, centerX + 55, barY, 9, 7, '#cbd5e1', '#334155');

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`SCAPULAR DEPRESSION: ACTIVE LATS`, centerX - 85, floorY - 185);
        ctx.fillText(`MOVEMENT: VERTICAL LATISSIMUS DORSI ADDUCTION`, 35, 30);
      }

      // =======================================================================
      // 13. DUMBBELL ROW (Flat Back Bench -> Row to Hip -> Lat Squeeze)
      // =======================================================================
      else if (exerciseType === 'DUMBBELL_ROW') {
        const benchY = floorY - 45;
        // Flat Bench
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 120, benchY, 140, 16);

        const hipX = centerX + 15;
        const hipY = floorY - 85;
        const shoulderX = centerX - 60;
        const shoulderY = floorY - 82;
        const dumbbellY = floorY - 45 - cycle * 42;

        // Support Arm on Bench
        draw3DLimb(shoulderX, shoulderY, shoulderX, benchY, 10, 8, '#64748b', '#1e293b');

        // Torso & Head
        draw3DTorso(shoulderX, shoulderY, hipX, hipY, 22, 17, true);
        draw3DHead(shoulderX - 16, shoulderY - 6, 'left');

        // Legs
        draw3DLimb(hipX, hipY, centerX + 30, floorY - 3, 16, 9, '#64748b', '#1e293b');
        drawFoot(centerX + 30, floorY - 3, 20, 1);

        // Rowing Arm (Elbow drives toward ceiling)
        const elbowY = shoulderY - cycle * 24;
        draw3DLimb(shoulderX + 22, shoulderY, shoulderX + 18, elbowY, 12, 10, '#e2e8f0', '#334155', '#10b981');
        draw3DLimb(shoulderX + 18, elbowY, shoulderX + 22, dumbbellY, 10, 8, '#cbd5e1', '#334155');

        // Dumbbell
        ctx.fillStyle = '#10b981';
        ctx.fillRect(shoulderX + 10, dumbbellY - 8, 28, 16);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`ELBOW PATH: DRIVES TO HIP CREASE`, centerX - 85, floorY - 110);
        ctx.fillText(`MOVEMENT: UNILATERAL LATISSIMUS CONTRACTION`, 35, 30);
      }

      // =======================================================================
      // FALLBACK: SAFE INDICATION IF NO MATCHING 3D DEMONSTRATION EXISTS (Rule 12)
      // =======================================================================
      else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px JetBrains Mono, monospace';
        ctx.fillText(`EXERCISE: "${exerciseTitle.toUpperCase()}"`, 40, h / 2 - 20);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Plus Jakarta Sans, sans-serif';
        ctx.fillText(`Kinematic demonstration for this variation is preparing.`, 40, h / 2 + 10);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Plus Jakarta Sans, sans-serif';
        ctx.fillText(`Please consult step-by-step form cues and coaching instructions below.`, 40, h / 2 + 35);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [exerciseType, isPlaying, showFloorGrid]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080c14] shadow-xl">
      <canvas ref={canvasRef} className={`block ${className}`} />

      {/* Visualizer Telemetry Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/[0.1] text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Realistic Human 3D Model
        </span>
      </div>
    </div>
  );
}
