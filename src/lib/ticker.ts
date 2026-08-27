"use client";

/*
 * requestAnimationFrame with a timer standing behind it.
 *
 * Measured on an iPad in Safari, page left untouched for 183 seconds:
 *
 *   rAF ticks           7053   (~38 fps average, 60 fps while scrolling)
 *   longest rAF gap     2278 ms
 *   timer ticks (100ms) 1771 / 1838 expected  (96%)
 *
 * WebKit stops servicing the rendering update on a page it decides is
 * visually idle, and rAF is dispatched from that update — so the callbacks
 * simply stop arriving, for seconds at a time. Timers are not part of the
 * rendering update and keep firing throughout. Any user interaction, scroll
 * included, wakes the update again, which is the whole reason the animations
 * on this site only ever moved while the page was being scrolled.
 *
 * So rAF drives whenever it is actually being serviced, and if it goes quiet
 * for longer than STALL_MS the interval takes over until it comes back. The
 * `last` guard keeps the two from double-ticking when rAF resumes.
 *
 * Everything downstream is time-based rather than frame-based, so a coarser
 * tick from the fallback slows nothing down — it just lands in bigger steps.
 */

type Tick = (nowMs: number) => void;

const STALL_MS = 120;

const subscribers = new Set<Tick>();
let rafId = 0;
let timerId = 0;
let last = 0;
let running = false;

function fire(now: number) {
  last = now;
  for (const cb of subscribers) cb(now);
}

function frame(now: number) {
  fire(now);
  rafId = requestAnimationFrame(frame);
}

function start() {
  if (running) return;
  running = true;
  last = performance.now();
  rafId = requestAnimationFrame(frame);
  timerId = window.setInterval(() => {
    const now = performance.now();
    if (now - last >= STALL_MS) fire(now);
  }, STALL_MS / 2);
}

function stop() {
  running = false;
  cancelAnimationFrame(rafId);
  window.clearInterval(timerId);
}

/* A backgrounded tab should go quiet properly — the point is to survive
   WebKit's idle throttling, not to defeat the battery saving that matters. */
function onVisibility() {
  if (document.hidden) stop();
  else if (subscribers.size > 0) start();
}

/** Subscribe to the shared loop. Returns an unsubscribe function. */
export function onTick(cb: Tick) {
  if (subscribers.size === 0) {
    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) start();
  }
  subscribers.add(cb);

  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0) {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    }
  };
}
