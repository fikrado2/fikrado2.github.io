import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/* ===========================================================
   Global Window-Level Mouse Coordinator
   Ensures Three.js always receives real mouse/touch coordinates
   regardless of DOM elements above the fixed background canvas.
   =========================================================== */
export const globalMouse = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  speed: 0,
  active: false,
};

if (typeof window !== "undefined") {
  let lastX = 0,
    lastY = 0,
    lastTime = performance.now();

  window.addEventListener(
    "pointermove",
    (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1; // -1 to 1
      globalMouse.targetX = nx;
      globalMouse.targetY = ny;
      globalMouse.active = true;

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      globalMouse.speed = Math.min(dist / dt, 6);
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    globalMouse.targetX = 0;
    globalMouse.targetY = 0;
    globalMouse.active = false;
  });
}

/* ===========================================================
   Shared mouse parallax hook — drives camera smoothly
   =========================================================== */
function useMouseParallax(intensity = 1) {
  const { camera } = useThree();

  useFrame(() => {
    globalMouse.x += (globalMouse.targetX - globalMouse.x) * 0.055;
    globalMouse.y += (globalMouse.targetY - globalMouse.y) * 0.055;
    camera.position.x = globalMouse.x * 2.8 * intensity;
    camera.position.y = globalMouse.y * 1.8 * intensity;
    camera.lookAt(0, 0, 0);
  });
}

/* Helper: a group that tilts and rotates toward the mouse */
function MouseGroup({ children, intensity = 0.6, ...props }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = globalMouse.x * intensity + state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = -globalMouse.y * intensity * 0.6;
    }
  });

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}

/* ===========================================================
   HOME (1/8) — Cosmic Leo Zodiac & Celestial Orbit Swarm
   =========================================================== */
const LEO_STARS = [
  [0.0, 0.5, 0],
  [0.35, 0.65, 0],
  [0.55, 0.55, 0],
  [0.7, 0.35, 0],
  [0.9, 0.25, 0],
  [0.2, 0.8, 0],
  [0.1, 0.9, 0],
  [0.4, 0.85, 0],
  [0.5, 0.75, 0],
];
const LEO_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [5, 7],
  [7, 8],
  [8, 2],
];

function LeoConstellation() {
  const group = useRef();
  const starRefs = useRef([]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
      group.current.rotation.x = -globalMouse.y * 0.35;
      group.current.rotation.y = globalMouse.x * 0.45;
    }
    starRefs.current.forEach((ref, i) => {
      if (ref) {
        const pulse = Math.sin(state.clock.elapsedTime * 1.6 + i * 0.7) * 0.35;
        ref.scale.setScalar(1 + pulse);
      }
    });
  });

  const scaled = useMemo(
    () => LEO_STARS.map(([x, y, z]) => [x * 2.7 - 1.35, y * 2.3 - 0.85, z]),
    []
  );

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {LEO_EDGES.map(([a, b], i) => {
        const pa = scaled[a],
          pb = scaled[b];
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([pa[0], pa[1], pa[2], pb[0], pb[1], pb[2]])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#fde047" transparent opacity={0.4} />
          </line>
        );
      })}
      {scaled.map((pos, i) => (
        <mesh key={i} position={pos} ref={(el) => (starRefs.current[i] = el)}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.95} />
        </mesh>
      ))}
      <mesh position={scaled[0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function ZodiacRing({
  radius = 3.5,
  speed = 0.05,
  tilt = 0.3,
  color = "#fde047",
  opacity = 0.15,
}) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
      ref.current.rotation.x = tilt + globalMouse.y * 0.25;
      ref.current.rotation.y = globalMouse.x * 0.25;
    }
  });
  return (
    <group rotation={[tilt, tilt * 0.4, 0]}>
      <mesh ref={ref}>
        <ringGeometry args={[radius, radius + 0.025, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function InteractiveStardustSwarm({ count = 90 }) {
  const group = useRef();
  const points = useMemo(() => {
    return Array.from({ length: count }, () => ({
      baseX: (Math.random() - 0.5) * 9,
      baseY: (Math.random() - 0.5) * 6,
      baseZ: (Math.random() - 0.5) * 4,
      size: 0.02 + Math.random() * 0.04,
      speed: 0.4 + Math.random() * 0.6,
      color: Math.random() > 0.4 ? "#fde047" : "#7dd3fc",
    }));
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const mx = globalMouse.x * 3.5;
    const my = globalMouse.y * 2.2;

    group.current.children.forEach((child, i) => {
      const p = points[i];
      // Subtle gravitational attraction toward mouse
      const dx = mx - child.position.x;
      const dy = my - child.position.y;
      const dist = Math.hypot(dx, dy) + 0.5;
      const pull = Math.min(0.25 / dist, 0.08);

      child.position.x = p.baseX + Math.sin(t * p.speed + i) * 0.35 + dx * pull;
      child.position.y = p.baseY + Math.cos(t * p.speed + i) * 0.35 + dy * pull;
    });
  });

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <mesh key={i} position={[p.baseX, p.baseY, p.baseZ]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

function ShootingStar({ delay = 0, color = "#7dd3fc" }) {
  const ref = useRef();
  const trailRef = useRef();

  useFrame((state) => {
    const t = (state.clock.elapsedTime + delay) % 8;
    const progress = t / 2.5;
    if (progress < 1 && ref.current) {
      ref.current.position.set(-4.5 + progress * 9, 2.2 - progress * 3.5, -2 + progress * 0.5);
      ref.current.visible = true;
      if (trailRef.current) {
        trailRef.current.position.set(
          -4.5 + progress * 9 - 0.35,
          2.2 - progress * 3.5 + 0.12,
          -2
        );
        trailRef.current.material.opacity = 0.45 * (1 - progress);
      }
    } else if (ref.current) ref.current.visible = false;
  });

  return (
    <>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh ref={trailRef} visible={false}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>
    </>
  );
}

function HomeScene() {
  useMouseParallax(1);
  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={2200} factor={3.2} saturation={0} fade speed={0.4} />
      <Sparkles count={130} scale={[16, 12, 8]} size={2} speed={0.18} color="#fde047" opacity={0.35} />
      <MouseGroup intensity={0.45}>
        <LeoConstellation />
      </MouseGroup>
      <ZodiacRing radius={3.2} speed={0.04} tilt={0.3} color="#fde047" opacity={0.14} />
      <ZodiacRing radius={4.1} speed={-0.03} tilt={0.55} color="#7dd3fc" opacity={0.1} />
      <InteractiveStardustSwarm count={80} />
      <ShootingStar delay={0} color="#7dd3fc" />
      <ShootingStar delay={4} color="#fde047" />
    </>
  );
}

/* ===========================================================
   ABOUT (2/8) — AI Neural Synapse Network & Quantum Lattice
   =========================================================== */
function NeuralNetwork() {
  const group = useRef();
  const nodeCount = 42;

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 4
      ),
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const edges = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 2.3) arr.push([i, j]);
      }
    }
    return arr;
  }, [nodes]);

  const nodeRefs = useRef([]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.04 + globalMouse.x * 0.4;
      group.current.rotation.x = -globalMouse.y * 0.3;
    }
    const mx = globalMouse.x * 4;
    const my = globalMouse.y * 2.5;

    nodeRefs.current.forEach((ref, i) => {
      if (ref) {
        const d = Math.hypot(nodes[i].pos.x - mx, nodes[i].pos.y - my);
        const nearMouse = Math.max(0, 1 - d / 2.5);
        const s = 1 + Math.sin(state.clock.elapsedTime * 2 + nodes[i].phase) * 0.35 + nearMouse * 0.7;
        ref.scale.setScalar(s);
      }
    });
  });

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => {
        const pa = nodes[a].pos,
          pb = nodes[b].pos;
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#a78bfa" transparent opacity={0.22} />
          </line>
        );
      })}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos} ref={(el) => (nodeRefs.current[i] = el)}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function AboutScene() {
  useMouseParallax(1.2);
  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={70} depth={50} count={1300} factor={2.6} saturation={0} fade speed={0.3} />
      <Sparkles count={70} scale={[14, 10, 6]} size={1.6} speed={0.12} color="#a78bfa" opacity={0.28} />
      <MouseGroup intensity={0.65}>
        <NeuralNetwork />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   SERVICES (3/8) — Cyber Defense Forcefield Shield & Satellites
   =========================================================== */
function ShieldWire() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.22 + globalMouse.x * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 - globalMouse.y * 0.4;
      const s = 1.6 + Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={ref} scale={1.6}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.42} />
    </mesh>
  );
}

function OrbitingCubes({ count = 8, radius = 3.2, color = "#34d399" }) {
  const group = useRef();
  const cubes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      y: (Math.random() - 0.5) * 2,
      size: 0.16 + Math.random() * 0.14,
      speed: 0.35 + Math.random() * 0.3,
    }));
  }, [count]);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.children.forEach((child, i) => {
      const c = cubes[i];
      const a = c.angle + state.clock.elapsedTime * c.speed + globalMouse.x * 0.5;
      child.position.set(
        Math.cos(a) * radius,
        c.y + Math.sin(state.clock.elapsedTime + i) * 0.3 - globalMouse.y * 0.4,
        Math.sin(a) * radius
      );
      child.rotation.x = state.clock.elapsedTime * c.speed;
      child.rotation.y = state.clock.elapsedTime * c.speed * 0.7;
    });
  });

  return (
    <group ref={group}>
      {cubes.map((c, i) => (
        <mesh key={i}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} wireframe />
        </mesh>
      ))}
    </group>
  );
}

function ServicesScene() {
  useMouseParallax(1);
  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={1100} factor={2.5} saturation={0} fade speed={0.3} />
      <Sparkles count={60} scale={[14, 10, 6]} size={1.6} speed={0.14} color="#34d399" opacity={0.25} />
      <MouseGroup intensity={0.55}>
        <ShieldWire />
        <OrbitingCubes count={8} radius={3.2} color="#34d399" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   COURSES (4/8) — Floating Knowledge Prisms & Crystals
   =========================================================== */
function Crystal({ position, color, scale, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed + globalMouse.x * 0.3;
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.6 - globalMouse.y * 0.3;
      ref.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.4 -
        globalMouse.y * 0.25;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
    </mesh>
  );
}

function CoursesScene() {
  useMouseParallax(1.1);
  const crystals = useMemo(
    () => [
      { pos: [-3, 0.5, -1], color: "#fb923c", scale: 0.8, speed: 0.4 },
      { pos: [3, -0.5, -0.5], color: "#fde047", scale: 1.0, speed: 0.3 },
      { pos: [0, 1.5, -1.5], color: "#fb923c", scale: 0.6, speed: 0.5 },
      { pos: [-1.5, -1.2, 0.5], color: "#fde047", scale: 0.7, speed: 0.35 },
      { pos: [2, 1.8, -1], color: "#fb923c", scale: 0.5, speed: 0.45 },
      { pos: [-2.5, 1.5, 0], color: "#fde047", scale: 0.55, speed: 0.4 },
      { pos: [1.5, -1.8, 0.8], color: "#fb923c", scale: 0.65, speed: 0.3 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={1100} factor={2.5} saturation={0} fade speed={0.3} />
      <Sparkles count={70} scale={[14, 10, 6]} size={1.6} speed={0.16} color="#fb923c" opacity={0.28} />
      <MouseGroup intensity={0.65}>
        {crystals.map((c, i) => (
          <Crystal key={i} position={c.pos} color={c.color} scale={c.scale} speed={c.speed} />
        ))}
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   BOOKS (5/8) — Floating Digital Codex & Arcane Pages
   =========================================================== */
function FloatingPage({ position, rotation, color, delay }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.position.y = position[1] + Math.sin(t * 0.45) * 0.4 - globalMouse.y * 0.3;
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.35) * 0.12 + globalMouse.x * 0.15;
      ref.current.rotation.y = rotation[1] + t * 0.12 + globalMouse.x * 0.25;
      ref.current.rotation.x = rotation[0] - globalMouse.y * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[1.25, 1.65]} />
      <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  );
}

function BooksScene() {
  useMouseParallax(1);
  const pages = useMemo(() => {
    const colors = ["#60a5fa", "#7dd3fc", "#38bdf8", "#60a5fa"];
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3 - 1,
      ],
      rotation: [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.3],
      color: colors[i % colors.length],
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={900} factor={2.5} saturation={0} fade speed={0.25} />
      <Sparkles count={60} scale={[14, 10, 6]} size={1.6} speed={0.12} color="#60a5fa" opacity={0.25} />
      <MouseGroup intensity={0.7}>
        {pages.map((p, i) => (
          <FloatingPage key={i} {...p} />
        ))}
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   VIDEOS (6/8) — Kinetic Soundwave Audio Horizon & Visualizer
   =========================================================== */
function WaveGrid({ color = "#f87171" }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(13, 13, 44, 44), []);
  const original = useMemo(() => geo.attributes.position.array.slice(), [geo]);

  useFrame((state) => {
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime * 1.2;
    const mx = globalMouse.x * 4;
    const my = globalMouse.y * 3;

    for (let i = 0; i < pos.length; i += 3) {
      const x = original[i],
        y = original[i + 1];
      // Wave equation reacting to mouse coordinates
      const distFromCursor = Math.hypot(x - mx, y - my);
      const cursorPulse = Math.sin(distFromCursor * 1.5 - t * 2) * Math.max(0, 0.45 - distFromCursor * 0.08);
      pos[i + 2] =
        Math.sin(x * 0.55 + t) * 0.35 +
        Math.cos(y * 0.55 + t * 0.8) * 0.35 +
        cursorPulse;
    }
    geo.attributes.position.needsUpdate = true;
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.02 + globalMouse.x * 0.1;
      ref.current.rotation.x = -Math.PI / 2.5 - globalMouse.y * 0.15;
    }
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1.5, 0]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

function VideoRings({ color = "#f87171" }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.12;
      group.current.rotation.x = globalMouse.y * 0.2;
    }
  });
  return (
    <group ref={group}>
      {[2.5, 3.2, 4.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2.5, 0, i * 0.3]}>
          <ringGeometry args={[r, r + 0.02, 80]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.18 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function VideosScene() {
  useMouseParallax(0.85);
  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={900} factor={2.5} saturation={0} fade speed={0.25} />
      <Sparkles count={60} scale={[14, 10, 6]} size={1.6} speed={0.14} color="#f87171" opacity={0.24} />
      <MouseGroup intensity={0.45}>
        <WaveGrid color="#f87171" />
        <VideoRings color="#f87171" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   NEWS (7/8) — ALL NEW UNIQUE: Cyber Intelligence Telemetry Matrix
   Holographic signal beacon rings, data stream pulses, and cyber beacons
   =========================================================== */
function CyberNewsBeacons() {
  const group = useRef();
  const beacons = useMemo(() => {
    return [
      { pos: [-3.2, 1.2, -1], color: "#fde047", scale: 0.8 },
      { pos: [3.4, 0.8, -1.2], color: "#38bdf8", scale: 0.9 },
      { pos: [0, -1.6, -0.5], color: "#facc15", scale: 1.1 },
      { pos: [-2.2, -1.0, 0.5], color: "#38bdf8", scale: 0.7 },
      { pos: [2.0, 1.8, 0.2], color: "#fde047", scale: 0.75 },
    ];
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.05 + globalMouse.x * 0.35;
    group.current.rotation.x = -globalMouse.y * 0.25;
  });

  return (
    <group ref={group}>
      {beacons.map((b, i) => (
        <group key={i} position={b.pos} scale={b.scale}>
          {/* Vertical telemetry pillar */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 3.5, 8]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.35} />
          </mesh>
          {/* Holographic pulse ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 0.5, 32]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.84, 32]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Beacon core */}
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DataStreamMatrix({ count = 55 }) {
  const group = useRef();
  const packets = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 4,
      speed: 0.8 + Math.random() * 1.4,
      size: 0.025 + Math.random() * 0.04,
      color: Math.random() > 0.45 ? "#fde047" : "#38bdf8",
    }));
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    const mx = globalMouse.x * 3.5;
    const my = globalMouse.y * 2.2;

    group.current.children.forEach((child, i) => {
      const p = packets[i];
      // Streaming flow upwards
      child.position.y += p.speed * 0.015;
      if (child.position.y > 3.5) child.position.y = -3.5;

      // Mouse reactivity: packets brighten and shift
      const dx = mx - child.position.x;
      const dy = my - child.position.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1.8) {
        child.position.x += dx * 0.02;
        child.scale.setScalar(1.5);
      } else {
        child.scale.setScalar(1);
      }
    });
  });

  return (
    <group ref={group}>
      {packets.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <boxGeometry args={[p.size, p.size * 2.5, p.size]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function NewsScene() {
  useMouseParallax(1.1);
  return (
    <>
      <ambientLight intensity={0.18} />
      <Stars radius={60} depth={40} count={1200} factor={2.8} saturation={0} fade speed={0.35} />
      <Sparkles count={80} scale={[15, 11, 7]} size={1.8} speed={0.16} color="#fde047" opacity={0.3} />
      <Sparkles count={50} scale={[14, 10, 6]} size={1.5} speed={0.2} color="#38bdf8" opacity={0.25} />
      <MouseGroup intensity={0.5}>
        <CyberNewsBeacons />
        <DataStreamMatrix count={55} />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   CONTACT (8/8) — Quantum Singularity Beacon & Orbit Sparks
   =========================================================== */
function ContactOrb() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.18 + globalMouse.x * 0.4;
      ref.current.rotation.x = -globalMouse.y * 0.35;
    }
  });
  return (
    <mesh ref={ref} scale={1.55}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#fde047"
        emissive="#facc15"
        emissiveIntensity={0.2}
        distort={0.38}
        speed={2.2}
        transparent
        opacity={0.18}
        wireframe
      />
    </mesh>
  );
}

function OrbitParticles({ count = 55, color = "#fde047" }) {
  const group = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 2.6,
      y: (Math.random() - 0.5) * 3,
      speed: 0.25 + Math.random() * 0.45,
      size: 0.02 + Math.random() * 0.045,
    }));
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      const a = p.angle + state.clock.elapsedTime * p.speed + globalMouse.x * 0.4;
      child.position.set(
        Math.cos(a) * p.radius,
        p.y - globalMouse.y * 0.3,
        Math.sin(a) * p.radius
      );
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

function ContactLight() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = globalMouse.x * 3.5;
      ref.current.position.y = globalMouse.y * 2.5;
    }
  });
  return <pointLight ref={ref} position={[0, 0, 2.5]} intensity={0.7} color="#fde047" />;
}

function ContactScene() {
  useMouseParallax(1.25);
  return (
    <>
      <ambientLight intensity={0.18} />
      <ContactLight />
      <Stars radius={60} depth={40} count={900} factor={2.6} saturation={0} fade speed={0.25} />
      <Sparkles count={70} scale={[12, 10, 6]} size={2} speed={0.16} color="#fde047" opacity={0.32} />
      <MouseGroup intensity={0.55}>
        <ContactOrb />
        <OrbitParticles count={55} color="#fde047" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   Scene Router — 8 Unique, Tailored 3D Experiences
   =========================================================== */
const SCENES = {
  home: HomeScene,
  about: AboutScene,
  services: ServicesScene,
  courses: CoursesScene,
  books: BooksScene,
  videos: VideosScene,
  news: NewsScene,
  contact: ContactScene,
};

export default function Scene3D({ variant = "home" }) {
  const Scene = SCENES[variant] || SCENES.home;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
