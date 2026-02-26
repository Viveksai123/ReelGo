'use client';

import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type StarBorderProps<T extends ElementType> = {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function StarBorder<T extends ElementType = 'button'>({
  as,
  className = '',
  color = '#e2e8f0',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) {
  const Component = (as || 'button') as ElementType;

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[16px] ${className}`}
      style={{ padding: `${thickness}px`, ...(style as CSSProperties) }}
      {...rest}
    >
      <div
        className="pointer-events-none absolute bottom-[-10px] right-[-240%] z-0 h-[55%] w-[300%] rounded-full opacity-75 star-movement-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="pointer-events-none absolute left-[-240%] top-[-10px] z-0 h-[55%] w-[300%] rounded-full opacity-75 star-movement-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      />
      <span className="relative z-10 block rounded-[15px] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
        {children}
      </span>
    </Component>
  );
}
