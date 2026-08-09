"use client";

import React, { PointerEvent, useEffect, useRef, useState } from "react";
import { isHoverPointer } from "@/lib/utils";

interface AwardBadgeProps {
  topText: string;
  text: string;
  link?: string;
}

const identityMatrix =
  "1, 0, 0, 0, " + "0, 1, 0, 0, " + "0, 0, 1, 0, " + "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

type Timer = ReturnType<typeof setTimeout>;

export const AwardBadge = ({ topText, text, link }: AwardBadgeProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0);
  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState<boolean>(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] =
    useState<boolean>(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const enterTimeout = useRef<Timer | null>(null);
  const leaveTimeout1 = useRef<Timer | null>(null);
  const leaveTimeout2 = useRef<Timer | null>(null);
  const leaveTimeout3 = useRef<Timer | null>(null);

  const getDimensions = () => {
    const left = ref?.current?.getBoundingClientRect()?.left || 0;
    const right = ref?.current?.getBoundingClientRect()?.right || 0;
    const top = ref?.current?.getBoundingClientRect()?.top || 0;
    const bottom = ref?.current?.getBoundingClientRect()?.bottom || 0;

    return { left, right, top, bottom };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    const scale = [
      maxScale -
        ((maxScale - minScale) * Math.abs(xCenter - clientX)) /
          (xCenter - left),
      maxScale -
        ((maxScale - minScale) * Math.abs(yCenter - clientY)) / (yCenter - top),
      maxScale -
        ((maxScale - minScale) *
          (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          (xCenter - left + yCenter - top),
    ];

    const rotate = {
      x1: 0.25 * ((yCenter - clientY) / yCenter - (xCenter - clientX) / xCenter),
      x2:
        maxRotate -
        ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left),
      x3: 0,
      y0: 0,
      y2: maxRotate - ((maxRotate - minRotate) * (top - clientY)) / (top - bottom),
      y3: 0,
      z0: -(
        maxRotate -
        ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left)
      ),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom),
      z3: 0,
    };
    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (
    _matrix: string,
    clientY: number,
    entering?: boolean
  ) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = entering ? 0.7 : 4;
    const multiplier = entering ? -1 : 1;

    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return (-parseFloat(item) * multiplier) / weakening;
        } else if (index === 0 || index === 5 || index === 10) {
          return "1";
        } else if (index === 6) {
          return (
            (multiplier *
              (maxRotate -
                ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom))) /
            weakening
          );
        } else if (index === 9) {
          return (
            (maxRotate -
              ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom)) /
            weakening
          );
        }
        return item;
      })
      .join(", ");
  };

  const onPointerEnter = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!isHoverPointer(e)) return;
    if (leaveTimeout1.current) {
      clearTimeout(leaveTimeout1.current);
    }
    if (leaveTimeout2.current) {
      clearTimeout(leaveTimeout2.current);
    }
    if (leaveTimeout3.current) {
      clearTimeout(leaveTimeout3.current);
    }
    setDisableOverlayAnimation(true);

    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(
      () => setDisableInOutOverlayAnimation(true),
      350
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        );
      });
    });

    const matrix = getMatrix(e.clientX, e.clientY);
    const oppositeMatrix = getOppositeMatrix(matrix, e.clientY, true);

    setMatrix(oppositeMatrix);
    setIsTimeoutFinished(false);
    setTimeout(() => {
      setIsTimeoutFinished(true);
    }, 200);
  };

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!isHoverPointer(e)) return;
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setTimeout(
      () =>
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        ),
      150
    );

    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY));
    }
  };

  const onPointerLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!isHoverPointer(e)) return;
    const oppositeMatrix = getOppositeMatrix(matrix, e.clientY);

    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current);
    }

    setCurrentMatrix(oppositeMatrix);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
          150
        );
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) {
      setMatrix(currentMatrix);
    }
  }, [currentMatrix, isTimeoutFinished]);

  const overlayAnimations = [...Array(10).keys()]
    .map(
      (e) =>
        `
    @keyframes overlayAnimation${e + 1} {
      0% {
        transform: rotate(${e * 10}deg);
      }
      50% {
        transform: rotate(${(e + 1) * 10}deg);
      }
      100% {
        transform: rotate(${e * 10}deg);
      }
    }
    `
    )
    .join(" ");

  return (
    <a
      ref={ref}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      /* On phones this rides in a row beside the theme switch, so it flexes to
         fill whatever is left rather than forcing a fixed 240px that would
         push the switch off a 320px screen. A small start margin nudges it a
         touch right of the switch on mobile; both reset from sm up, where it
         locks to 320px and the footer has the room. */
      className="ms-2 block h-auto w-full max-w-[220px] flex-1 sm:ms-0 sm:w-[320px] sm:max-w-none sm:flex-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 54"
          className="w-full h-auto"
        >
          <defs>
            <filter id="blur1">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="badgeMask">
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
          </defs>
          {/* --badge-* rather than literals: the tile has to invert with the
              page, or it stays a pale green chip glued to a dark footer */}
          <rect width="260" height="54" rx="10" fill="var(--badge-bg)" />
          <rect
            x="4"
            y="4"
            width="252"
            height="46"
            rx="8"
            fill="transparent"
            stroke="var(--badge-edge)"
            strokeWidth="1"
          />
          <text
            fontFamily="var(--font-karla), system-ui, sans-serif"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="var(--badge-label)"
            x="52"
            y="20"
          >
            {topText.toUpperCase()}
          </text>
          <text
            fontFamily="var(--font-fraunces), Georgia, serif"
            fontSize="17"
            fontWeight="600"
            fill="var(--badge-title)"
            x="52"
            y="40"
          >
            {text}
          </text>
          {/* Ko-fi style cup with heart, drawn to match the site's line icons */}
          <g
            transform="translate(10, 10) scale(1.45)"
            fill="none"
            stroke="var(--badge-label)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z" />
            <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
            <path d="M10 15.3s-2.8-1.8-2.8-3.6c0-.9.7-1.6 1.5-1.6.6 0 1.1.4 1.3.9.2-.5.7-.9 1.3-.9.8 0 1.5.7 1.5 1.6 0 1.8-2.8 3.6-2.8 3.6Z" />
          </g>
          {/* blend mode lives in CSS — `overlay` vanishes against a dark
              tile, so dark mode swaps it for `screen`. See globals.css. */}
          <g className="award-badge__sheen" mask="url(#badgeMask)">
            {[
              "hsl(358, 100%, 62%)",
              "hsl(30, 100%, 50%)",
              "hsl(60, 100%, 50%)",
              "hsl(96, 100%, 50%)",
              "hsl(233, 85%, 47%)",
              "hsl(271, 85%, 47%)",
              "hsl(300, 20%, 35%)",
              "transparent",
              "transparent",
              "white",
            ].map((fill, i) => (
              <g
                key={i}
                style={{
                  transform: `rotate(${firstOverlayPosition + i * 10}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation
                    ? "transform 200ms ease-out"
                    : "none",
                  animation: disableOverlayAnimation
                    ? "none"
                    : `overlayAnimation${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={fill}
                  filter="url(#blur1)"
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </a>
  );
};
