import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  RefreshCw, 
  Layers, 
  User, 
  ArrowRight,
  Info
} from 'lucide-react';
import ThreeRealisticHumanModel from './ThreeRealisticHumanModel';
import { AvatarProfile, UserProfile } from '../types';

interface PersonalAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onAvatarSaved: (avatar: AvatarProfile) => void;
}

export default function PersonalAvatarModal({
  isOpen,
  onClose,
  user,
  onAvatarSaved,
}: PersonalAvatarModalProps) {
  // Input states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [height, setHeight] = useState<string>(user.height ? String(user.height) : '175');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(user.heightUnit || 'cm');
  const [weight, setWeight] = useState<string>(user.weight ? String(user.weight) : '72');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user.weightUnit || 'kg');
  const [genderPreference, setGenderPreference] = useState<'masculine' | 'feminine' | 'neutral'>('neutral');

  // Generation flow states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<AvatarProfile | null>(user.avatar || null);
  const [activeStep, setActiveStep] = useState<'input' | 'preview'>(user.avatar ? 'preview' : 'input');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Photo Selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Avatar Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationStep('Analyzing anatomical cues & skin undertones...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Calibrating proportional skeletal geometry...');
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Assembling realistic 3D human model & exercise rig...');
      }, 1500);

      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          imageBase64: photoBase64,
          mimeType: photoBase64?.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          height: height ? parseFloat(height) : undefined,
          heightUnit,
          weight: weight ? parseFloat(weight) : undefined,
          weightUnit,
          genderPreference,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();
      if (!res.ok || !data.success || !data.avatar) {
        throw new Error(data.error || 'Failed to calibrate 3D avatar.');
      }

      setGeneratedAvatar(data.avatar);
      setActiveStep('preview');
    } catch (err: any) {
      console.error('Error generating avatar:', err);
      setError(err.message || 'Avatar calibration failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Confirm and Save
  const handleUseThisAvatar = async () => {
    if (!generatedAvatar) return;

    try {
      await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: generatedAvatar }),
      });
    } catch (e) {
      console.warn('Avatar remote sync warning:', e);
    }

    onAvatarSaved(generatedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#090d14] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {activeStep === 'preview' ? 'Your 3D Avatar' : 'Personal Realistic 3D Human Avatar'}
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {activeStep === 'preview' ? 'Calibrated 3D Human Fitness Model' : 'Photo & Anthropometric Calibration'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================================================================= */}
          {/* STEP 1: INPUTS (Photo Upload + Optional Height & Weight)          */}
          {/* ================================================================= */}
          {activeStep === 'input' && (
            <div className="space-y-6">
              {/* Privacy Shield Notice */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-emerald-300 font-bold block">
                    Privacy Protected Processing
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    Your uploaded photo is processed in temporary volatile memory strictly to extract skin undertones and natural anatomical proportions. It is never stored on disk, never published, and never used for machine learning training.
                  </p>
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                  1. Upload Clear Personal Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="p-4 rounded-2xl bg-[#0c1017] border border-emerald-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={photoPreview}
                        alt="Uploaded preview"
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Photo Loaded Successfully
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Ready for visual tone & proportion analysis.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoBase64(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300 font-semibold transition"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/50 bg-[#0c1017] transition cursor-pointer text-center space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] group-hover:bg-emerald-500/15 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mx-auto transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        Click or drag a clear personal photo here
                      </span>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        Front-facing upper or full body photo in natural lighting works best.
                      </p>
                    </div>
                    <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-white/[0.04] text-slate-400">
                      JPEG, PNG, or WebP up to 8MB
                    </span>
                  </div>
                )}
              </div>

              {/* Physical Measurements (Optional Height & Weight) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    2. Body Measurements (Optional)
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    Enhances athletic scale & proportions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height Input */}
                  <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Height</span>
                      <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setHeightUnit('cm')}
                          className={`px-2 py-0.5 rounded ${heightUnit === 'cm' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          CM
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeightUnit('in')}
                          className={`px-2 py-0.5 rounded ${heightUnit === 'in' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          IN
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={heightUnit === 'cm' ? 'e.g. 178' : 'e.g. 70'}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Weight Input */}
                  <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Weight</span>
                      <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setWeightUnit('kg')}
                          className={`px-2 py-0.5 rounded ${weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('lbs')}
                          className={`px-2 py-0.5 rounded ${weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          LBS
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={weightUnit === 'kg' ? 'e.g. 74' : 'e.g. 163'}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Accuracy Disclaimer */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Height and weight alone provide an athletic structural estimate rather than exact clinical body composition. If inputs are minimal, the engine builds an approximate, natural human 3D representation calibrated for exercise kinematics.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm transition cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{generationStep || 'Calibrating 3D Avatar...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate My Avatar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: PREVIEW ("Your 3D Avatar" & Controls)                      */}
          {/* ================================================================= */}
          {activeStep === 'preview' && generatedAvatar && (
            <div className="space-y-6">
              {/* Top Summary Banner */}
              <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold block">
                    CALIBRATED 3D PROFILE
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {user.username}'s Realistic 3D Fitness Model
                  </h3>
                  <p className="text-slate-400">
                    Proportions: <strong className="text-slate-200 capitalize">{generatedAvatar.bodyBuild}</strong> · Height: {generatedAvatar.heightCm} cm · Weight: {generatedAvatar.weightKg} kg
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-mono">Skin Tone:</span>
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: generatedAvatar.skinToneHex }}
                      title={`Tone Hex: ${generatedAvatar.skinToneHex}`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-mono">Hair:</span>
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: generatedAvatar.hairColorHex }}
                      title={`Hair: ${generatedAvatar.hairStyle}`}
                    />
                  </div>
                </div>
              </div>

              {/* Three.js Interactive 3D Viewport */}
              <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl">
                <ThreeRealisticHumanModel
                  avatar={generatedAvatar}
                  exerciseType="SQUAT"
                  showControls={true}
                  interactiveOrbit={true}
                  className="w-full h-full"
                />
              </div>

              {/* Rig / Exercise Kinematics Capability Note */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Interactive 360° orbit enabled. Select an exercise movement above to test the rig.</span>
                <span className="text-emerald-400 font-bold hidden sm:inline">IK Rig Active</span>
              </div>

              {/* Actions: [ USE THIS AVATAR ] and [ REGENERATE ] */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActiveStep('input')}
                  className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUseThisAvatar}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Use This Avatar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
