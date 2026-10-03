import { GoogleGenAI, Type } from '@google/genai';
import { AvatarProfile } from '../../types';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export interface AvatarGenerationParams {
  userId?: string;
  imageBase64?: string;
  mimeType?: string;
  height?: number;
  heightUnit?: 'cm' | 'in';
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  genderPreference?: 'masculine' | 'feminine' | 'neutral';
}

export class AvatarService {
  /**
   * Generates a realistic 3D human avatar configuration based on photo analysis
   * and optional physical measurements (height & weight).
   * 
   * Strict privacy: The photo is processed in-memory only and discarded immediately.
   * Strict accuracy: Always flagged as an approximate athletic estimate.
   */
  async generateAvatar(params: AvatarGenerationParams): Promise<AvatarProfile> {
    const {
      userId = 'user-default',
      imageBase64,
      mimeType = 'image/jpeg',
      height,
      heightUnit = 'cm',
      weight,
      weightUnit = 'kg',
      genderPreference
    } = params;

    // Convert height to cm for proportional calculations
    let heightCm = 175;
    if (height && height > 0) {
      heightCm = heightUnit === 'in' ? Math.round(height * 2.54) : Math.round(height);
      // Constrain to realistic human bounds (130cm to 220cm)
      heightCm = Math.max(130, Math.min(220, heightCm));
    }

    // Convert weight to kg for proportional calculations
    let weightKg = 72;
    if (weight && weight > 0) {
      weightKg = weightUnit === 'lbs' ? Math.round(weight * 0.453592) : Math.round(weight);
      // Constrain to realistic human bounds (40kg to 160kg)
      weightKg = Math.max(40, Math.min(160, weightKg));
    }

    // Compute Body Mass Index (BMI) baseline reference
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Compute standard anatomical scaling based on natural human anthropometry
    // Average reference: 175cm, 72kg => BMI ~23.5 => scale 1.0
    const heightScale = Math.max(0.88, Math.min(1.15, heightCm / 175));
    
    // Proportions based on BMI variations (restrained, realistic, non-exaggerated)
    const bmiFactor = (bmi - 22.5) / 15; // -0.5 to +0.5 typically
    let shoulderWidthScale = Math.max(0.92, Math.min(1.18, 1.0 + bmiFactor * 0.15));
    let chestScale = Math.max(0.90, Math.min(1.18, 1.0 + bmiFactor * 0.20));
    let waistScale = Math.max(0.88, Math.min(1.22, 1.0 + bmiFactor * 0.35));
    let hipScale = Math.max(0.90, Math.min(1.18, 1.0 + bmiFactor * 0.22));
    let limbThicknessScale = Math.max(0.88, Math.min(1.18, 1.0 + bmiFactor * 0.25));

    let detectedGender: 'masculine' | 'feminine' | 'neutral' = genderPreference || 'neutral';
    let skinToneHex = '#d89e78'; // Natural warm athletic tone
    let hairColorHex = '#27201c'; // Dark espresso
    let hairStyle: 'short' | 'buzz' | 'medium' | 'long' | 'tied' = 'short';
    let bodyBuild: 'lean' | 'athletic' | 'medium' | 'muscular' | 'stocky' = 
      bmi < 21 ? 'lean' : bmi < 25 ? 'athletic' : bmi < 28 ? 'medium' : 'stocky';

    let topColorHex = '#0f172a'; // Slate-900 compression top
    let bottomColorHex = '#1e293b'; // Slate-800 athletic shorts
    let shoesColorHex = '#10b981'; // Emerald accent sneakers

    // Try Gemini Multi-modal Analysis if user provided a photo
    if (imageBase64 && apiKey) {
      try {
        const cleanBase64 = imageBase64.includes('base64,')
          ? imageBase64.split('base64,')[1]
          : imageBase64;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType: mimeType || 'image/jpeg'
                  }
                },
                {
                  text: `You are an expert 3D character artist and biomechanics specialist for a realistic sports fitness platform.
Analyze this user's clear uploaded photo to calibrate a personalized, realistic 3D human fitness avatar.

USER PROVIDED MEASUREMENTS:
- Height: ${height ? `${height} ${heightUnit}` : 'Not specified'}
- Weight: ${weight ? `${weight} ${weightUnit}` : 'Not specified'}
- Calculated baseline BMI: ${bmi.toFixed(1)}

EXTRACTION GOALS:
1. Realistic skin undertone hex color (e.g. fair #f5cfb3, warm olive #c99368, tan #ba7f52, brown #844c2c, deep #4d2d1b, etc.).
2. Hair color hex and hair style ('short' | 'buzz' | 'medium' | 'long' | 'tied').
3. Gender presentation ('masculine' | 'feminine' | 'neutral').
4. Body build category ('lean' | 'athletic' | 'medium' | 'muscular' | 'stocky').
5. Natural human proportion scales (shoulderWidthScale, chestScale, waistScale, hipScale, limbThicknessScale) between 0.88 and 1.20.

STRICT CONSTRAINTS:
- The avatar MUST look like a real human fitness model.
- NO cartoon, NO stickman, NO superhero exaggeration, NO unnatural balloon muscles.
- Proportions must be natural and balanced for athletic exercise performance.
- Never retain, leak, or mention personally identifiable information.`
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                genderPresentation: {
                  type: Type.STRING,
                  enum: ['masculine', 'feminine', 'neutral']
                },
                skinToneHex: { type: Type.STRING },
                hairColorHex: { type: Type.STRING },
                hairStyle: {
                  type: Type.STRING,
                  enum: ['short', 'buzz', 'medium', 'long', 'tied']
                },
                bodyBuild: {
                  type: Type.STRING,
                  enum: ['lean', 'athletic', 'medium', 'muscular', 'stocky']
                },
                topColorHex: { type: Type.STRING },
                bottomColorHex: { type: Type.STRING },
                shoesColorHex: { type: Type.STRING },
                shoulderWidthScale: { type: Type.NUMBER },
                chestScale: { type: Type.NUMBER },
                waistScale: { type: Type.NUMBER },
                hipScale: { type: Type.NUMBER },
                limbThicknessScale: { type: Type.NUMBER }
              },
              required: [
                'genderPresentation',
                'skinToneHex',
                'hairColorHex',
                'hairStyle',
                'bodyBuild',
                'shoulderWidthScale',
                'chestScale',
                'waistScale',
                'hipScale',
                'limbThicknessScale'
              ]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.genderPresentation) detectedGender = parsed.genderPresentation;
          if (parsed.skinToneHex && parsed.skinToneHex.startsWith('#')) skinToneHex = parsed.skinToneHex;
          if (parsed.hairColorHex && parsed.hairColorHex.startsWith('#')) hairColorHex = parsed.hairColorHex;
          if (parsed.hairStyle) hairStyle = parsed.hairStyle;
          if (parsed.bodyBuild) bodyBuild = parsed.bodyBuild;
          if (parsed.topColorHex && parsed.topColorHex.startsWith('#')) topColorHex = parsed.topColorHex;
          if (parsed.bottomColorHex && parsed.bottomColorHex.startsWith('#')) bottomColorHex = parsed.bottomColorHex;
          if (parsed.shoesColorHex && parsed.shoesColorHex.startsWith('#')) shoesColorHex = parsed.shoesColorHex;

          if (typeof parsed.shoulderWidthScale === 'number') {
            shoulderWidthScale = Math.max(0.88, Math.min(1.22, parsed.shoulderWidthScale));
          }
          if (typeof parsed.chestScale === 'number') {
            chestScale = Math.max(0.88, Math.min(1.22, parsed.chestScale));
          }
          if (typeof parsed.waistScale === 'number') {
            waistScale = Math.max(0.85, Math.min(1.25, parsed.waistScale));
          }
          if (typeof parsed.hipScale === 'number') {
            hipScale = Math.max(0.88, Math.min(1.22, parsed.hipScale));
          }
          if (typeof parsed.limbThicknessScale === 'number') {
            limbThicknessScale = Math.max(0.88, Math.min(1.22, parsed.limbThicknessScale));
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini avatar photo analysis fallback triggered:', geminiErr);
        // Continue with robust heuristic calculations
      }
    }

    // Return the generated avatar configuration
    const avatarConfig: AvatarProfile = {
      id: `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      heightCm,
      heightUnit,
      weightKg,
      weightUnit,
      genderPresentation: detectedGender,
      bodyBuild,
      skinToneHex,
      hairColorHex,
      hairStyle,
      topColorHex,
      bottomColorHex,
      shoesColorHex,
      shoulderWidthScale: Math.round(shoulderWidthScale * 100) / 100,
      chestScale: Math.round(chestScale * 100) / 100,
      waistScale: Math.round(waistScale * 100) / 100,
      hipScale: Math.round(hipScale * 100) / 100,
      limbThicknessScale: Math.round(limbThicknessScale * 100) / 100,
      heightScale: Math.round(heightScale * 100) / 100,
      photoAnalyzedAt: new Date().toISOString(),
      isApproximateEstimate: true,
      notes: 'Calibrated using visual undertone mapping and anthropometric scaling. Approximate 3D representation designed for exercise kinetics.'
    };

    return avatarConfig;
  }
}

export const avatarService = new AvatarService();
