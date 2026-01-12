import React, { useState, useEffect, useRef } from 'react';
import GlassCard from './GlassCard';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!";

const TypingTest = () => {
    const [text, setText] = useState(SAMPLE_TEXT);
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 60s timer option logic if needed, or open-ended

    const inputRef = useRef(null);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // Calculate WPM and finish status
    useEffect(() => {
        if (startTime && !isFinished) {
            const interval = setInterval(() => {
                const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
                if (timeElapsed > 0) {
                    const wordsTyped = input.length / 5;
                    const currentWpm = Math.round(wordsTyped / timeElapsed);
                    setWpm(currentWpm);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [startTime, input, isFinished]);

    const handleChange = (e) => {
        if (isFinished) return;

        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());

        setInput(val);

        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === text[i]) correctChars++;
        }
        const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
        setAccuracy(acc);

        if (val.length >= text.length) {
            setIsFinished(true);
            // Final WPM calc
            const timeElapsed = (Date.now() - startTime) / 1000 / 60;
            const wordsTyped = val.length / 5;
            setWpm(Math.round(wordsTyped / timeElapsed));
        }
    };

    const resetTest = () => {
        setInput('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        if (inputRef.current) inputRef.current.focus();
    };

    // Render text with highlights
    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = 'rgba(255, 255, 255, 0.5)'; // default untyped
            let bg = 'transparent';

            if (index < input.length) {
                if (input[index] === char) {
                    color = '#fff'; // correct
                } else {
                    color = '#ff6b6b'; // incorrect
                    bg = 'rgba(255, 107, 107, 0.2)';
                }
            }

            // Cursor logic
            const isCursor = index === input.length;

            return (
                <span key={index} style={{
                    color,
                    backgroundColor: bg,
                    borderLeft: isCursor ? '2px solid #5fc3e4' : 'none',
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                    transition: 'all 0.1s'
                }}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div style={{ maxWidth: '800px', width: '100%' }}>
            <GlassCard className="typing-container">
                <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem', fontWeight: '200' }}>
                    Type<span style={{ fontWeight: 'bold' }}>Fast</span>
                </h1>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginBottom: '2rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1rem',
                    borderRadius: '15px'
                }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>WPM</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{wpm}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Accuracy</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{accuracy}%</div>
                    </div>
                </div>

                <div
                    onClick={() => inputRef.current.focus()}
                    style={{
                        marginBottom: '2rem',
                        lineHeight: '2rem',
                        cursor: 'text',
                        minHeight: '100px'
                    }}
                >
                    {renderText()}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleChange}
                    style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
                />

                {isFinished && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>🎉 Test Completed!</h2>
                        <button
                            onClick={resetTest}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.4)',
                                color: 'white',
                                padding: '10px 30px',
                                borderRadius: '30px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default TypingTest;
