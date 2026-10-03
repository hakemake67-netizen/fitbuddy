import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Send, 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  X,
  RefreshCw,
  Power
} from 'lucide-react';
import { CoachState, CoachMessage, UserProfile, WorkoutPlan } from '../types';

interface LiveCoachProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activePlan: WorkoutPlan | null;
  currentDayNumber: number;
  currentExerciseName: string;
  currentSetNumber?: number;
}

export default function LiveCoach({
  isOpen,
  onClose,
  user,
  activePlan,
  currentDayNumber,
  currentExerciseName,
  currentSetNumber,
}: LiveCoachProps) {
  // State Machine: IDLE | REQUESTING_MIC | LISTENING | PROCESSING | SPEAKING | PAUSED | ERROR | ENDED
  const [coachState, setCoachState] = useState<CoachState>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>("I'm ready. Tell me what you need.");
  
  // Specific fallbacks
  const [errorType, setErrorType] = useState<'permission_denied' | 'unsupported_browser' | 'gemini_error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chat message stream
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      role: 'model',
      content: `Hello ${user.username}. I am your FitBuddy Coach. Ask me any movement question, pacing check, or form adjustment for ${currentExerciseName}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [typedInput, setTypedInput] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lastUserQuery, setLastUserQuery] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const isComponentMounted = useRef<boolean>(true);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const coachStateRef = useRef<CoachState>('IDLE');
  useEffect(() => {
    coachStateRef.current = coachState;
  }, [coachState]);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      cleanupAudioAndVoice();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const cleanupAudioAndVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  };

  // START COACH: Requests mic then enters LISTENING state
  const startConversation = async () => {
    setErrorType(null);
    setErrorMessage(null);
    setCoachState('REQUESTING_MIC');
    setStatusMessage('REQUESTING MICROPHONE...');

    // 1. Check browser speech support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCoachState('ERROR');
      setErrorType('unsupported_browser');
      setErrorMessage("Voice conversation isn't supported on this browser.");
      setStatusMessage('VOICE UNSUPPORTED');
      return;
    }

    // 2. Request microphone stream cleanly
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: any) {
      console.warn('Microphone permission denied:', err);
      setCoachState('ERROR');
      setErrorType('permission_denied');
      setErrorMessage('Voice access is unavailable.');
      setStatusMessage('MIC ACCESS DENIED');
      return;
    }

    // 3. Initialize single SpeechRecognition instance
    try {
      cleanupAudioAndVoice();

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        if (!isComponentMounted.current) return;
        setCoachState('LISTENING');
        setStatusMessage('LISTENING...');
      };

      recognition.onresult = (event: any) => {
        if (!isComponentMounted.current) return;
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          handleUserUtterance(transcript.trim());
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setCoachState('ERROR');
          setErrorType('permission_denied');
          setErrorMessage('Voice access is unavailable.');
          setStatusMessage('MIC ACCESS DENIED');
        } else if (e.error === 'no-speech') {
          if (coachStateRef.current === 'LISTENING') {
            restartListeningSafe();
          }
        } else {
          setCoachState('ERROR');
          setErrorType('permission_denied');
          setErrorMessage('Voice access is unavailable.');
          setStatusMessage('VOICE ERROR');
        }
      };

      recognition.onend = () => {
        if (coachStateRef.current === 'LISTENING' && isComponentMounted.current) {
          restartListeningSafe();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setCoachState('ERROR');
      setErrorType('unsupported_browser');
      setErrorMessage("Voice conversation isn't supported on this browser.");
      setStatusMessage('VOICE ERROR');
    }
  };

  const restartListeningSafe = () => {
    if (coachStateRef.current === 'SPEAKING' || coachStateRef.current === 'PROCESSING') return;
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        setTimeout(() => {
          if (coachStateRef.current === 'LISTENING' && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 300);
      }
    } catch (e) {}
  };

  const stopListeningImmediately = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
  };

  const pauseCoach = () => {
    cleanupAudioAndVoice();
    setCoachState('PAUSED');
    setStatusMessage('PAUSED');
  };

  const resumeCoach = () => {
    startConversation();
  };

  const endCoach = () => {
    cleanupAudioAndVoice();
    setCoachState('ENDED');
    setStatusMessage('ENDED');
  };

  const handleContinueWithText = () => {
    cleanupAudioAndVoice();
    setCoachState('IDLE');
    setErrorType(null);
    setErrorMessage(null);
    setStatusMessage("I'm ready. Tell me what you need.");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handles query execution with full current workout context
  const handleUserUtterance = async (queryText: string) => {
    if (!queryText.trim()) return;

    setLastUserQuery(queryText.trim());
    stopListeningImmediately();
    setCoachState('PROCESSING');
    setStatusMessage('PROCESSING...');
    setErrorType(null);
    setErrorMessage(null);

    const userMessage: CoachMessage = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    setTypedInput('');

    try {
      const response = await fetch('/api/coach/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: queryText,
          currentDay: currentDayNumber,
          currentExercise: currentExerciseName,
          currentSet: currentSetNumber
        })
      });

      if (!response.ok) {
        throw new Error('Coach API response failure');
      }

      const data = await response.json();
      const reply = data.reply || "Focus on controlling your tempo and keep your core braced.";

      const coachMessage: CoachMessage = {
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, coachMessage]);

      speakResponse(reply);
    } catch (err: any) {
      console.error('Coach API failure:', err);
      setCoachState('ERROR');
      setErrorType('gemini_error');
      setErrorMessage("I couldn't respond right now.");
      setStatusMessage('ERROR');
    }
  };

  const handleRetryLastQuery = () => {
    if (lastUserQuery) {
      handleUserUtterance(lastUserQuery);
    } else {
      startConversation();
    }
  };

  // Voice playback and automatic return to LISTENING
  const speakResponse = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCoachState('LISTENING');
      setStatusMessage('LISTENING...');
      restartListeningSafe();
      return;
    }

    setCoachState('SPEAKING');
    setStatusMessage('SPEAKING...');
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isComponentMounted.current) return;
      setCoachState('LISTENING');
      setStatusMessage('LISTENING...');
      restartListeningSafe();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (!isComponentMounted.current) return;
      setCoachState('LISTENING');
      setStatusMessage('LISTENING...');
      restartListeningSafe();
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    handleUserUtterance(typedInput.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0a0d14] border border-white/[0.1] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  FITBUDDY COACH
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  coachState === 'LISTENING' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : coachState === 'SPEAKING'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : coachState === 'PROCESSING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : coachState === 'PAUSED'
                    ? 'bg-white/[0.08] text-slate-300'
                    : 'bg-white/[0.04] text-slate-400'
                }`}>
                  {statusMessage}
                </span>
              </div>
              <h2 className="text-xs text-slate-400 mt-0.5 font-mono">
                Context: Day {currentDayNumber} · {currentExerciseName} {currentSetNumber ? `· Set ${currentSetNumber}` : ''}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                cleanupAudioAndVoice();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specific Fallback Notification Bar */}
        {errorMessage && (
          <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {errorType === 'gemini_error' ? (
              <button
                type="button"
                onClick={handleRetryLastQuery}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold font-mono text-[11px] transition cursor-pointer"
              >
                TRY AGAIN
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinueWithText}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono text-[11px] transition cursor-pointer"
              >
                CONTINUE WITH TEXT
              </button>
            )}
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isCoach = msg.role === 'model';
            return (
              <div key={idx} className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isCoach
                      ? 'bg-white/[0.04] border border-white/[0.08] text-slate-200'
                      : 'bg-emerald-500 text-slate-950 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mb-1">
                    <span>{isCoach ? 'FitBuddy Coach' : user.username}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Input */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] space-y-3">
          {/* Controls: [ START CONVERSATION ] [ PAUSE ] [ END COACH ] */}
          <div className="flex items-center gap-2">
            {coachState === 'IDLE' || coachState === 'ENDED' || coachState === 'ERROR' ? (
              <button
                type="button"
                onClick={startConversation}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>START CONVERSATION</span>
              </button>
            ) : coachState === 'PAUSED' ? (
              <button
                type="button"
                onClick={resumeCoach}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME COACH</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={pauseCoach}
                  className="flex-1 py-3 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/[0.08]"
                >
                  <Pause className="w-4 h-4" />
                  <span>PAUSE</span>
                </button>

                <button
                  type="button"
                  onClick={endCoach}
                  className="px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  <span>END COACH</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                cleanupAudioAndVoice();
                setMessages([
                  {
                    role: 'model',
                    content: "Session refreshed. Tell me what you need assistance with.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                setCoachState('IDLE');
                setStatusMessage("I'm ready. Tell me what you need.");
              }}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition border border-white/[0.08] cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {[
              "Is my back supposed to round on this?",
              "How long should I rest?",
              "Can I do this with dumbbells instead?",
              "Make this harder.",
              "Make this easier."
            ].map((query, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUserUtterance(query)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] shrink-0 font-medium transition cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>

          {/* TYPE MESSAGE Form */}
          <form onSubmit={handleTypedSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="TYPE MESSAGE: e.g. This exercise feels too heavy, can I modify it?"
              className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
