'use client';

import { type CSSProperties, type MouseEvent, type ReactNode, useMemo, useState } from 'react';

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  overlayContent?: ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
}

export function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.06,
  rotateAmplitude = 12,
  overlayContent = null,
  displayOverlayContent = false,
  className = '',
}: TiltedCardProps) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) scale(1)');
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, show: false });

  const containerStyle = useMemo<CSSProperties>(
    () => ({ height: containerHeight, width: containerWidth }),
    [containerHeight, containerWidth]
  );

  const frameStyle = useMemo<CSSProperties>(
    () => ({ width: imageWidth, height: imageHeight, transform }),
    [imageHeight, imageWidth, transform]
  );

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    setTransform(`rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scaleOnHover})`);
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  };

  const onLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  return (
    <figure
      className={`relative flex h-full w-full items-center justify-center [perspective:900px] ${className}`}
      style={containerStyle}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="relative rounded-2xl transition-transform duration-300 [transform-style:preserve-3d]"
        style={frameStyle}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="absolute inset-0 h-full w-full rounded-2xl object-cover"
        />
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 z-20 [transform:translateZ(25px)]">{overlayContent}</div>
        )}
      </div>

      {captionText && (
        <figcaption
          className={`pointer-events-none absolute hidden rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-800 shadow sm:block ${
            tooltip.show ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(10px, -22px)' }}
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
