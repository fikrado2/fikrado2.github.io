import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ===========================================================
   Shared mouse parallax hook — drives camera + group rotation
   =========================================================== */
function useMouseParallax(intensity = 1) {
  const { camera, pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.05;
    target.current.y += (pointer.y - target.current.y) * 0.05;
    camera.position.x = target.current.x * 2.5 * intensity;
    camera.position.y = target.current.y * 1.5 * intensity;
    camera.lookAt(0, 0, 0);
  });
}

/* Helper: a group that rotates toward the mouse */
function MouseGroup({ children, intensity = 0.6, ...props }) {
  const ref = useRef();
  const { pointer } = useThree();
  const t = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    t.current.x += (pointer.x - t.current.x) * 0.04;
    t.current.y += (pointer.y - t.current.y) * 0.04;
    if (ref.current) {
      ref.current.rotation.y = t.current.x * intensity + state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = -t.current.y * intensity * 0.6;
    }
  });

  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}

/* ===========================================================
   HOME — Cosmic zodiac: constellations, orbital rings, dust
   =========================================================== */
const LEO_STARS = [
  [0.0, 0.5, 0], [0.35, 0.65, 0], [0.55, 0.55, 0], [0.7, 0.35, 0],
  [0.9, 0.25, 0], [0.2, 0.8, 0], [0.1, 0.9, 0], [0.4, 0.85, 0], [0.5, 0.75, 0],
];
const LEO_EDGES = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[5,7],[7,8],[8,2]];

function LeoConstellation() {
  const group = useRef();
  const starRefs = useRef([]);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
    starRefs.current.forEach((ref, i) => {
      if (ref) ref.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.7) * 0.3);
    });
  });
  const scaled = LEO_STARS.map(([x, y, z]) => [x * 2.5 - 1.25, y * 2.2 - 0.8, z]);
  return (
    <group ref={group} position={[0, 0.3, 0]}>
      {LEO_EDGES.map(([a, b], i) => {
        const pa = scaled[a], pb = scaled[b];
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={2}
                array={new Float32Array([pa[0],pa[1],pa[2],pb[0],pb[1],pb[2]])} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#fde047" transparent opacity={0.35} />
          </line>
        );
      })}
      {scaled.map((pos, i) => (
        <mesh key={i} position={pos} ref={(el) => (starRefs.current[i] = el)}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh position={scaled[0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ZodiacRing({ radius = 3.5, speed = 0.05, tilt = 0.3, color = "#fde047", opacity = 0.15 }) {
  const ref = useRef();
  useFrame((state) => { ref.current.rotation.z = state.clock.elapsedTime * speed; });
  return (
    <group rotation={[tilt, tilt * 0.4, 0]}>
      <mesh ref={ref}>
        <ringGeometry args={[radius, radius + 0.02, 100]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ZodiacDust({ count = 60, radius = 3.8, color = "#fde047" }) {
  const group = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.8;
      arr.push([r * Math.cos(angle), (Math.random() - 0.5) * 0.4, r * Math.sin(angle)]);
    }
    return arr;
  }, [count, radius]);
  useFrame((state) => { group.current.rotation.y = state.clock.elapsedTime * 0.03; });
  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
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
      ref.current.position.set(-4 + progress * 8, 2 - progress * 3, -2 + progress * 0.5);
      ref.current.visible = true;
      if (trailRef.current) {
        trailRef.current.position.set(-4 + progress * 8 - 0.3, 2 - progress * 3 + 0.1, -2);
        trailRef.current.material.opacity = 0.4 * (1 - progress);
      }
    } else if (ref.current) ref.current.visible = false;
  });
  return (
    <>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh ref={trailRef} visible={false}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>
    </>
  );
}

function HomeScene() {
  useMouseParallax(1);
  return (
    <>
      <ambientLight intensity={0.25} />
      <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={0.4} />
      <Sparkles count={120} scale={[16, 12, 8]} size={2} speed={0.15} color="#fde047" opacity={0.3} />
      <MouseGroup intensity={0.4}>
        <LeoConstellation />
      </MouseGroup>
      <ZodiacRing radius={3.2} speed={0.04} tilt={0.3} color="#fde047" opacity={0.12} />
      <ZodiacRing radius={4.0} speed={-0.03} tilt={0.55} color="#7dd3fc" opacity={0.08} />
      <ZodiacDust count={70} radius={3.8} color="#fde047" />
      <ShootingStar delay={0} color="#7dd3fc" />
      <ShootingStar delay={4} color="#fde047" />
    </>
  );
}

/* ===========================================================
   ABOUT — Neural network: nodes + connecting lines
   =========================================================== */
function NeuralNetwork() {
  const group = useRef();
  const nodeCount = 40;
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodeCount; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const edges = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 2.2) arr.push([i, j]);
      }
    }
    return arr;
  }, [nodes]);

  const nodeRefs = useRef([]);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.03;
    nodeRefs.current.forEach((ref, i) => {
      if (ref) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 2 + nodes[i].phase) * 0.4;
        ref.scale.setScalar(s);
      }
    });
  });

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => {
        const pa = nodes[a].pos, pb = nodes[b].pos;
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={2}
                array={new Float32Array([pa.x,pa.y,pa.z,pb.x,pb.y,pb.z])} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#a78bfa" transparent opacity={0.18} />
          </line>
        );
      })}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos} ref={(el) => (nodeRefs.current[i] = el)}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function AboutScene() {
  useMouseParallax(1.2);
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={70} depth={50} count={1200} factor={2.5} saturation={0} fade speed={0.3} />
      <Sparkles count={60} scale={[14, 10, 6]} size={1.5} speed={0.1} color="#a78bfa" opacity={0.25} />
      <MouseGroup intensity={0.7}>
        <NeuralNetwork />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   SERVICES — Rotating wireframe shield + orbiting cubes
   =========================================================== */
function ShieldWire() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  return (
    <mesh ref={ref} scale={1.6}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function OrbitingCubes({ count = 8, radius = 3, color = "#34d399" }) {
  const group = useRef();
  const cubes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      y: (Math.random() - 0.5) * 2,
      size: 0.15 + Math.random() * 0.15,
      speed: 0.3 + Math.random() * 0.3,
    }));
  }, [count]);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.1;
    group.current.children.forEach((child, i) => {
      const c = cubes[i];
      const a = c.angle + state.clock.elapsedTime * c.speed;
      child.position.set(Math.cos(a) * radius, c.y + Math.sin(state.clock.elapsedTime + i) * 0.3, Math.sin(a) * radius);
      child.rotation.x = state.clock.elapsedTime * c.speed;
      child.rotation.y = state.clock.elapsedTime * c.speed * 0.7;
    });
  });
  return (
    <group ref={group}>
      {cubes.map((c, i) => (
        <mesh key={i}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} wireframe />
        </mesh>
      ))}
    </group>
  );
}

function ServicesScene() {
  useMouseParallax(1);
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={60} depth={40} count={1000} factor={2.5} saturation={0} fade speed={0.3} />
      <Sparkles count={50} scale={[14, 10, 6]} size={1.5} speed={0.12} color="#34d399" opacity={0.2} />
      <MouseGroup intensity={0.5}>
        <ShieldWire />
        <OrbitingCubes count={8} radius={3} color="#34d399" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   COURSES — Floating knowledge crystals (octahedrons)
   =========================================================== */
function Crystal({ position, color, scale, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.6;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.4;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function CoursesScene() {
  useMouseParallax(1.1);
  const crystals = useMemo(() => [
    { pos: [-3, 0.5, -1], color: "#fb923c", scale: 0.8, speed: 0.4 },
    { pos: [3, -0.5, -0.5], color: "#fde047", scale: 1.0, speed: 0.3 },
    { pos: [0, 1.5, -1.5], color: "#fb923c", scale: 0.6, speed: 0.5 },
    { pos: [-1.5, -1.2, 0.5], color: "#fde047", scale: 0.7, speed: 0.35 },
    { pos: [2, 1.8, -1], color: "#fb923c", scale: 0.5, speed: 0.45 },
    { pos: [-2.5, 1.5, 0], color: "#fde047", scale: 0.55, speed: 0.4 },
    { pos: [1.5, -1.8, 0.8], color: "#fb923c", scale: 0.65, speed: 0.3 },
  ], []);
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={60} depth={40} count={1000} factor={2.5} saturation={0} fade speed={0.3} />
      <Sparkles count={60} scale={[14, 10, 6]} size={1.5} speed={0.15} color="#fb923c" opacity={0.25} />
      <MouseGroup intensity={0.6}>
        {crystals.map((c, i) => (
          <Crystal key={i} position={c.pos} color={c.color} scale={c.scale} speed={c.speed} />
        ))}
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   BOOKS — Floating pages / planes drifting in 3D space
   =========================================================== */
function FloatingPage({ position, rotation, color, delay }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.5;
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.1;
      ref.current.rotation.y = rotation[1] + t * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[1.2, 1.6]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

function BooksScene() {
  useMouseParallax(1);
  const pages = useMemo(() => {
    const colors = ["#60a5fa", "#7dd3fc", "#38bdf8", "#60a5fa"];
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3 - 1,
      ],
      rotation: [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.3],
      color: colors[i % colors.length],
      delay: Math.random() * 5,
    }));
  }, []);
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={60} depth={40} count={800} factor={2.5} saturation={0} fade speed={0.25} />
      <Sparkles count={50} scale={[14, 10, 6]} size={1.5} speed={0.1} color="#60a5fa" opacity={0.2} />
      <MouseGroup intensity={0.7}>
        {pages.map((p, i) => (
          <FloatingPage key={i} {...p} />
        ))}
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   VIDEOS — Wavy grid plane (audio-wave inspired)
   =========================================================== */
function WaveGrid({ color = "#f87171" }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(12, 12, 40, 40), []);
  const original = useMemo(() => geo.attributes.position.array.slice(), [geo]);
  useFrame((state) => {
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.length; i += 3) {
      const x = original[i], y = original[i + 1];
      pos[i + 2] = Math.sin(x * 0.5 + t) * 0.4 + Math.cos(y * 0.5 + t * 0.8) * 0.4;
    }
    geo.attributes.position.needsUpdate = true;
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1.5, 0]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function VideoRings({ color = "#f87171" }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) group.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={group}>
      {[2.5, 3.2, 4.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2.5, 0, i * 0.3]}>
          <ringGeometry args={[r, r + 0.015, 80]} />
          <meshBasicMaterial color={color} transparent opacity={0.15 - i * 0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function VideosScene() {
  useMouseParallax(0.8);
  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={60} depth={40} count={800} factor={2.5} saturation={0} fade speed={0.25} />
      <Sparkles count={50} scale={[14, 10, 6]} size={1.5} speed={0.12} color="#f87171" opacity={0.2} />
      <MouseGroup intensity={0.4}>
        <WaveGrid color="#f87171" />
        <VideoRings color="#f87171" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   CONTACT — Distorting orb with orbiting particles
   =========================================================== */
function ContactOrb() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  return (
    <mesh ref={ref} scale={1.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#fde047"
        emissive="#facc15"
        emissiveIntensity={0.15}
        distort={0.35}
        speed={2}
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  );
}

function OrbitParticles({ count = 50, color = "#fde047" }) {
  const group = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 2.5,
      y: (Math.random() - 0.5) * 3,
      speed: 0.2 + Math.random() * 0.4,
      size: 0.02 + Math.random() * 0.04,
    }));
  }, [count]);
  useFrame((state) => {
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      const a = p.angle + state.clock.elapsedTime * p.speed;
      child.position.set(Math.cos(a) * p.radius, p.y, Math.sin(a) * p.radius);
    });
  });
  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function ContactScene() {
  useMouseParallax(1.3);
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#fde047" />
      <Stars radius={60} depth={40} count={800} factor={2.5} saturation={0} fade speed={0.25} />
      <Sparkles count={60} scale={[12, 10, 6]} size={2} speed={0.15} color="#fde047" opacity={0.3} />
      <MouseGroup intensity={0.5}>
        <ContactOrb />
        <OrbitParticles count={50} color="#fde047" />
      </MouseGroup>
    </>
  );
}

/* ===========================================================
   Scene router
   =========================================================== */
const SCENES = {
  home: HomeScene,
  about: AboutScene,
  services: ServicesScene,
  courses: CoursesScene,
  books: BooksScene,
  videos: VideosScene,
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
