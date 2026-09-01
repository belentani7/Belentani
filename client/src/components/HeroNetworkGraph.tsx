import { useRef, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ── colour palette (matches brand) ────────────────────────────────── */
const COLORS = {
  core: "#ff2d2d", // red — core platforms
  live: "#22c55e", // green — live services
  dev: "#3b82f6", // blue — in development
} as const;

type NodeKind = keyof typeof COLORS;

/* ── data ───────────────────────────────────────────────────────────── */
interface GraphNode {
  id: number;
  kind: NodeKind;
  position: THREE.Vector3;
  speed: number;
  radius: number;
  phase: number;
}

const NODE_COUNT = 26;

function buildNodes(): GraphNode[] {
  const kinds: NodeKind[] = ["core", "live", "dev"];
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const angle = (i / NODE_COUNT) * Math.PI * 2;
    const r = 2.2 + Math.random() * 1.8;
    return {
      id: i,
      kind: kinds[i % 3],
      position: new THREE.Vector3(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * r,
      ),
      speed: 0.08 + Math.random() * 0.12,
      radius: r,
      phase: angle,
    };
  });
}

/* ── single animated node ──────────────────────────────────────────── */
function Node({
  node,
  time,
}: {
  node: GraphNode;
  time: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const t = time.current * node.speed + node.phase;
    ref.current.position.x = Math.cos(t) * node.radius;
    ref.current.position.z = Math.sin(t) * node.radius;
    ref.current.position.y =
      node.position.y + Math.sin(t * 1.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={node.position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={COLORS[node.kind]}
        emissive={COLORS[node.kind]}
        emissiveIntensity={1.6}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── connections between nearby nodes ──────────────────────────────── */
function Connections({
  nodes,
  time,
}: {
  nodes: GraphNode[];
  time: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.LineSegments>(null!);

  const pairs = useMemo(() => {
    const p: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 3.2) {
          p.push([i, j]);
        }
      }
    }
    return p;
  }, [nodes]);

  const positions = useMemo(
    () => new Float32Array(pairs.length * 6),
    [pairs],
  );

  useFrame(() => {
    const t = time.current;
    let idx = 0;
    for (const [i, j] of pairs) {
      const ni = nodes[i];
      const nj = nodes[j];
      const ti = t * ni.speed + ni.phase;
      const tj = t * nj.speed + nj.phase;
      positions[idx++] = Math.cos(ti) * ni.radius;
      positions[idx++] = ni.position.y + Math.sin(ti * 1.5) * 0.3;
      positions[idx++] = Math.sin(ti) * ni.radius;
      positions[idx++] = Math.cos(tj) * nj.radius;
      positions[idx++] = nj.position.y + Math.sin(tj * 1.5) * 0.3;
      positions[idx++] = Math.sin(tj) * nj.radius;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // pulse opacity
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.15 + Math.sin(t * 2) * 0.08;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ff2d2d"
        transparent
        opacity={0.2}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ── camera follows mouse ──────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e: PointerEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // attach/detach listener
  useMemo(() => {
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [onMove]);

  return null;
}

/* ── scene wrapper ─────────────────────────────────────────────────── */
function Scene() {
  const nodes = useMemo(buildNodes, []);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <CameraRig />
      <Connections nodes={nodes} time={time} />
      {nodes.map(node => (
        <Node key={node.id} node={node} time={time} />
      ))}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ── exported component ────────────────────────────────────────────── */
export default function HeroNetworkGraph() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.5, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <PerformanceMonitor
            onDecline={() => {
              /* drei will lower dpr automatically */
            }}
          />
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
