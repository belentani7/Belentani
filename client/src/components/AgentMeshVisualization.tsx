import {
  useRef,
  useMemo,
  useState,
  Suspense,
  type ReactNode,
} from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

/* ── agent data ────────────────────────────────────────────────────── */
interface AgentNode {
  id: string;
  label: string;
  status: "active" | "idle" | "offline";
  orbit: number; // distance from centre
  speed: number;
  phase: number;
  yOffset: number;
  isCore?: boolean;
}

const AGENTS: AgentNode[] = [
  { id: "aion", label: "Aion", status: "active", orbit: 0, speed: 0, phase: 0, yOffset: 0, isCore: true },
  { id: "scout", label: "Scout", status: "active", orbit: 2.0, speed: 0.35, phase: 0, yOffset: 0.3 },
  { id: "archivist", label: "Archivist", status: "idle", orbit: 2.0, speed: 0.35, phase: Math.PI, yOffset: -0.2 },
  { id: "analyst", label: "Analyst", status: "active", orbit: 2.8, speed: 0.25, phase: 0.5, yOffset: 0.5 },
  { id: "guardian", label: "Guardian", status: "active", orbit: 2.8, speed: 0.25, phase: Math.PI + 0.5, yOffset: -0.4 },
  { id: "catalyst", label: "Catalyst", status: "idle", orbit: 3.5, speed: 0.18, phase: 1.0, yOffset: 0.1 },
  { id: "relay", label: "Relay", status: "offline", orbit: 3.5, speed: 0.18, phase: Math.PI + 1.0, yOffset: -0.3 },
  { id: "sentinel", label: "Sentinel", status: "active", orbit: 3.5, speed: 0.18, phase: 2.5, yOffset: 0.6 },
  { id: "echo", label: "Echo", status: "idle", orbit: 4.0, speed: 0.14, phase: 0.8, yOffset: -0.5 },
];

const STATUS_COLOR: Record<AgentNode["status"], string> = {
  active: "#22c55e",
  idle: "#f59e0b",
  offline: "#6b7280",
};

/* ── single agent sphere ───────────────────────────────────────────── */
function AgentSphere({
  agent,
  time,
  onSelect,
  selected,
}: {
  agent: AgentNode;
  time: React.MutableRefObject<number>;
  onSelect: (id: string | null) => void;
  selected: string | null;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (agent.isCore) return;
    const t = time.current * agent.speed + agent.phase;
    ref.current.position.x = Math.cos(t) * agent.orbit;
    ref.current.position.z = Math.sin(t) * agent.orbit;
    ref.current.position.y = agent.yOffset + Math.sin(t * 1.2) * 0.15;
  });

  const color = agent.isCore ? "#ff2d2d" : STATUS_COLOR[agent.status];
  const size = agent.isCore ? 0.35 : 0.16;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(selected === agent.id ? null : agent.id);
  };

  return (
    <mesh
      ref={ref}
      position={agent.isCore ? [0, 0, 0] : undefined}
      onClick={handleClick}
    >
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={agent.isCore ? 2.0 : 1.2}
        toneMapped={false}
      />
      {selected === agent.id && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-lg border border-border/70 bg-card/90 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
            <p className="font-semibold text-foreground">{agent.label}</p>
            <p className="mt-0.5 capitalize text-muted-foreground">
              {agent.status}
            </p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* ── lines from core to agents ─────────────────────────────────────── */
function AgentConnections({
  agents,
  time,
}: {
  agents: AgentNode[];
  time: React.MutableRefObject<number>;
}) {
  const satellites = agents.filter(a => !a.isCore);
  const ref = useRef<THREE.LineSegments>(null!);
  const positions = useMemo(
    () => new Float32Array(satellites.length * 6),
    [satellites.length],
  );

  useFrame(() => {
    const t = time.current;
    let idx = 0;
    for (const a of satellites) {
      const tt = t * a.speed + a.phase;
      // from centre
      positions[idx++] = 0;
      positions[idx++] = 0;
      positions[idx++] = 0;
      // to agent
      positions[idx++] = Math.cos(tt) * a.orbit;
      positions[idx++] = a.yOffset + Math.sin(tt * 1.2) * 0.15;
      positions[idx++] = Math.sin(tt) * a.orbit;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
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
      <lineBasicMaterial color="#ff2d2d" transparent opacity={0.18} depthWrite={false} />
    </lineSegments>
  );
}

/* ── background particle field ─────────────────────────────────────── */
function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff2d2d" size={0.03} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/* ── scene ─────────────────────────────────────────────────────────── */
function Scene() {
  const time = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);

  useFrame((_, delta) => {
    time.current += delta;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 4]} intensity={0.5} />
      <ParticleField />
      <AgentConnections agents={AGENTS} time={time} />
      {AGENTS.map(agent => (
        <AgentSphere
          key={agent.id}
          agent={agent}
          time={time}
          onSelect={setSelected}
          selected={selected}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </>
  );
}

/* ── exported component ────────────────────────────────────────────── */
export default function AgentMeshVisualization() {
  return (
    <div className="relative mx-auto mt-12 h-[480px] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/60 bg-background/80 backdrop-blur-sm">
      {/* label */}
      <div className="absolute left-6 top-5 z-10">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-primary">
          AGENT MESH
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Observe the network
        </p>
      </div>

      {/* legend */}
      <div className="absolute right-6 top-5 z-10 flex gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-green-500" />
          active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-amber-500" />
          idle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-gray-500" />
          offline
        </span>
      </div>

      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 3, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        >
          <PerformanceMonitor />
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
