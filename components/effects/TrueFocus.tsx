'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 0,
  borderColor = '#22c55e',
  glowColor = 'rgba(34, 197, 94, 0.55)',
  animationDuration = 0.45,
  pauseBetweenAnimations = 1,
  className = '',
}: TrueFocusProps) {
  const words = useMemo(() => sentence.split(separator), [sentence, separator]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (manualMode) return;
    const delay = (animationDuration + pauseBetweenAnimations) * 1000;
    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, delay);
    return () => window.clearInterval(id);
  }, [animationDuration, manualMode, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    const parent = containerRef.current;
    const activeWord = wordRefs.current[currentIndex];
    if (!parent || !activeWord) return;
    const parentRect = parent.getBoundingClientRect();
    const activeRect = activeWord.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  return (
    <div ref={containerRef} className={`relative flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {words.map((word, idx) => {
        const active = idx === currentIndex;
        return (
          <span
            key={`${word}-${idx}`}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            onMouseEnter={() => manualMode && setCurrentIndex(idx)}
            className="relative cursor-default text-3xl font-black tracking-tight sm:text-5xl"
            style={{
              filter: blurAmount > 0 ? (active ? 'blur(0px)' : `blur(${blurAmount}px)`) : 'none',
              opacity: active ? 1 : 0.72,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
            }}
          >
            {word}
          </span>
        );
      })}

      <div
        className="pointer-events-none absolute box-border transition-all"
        style={{
          left: focusRect.x,
          top: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          transitionDuration: `${animationDuration}s`,
        }}
      >
        <span className="focus-corner focus-corner-tl" style={{ borderColor, filter: `drop-shadow(0 0 4px ${glowColor})` }} />
        <span className="focus-corner focus-corner-tr" style={{ borderColor, filter: `drop-shadow(0 0 4px ${glowColor})` }} />
        <span className="focus-corner focus-corner-bl" style={{ borderColor, filter: `drop-shadow(0 0 4px ${glowColor})` }} />
        <span className="focus-corner focus-corner-br" style={{ borderColor, filter: `drop-shadow(0 0 4px ${glowColor})` }} />
      </div>
    </div>
  );
}
