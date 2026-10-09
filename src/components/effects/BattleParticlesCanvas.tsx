import React, { useEffect, useRef } from 'react';

export interface BattleParticlesCanvasProps {
  triggerType: 'success' | 'victory' | 'attack' | null;
  onFinished?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'spark' | 'star' | 'runic' | 'circle';
  rotation: number;
  vRot: number;
  label?: string;
}

export const BattleParticlesCanvas: React.FC<BattleParticlesCanvasProps> = ({
  triggerType,
  onFinished,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!triggerType) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onFinished) onFinished();
      return;
    }

    const width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particles: Particle[] = [];
    const colors =
      triggerType === 'victory'
        ? ['#fde047', '#f59e0b', '#38bdf8', '#c084fc', '#34d399', '#f43f5e']
        : ['#fde047', '#f59e0b', '#38bdf8', '#67e8f9', '#ffffff'];

    const count = triggerType === 'victory' ? 90 : 45;
    const originX = width / 2;
    const originY = height / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = (Math.random() * 6 + 3) * (triggerType === 'victory' ? 1.4 : 1);
      const shapeRand = Math.random();

      particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (triggerType === 'victory' ? 2 : 0.5),
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.015,
        type: shapeRand > 0.6 ? 'star' : shapeRand > 0.3 ? 'runic' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        label: i === 0 && triggerType === 'success' ? 'CRITIQUE !' : undefined,
      });
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if (p.label) {
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 16px serif';
            ctx.shadowColor = '#d97706';
            ctx.shadowBlur = 10;
            ctx.fillText(p.label, -40, -10);
          } else if (p.type === 'star') {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size);
              ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2));
            }
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'runic') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onFinished) onFinished();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [triggerType, onFinished]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
