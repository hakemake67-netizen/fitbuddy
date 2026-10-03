import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { AvatarProfile } from '../types';

export type ExerciseAnimationType = 
  | 'IDLE' 
  | 'SQUAT' 
  | 'PUSH_UP' 
  | 'LUNGE' 
  | 'PLANK' 
  | 'SHOULDER_PRESS' 
  | 'BICEP_CURL' 
  | 'DEADLIFT' 
  | 'PULL_UP';

export function normalizeExerciseToAnimation(title: string): ExerciseAnimationType {
  if (!title) return 'IDLE';
  const clean = title.toLowerCase();
  if (clean.includes('push up') || clean.includes('pushup') || clean.includes('chest press') || clean.includes('bench press')) return 'PUSH_UP';
  if (clean.includes('squat')) return 'SQUAT';
  if (clean.includes('lunge') || clean.includes('split squat')) return 'LUNGE';
  if (clean.includes('plank')) return 'PLANK';
  if (clean.includes('shoulder press') || clean.includes('overhead press') || clean.includes('military press')) return 'SHOULDER_PRESS';
  if (clean.includes('curl')) return 'BICEP_CURL';
  if (clean.includes('deadlift') || clean.includes('rdl')) return 'DEADLIFT';
  if (clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin up')) return 'PULL_UP';
  return 'SQUAT';
}

interface ThreeRealisticHumanModelProps {
  avatar?: AvatarProfile | null;
  exerciseType?: ExerciseAnimationType | string;
  isPlaying?: boolean;
  className?: string;
  showControls?: boolean;
  interactiveOrbit?: boolean;
  viewAnglePreset?: 'front' | 'three_quarter' | 'side';
  showMuscleHighlight?: boolean;
}

export default function ThreeRealisticHumanModel({
  avatar,
  exerciseType = 'IDLE',
  isPlaying = true,
  className = 'w-full h-full min-h-[380px]',
  showControls = true,
  interactiveOrbit = true,
  viewAnglePreset = 'three_quarter',
  showMuscleHighlight = true,
}: ThreeRealisticHumanModelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Active exercise playback state
  const resolvedExercise: ExerciseAnimationType = typeof exerciseType === 'string'
    ? normalizeExerciseToAnimation(exerciseType)
    : exerciseType;

  const [activeExercise, setActiveExercise] = useState<ExerciseAnimationType>(resolvedExercise);
  const [playbackActive, setPlaybackActive] = useState<boolean>(isPlaying);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Keep internal state updated if prop changes
  useEffect(() => {
    setActiveExercise(resolvedExercise);
  }, [resolvedExercise]);

  useEffect(() => {
    setPlaybackActive(isPlaying);
  }, [isPlaying]);

  // Orbit control interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: viewAnglePreset === 'side' ? Math.PI / 2 : viewAnglePreset === 'front' ? 0 : Math.PI / 5,
    phi: Math.PI / 2.35,
    radius: 3.4
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070a11);
    scene.fog = new THREE.FogExp2(0x070a11, 0.16);

    // 2. CAMERA SETUP
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    cameraRef.current = camera;
    
    const updateCameraPos = () => {
      const { theta, phi, radius } = cameraAngleRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi) + 0.85; // Target center of torso
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0.95, 0);
    };
    updateCameraPos();

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      powerPreference: 'high-performance' 
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. STUDIO LIGHTING
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // Key Light (Warm soft studio key)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(2.4, 4.0, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (Cool natural bounce)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-3.0, 2.5, 2.0);
    scene.add(fillLight);

    // Rim Light (Teal/Emerald athlete silhouette contour)
    const rimLight = new THREE.DirectionalLight(0x10b981, 1.8);
    rimLight.position.set(0, 3.2, -3.5);
    scene.add(rimLight);

    // Subtle Ground Glow / Floor Reflection
    const floorBounceLight = new THREE.PointLight(0x064e3b, 0.8, 4);
    floorBounceLight.position.set(0, 0.2, 0);
    scene.add(floorBounceLight);

    // 5. GYM STUDIO FLOOR
    const floorGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.05, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b111a,
      roughness: 0.75,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.025;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor Target Marker / Circular Grid Rings
    const ringGeo1 = new THREE.RingGeometry(1.2, 1.215, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.005;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(2.2, 2.215, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.005;
    scene.add(ring2);

    // -------------------------------------------------------------------------
    // 6. BUILD REALISTIC 3D ANATOMICAL HUMAN ATHLETE RIG
    // -------------------------------------------------------------------------
    // Resolve personal avatar parameters or realistic default fitness athlete
    const skinColorHex = avatar?.skinToneHex || '#d49b77';
    const hairColorHex = avatar?.hairColorHex || '#211c19';
    const hairStyle = avatar?.hairStyle || 'short';
    const topColorHex = avatar?.topColorHex || '#0f172a';
    const bottomColorHex = avatar?.bottomColorHex || '#1e293b';
    const shoesColorHex = avatar?.shoesColorHex || '#10b981';

    // Proportions
    const sWidth = avatar?.shoulderWidthScale || 1.0;
    const cScale = avatar?.chestScale || 1.0;
    const wScale = avatar?.waistScale || 1.0;
    const hScale = avatar?.hipScale || 1.0;
    const lThick = avatar?.limbThicknessScale || 1.0;
    const vScale = avatar?.heightScale || 1.0;

    // Materials with realistic sub-surface & athletic textiles
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinColorHex),
      roughness: 0.54,
      metalness: 0.04,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hairColorHex),
      roughness: 0.85,
      metalness: 0.1,
    });

    const topClothingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(topColorHex),
      roughness: 0.62,
      metalness: 0.15,
    });

    const bottomClothingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bottomColorHex),
      roughness: 0.68,
      metalness: 0.12,
    });

    const shoesMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(shoesColorHex),
      roughness: 0.45,
      metalness: 0.2,
    });

    const shoesSoleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Muscle Activation Glow Material (for exercise focus)
    const muscleGlowMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.65,
      roughness: 0.35,
      metalness: 0.1,
    });

    // SKELETAL HIERARCHY
    const root = new THREE.Group();
    root.scale.set(vScale, vScale, vScale);
    scene.add(root);

    // Pelvis Group (Center of Gravity)
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, 0.98, 0);
    root.add(pelvisGroup);

    // Pelvis Mesh (Athletic shorts waistband & hips)
    const pelvisGeo = new THREE.CylinderGeometry(0.165 * hScale, 0.155 * hScale, 0.16, 20);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, bottomClothingMat);
    pelvisMesh.castShadow = true;
    pelvisGroup.add(pelvisMesh);

    // Torso Group (Abdominals & Lower Back)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.08, 0);
    pelvisGroup.add(torsoGroup);

    const absGeo = new THREE.CylinderGeometry(0.17 * cScale, 0.155 * wScale, 0.18, 20);
    const absMesh = new THREE.Mesh(absGeo, topClothingMat);
    absMesh.position.y = 0.09;
    absMesh.castShadow = true;
    torsoGroup.add(absMesh);

    // Chest Group (Ribcage, Pectoralis Major, Scapulae, Shoulders)
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 0.18, 0);
    torsoGroup.add(chestGroup);

    const chestGeo = new THREE.CylinderGeometry(0.205 * cScale * sWidth, 0.17 * cScale, 0.22, 24);
    const chestMesh = new THREE.Mesh(chestGeo, topClothingMat);
    chestMesh.position.y = 0.11;
    chestMesh.castShadow = true;
    chestGroup.add(chestMesh);

    // Neck & Head
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.23, 0);
    chestGroup.add(neckGroup);

    const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.10, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.y = 0.05;
    neckMesh.castShadow = true;
    neckGroup.add(neckMesh);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.10, 0);
    neckGroup.add(headGroup);

    // Cranium & Face
    const headGeo = new THREE.SphereGeometry(0.115, 24, 20);
    headGeo.scale(0.9, 1.15, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.y = 0.11;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hair Model based on avatar preference
    const hairGeo = new THREE.SphereGeometry(0.122, 20, 16);
    hairGeo.scale(0.94, 1.18, 1.05);
    const hairMesh = new THREE.Mesh(hairGeo, hairMaterial);
    hairMesh.position.set(0, 0.13, -0.015);
    headGroup.add(hairMesh);

    if (hairStyle === 'tied' || hairStyle === 'long') {
      const bunGeo = new THREE.SphereGeometry(0.055, 16, 14);
      const bunMesh = new THREE.Mesh(bunGeo, hairMaterial);
      bunMesh.position.set(0, 0.16, -0.12);
      headGroup.add(bunMesh);
    }

    // ARMS RIG (Left & Right)
    // Left Shoulder & Arm
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(0.22 * sWidth, 0.18, 0);
    chestGroup.add(leftShoulder);

    const leftDeltoidGeo = new THREE.SphereGeometry(0.075 * lThick, 16, 14);
    const leftDeltoidMesh = new THREE.Mesh(leftDeltoidGeo, skinMaterial);
    leftShoulder.add(leftDeltoidMesh);

    const leftUpperArm = new THREE.Group();
    leftUpperArm.position.set(0, 0, 0);
    leftShoulder.add(leftUpperArm);

    const armGeo = new THREE.CylinderGeometry(0.058 * lThick, 0.050 * lThick, 0.26, 16);
    const leftArmMesh = new THREE.Mesh(armGeo, skinMaterial);
    leftArmMesh.position.y = -0.13;
    leftArmMesh.castShadow = true;
    leftUpperArm.add(leftArmMesh);

    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.set(0, -0.26, 0);
    leftUpperArm.add(leftForearmGroup);

    const forearmGeo = new THREE.CylinderGeometry(0.048 * lThick, 0.038 * lThick, 0.24, 16);
    const leftForearmMesh = new THREE.Mesh(forearmGeo, skinMaterial);
    leftForearmMesh.position.y = -0.12;
    leftForearmMesh.castShadow = true;
    leftForearmGroup.add(leftForearmMesh);

    const leftHand = new THREE.Group();
    leftHand.position.set(0, -0.24, 0);
    leftForearmGroup.add(leftHand);

    const handGeo = new THREE.BoxGeometry(0.045, 0.08, 0.06);
    const leftHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    leftHandMesh.position.y = -0.04;
    leftHand.add(leftHandMesh);

    // Right Shoulder & Arm
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(-0.22 * sWidth, 0.18, 0);
    chestGroup.add(rightShoulder);

    const rightDeltoidMesh = new THREE.Mesh(leftDeltoidGeo, skinMaterial);
    rightShoulder.add(rightDeltoidMesh);

    const rightUpperArm = new THREE.Group();
    rightUpperArm.position.set(0, 0, 0);
    rightShoulder.add(rightUpperArm);

    const rightArmMesh = new THREE.Mesh(armGeo, skinMaterial);
    rightArmMesh.position.y = -0.13;
    rightArmMesh.castShadow = true;
    rightUpperArm.add(rightArmMesh);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.26, 0);
    rightUpperArm.add(rightForearmGroup);

    const rightForearmMesh = new THREE.Mesh(forearmGeo, skinMaterial);
    rightForearmMesh.position.y = -0.12;
    rightForearmMesh.castShadow = true;
    rightForearmGroup.add(rightForearmMesh);

    const rightHand = new THREE.Group();
    rightHand.position.set(0, -0.24, 0);
    rightForearmGroup.add(rightHand);

    const rightHandMesh = new THREE.Mesh(handGeo, skinMaterial);
    rightHandMesh.position.y = -0.04;
    rightHand.add(rightHandMesh);

    // LEGS RIG (Left & Right)
    // Left Hip & Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(0.105 * hScale, -0.07, 0);
    pelvisGroup.add(leftHip);

    const leftThighGroup = new THREE.Group();
    leftHip.add(leftThighGroup);

    const thighGeo = new THREE.CylinderGeometry(0.088 * lThick, 0.068 * lThick, 0.40, 18);
    const leftThighMesh = new THREE.Mesh(thighGeo, bottomClothingMat);
    leftThighMesh.position.y = -0.20;
    leftThighMesh.castShadow = true;
    leftThighGroup.add(leftThighMesh);

    const leftKneeGroup = new THREE.Group();
    leftKneeGroup.position.set(0, -0.40, 0);
    leftThighGroup.add(leftKneeGroup);

    const kneeJointGeo = new THREE.SphereGeometry(0.062 * lThick, 14, 12);
    const leftKneeJointMesh = new THREE.Mesh(kneeJointGeo, skinMaterial);
    leftKneeGroup.add(leftKneeJointMesh);

    const calfGeo = new THREE.CylinderGeometry(0.066 * lThick, 0.048 * lThick, 0.42, 16);
    const leftCalfMesh = new THREE.Mesh(calfGeo, skinMaterial);
    leftCalfMesh.position.y = -0.21;
    leftCalfMesh.castShadow = true;
    leftKneeGroup.add(leftCalfMesh);

    const leftAnkleGroup = new THREE.Group();
    leftAnkleGroup.position.set(0, -0.42, 0);
    leftKneeGroup.add(leftAnkleGroup);

    // Sneaker
    const shoeGeo = new THREE.BoxGeometry(0.09, 0.09, 0.22);
    const leftShoeMesh = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoeMesh.position.set(0, -0.045, 0.045);
    leftShoeMesh.castShadow = true;
    leftAnkleGroup.add(leftShoeMesh);

    const shoeSoleGeo = new THREE.BoxGeometry(0.096, 0.025, 0.23);
    const leftSoleMesh = new THREE.Mesh(shoeSoleGeo, shoesSoleMat);
    leftSoleMesh.position.set(0, -0.08, 0.045);
    leftAnkleGroup.add(leftSoleMesh);

    // Right Hip & Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(-0.105 * hScale, -0.07, 0);
    pelvisGroup.add(rightHip);

    const rightThighGroup = new THREE.Group();
    rightHip.add(rightThighGroup);

    const rightThighMesh = new THREE.Mesh(thighGeo, bottomClothingMat);
    rightThighMesh.position.y = -0.20;
    rightThighMesh.castShadow = true;
    rightThighGroup.add(rightThighMesh);

    const rightKneeGroup = new THREE.Group();
    rightKneeGroup.position.set(0, -0.40, 0);
    rightThighGroup.add(rightKneeGroup);

    const rightKneeJointMesh = new THREE.Mesh(kneeJointGeo, skinMaterial);
    rightKneeGroup.add(rightKneeJointMesh);

    const rightCalfMesh = new THREE.Mesh(calfGeo, skinMaterial);
    rightCalfMesh.position.y = -0.21;
    rightCalfMesh.castShadow = true;
    rightKneeGroup.add(rightCalfMesh);

    const rightAnkleGroup = new THREE.Group();
    rightAnkleGroup.position.set(0, -0.42, 0);
    rightKneeGroup.add(rightAnkleGroup);

    const rightShoeMesh = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoeMesh.position.set(0, -0.045, 0.045);
    rightShoeMesh.castShadow = true;
    rightAnkleGroup.add(rightShoeMesh);

    const rightSoleMesh = new THREE.Mesh(shoeSoleGeo, shoesSoleMat);
    rightSoleMesh.position.set(0, -0.08, 0.045);
    rightAnkleGroup.add(rightSoleMesh);

    // -------------------------------------------------------------------------
    // 7. ANIMATION LOOP & KINEMATICS ENGINE
    // -------------------------------------------------------------------------
    let time = 0;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (playbackActive) {
        time += 0.028 * playbackSpeed;
      }

      // Continuous normalized cycle [0 to 1] with sinusoidal easing
      const cycle = (Math.sin(time) + 1) / 2;
      const cosCycle = (Math.cos(time) + 1) / 2;

      // Reset transformations
      root.position.set(0, 0, 0);
      root.rotation.set(0, 0, 0);
      pelvisGroup.position.set(0, 0.98, 0);
      pelvisGroup.rotation.set(0, 0, 0);
      torsoGroup.rotation.set(0, 0, 0);
      chestGroup.rotation.set(0, 0, 0);
      neckGroup.rotation.set(0, 0, 0);

      leftShoulder.rotation.set(0, 0, 0);
      rightShoulder.rotation.set(0, 0, 0);
      leftUpperArm.rotation.set(0, 0, 0);
      rightUpperArm.rotation.set(0, 0, 0);
      leftForearmGroup.rotation.set(0, 0, 0);
      rightForearmGroup.rotation.set(0, 0, 0);

      leftThighGroup.rotation.set(0, 0, 0);
      rightThighGroup.rotation.set(0, 0, 0);
      leftKneeGroup.rotation.set(0, 0, 0);
      rightKneeGroup.rotation.set(0, 0, 0);
      leftAnkleGroup.rotation.set(0, 0, 0);
      rightAnkleGroup.rotation.set(0, 0, 0);

      // KINEMATICS IMPLEMENTATIONS
      switch (activeExercise) {
        case 'IDLE': {
          // Natural relaxed athletic posture with breathing and micro-weight shift
          const breath = Math.sin(time * 1.5) * 0.02;
          chestGroup.scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
          pelvisGroup.position.y = 0.98 + Math.sin(time * 0.75) * 0.008;
          leftUpperArm.rotation.z = 0.12 + Math.sin(time * 0.75) * 0.02;
          rightUpperArm.rotation.z = -0.12 - Math.sin(time * 0.75) * 0.02;
          leftForearmGroup.rotation.x = -0.15;
          rightForearmGroup.rotation.x = -0.15;
          break;
        }

        case 'SQUAT': {
          // Deep athletic squat: hip hinge, knee flexion, ankle dorsiflexion, arms counterbalance
          const squatDrop = cycle * 0.46; // Pelvis drops
          pelvisGroup.position.y = 0.98 - squatDrop;
          pelvisGroup.position.z = -cycle * 0.12; // Hips move backwards

          // Torso counter-balance angle
          torsoGroup.rotation.x = cycle * 0.42;

          // Thighs flexion (hip hinge)
          const hipAngle = -cycle * 1.65;
          leftThighGroup.rotation.x = hipAngle;
          rightThighGroup.rotation.x = hipAngle;

          // Knees flexion
          const kneeAngle = cycle * 2.35;
          leftKneeGroup.rotation.x = kneeAngle;
          rightKneeGroup.rotation.x = kneeAngle;

          // Ankles flexion
          const ankleAngle = -cycle * 0.70;
          leftAnkleGroup.rotation.x = ankleAngle;
          rightAnkleGroup.rotation.x = ankleAngle;

          // Arms raise forward for counterbalance
          leftUpperArm.rotation.x = -cycle * 1.45;
          rightUpperArm.rotation.x = -cycle * 1.45;
          leftForearmGroup.rotation.x = -cycle * 0.35;
          rightForearmGroup.rotation.x = -cycle * 0.35;
          break;
        }

        case 'PUSH_UP': {
          // Horizontal prone push-up position on floor
          root.position.set(0, 0.24, 0);
          root.rotation.x = Math.PI / 2; // Horizontal prone

          // Cycle: 0 = Lockout high plank, 1 = Bottom chest dip
          const chestDip = cycle * 0.22;
          root.position.y = 0.28 - chestDip;

          // Arm pressing mechanics
          const armAngle = cycle * 1.35;
          leftUpperArm.rotation.y = -0.5 - cycle * 0.4;
          rightUpperArm.rotation.y = 0.5 + cycle * 0.4;
          leftForearmGroup.rotation.x = armAngle;
          rightForearmGroup.rotation.x = armAngle;

          // Stable straight core and legs
          torsoGroup.rotation.x = -0.03;
          leftAnkleGroup.rotation.x = 0.45; // Toes planted
          rightAnkleGroup.rotation.x = 0.45;
          break;
        }

        case 'LUNGE': {
          // Split-stance dynamic lunge
          const lungeDepth = cycle * 0.36;
          pelvisGroup.position.y = 0.98 - lungeDepth;

          // Left leg (Forward): 90° knee bend
          leftThighGroup.rotation.x = -cycle * 1.35;
          leftKneeGroup.rotation.x = cycle * 1.65;
          leftAnkleGroup.rotation.x = -cycle * 0.30;

          // Right leg (Trailing): Extends back, knee drops toward floor
          rightThighGroup.rotation.x = cycle * 0.75;
          rightKneeGroup.rotation.x = cycle * 1.55;
          rightAnkleGroup.rotation.x = cycle * 0.65;

          // Upright torso
          torsoGroup.rotation.x = 0.05;

          // Arms running cadence balance
          leftUpperArm.rotation.x = -0.4 * Math.sin(time);
          rightUpperArm.rotation.x = 0.4 * Math.sin(time);
          leftForearmGroup.rotation.x = -0.6;
          rightForearmGroup.rotation.x = -0.6;
          break;
        }

        case 'PLANK': {
          // Isometric prone core hold
          root.position.set(0, 0.22, 0);
          root.rotation.x = Math.PI / 2;

          // Subtle breathing micro-motion
          const coreTension = Math.sin(time * 2) * 0.015;
          absMesh.scale.set(1 - coreTension, 1, 1 - coreTension);

          // Forearms planted
          leftUpperArm.rotation.y = -0.3;
          rightUpperArm.rotation.y = 0.3;
          leftForearmGroup.rotation.x = 1.4;
          rightForearmGroup.rotation.x = 1.4;

          leftAnkleGroup.rotation.x = 0.45;
          rightAnkleGroup.rotation.x = 0.45;
          break;
        }

        case 'SHOULDER_PRESS': {
          // Standing overhead dumbbell / barbell pressing pattern
          const pressHeight = cycle * 1.85; // 0: at shoulders, 1: full overhead lockout

          leftShoulder.rotation.z = 0.4 + cycle * 0.8;
          rightShoulder.rotation.z = -0.4 - cycle * 0.8;

          leftUpperArm.rotation.x = -0.3 - cycle * 1.2;
          rightUpperArm.rotation.x = -0.3 - cycle * 1.2;

          leftForearmGroup.rotation.x = -1.6 + pressHeight;
          rightForearmGroup.rotation.x = -1.6 + pressHeight;

          // Slight athletic stance with soft knees
          leftKneeGroup.rotation.x = 0.06;
          rightKneeGroup.rotation.x = 0.06;
          break;
        }

        case 'BICEP_CURL': {
          // Strict elbow flexion and supination
          const curlFlex = cycle * 2.15; // 0: at sides, 1: peak bicep contraction

          leftUpperArm.rotation.x = -0.08;
          rightUpperArm.rotation.x = -0.08;
          leftUpperArm.rotation.z = 0.08;
          rightUpperArm.rotation.z = -0.08;

          leftForearmGroup.rotation.x = -curlFlex;
          rightForearmGroup.rotation.x = -curlFlex;
          break;
        }

        case 'DEADLIFT': {
          // Hip hinge posterior chain loading
          const hinge = cycle * 0.95; // 0: upright lockout, 1: barbell at shins
          pelvisGroup.position.z = -cycle * 0.24; // Hips drive backwards
          pelvisGroup.position.y = 0.98 - cycle * 0.22;

          torsoGroup.rotation.x = hinge * 0.85; // Forward hinge with flat spine
          leftThighGroup.rotation.x = -hinge * 0.75;
          rightThighGroup.rotation.x = -hinge * 0.75;

          // Slight knee bend (soft knees)
          leftKneeGroup.rotation.x = hinge * 0.55;
          rightKneeGroup.rotation.x = hinge * 0.55;

          // Arms hanging vertical holding bar
          leftUpperArm.rotation.x = -hinge * 0.8;
          rightUpperArm.rotation.x = -hinge * 0.8;
          break;
        }

        case 'PULL_UP': {
          // Hanging pull-up chin to bar
          root.position.y = 0.65 + (1 - cycle) * 0.45; // 1 = top, 0 = hang

          // Arms gripping bar overhead
          leftUpperArm.rotation.z = 2.4 - cycle * 1.1;
          rightUpperArm.rotation.z = -2.4 + cycle * 1.1;
          leftForearmGroup.rotation.x = -1.2 + cycle * 1.1;
          rightForearmGroup.rotation.x = -1.2 + cycle * 1.1;

          // Crossed ankles
          leftKneeGroup.rotation.x = 0.6;
          rightKneeGroup.rotation.x = 0.6;
          break;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------------------
    // 8. INTERACTIVE ORBIT CONTROLS (Pointer drag to rotate, wheel to zoom)
    // -------------------------------------------------------------------------
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactiveOrbit) return;
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactiveOrbit || !isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      cameraAngleRef.current.theta += deltaX * 0.009;
      // Clamp vertical polar angle to avoid flipping
      cameraAngleRef.current.phi = Math.max(
        0.3,
        Math.min(Math.PI / 2.05, cameraAngleRef.current.phi + deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: clientX, y: clientY };
      updateCameraPos();
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactiveOrbit) return;
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(
        1.8,
        Math.min(5.2, cameraAngleRef.current.radius + e.deltaY * 0.003)
      );
      updateCameraPos();
    };

    // Attach interaction listeners
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);

      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      dom.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      scene.clear();
    };
  }, [avatar, activeExercise, playbackActive, playbackSpeed, interactiveOrbit, viewAnglePreset]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#070a11] border border-white/[0.08] shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate 3D human model in 360°"
      />

      {/* Top Overlay Badge: Model Info */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          REALISTIC 3D HUMAN MODEL
        </span>
        {avatar && (
          <span className="px-2 py-0.5 rounded-md bg-white/[0.06] backdrop-blur-md text-[10px] font-mono text-slate-300">
            Personalized Build: {avatar.bodyBuild}
          </span>
        )}
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          {/* Exercise Mode Selector Chips */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {(['IDLE', 'SQUAT', 'PUSH_UP', 'LUNGE', 'PLANK', 'SHOULDER_PRESS', 'BICEP_CURL'] as ExerciseAnimationType[]).map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setActiveExercise(ex)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer whitespace-nowrap ${
                  activeExercise === ex
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {ex.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Playback & Reset Controls */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setPlaybackActive(!playbackActive)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              {playbackActive ? 'PAUSE' : 'PLAY'}
            </button>

            <button
              type="button"
              onClick={() => {
                cameraAngleRef.current = {
                  theta: Math.PI / 5,
                  phi: Math.PI / 2.35,
                  radius: 3.4
                };
              }}
              className="px-2 py-1 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset 3D camera angle"
            >
              RESET VIEW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
