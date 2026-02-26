'use client';

import { type CSSProperties, type MouseEvent, type ReactNode, useRef } from 'react';
import styles from './SpotlightCard.module.css';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.22)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`${styles.cardSpotlight} ${className}`}
      style={{ '--spotlight-color': spotlightColor } as CSSProperties}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
