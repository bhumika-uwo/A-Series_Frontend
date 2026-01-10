import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mic, MicOff, Camera, Video, VideoOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import toast from 'react-hot-toast';

const LiveAI = ({ onClose, language }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState(null);
    const [isVideoActive, setIsVideoActive] = useState(true);
    const [duration, setDuration] = useState(0);

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const [facingMode, setFacingMode] = useState('user');

    // Initialize Camera
    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                // Re-apply video mute state
                stream.getVideoTracks().forEach(t => t.enabled = isVideoActive);
            } catch (err) {
                console.error("Camera Error:", err);
                setError("Could not access camera. Please allow permissions.");
            }
        };

        if (isVideoActive) {
            startCamera();
        } else {
            // If video is toggled off (paused), we might want to stop the stream or just mute tracks.
            // But for switching camera, we need to restart stream. 
            // Logic: If active, start.
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]); // Re-run when facingMode changes


    // Call Timer
    useEffect(() => {
        const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Capture Frame
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.7);
    }, []);

    // Text to Speech
    const speakResponse = (text) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Simple language mapper
        const langMap = {
            'Hindi': 'hi-IN',
            'English': 'en-US',
            'Spanish': 'es-ES',
            'French': 'fr-FR',
            'German': 'de-DE',
            'Japanese': 'ja-JP'
        };
        utterance.lang = langMap[language] || 'en-US';

        // Try to select a "natural" voice if available
        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
            const preferredVoice = voices.find(v => v.lang === utterance.lang && v.name.includes('Google')) ||
                voices.find(v => v.lang === utterance.lang);
            if (preferredVoice) utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            // Auto-restart listening for continuous conversation (Gemini Style)
            // We verify we are still mounted and in a "call" (isVideoActive or generally open)
            // Note: checks if user manually closed/muted via a ref or state could be complex in closures, 
            // but for "Live" mode, defaulting to Resume is the expected behavior.

            if (recognitionRef.current) {
                try {
                    // Small delay to avoid picking up the very end of the AI's own voice
                    setTimeout(() => {
                        if (recognitionRef.current) {
                            recognitionRef.current.start();
                            setIsListening(true);
                        }
                    }, 100);
                } catch (e) {
                    // Ignore if already started
                    console.log("Auto-resume mic info:", e);
                }
            }
        };

        synthRef.current.speak(utterance);
    };

    // Process Query
    const processQuery = async (text) => {
        if (!text.trim()) return;

        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);

        let attachment = null;
        if (isVideoActive) {
            const imageBase64 = captureFrame();
            attachment = imageBase64 ? { type: 'image', url: imageBase64 } : null;
        }

        try {
            setAiResponse("Thinking...");
            // Pass current history
            const response = await generateChatResponse(
                history,
                text,
                `You are in a Video Call with the user. See what they see. Respond naturally in the user's language (${language}). Keep answers concise and conversational.`,
                attachment,
                language
            );

            setAiResponse(response);
            speakResponse(response);

            // Update history with User and Model turns
            setHistory(prev => [
                ...prev,
                { role: 'user', content: text, attachment: attachment }, // Include attachment context if needed
                { role: 'model', content: response }
            ]);

        } catch (err) {
            console.error(err);
            setAiResponse("Connection error.");
        }
    };

    // Speech Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setError("Voice not supported.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            const text = lastResult[0].transcript;
            setTranscript(text);

            if (lastResult.isFinal) {
                processQuery(text);
            }
        };

        return () => recognition.stop();
    }, [captureFrame]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            if (synthRef.current.speaking) synthRef.current.cancel();

            setTranscript("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Sync Video State
    useEffect(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getVideoTracks().forEach(t => t.enabled = isVideoActive);
        }
    }, [isVideoActive]);

    const toggleVideo = () => setIsVideoActive(prev => !prev);

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col text-white font-sans">
            {/* Fullscreen Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`flex-1 w-full h-full object-cover transition-opacity duration-500 ${isVideoActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Placeholder when video is off */}
            {!isVideoActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 animate-pulse flex items-center justify-center">
                        <Mic className="w-8 h-8 text-primary/50" />
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* AI Response / Subtitles - Positioned above controls, centered, subtle */}
            <div className="absolute bottom-32 left-0 right-0 px-6 flex flex-col items-center pointer-events-none">
                <div className="w-full max-w-xl text-center space-y-4">
                    {/* User Transcript */}
                    {transcript && (
                        <p className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                            "{transcript}"
                        </p>
                    )}

                    {/* AI Response */}
                    {aiResponse && !isListening && (
                        <p className="text-lg md:text-xl text-blue-200/90 font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {aiResponse}
                        </p>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm bg-black/50 px-3 py-1 rounded-full">{error}</p>
                    )}
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center gap-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">

                    {/* Switch Camera */}
                    <button
                        onClick={switchCamera}
                        className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        title="Switch Camera"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    {/* Video Toggle */}
                    <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-all ${isVideoActive ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-red-400 bg-red-500/10'}`}
                        title={isVideoActive ? "Turn Off Video" : "Turn On Video"}
                    >
                        {isVideoActive ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </button>

                    {/* Mic / Listening State - The Centerpiece */}
                    <button
                        onClick={toggleListening}
                        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isListening
                            ? 'bg-white text-black scale-110 shadow-blue-500/50'
                            : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                            }`}
                        title={isListening ? "Stop Listening" : "Start Listening"}
                    >
                        {isListening ? (
                            <div className="space-x-1 flex items-center h-4">
                                <div className="w-1 h-3 bg-black animate-[bounce_1s_infinite_0ms]" />
                                <div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_200ms]" />
                                <div className="w-1 h-3 bg-black animate-[bounce_1s_infinite_400ms]" />
                            </div>
                        ) : (
                            <Mic className="w-7 h-7" />
                        )}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-zinc-800 text-red-500 hover:bg-zinc-700 transition-all ml-2"
                        title="End Call"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAI;
