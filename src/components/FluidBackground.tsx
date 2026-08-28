"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from "@react-three/fiber";
import { shaderMaterial, PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { onTick } from "@/lib/ticker";
import * as THREE from "three";

// Living-fluid blob shader, tuned to the matcha palette.
const FluidMaterial = shaderMaterial(
  {
    uTime: 0,
    // attractor, already converted to the mesh's own local space on the CPU
    uMouse: new THREE.Vector2(999, 999),
    uColorA: new THREE.Color("#c3d3ab"),
    uColorB: new THREE.Color("#8ba372"),
  },
  // Vertex shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;

    // Simplex 3D noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
        vNormal = normalize(normalMatrix * normal);

        float displacement = snoise(position * 1.8 + uTime * 0.1) * 0.28;

        // uMouse already lives in this mesh's local space. The bulge is
        // directional rather than a flat radial falloff on position.xy:
        // vertices lean out along the direction of the cursor, weighted by
        // how squarely they face it. A radial falloff is uneven by nature —
        // with the cursor near the middle almost every vertex is "close" and
        // the whole blob inflates, while off to one side only a sliver of
        // the silhouette responds at all.
        float reach = 1.0 - smoothstep(1.1, 4.0, length(uMouse));
        vec3 toCursor = normalize(vec3(uMouse, 0.85));
        float facing = max(dot(normalize(position), toCursor), 0.0);
        displacement += pow(facing, 3.0) * 0.30 * reach;

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec3 vNormal;
    void main() {
        float fresnel = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 color = mix(uColorA, uColorB, vNormal.y * 0.5 + 0.5);
        gl_FragColor = vec4(color + fresnel * 0.12, 1.0);
    }
  `
);

type FluidMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uMouse: THREE.Vector2;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
};

/* Registered as a JSX element so the material can be reached through a ref
   and mutated per-frame — hook return values are meant to stay immutable. */
extend({ FluidMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fluidMaterial: ThreeElement<typeof FluidMaterial>;
  }
}

/* Palette lives in CSS custom properties so the blob follows the theme. */
function readBlobColors() {
  if (typeof window === "undefined") return null;
  const s = getComputedStyle(document.documentElement);
  const a = s.getPropertyValue("--blob-a").trim();
  const b = s.getPropertyValue("--blob-b").trim();
  return a && b ? { a, b } : null;
}

/* Piecewise-linear interpolation over scroll waypoints */
function interp(t: number, stops: number[], values: number[]) {
  if (t <= stops[0]) return values[0];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t <= stops[i + 1]) {
      const f = (t - stops[i]) / (stops[i + 1] - stops[i]);
      return values[i] + f * (values[i + 1] - values[i]);
    }
  }
  return values[values.length - 1];
}

// Long plateaus, only two slow relocations across the whole page:
// hero (middle-right) → left for the middle sections → soft right at the end.
const STOPS = [0, 0.14, 0.3, 0.6, 0.78, 1];
// pulled in from ±0.24 so the bigger blob still clears both edges
const X_FRACTIONS = [0.12, 0.12, -0.2, -0.2, 0.15, 0.15];
const SCALE_STOPS = [0, 0.35, 0.7, 1];
const SCALES = [1.04, 0.99, 0.99, 1.04];

/* Where the attractor sits, in the mesh's own local space. In "loader" mode
   nobody is holding a mouse, so it walks a circle around the blob instead. */
function FluidScene({
  scrollProgress,
  variant = "page",
}: {
  scrollProgress?: MotionValue<number>;
  variant?: "page" | "loader";
}) {
  const isLoader = variant === "loader";
  // held far outside the blob until the pointer actually moves
  const pointerNdc = useRef(new THREE.Vector2(99, 99));
  const localTarget = useRef(new THREE.Vector2(99, 99));
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const material = useRef<FluidMaterialImpl>(null);

  useEffect(() => {
    const paint = () => {
      const next = readBlobColors();
      if (!next || !material.current) return;
      material.current.uColorA.set(next.a);
      material.current.uColorB.set(next.b);
    };
    paint();

    // repaint when the theme attribute flips or the OS preference changes
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", paint);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", paint);
    };
  }, []);

  useEffect(() => {
    if (isLoader) return;
    const handleMouseMove = (event: MouseEvent) => {
      pointerNdc.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerNdc.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoader]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mat = material.current;
    if (mat) mat.uTime = t;

    if (!mesh.current || !mat) return;

    const p = isLoader ? 0 : scrollProgress?.get() ?? 0;
    const targetX = isLoader ? 0 : interp(p, STOPS, X_FRACTIONS) * viewport.width;
    const targetY = isLoader ? 0 : -p * 0.04 * viewport.height;
    const targetScale = isLoader ? 1 : interp(p, SCALE_STOPS, SCALES);

    // Frame-rate-independent critically-damped glide: the blob drifts
    // toward its resting spot without ever jittering with the scroll.
    const pos = mesh.current.position;
    pos.x = THREE.MathUtils.damp(pos.x, targetX, 1.1, delta);
    pos.y = THREE.MathUtils.damp(pos.y, targetY, 1.1, delta);
    const s = THREE.MathUtils.damp(mesh.current.scale.x, targetScale, 1.1, delta);
    mesh.current.scale.setScalar(s);

    if (isLoader) {
      // attractor orbits the blob, so the pull arrives from every side
      const r = 1.55;
      localTarget.current.set(Math.cos(t * 1.5) * r, Math.sin(t * 1.5) * r);
    } else {
      // NDC -> world -> the mesh's local space. The old code multiplied NDC
      // by a flat 2.0, which is only ever right when the viewport happens to
      // be 4 world-units wide — hence the lopsided reaction.
      const worldX = (pointerNdc.current.x * viewport.width) / 2;
      const worldY = (pointerNdc.current.y * viewport.height) / 2;
      localTarget.current.set((worldX - pos.x) / s, (worldY - pos.y) / s);

      // The blob slides left and right with scroll, so the raw distance to
      // the cursor swings wildly — near one edge of the screen it would be
      // right on top of the mesh, near the other it would be miles away.
      // Capping the radius keeps the response even wherever the blob sits.
      const MAX_REACH = 3.4;
      const len = localTarget.current.length();
      if (len > MAX_REACH) {
        localTarget.current.multiplyScalar(MAX_REACH / len);
      }
    }

    // Damp the attractor so the bulge trails the cursor instead of snapping
    // to it. 1.7 rather than 3.2: the faster value was what made quick
    // pointer moves read as a sudden lurch.
    const follow = isLoader ? 3.2 : 1.7;
    mat.uMouse.x = THREE.MathUtils.damp(
      mat.uMouse.x,
      localTarget.current.x,
      follow,
      delta
    );
    mat.uMouse.y = THREE.MathUtils.damp(
      mat.uMouse.y,
      localTarget.current.y,
      follow,
      delta
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[isLoader ? 0 : X_FRACTIONS[0] * viewport.width, 0, 0]}
    >
      {/* detail 32 ≈ 20k triangles — visually identical to 64 for a soft
          displaced blob, ~7x cheaper on the vertex-noise shader */}
      <icosahedronGeometry args={[1.8, 32]} />
      <fluidMaterial ref={material} />
    </mesh>
  );
}

/*
 * The canvas is `frameloop="never"` and stepped from here. r3f's own loop is
 * requestAnimationFrame, and WebKit stops servicing rAF on a page it decides
 * is visually idle — which is why the blob only ever moved on an iPad while
 * the page was being scrolled. The shared ticker keeps rAF as the driver
 * whenever it is actually running and falls back to a timer when it isn't,
 * so nothing about the frame rate changes on a browser that behaves.
 */
function TickDriver() {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    /* Seconds, counted from the first tick — not `performance.now()`. Under
       frameloop="never" r3f writes this value straight into clock.elapsedTime
       and takes delta off the difference, so milliseconds run the shader a
       thousand times too fast, and a raw clock gives the very first frame a
       delta of however long the tab had been open. */
    let origin: number | null = null;

    return onTick((now) => {
      if (origin === null) origin = now;
      advance((now - origin) / 1000);
    });
  }, [advance]);

  return null;
}

export default function FluidBackground({
  scrollProgress,
  variant = "page",
}: {
  scrollProgress?: MotionValue<number>;
  variant?: "page" | "loader";
}) {
  // Start at full resolution; PerformanceMonitor steps the pixel ratio
  // down only on devices that can't hold the frame rate, and back up
  // when there is headroom. High-res where possible, smooth everywhere.
  const [dpr, setDpr] = useState(2);

  return (
    <div
      className="absolute inset-0"
      style={{ opacity: variant === "loader" ? 1 : "var(--blob-opacity, 0.75)" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, variant === "loader" ? 5.4 : 4], fov: 75 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="never"
      >
        <TickDriver />
        <PerformanceMonitor
          onChange={({ factor }) =>
            setDpr(Math.round((1 + factor) * 4) / 4)
          }
        >
          <Suspense fallback={null}>
            <FluidScene scrollProgress={scrollProgress} variant={variant} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
