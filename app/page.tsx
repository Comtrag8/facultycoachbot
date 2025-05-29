'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();
      setResponse(data.reply);
      speakText(data.reply);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎤 CoachBot: Teacher Practice Simulator</h1>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? '🛑 Stop Listening' : '🎙️ Start Talking'}
      </button>
      {response && (
        <div style={{ marginTop: '1rem' }}>
          <strong>CoachBot:</strong>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}
