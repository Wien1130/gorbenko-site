"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const PHOTOS = [
  {
    src: "/about/andrii-outdoor-1.webp",
    alt: "Andrii Gorbenko",
    idleRotate: -2.5,
    hoverRotate: -6,
    floatY: [-4, 4, -4] as number[],
  },
  {
    src: "/about/andrii-outdoor-2.webp",
    alt: "Andrii Gorbenko",
    idleRotate: 3,
    hoverRotate: 7,
    floatY: [5, -3, 5] as number[],
  },
];

export default function AboutPhotoDuo() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 lg:max-w-none">
      {PHOTOS.map((photo, i) => {
        const isHovered = hovered === i;
        const otherHovered = hovered !== null && hovered !== i;
        const offsetClass = i === 1 ? "mt-8 sm:mt-12" : "";

        return (
          <motion.div
            key={photo.src}
            className={`relative aspect-[3/5] cursor-pointer ${offsetClass}`}
            style={{ perspective: 900 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            onTapStart={() => setHovered(i)}
            onTap={() => setHovered(null)}
            animate={
              reduce
                ? { rotate: 0, scale: 1, y: 0 }
                : isHovered
                  ? {
                      y: -14,
                      rotate: photo.hoverRotate,
                      scale: 1.07,
                      zIndex: 2,
                    }
                  : otherHovered
                    ? {
                        y: 6,
                        rotate: photo.idleRotate * -0.6,
                        scale: 0.94,
                        zIndex: 1,
                      }
                    : {
                        y: photo.floatY,
                        rotate: photo.idleRotate,
                        scale: 1,
                        zIndex: 1,
                      }
            }
            transition={
              reduce
                ? { duration: 0 }
                : isHovered || otherHovered
                  ? { type: "spring", stiffness: 380, damping: 16, mass: 0.7 }
                  : {
                      y: {
                        duration: 3.2 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotate: { duration: 0.45 },
                      scale: { duration: 0.35 },
                    }
            }
          >
            <motion.div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg shadow-black/30 sm:rounded-3xl"
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: isHovered
                        ? "0 20px 50px -12px rgba(0, 212, 170, 0.35)"
                        : "0 10px 30px -12px rgba(0, 0, 0, 0.4)",
                    }
              }
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover object-top"
                priority
                unoptimized
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent-dim),transparent_55%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered && !reduce ? 0.85 : 0 }}
                transition={{ duration: 0.25 }}
              />
              {isHovered && !reduce && (
                <motion.span
                  className="pointer-events-none absolute -right-1 -top-1 text-2xl text-[var(--accent)] sm:text-3xl"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: [0, -12, 10, 0] }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  aria-hidden
                >
                  ✦
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
