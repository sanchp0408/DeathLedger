'use client';

import { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  lang?: 'en' | 'hi';
}

export default function TextToSpeech({ text, lang = 'en' }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Pre-load voices
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (speechSynthesis?.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis?.onvoiceschanged]);

  const handlePlay = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a voice matching the language
      const voices = speechSynthesis.getVoices();
      let preferredVoice;
      
      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
        preferredVoice = voices.find(v => v.lang.includes('hi-IN'));
      } else {
        utterance.lang = 'en-IN';
        preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB'));
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (!speechSynthesis) return null;

  return (
    <button
      onClick={handlePlay}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isPlaying ? 'var(--color-primary-light)' : 'transparent',
        color: 'var(--color-primary)',
        border: '1.5px solid var(--color-primary)',
        borderRadius: 'var(--radius)',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '13px',
        fontWeight: 600,
        gap: '6px',
        boxShadow: 'var(--shadow-card)',
      }}
      title={isPlaying ? (lang === 'hi' ? 'पढ़ना बंद करें' : 'Stop reading') : (lang === 'hi' ? 'जोर से पढ़ें' : 'Read out loud')}
    >
      {isPlaying ? (
        <>
          <Square size={16} fill="currentColor" />
          {lang === 'hi' ? 'रोकें' : 'Stop Reading'}
        </>
      ) : (
        <>
          <Volume2 size={16} />
          {lang === 'hi' ? 'पढ़ें' : 'Read Aloud'}
        </>
      )}
    </button>
  );
}
