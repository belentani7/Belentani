import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CosmosFocusId } from '../../types';
import { Audio432Engine, AudioTelemetry } from './Audio432Engine';
import {
  GalaxyNodeItem,
  ODYSSEY_ACTS,
  ODYSSEY_DURATION_SEC,
  SIGNATURES,
  VIAJE3D_NODES,
} from './judasData';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Film,
  Gem,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface OmegaCosmosCanvasProps {
  audioEngine: Audio432Engine;
  unlockedGems: number[];
  onToggleGem: (idx: number) => void;
  selectedNodeIndex: number;
  onSelectNode: (idx: number, node: GalaxyNodeItem) => void;
  focusPreset: CosmosFocusId;
  onFocusChange: (focus: CosmosFocusId) => void;
  droneActive: boolean;
  onToggleDrone: () => void;
  onSyncAudioStates?: (drone: boolean) => void;
  externalFocusSeq?: number;
}

type StagePhase = 'black_silence' | 'odyssey' | 'free_orbit';

const FBM_GLSL = `
float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i + vec3(0,0,0)), hash31(i + vec3(1,0,0)), f.x),
        mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
        mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}
float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = p * 2.05 + 13.7;
    amp *= 0.5;
  }
  return sum;
}
`;

function createMetalMicroTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 115 + Math.random() * 85;
      img.data[i] = n;
      img.data[i + 1] = n;
      img.data[i + 2] = n;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 120; i++) {
      const y = Math.random() * size;
      ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 50, y);
      ctx.lineTo(size - Math.random() * 50, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.2, 4.5);
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createBrilliantGeometry(): THREE.BufferGeometry {
  const triangles: number[] = [];
  const ring = (count: number, radius: number, y: number, phase = 0) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const a = phase + (i / count) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
    }
    return pts;
  };
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    triangles.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  const table = ring(8, 0.39, 0.62, Math.PI / 8);
  const crown = ring(16, 1.0, 0.18, Math.PI / 16);
  const girdleTop = ring(16, 1.035, 0.08, Math.PI / 16);
  const girdleBottom = ring(16, 1.035, 0.01, Math.PI / 16);
  const lower = ring(8, 0.58, -0.56, Math.PI / 8);

  const topCenter = new THREE.Vector3(0, 0.62, 0);
  for (let i = 0; i < 8; i++) {
    tri(topCenter, table[i], table[(i + 1) % 8]);
    const c0 = crown[(i * 2) % 16];
    const c1 = crown[(i * 2 + 1) % 16];
    const c2 = crown[(i * 2 + 2) % 16];
    tri(table[i], c0, c1);
    tri(table[i], c1, table[(i + 1) % 8]);
    tri(table[(i + 1) % 8], c1, c2);
  }
  for (let i = 0; i < 16; i++) {
    const next = (i + 1) % 16;
    tri(crown[i], girdleTop[i], girdleTop[next]);
    tri(crown[i], girdleTop[next], crown[next]);
    tri(girdleTop[i], girdleBottom[i], girdleBottom[next]);
    tri(girdleTop[i], girdleBottom[next], girdleTop[next]);
  }
  for (let i = 0; i < 8; i++) {
    const o0 = girdleBottom[(i * 2) % 16];
    const o1 = girdleBottom[(i * 2 + 1) % 16];
    const o2 = girdleBottom[(i * 2 + 2) % 16];
    const l0 = lower[i];
    const l1 = lower[(i + 1) % 8];
    tri(o0, o1, l0);
    tri(o1, l1, l0);
    tri(o1, o2, l1);
  }
  const culet = new THREE.Vector3(0, -1.28, 0);
  for (let i = 0; i < 8; i++) {
    tri(lower[i], lower[(i + 1) % 8], culet);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(triangles, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

const CAMERA_PRESETS: Record<CosmosFocusId, { pos: [number, number, number]; target: [number, number, number] }> = {
  all: { pos: [0, 1.4, 13.5], target: [0, 0, 0] },
  planet: { pos: [0.2, 0.25, 5.8], target: [0, 0, 0] },
  machine: { pos: [0.3, 2.35, 7.2], target: [0, 0, 0] },
  key: { pos: [4.15, 0.35, 4.9], target: [4.15, 0.12, 0.32] },
  diamonds: { pos: [4.15, 0.55, 6.2], target: [4.15, 0.12, 0.32] },
  galaxy: { pos: [0, 8.2, 22.0], target: [0, 0, 0] },
};

function formatClock(sec: number): string {
  const clamped = Math.max(0, Math.floor(sec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function easeInOutCubic(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const OmegaCosmosCanvas: React.FC<OmegaCosmosCanvasProps> = ({
  audioEngine,
  unlockedGems,
  onToggleGem,
  selectedNodeIndex,
  onSelectNode,
  focusPreset,
  onFocusChange,
  droneActive,
  onToggleDrone,
  onSyncAudioStates,
  externalFocusSeq = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [webglError, setWebglError] = useState<string | null>(null);
  const [stagePhase, setStagePhase] = useState<StagePhase>('black_silence');
  const [odysseyPlaying, setOdysseyPlaying] = useState<boolean>(false);
  const [odysseySec, setOdysseySec] = useState<number>(0);
  const [odysseySpeed, setOdysseySpeed] = useState<1 | 2>(1);
  const [cameraTakeover, setCameraTakeover] = useState<boolean>(true);
  const [odysseyAudioArmed, setOdysseyAudioArmed] = useState<boolean>(false);

  const [dockOpen, setDockOpen] = useState(true);
  const [shaderDrawerOpen, setShaderDrawerOpen] = useState(false);

  const [morph, setMorph] = useState(1.25);
  const [goldMix, setGoldMix] = useState(0.5);
  const [shatterExpand, setShatterExpand] = useState(0.25);
  const [shatteredMode, setShatteredMode] = useState(false);
  const [rotSpeed, setRotSpeed] = useState(1.0);
  const [hoveredEntity, setHoveredEntity] = useState<string>('');

  // Active Act derived from current odyssey timestamp
  const currentAct =
    ODYSSEY_ACTS.find((a) => odysseySec >= a.startSec && odysseySec < a.endSec) ??
    ODYSSEY_ACTS[ODYSSEY_ACTS.length - 1];

  // Mutable refs for animation loop without re-initializing WebGL scene
  const paramsRef = useRef({
    morph,
    goldMix,
    shatterExpand,
    shatteredMode,
    rotSpeed,
    unlockedCount: unlockedGems.length,
    unlockedSet: new Set(unlockedGems),
    focusPreset,
    selectedNodeIndex,
    stagePhase,
    odysseyPlaying,
    odysseySpeed,
    cameraTakeover,
    odysseyAudioArmed,
    externalFocusSeq,
  });

  useEffect(() => {
    paramsRef.current.morph = morph;
    paramsRef.current.goldMix = goldMix;
    paramsRef.current.shatterExpand = shatterExpand;
    paramsRef.current.shatteredMode = shatteredMode;
    paramsRef.current.rotSpeed = rotSpeed;
    paramsRef.current.unlockedCount = unlockedGems.length;
    paramsRef.current.unlockedSet = new Set(unlockedGems);
    paramsRef.current.focusPreset = focusPreset;
    paramsRef.current.selectedNodeIndex = selectedNodeIndex;
    paramsRef.current.stagePhase = stagePhase;
    paramsRef.current.odysseyPlaying = odysseyPlaying;
    paramsRef.current.odysseySpeed = odysseySpeed;
    paramsRef.current.cameraTakeover = cameraTakeover;
    paramsRef.current.odysseyAudioArmed = odysseyAudioArmed;
    paramsRef.current.externalFocusSeq = externalFocusSeq;
  }, [
    morph,
    goldMix,
    shatterExpand,
    shatteredMode,
    rotSpeed,
    unlockedGems,
    focusPreset,
    selectedNodeIndex,
    stagePhase,
    odysseyPlaying,
    odysseySpeed,
    cameraTakeover,
    odysseyAudioArmed,
    externalFocusSeq,
  ]);

  const odysseyTimeRef = useRef<number>(0);
  const lastActRef = useRef<number>(-1);
  const droneTriggeredAtZoomRef = useRef<boolean>(false);

  const callbacksRef = useRef({ onToggleGem, onSelectNode, onSyncAudioStates });
  useEffect(() => {
    callbacksRef.current = { onToggleGem, onSelectNode, onSyncAudioStates };
  }, [onToggleGem, onSelectNode, onSyncAudioStates]);

  // Keyboard shortcut [H] for collapsible dock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (externalFocusSeq > 0) {
      setStagePhase('free_orbit');
      setOdysseyPlaying(false);
      setCameraTakeover(false);
    }
  }, [externalFocusSeq]);

  const handleStartOdyssey = (withSound: boolean) => {
    odysseyTimeRef.current = 0;
    lastActRef.current = -1;
    droneTriggeredAtZoomRef.current = false;
    setOdysseySec(0);
    setStagePhase('odyssey');
    setOdysseyPlaying(true);
    setCameraTakeover(true);
    setOdysseyAudioArmed(withSound);
    if (!withSound) {
      audioEngine.stopAll();
      callbacksRef.current.onSyncAudioStates?.(false);
    }
  };

  const handleEnterFreeOrbit = () => {
    odysseyTimeRef.current = 35;
    setOdysseySec(35);
    setStagePhase('free_orbit');
    setOdysseyPlaying(false);
    setCameraTakeover(false);
    onFocusChange('all');
  };

  const handleResetToBlackSilence = () => {
    audioEngine.stopAll();
    callbacksRef.current.onSyncAudioStates?.(false);
    odysseyTimeRef.current = 0;
    lastActRef.current = -1;
    droneTriggeredAtZoomRef.current = false;
    setOdysseySec(0);
    setOdysseyPlaying(false);
    setOdysseyAudioArmed(false);
    setCameraTakeover(true);
    setStagePhase('black_silence');
  };

  const handleJumpToAct = (actIndex: number) => {
    const act = ODYSSEY_ACTS[actIndex];
    if (!act) return;
    odysseyTimeRef.current = act.startSec;
    lastActRef.current = -1;
    setOdysseySec(act.startSec);
    setStagePhase('odyssey');
    setOdysseyPlaying(true);
    setCameraTakeover(true);
    if (act.startSec > 8 && odysseyAudioArmed && !audioEngine.droneActive) {
      const active = audioEngine.startDroneWithFade(2.2);
      callbacksRef.current.onSyncAudioStates?.(active);
    }
  };

  // Main Three.js WebGL initialization & animation lifecycle
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let glTest: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      glTest = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      glTest = null;
    }

    if (!glTest) {
      setWebglError('WebGL no está disponible en este entorno.');
      return;
    }

    const debugExt = glTest.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = debugExt ? String(glTest.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '') : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Mesa/i.test(rendererInfo);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 620;
    const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.0; // Literal black start until Odyssey illuminates

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010002, 0.0085);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.08, 650);
    camera.position.set(...ODYSSEY_ACTS[0].camStart);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.minDistance = 2.6;
    controls.maxDistance = 320;
    controls.maxPolarAngle = Math.PI * 0.92;

    const onControlsStart = () => {
      if (paramsRef.current.stagePhase === 'odyssey') {
        setCameraTakeover(false);
      }
    };
    controls.addEventListener('start', onControlsStart);

    // Environment reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // Post-processing only when hardware GPU is active
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    let cinematicPass: ShaderPass | null = null;

    if (!isSoftwareGl) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.92, 0.62, 0.22);
      composer.addPass(bloomPass);

      cinematicPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uAudio: { value: 0 },
          uReveal: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float uTime;
          uniform float uAudio;
          uniform float uReveal;
          varying vec2 vUv;
          void main() {
            vec2 c = vUv - 0.5;
            float r2 = dot(c, c);
            vec2 shift = c * r2 * (0.011 + uAudio * 0.038);
            float r = texture2D(tDiffuse, vUv + shift).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - shift).b;
            vec3 col = vec3(r, g, b);
            float vig = smoothstep(0.9, 0.18, r2 * 0.85);
            col *= mix(0.62, 1.0, vig) * uReveal;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      composer.addPass(cinematicPass);
      composer.addPass(new OutputPass());
    }

    // 3-Point Lighting Setup (Obsidian + Crimson + Gold + Cyan Rim)
    const ambient = new THREE.AmbientLight(0x281020, 0.65);
    scene.add(ambient);

    const redLight = new THREE.PointLight(0xff0033, 16, 28, 1.6);
    redLight.position.set(0, 0.8, 3.6);
    scene.add(redLight);

    const goldLight = new THREE.PointLight(0xffd45c, 13, 20, 1.6);
    goldLight.position.set(4.5, 2.2, 3.8);
    scene.add(goldLight);

    const cyanLight = new THREE.PointLight(0x65f7ff, 9, 20, 1.7);
    cyanLight.position.set(-4.6, 1.8, 3.4);
    scene.add(cyanLight);

    // 1. Procedural Nebula Dome (radius expanded to 290 so camera starts inside in Act I)
    const nebulaUniforms = {
      uTime: { value: 0 },
      uGoldMix: { value: 0.5 },
      uReveal: { value: 0 },
    };
    const nebulaDome = new THREE.Mesh(
      new THREE.SphereGeometry(290, 32, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: nebulaUniforms,
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uGoldMix;
          uniform float uReveal;
          varying vec3 vDir;
          ${FBM_GLSL}
          void main() {
            float n = fbm(vDir * 3.1 + vec3(uTime * 0.02));
            float dust = smoothstep(0.35, 0.88, n);
            vec3 crimson = vec3(0.24, 0.0, 0.05) * dust;
            vec3 gold = vec3(0.18, 0.11, 0.02) * pow(dust, 2.8) * (0.4 + uGoldMix * 0.6);
            vec3 cyan = vec3(0.02, 0.08, 0.12) * pow(1.0 - abs(vDir.y), 4.0) * 0.35;
            gl_FragColor = vec4((crimson + gold + cyan) * uReveal, 1.0);
          }
        `,
      })
    );
    scene.add(nebulaDome);

    // 2. Deep-Space Starfield (multi-scale depth from inner cosmos out to z=240)
    const starCount = isSoftwareGl ? 1500 : 3600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const paletteHex = [0xffffff, 0xff0033, 0xffd45c, 0x65f7ff];
    const tmpColor = new THREE.Color();
    for (let i = 0; i < starCount; i++) {
      const r = 14 + Math.pow(Math.random(), 0.55) * 165;
      const theta = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const xy = Math.sqrt(1 - z * z);
      starPos[i * 3] = r * xy * Math.cos(theta);
      starPos[i * 3 + 1] = r * z;
      starPos[i * 3 + 2] = r * xy * Math.sin(theta);
      const cIdx = Math.random() > 0.82 ? Math.floor(Math.random() * 3) + 1 : 0;
      tmpColor.setHex(paletteHex[cIdx]);
      starCol[i * 3] = tmpColor.r;
      starCol[i * 3 + 1] = tmpColor.g;
      starCol[i * 3 + 2] = tmpColor.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starsMat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.0 });
    const stars = new THREE.Points(starGeo, starsMat);
    scene.add(stars);

    // 3. Bioelectric Living Planet + Fresnel Atmosphere + Accretion Shockwave Ring
    const planetUniforms = {
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uMorph: { value: 1.25 },
      uGoldMix: { value: 0.5 },
      uAscend: { value: 0 },
    };
    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.52, isSoftwareGl ? 4 : 5),
      new THREE.ShaderMaterial({
        uniforms: planetUniforms,
        vertexShader: `
          uniform float uTime;
          uniform float uAudio;
          uniform float uMorph;
          varying vec3 vNormalW;
          varying vec3 vObj;
          varying float vDisp;
          void main() {
            vObj = normalize(position);
            float wave = sin(vObj.x * 8.0 + uTime * 1.4) * cos(vObj.y * 8.0 - uTime) * 0.042 * uMorph;
            float disp = wave + uAudio * 0.09;
            vDisp = disp;
            vec3 displaced = position + normal * disp;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uAudio;
          uniform float uGoldMix;
          uniform float uAscend;
          varying vec3 vNormalW;
          varying vec3 vObj;
          varying float vDisp;
          void main() {
            float veinPattern = abs(sin((vObj.x * 13.0 + sin(vObj.y * 10.0 + uTime * 0.5) * 2.1) * 3.14159));
            float veins = smoothstep(0.93, 0.995, veinPattern);
            float rim = pow(1.0 - max(dot(normalize(vNormalW), vec3(0.0, 0.0, 1.0)), 0.0), 2.8);
            vec3 base = vec3(0.02, 0.006, 0.015);
            vec3 crimson = vec3(1.0, 0.02, 0.22);
            vec3 gold = vec3(0.98, 0.8, 0.34);
            vec3 accent = mix(crimson, gold, clamp(uAscend * 0.8 + uGoldMix * 0.55 * smoothstep(0.01, 0.06, vDisp), 0.0, 1.0));
            vec3 aurora = vec3(0.4, 0.96, 1.0) * pow(abs(vObj.y), 6.0) * 0.35;
            vec3 col = base + accent * veins * (1.7 + uAudio * 2.8) + accent * rim * 0.68 + aurora;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      })
    );
    scene.add(planet);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.76, 32, 24),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          uAscend: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormalW;
          void main() {
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uAscend;
          varying vec3 vNormalW;
          void main() {
            float intensity = pow(0.65 - dot(vNormalW, vec3(0.0, 0.0, 1.0)), 2.5);
            vec3 col = mix(vec3(1.0, 0.0, 0.24), vec3(1.0, 0.82, 0.34), uAscend);
            gl_FragColor = vec4(col, 1.0) * clamp(intensity, 0.0, 0.65);
          }
        `,
      })
    );
    scene.add(atmosphere);

    // Equatorial Accretion Shockwave Ring (GLSL procedural resonance halo)
    const accretionUniforms = {
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uGoldMix: { value: 0.5 },
    };
    const accretionRing = new THREE.Mesh(
      new THREE.RingGeometry(1.9, 4.3, 96, 1),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: accretionUniforms,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uAudio;
          uniform float uGoldMix;
          varying vec3 vPos;
          void main() {
            float r = length(vPos.xy);
            float normR = clamp((r - 1.9) / 2.4, 0.0, 1.0);
            float angle = atan(vPos.y, vPos.x);
            float wave = sin(normR * 22.0 - uTime * 2.6 + sin(angle * 3.0 + uTime) * 0.8);
            float bands = smoothstep(0.45, 0.98, wave) * (1.0 - normR);
            float edgeFade = smoothstep(0.0, 0.14, normR) * (1.0 - smoothstep(0.75, 1.0, normR));
            vec3 crimson = vec3(1.0, 0.04, 0.24);
            vec3 gold = vec3(1.0, 0.84, 0.35);
            vec3 col = mix(crimson, gold, clamp(uGoldMix * 0.85, 0.0, 1.0));
            float alpha = bands * edgeFade * (0.28 + uAudio * 0.48);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })
    );
    accretionRing.rotation.x = Math.PI * 0.44;
    accretionRing.rotation.y = 0.22;
    scene.add(accretionRing);

    // 4. Organic Machine (3 Rings + 36 Instanced Plates + 36 Spikes + 14 Dilating Iris Petals + Sacred Merkaba Core)
    const machine = new THREE.Group();
    scene.add(machine);

    const machineMetal = new THREE.MeshPhysicalMaterial({
      color: 0x0b0910,
      metalness: 0.94,
      roughness: 0.24,
      clearcoat: 0.78,
      emissive: 0xff0033,
      emissiveIntensity: 1.25,
    });
    const machineDark = new THREE.MeshStandardMaterial({
      color: 0x050307,
      metalness: 0.86,
      roughness: 0.35,
      emissive: 0x450012,
      emissiveIntensity: 1.0,
    });

    const ringConfigs = [
      { r: 2.15, tube: 0.024, rot: [0.6, 0.2, 0] as [number, number, number], speed: 0.1 },
      { r: 2.58, tube: 0.03, rot: [-0.3, 0.4, 0.45] as [number, number, number], speed: -0.07 },
      { r: 3.0, tube: 0.018, rot: [0.15, -0.5, 0.2] as [number, number, number], speed: 0.05 },
    ];
    const machineRings = ringConfigs.map((cfg, idx) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.r, cfg.tube, 8, isSoftwareGl ? 64 : 128),
        idx === 1 ? machineMetal : machineDark
      );
      m.rotation.set(...cfg.rot);
      m.userData.speed = cfg.speed;
      machine.add(m);
      return m;
    });

    const plateCount = isSoftwareGl ? 24 : 36;
    const plates = new THREE.InstancedMesh(new THREE.BoxGeometry(0.32, 0.11, 0.68), machineMetal, plateCount);
    plates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    plates.frustumCulled = false;
    machine.add(plates);

    const spikeGeo = new THREE.ConeGeometry(0.052, 0.44, 6);
    spikeGeo.rotateZ(Math.PI / 2);
    const spikes = new THREE.InstancedMesh(spikeGeo, machineDark, plateCount);
    spikes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    spikes.frustumCulled = false;
    machine.add(spikes);

    const irisPetals: THREE.Group[] = [];
    for (let i = 0; i < 14; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.z = (i / 14) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.78, 0.05),
        i % 2 === 0 ? machineMetal : machineDark
      );
      petal.position.y = 1.95;
      petal.rotation.z = 0.22;
      pivot.add(petal);
      machine.add(pivot);
      irisPetals.push(pivot);
    }

    // Sacred Merkaba / Inner Pulsar Reactor revealed as Iris opens
    const sacredCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffd45c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const sacredKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.032, 72, 8, 2, 3), sacredCoreMat);
    machine.add(sacredKnot);

    const merkabaShell = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.05, 0),
      new THREE.MeshBasicMaterial({
        color: 0xff0033,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      })
    );
    machine.add(merkabaShell);

    // 5. Golden Key PBR + Procedural Microtexture + 5 Orbiting Brilliant Diamonds
    const metalMicro = createMetalMicroTexture(renderer);
    const keyGroup = new THREE.Group();
    keyGroup.position.set(4.15, 0.12, 0.32);
    scene.add(keyGroup);

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffc84f,
      metalness: 1.0,
      roughness: 0.19,
      clearcoat: 0.72,
      envMapIntensity: 2.1,
      emissive: 0x5b2600,
      emissiveIntensity: 0.2,
      roughnessMap: metalMicro,
      bumpMap: metalMicro,
      bumpScale: 0.012,
    });
    const goldDark = new THREE.MeshPhysicalMaterial({
      color: 0x7d4307,
      metalness: 1.0,
      roughness: 0.32,
      clearcoat: 0.35,
      envMapIntensity: 1.6,
    });

    const addKeyPart = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rot?: [number, number, number]) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      keyGroup.add(mesh);
      return mesh;
    };

    addKeyPart(new THREE.TorusGeometry(0.62, 0.11, 16, 64), goldMat, [0, 1.0, 0]);
    addKeyPart(new THREE.TorusGeometry(0.33, 0.035, 10, 48), goldDark, [0, 1.0, 0]);
    addKeyPart(new THREE.CylinderGeometry(0.115, 0.145, 2.4, 28), goldMat, [0, -0.36, 0]);
    addKeyPart(new THREE.TorusGeometry(0.18, 0.05, 10, 36), goldMat, [0, 0.26, 0], [Math.PI / 2, 0, 0]);
    addKeyPart(new THREE.TorusGeometry(0.16, 0.045, 10, 36), goldDark, [0, -1.24, 0], [Math.PI / 2, 0, 0]);
    addKeyPart(new THREE.BoxGeometry(0.56, 0.23, 0.25), goldMat, [0.22, -1.46, 0]);
    addKeyPart(new THREE.BoxGeometry(0.36, 0.28, 0.25), goldMat, [-0.02, -1.7, 0]);
    addKeyPart(new THREE.BoxGeometry(0.24, 0.22, 0.25), goldDark, [0.24, -1.88, 0]);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      addKeyPart(
        new THREE.SphereGeometry(0.024, 8, 6),
        i % 3 === 0 ? goldDark : goldMat,
        [Math.cos(a) * 0.46, 1.0 + Math.sin(a) * 0.46, 0.105]
      );
    }

    const keyHalo = addKeyPart(
      new THREE.TorusGeometry(0.92, 0.012, 6, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffd45c,
        transparent: true,
        opacity: 0.64,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      [0, 1.0, 0]
    );

    const brilliantGeo = createBrilliantGeometry();
    const diamondMeshes: THREE.Mesh[] = [];
    SIGNATURES.forEach((sig, idx) => {
      const mat = isSoftwareGl
        ? new THREE.MeshPhysicalMaterial({
            color: sig.hex,
            metalness: 0.15,
            roughness: 0.08,
            clearcoat: 1.0,
            ior: 2.417,
            transparent: true,
            opacity: 0.86,
            emissive: sig.hex,
            emissiveIntensity: paramsRef.current.unlockedSet.has(idx) ? 0.8 : 0.22,
          })
        : new THREE.MeshPhysicalMaterial({
            color: sig.hex,
            metalness: 0.0,
            roughness: 0.02,
            transmission: 0.9,
            thickness: 1.4,
            ior: 2.417,
            clearcoat: 1.0,
            iridescence: 0.35,
            emissive: sig.hex,
            emissiveIntensity: paramsRef.current.unlockedSet.has(idx) ? 0.72 : 0.18,
          });
      const mesh = new THREE.Mesh(brilliantGeo, mat);
      mesh.scale.setScalar(0.36);
      mesh.userData = { type: 'diamond', gemIndex: idx, label: `${sig.name} (${sig.title})` };
      keyGroup.add(mesh);
      diamondMeshes.push(mesh);
    });

    // 6. 180 Shattered Mirror Shards (InstancedMesh)
    const SHARD_COUNT = isSoftwareGl ? 96 : 180;
    const shardGeo = new THREE.OctahedronGeometry(0.24, 0);
    shardGeo.scale(1.3, 2.1, 0.12);
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd6de,
      emissive: 0x2c000a,
      metalness: 0.92,
      roughness: 0.08,
      clearcoat: 1.0,
    });
    const shardInstanced = new THREE.InstancedMesh(shardGeo, shardMat, SHARD_COUNT);
    shardInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    shardInstanced.frustumCulled = false;
    const shardMeta = Array.from({ length: SHARD_COUNT }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      baseRadius: 3.4 + Math.random() * 3.8,
      rotSpeedX: (Math.random() - 0.5) * 1.9,
      rotSpeedY: (Math.random() - 0.5) * 1.9,
      phase: Math.random() * Math.PI * 2,
      scale: 0.42 + Math.random() * 0.95,
    }));
    scene.add(shardInstanced);

    // 7. 44-Node Spiral Galaxy (VIAJE 3D) + Harmonic Constellation Bridges + Active Node Beacon
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);
    const nodeMeshes: THREE.Mesh[] = [];
    const spiralPoints: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    VIAJE3D_NODES.forEach((node, idx) => {
      const tNorm = idx / (VIAJE3D_NODES.length - 1);
      const radius = 5.4 + tNorm * 13.5;
      const angle = idx * goldenAngle * 1.65;
      const yOffset = Math.sin(idx * 0.65) * 1.75;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      spiralPoints.push(new THREE.Vector3(x, yOffset, z));

      const isGold = idx % 4 === 0;
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(idx === 0 ? 0.36 : 0.25, 16, 16),
        new THREE.MeshStandardMaterial({
          color: isGold ? 0xe6b84c : 0xff0033,
          emissive: isGold ? 0x6e4700 : 0x7a0014,
          emissiveIntensity: 0.85,
          metalness: 0.72,
          roughness: 0.22,
        })
      );
      pMesh.position.set(x, yOffset, z);
      pMesh.userData = { type: 'node', nodeIndex: idx, label: `${String(idx + 1).padStart(2, '0')}. ${node.name}` };

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.43, 24),
        new THREE.MeshBasicMaterial({
          color: isGold ? 0xffe18c : 0xff3355,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
        })
      );
      halo.rotation.x = Math.PI / 2;
      pMesh.add(halo);
      galaxyGroup.add(pMesh);
      nodeMeshes.push(pMesh);
    });

    const spiralLineGeo = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const spiralLine = new THREE.Line(
      spiralLineGeo,
      new THREE.LineBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.26 })
    );
    galaxyGroup.add(spiralLine);

    // Constellation filament chords linking key themes across the 44 nodes
    const chordPairs = [
      [0, 1], [1, 13], [0, 7], [7, 8], [8, 9], [9, 10],
      [2, 3], [3, 4], [4, 5], [5, 6], [25, 26], [27, 29], [10, 43], [1, 43],
    ];
    const bridgePts: THREE.Vector3[] = [];
    chordPairs.forEach(([a, b]) => {
      if (spiralPoints[a] && spiralPoints[b]) {
        bridgePts.push(spiralPoints[a], spiralPoints[b]);
      }
    });
    const bridgeLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(bridgePts),
      new THREE.LineBasicMaterial({
        color: 0xffd45c,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      })
    );
    galaxyGroup.add(bridgeLines);

    // Active spotlight beacon ring inside Galaxy group
    const activeBeacon = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.025, 8, 36),
      new THREE.MeshBasicMaterial({
        color: 0xffd45c,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
    );
    activeBeacon.rotation.x = Math.PI / 2;
    galaxyGroup.add(activeBeacon);

    // Raycaster & reusable objects (zero per-frame heap allocations)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clickStart = new THREE.Vector2();
    const clickableObjects: THREE.Object3D[] = [...diamondMeshes, ...nodeMeshes];

    const updatePointerFromEvent = (ev: PointerEvent, out: THREE.Vector2) => {
      const rect = renderer.domElement.getBoundingClientRect();
      out.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      out.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (ev: PointerEvent) => {
      clickStart.set(ev.clientX, ev.clientY);
    };

    const onPointerMove = (ev: PointerEvent) => {
      updatePointerFromEvent(ev, pointer);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableObjects, false);
      if (hits.length > 0) {
        const hitLabel = String(hits[0].object.userData.label || '');
        setHoveredEntity(hitLabel);
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredEntity('');
        canvas.style.cursor = 'grab';
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      const moved = Math.hypot(ev.clientX - clickStart.x, ev.clientY - clickStart.y);
      if (moved > 8) return;

      updatePointerFromEvent(ev, pointer);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableObjects, false);
      if (hits.length === 0) return;

      const hit = hits[0].object;
      if (hit.userData.type === 'diamond') {
        callbacksRef.current.onToggleGem(Number(hit.userData.gemIndex));
      } else if (hit.userData.type === 'node') {
        const idx = Number(hit.userData.nodeIndex);
        const node = VIAJE3D_NODES[idx];
        if (node) callbacksRef.current.onSelectNode(idx, node);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerup', onPointerUp);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        composer?.setSize(w, h);
      }
    });
    ro.observe(container);

    // Pre-allocated animation state & temp vectors (strictly zero GC inside loop)
    const clock = new THREE.Clock();
    const dummy = new THREE.Object3D();
    const tmpDesiredPos = new THREE.Vector3(...CAMERA_PRESETS.all.pos);
    const tmpDesiredTarget = new THREE.Vector3(...CAMERA_PRESETS.all.target);
    const _vA = new THREE.Vector3();
    const _vB = new THREE.Vector3();
    const _tA = new THREE.Vector3();
    const _tB = new THREE.Vector3();
    const telemetryOut: AudioTelemetry = {
      overall: 0,
      bass: 0,
      mid: 0,
      high: 0,
      bins: new Uint8Array(new ArrayBuffer(64)),
    };

    let lastFocusApplied: CosmosFocusId = paramsRef.current.focusPreset;
    let lastFocusSeq = paramsRef.current.externalFocusSeq;
    let cameraLerpFrames = 0;
    let uiSyncAccum = 0;
    let smoothExposure = 0;
    let smoothMorph = 1.25;
    let smoothGoldMix = 0.5;
    let smoothIris = 0.0;
    let smoothShatter = 0.25;

    let rafId = 0;
    let pollId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      if (!isSoftwareGl) {
        rafId = window.requestAnimationFrame(cb);
        return;
      }
      const gl2 = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl2.fenceSync === 'function') {
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl2.flush();
          const check = () => {
            if (disposed) {
              gl2.deleteSync(sync);
              return;
            }
            const status = gl2.clientWaitSync(sync, 0, 0);
            if (status === gl2.ALREADY_SIGNALED || status === gl2.CONDITION_SATISFIED) {
              gl2.deleteSync(sync);
              rafId = window.requestAnimationFrame(cb);
            } else {
              pollId = window.setTimeout(check, 10);
            }
          };
          pollId = window.setTimeout(check, 10);
          return;
        }
      }
      rafId = window.requestAnimationFrame(cb);
    };

    const renderFrame = () => {
      if (disposed) return;

      const delta = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      const motion = reducedMotion ? 0.18 : 1.0;
      const p = paramsRef.current;

      audioEngine.readTelemetry(telemetryOut);
      const audioDrive = telemetryOut.overall + telemetryOut.bass * 0.8;

      let targetMorph = p.morph;
      let targetGoldMix = p.goldMix;
      let targetShatter = (p.shatteredMode ? 1.5 : 0.0) + p.shatterExpand;
      let targetIris = 0.18;
      let targetReveal = 1.0;
      let targetFov = 46;
      let odysseyAscend = p.unlockedCount === 5 ? 1.0 : 0.0;

      if (p.stagePhase === 'black_silence') {
        targetReveal = 0.0;
        smoothExposure = THREE.MathUtils.damp(smoothExposure, 0.0, 6.0, delta);
        camera.position.set(...ODYSSEY_ACTS[0].camStart);
        controls.target.set(0, 0, 0);
      } else if (p.stagePhase === 'odyssey') {
        if (p.odysseyPlaying) {
          odysseyTimeRef.current += delta * p.odysseySpeed;
          if (odysseyTimeRef.current >= ODYSSEY_DURATION_SEC) {
            odysseyTimeRef.current = ODYSSEY_DURATION_SEC;
            setOdysseyPlaying(false);
          }
          uiSyncAccum += delta;
          if (uiSyncAccum >= 0.2) {
            uiSyncAccum = 0;
            setOdysseySec(odysseyTimeRef.current);
          }
        }

        const ot = odysseyTimeRef.current;
        const act =
          ODYSSEY_ACTS.find((a) => ot >= a.startSec && ot < a.endSec) ??
          ODYSSEY_ACTS[ODYSSEY_ACTS.length - 1];
        const actSpan = Math.max(1, act.endSec - act.startSec);
        const actProgress = easeInOutCubic((ot - act.startSec) / actSpan);

        // First 5.5s of Act I stay deep black & dead silent, then cosmic light dawns into the galaxy zoom
        if (act.id === 0) {
          const voidEmergence = THREE.MathUtils.smoothstep(ot, 5.5, 13.5);
          targetReveal = voidEmergence;
          if (p.odysseyAudioArmed && ot >= 7.0 && !droneTriggeredAtZoomRef.current) {
            droneTriggeredAtZoomRef.current = true;
            const ok = audioEngine.startDroneWithFade(4.5);
            callbacksRef.current.onSyncAudioStates?.(ok);
          }
        } else {
          targetReveal = 1.0;
        }

        // Trigger harmonic chime & spotlight galaxy node whenever crossing into a new Act
        if (lastActRef.current !== act.id) {
          lastActRef.current = act.id;
          const node = VIAJE3D_NODES[act.spotlightNode];
          if (node) callbacksRef.current.onSelectNode(act.spotlightNode, node);
          if (p.odysseyAudioArmed && ot > 7.5) {
            audioEngine.triggerTone(act.freqHz, 2.8, 0.065);
          }
        }

        // Dynamic parameter choreography across acts
        targetMorph = act.morph;
        targetGoldMix = Math.max(p.goldMix * 0.4, act.goldMix);
        targetIris = act.irisOpen;
        targetShatter = Math.max(p.shatterExpand, act.shatterExpand);
        targetFov = 46 + Math.sin(actProgress * Math.PI) * (act.fovPeak - 46);
        if (act.id === 6) {
          odysseyAscend = Math.max(odysseyAscend, easeInOutCubic(actProgress));
        }

        if (p.cameraTakeover) {
          _vA.set(...act.camStart);
          _vB.set(...act.camEnd);
          _tA.set(...act.lookStart);
          _tB.set(...act.lookEnd);

          // In Act I zoom, use an exponential dive curve so distance rushes dramatically into the spiral
          const camT = act.id === 0 ? Math.pow(THREE.MathUtils.smoothstep(ot, 9.0, act.endSec), 1.45) : actProgress;
          tmpDesiredPos.lerpVectors(_vA, _vB, camT);
          // Subtle lateral cinema drift
          if (act.id > 0) {
            tmpDesiredPos.x += Math.sin(ot * 0.28) * 0.55;
            tmpDesiredPos.y += Math.cos(ot * 0.22) * 0.28;
          }
          tmpDesiredTarget.lerpVectors(_tA, _tB, camT);

          camera.position.lerp(tmpDesiredPos, 1 - Math.exp(-2.8 * delta));
          controls.target.lerp(tmpDesiredTarget, 1 - Math.exp(-3.2 * delta));
        }

        smoothExposure = THREE.MathUtils.damp(smoothExposure, 1.24 * targetReveal, 3.2, delta);
      } else {
        // Free orbit mode
        targetReveal = 1.0;
        smoothExposure = THREE.MathUtils.damp(smoothExposure, 1.22, 4.0, delta);
        if (p.focusPreset !== lastFocusApplied || lastFocusSeq !== p.externalFocusSeq) {
          lastFocusApplied = p.focusPreset;
          lastFocusSeq = p.externalFocusSeq;
          const preset = CAMERA_PRESETS[p.focusPreset];
          tmpDesiredPos.set(...preset.pos);
          tmpDesiredTarget.set(...preset.target);
          cameraLerpFrames = 48;
        }
        if (cameraLerpFrames > 0) {
          camera.position.lerp(tmpDesiredPos, 0.09);
          controls.target.lerp(tmpDesiredTarget, 0.09);
          cameraLerpFrames -= 1;
        }
      }

      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 2.5, delta);
        camera.updateProjectionMatrix();
      }
      controls.update();

      smoothMorph = THREE.MathUtils.damp(smoothMorph, targetMorph, 2.2, delta);
      smoothGoldMix = THREE.MathUtils.damp(smoothGoldMix, targetGoldMix, 1.8, delta);
      smoothIris = THREE.MathUtils.damp(smoothIris, targetIris, 2.0, delta);
      smoothShatter = THREE.MathUtils.damp(smoothShatter, targetShatter, 2.2, delta);

      renderer.toneMappingExposure = smoothExposure;
      starsMat.opacity = 0.85 * targetReveal;
      nebulaUniforms.uReveal.value = targetReveal;
      nebulaUniforms.uTime.value = t;
      nebulaUniforms.uGoldMix.value = smoothGoldMix;

      planetUniforms.uTime.value = t;
      planetUniforms.uAudio.value = audioDrive;
      planetUniforms.uMorph.value = smoothMorph;
      planetUniforms.uGoldMix.value = smoothGoldMix;
      planetUniforms.uAscend.value = odysseyAscend;
      atmosphere.material.uniforms.uAscend.value = odysseyAscend;

      accretionUniforms.uTime.value = t;
      accretionUniforms.uAudio.value = audioDrive;
      accretionUniforms.uGoldMix.value = Math.max(smoothGoldMix, odysseyAscend);
      accretionRing.rotation.z = t * 0.14 * p.rotSpeed * motion;

      planet.rotation.y = t * 0.09 * p.rotSpeed * motion;
      planet.position.y = Math.sin(t * 0.72) * 0.04 * motion;

      // Organic machine plates, iris dilation & sacred Merkaba core
      machine.rotation.z = t * 0.02 * p.rotSpeed * motion;
      machineRings.forEach((ring, i) => {
        ring.rotation.z += Number(ring.userData.speed || 0.05) * 0.004 * p.rotSpeed * motion;
        const mat = ring.material as THREE.MeshStandardMaterial;
        mat.emissive.setHex(odysseyAscend > 0.6 ? 0xd4af37 : 0xff0033);
        mat.emissiveIntensity = (1.0 + Math.sin(t * 1.5 + i) * 0.4 + telemetryOut.bass * 0.9) * targetReveal;
      });
      for (let i = 0; i < plateCount; i++) {
        const a = (i / plateCount) * Math.PI * 2;
        const breath = Math.sin(t * 1.45 + i * 0.39);
        const rad = 2.72 + smoothIris * 0.45 + breath * 0.085 + telemetryOut.bass * 0.12;
        dummy.position.set(Math.cos(a) * rad, Math.sin(a) * rad, Math.sin(t * 0.7 + i * 0.7) * 0.11);
        dummy.rotation.set(0, 0, a + Math.PI / 2);
        dummy.scale.set(0.75 + (breath + 1) * 0.12, 1, 1 + (breath + 1) * 0.08);
        dummy.updateMatrix();
        plates.setMatrixAt(i, dummy.matrix);

        const spikeRad = 2.42 + smoothIris * 0.35 + breath * 0.04;
        dummy.position.set(Math.cos(a) * spikeRad, Math.sin(a) * spikeRad, 0);
        dummy.rotation.set(0, 0, a);
        dummy.scale.set(0.8, 0.75 + (breath + 1) * 0.16, 0.8);
        dummy.updateMatrix();
        spikes.setMatrixAt(i, dummy.matrix);
      }
      plates.instanceMatrix.needsUpdate = true;
      spikes.instanceMatrix.needsUpdate = true;

      irisPetals.forEach((petal, idx) => {
        petal.rotation.z =
          (idx / irisPetals.length) * Math.PI * 2 +
          smoothIris * 0.42 +
          Math.sin(t * 1.2 + idx * 0.3) * 0.035 * motion;
        const childMesh = petal.children[0] as THREE.Mesh | undefined;
        if (childMesh) {
          childMesh.position.y = 1.95 + smoothIris * 0.55;
        }
      });

      sacredKnot.rotation.x = t * 0.35 * motion;
      sacredKnot.rotation.y = -t * 0.48 * motion;
      sacredCoreMat.opacity = (0.12 + smoothIris * 0.45 + audioDrive * 0.25) * targetReveal;
      merkabaShell.rotation.y = t * 0.18 * motion;
      merkabaShell.rotation.x = Math.sin(t * 0.4) * 0.25 * motion;

      // Golden Key & 5 Orbiting Diamonds
      keyGroup.rotation.y = -0.24 + Math.sin(t * 0.58) * 0.2 * motion;
      keyGroup.position.y = 0.12 + Math.sin(t * 0.8) * 0.09 * motion;
      keyHalo.rotation.z = t * 0.42 * motion;

      diamondMeshes.forEach((d, idx) => {
        const orbitA = t * 0.55 * p.rotSpeed * motion + (idx / 5) * Math.PI * 2;
        d.position.set(Math.cos(orbitA) * 1.55, Math.sin(orbitA * 1.35) * 0.8, Math.sin(orbitA) * 1.55);
        d.rotation.y = t * 0.85 + idx;
        d.rotation.x = t * 0.45;
        const mat = d.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = p.unlockedSet.has(idx) ? 0.88 + telemetryOut.high * 0.4 : 0.16;
      });

      // Shattered Mirrors Expansion
      const shatterRadiusBoost = smoothShatter * 1.85 + telemetryOut.bass * 1.4;
      for (let i = 0; i < SHARD_COUNT; i++) {
        const s = shardMeta[i];
        const r = s.baseRadius + shatterRadiusBoost + Math.sin(t * 0.9 + s.phase) * 0.22;
        const aTheta = s.theta + t * 0.08 * p.rotSpeed * motion;
        dummy.position.set(
          r * Math.sin(s.phi) * Math.cos(aTheta),
          r * Math.cos(s.phi) * 0.65,
          r * Math.sin(s.phi) * Math.sin(aTheta)
        );
        dummy.rotation.set(t * s.rotSpeedX * motion, t * s.rotSpeedY * motion, s.phase);
        dummy.scale.setScalar(s.scale * (p.shatteredMode ? 1.15 : 0.88));
        dummy.updateMatrix();
        shardInstanced.setMatrixAt(i, dummy.matrix);
      }
      shardInstanced.instanceMatrix.needsUpdate = true;

      // 44-Node Spiral Galaxy rotation + Spotlight Beacon
      galaxyGroup.rotation.y = t * 0.035 * p.rotSpeed * motion;
      stars.rotation.y = t * 0.006 * motion;
      const targetBeaconNode = nodeMeshes[p.selectedNodeIndex] ?? nodeMeshes[0];
      if (targetBeaconNode) {
        activeBeacon.position.copy(targetBeaconNode.position);
        const beaconPulse = 1.0 + Math.sin(t * 3.2) * 0.2;
        activeBeacon.scale.setScalar(beaconPulse);
        activeBeacon.rotation.z = t * 0.8;
      }

      // Lighting & Postprocessing
      redLight.color.setHex(odysseyAscend > 0.55 ? 0xffd45c : 0xff0033);
      redLight.intensity = (14 + telemetryOut.bass * 8) * targetReveal;
      goldLight.intensity = 13 * targetReveal;
      cyanLight.intensity = 9 * targetReveal;
      ambient.intensity = 0.65 * targetReveal;

      if (composer && !isSoftwareGl) {
        if (bloomPass) bloomPass.strength = (0.85 + audioDrive * 0.65) * targetReveal;
        if (cinematicPass) {
          cinematicPass.uniforms.uTime.value = t;
          cinematicPass.uniforms.uAudio.value = audioDrive;
          cinematicPass.uniforms.uReveal.value = targetReveal;
        }
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      afterDraw(renderFrame);
    };

    afterDraw(renderFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(pollId);
      ro.disconnect();
      controls.removeEventListener('start', onControlsStart);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      composer?.dispose();
      envTarget.dispose();
      metalMicro.dispose();
      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.Line ||
          obj instanceof THREE.LineSegments
        ) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, [audioEngine]);

  const activeNode = VIAJE3D_NODES[selectedNodeIndex] ?? VIAJE3D_NODES[0];
  const progressPct = Math.min(100, (odysseySec / ODYSSEY_DURATION_SEC) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] lg:h-[700px] rounded-2xl overflow-hidden border border-rose-500/30 bg-black select-none"
    >
      {webglError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black">
          <Sparkles className="w-8 h-8 text-rose-500 mb-3" />
          <p className="text-sm font-mono text-rose-300">{webglError}</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full block outline-none" />
      )}

      {/* INITIAL BLACK & SILENCE GENESIS OVERLAY */}
      {stagePhase === 'black_silence' && !webglError && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-xl space-y-6">
            <div className="text-[11px] font-mono tracking-[0.28em] text-amber-300/85 uppercase">
              BELENTANI.ES · OMEGA CORE · 04:20 MIN
            </div>
            <h2 className="font-ritual text-3xl sm:text-5xl font-black tracking-wide text-white text-balance">
              THE JUDAS EXPERIENCE
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
              Inicio en negro absoluto y silencio. Durante los primeros segundos el vacío respira; después, la cámara rompe la oscuridad en un zoom cinematográfico hacia la galaxia espiral de 44 mundos a 432 Hz.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleStartOdyssey(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-display font-bold text-sm tracking-wider uppercase border border-amber-400/50 shadow-2xl shadow-rose-900/50 flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-amber-300" />
                <span>Iniciar el Viaje (Con Audio 432 Hz)</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartOdyssey(false)}
                className="px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-mono text-xs uppercase tracking-wider border border-zinc-800 cursor-pointer"
              >
                Viaje en Silencio
              </button>

              <button
                type="button"
                onClick={handleEnterFreeOrbit}
                className="px-4 py-3 rounded-xl bg-transparent hover:bg-zinc-900/70 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider border border-zinc-800/70 cursor-pointer"
              >
                Órbita Libre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corner Readouts (Center Viewport 100% Open) */}
      {stagePhase !== 'black_silence' && (
        <>
          <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-1">
            <div className="text-[11px] font-mono tracking-widest text-amber-300/90 uppercase">
              {stagePhase === 'odyssey'
                ? `${currentAct.roman} · ${currentAct.title}`
                : 'THE JUDAS EXPERIENCE · VIAJE 3D'}
            </div>
            <div className="text-xs font-mono text-zinc-400">
              NODO #{String(selectedNodeIndex + 1).padStart(2, '0')} · {activeNode.name}
            </div>
          </div>

          <div className="pointer-events-none absolute top-4 right-4 text-right font-mono text-[11px]">
            <div className="text-amber-300 tabular-nums">
              {stagePhase === 'odyssey'
                ? `${formatClock(odysseySec)} / ${formatClock(ODYSSEY_DURATION_SEC)}`
                : `${unlockedGems.length}/5 ARQUETIPOS`}
            </div>
            {hoveredEntity && (
              <div className="text-rose-400 mt-0.5">
                CLICK &rarr; {hoveredEntity}
              </div>
            )}
          </div>
        </>
      )}

      {/* Collapsible Bottom Control & Cinema Dock (NO backdrop-filter over active WebGL canvas) */}
      {stagePhase !== 'black_silence' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-5xl flex flex-col items-center gap-2 pointer-events-auto">
          {/* Poetic Narrative Subtitle + Visual Code Meaning during Odyssey */}
          {stagePhase === 'odyssey' && (
            <div className="w-full max-w-3xl bg-black/80 border border-rose-500/25 rounded-xl px-4 py-2.5 text-center space-y-1">
              <p className="text-xs sm:text-sm text-zinc-100 leading-snug">
                {odysseySec < 5.5
                  ? 'En el principio solo hay oscuridad y silencio. Escucha la ausencia antes de la ruptura…'
                  : currentAct.subtitle}
              </p>
              <p className="text-[10px] font-mono text-amber-300/85">
                SEMÁNTICA VISUAL: {currentAct.visualMeaning}
              </p>
            </div>
          )}

          {dockOpen && shaderDrawerOpen && (
            <div className="w-full bg-black/95 border border-rose-500/35 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <label className="flex flex-col gap-1 text-zinc-300">
                <span className="flex justify-between">
                  <span>Simplex Morph</span>
                  <span className="text-amber-300">{morph.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={morph}
                  onChange={(e) => setMorph(Number(e.target.value))}
                  className="accent-rose-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-zinc-300">
                <span className="flex justify-between">
                  <span>Oro Alquímico</span>
                  <span className="text-amber-300">{goldMix.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={goldMix}
                  onChange={(e) => setGoldMix(Number(e.target.value))}
                  className="accent-amber-400"
                />
              </label>
              <label className="flex flex-col gap-1 text-zinc-300">
                <span className="flex justify-between">
                  <span>Espejos Rotación</span>
                  <span className="text-amber-300">{shatterExpand.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={shatterExpand}
                  onChange={(e) => setShatterExpand(Number(e.target.value))}
                  className="accent-rose-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-zinc-300">
                <span className="flex justify-between">
                  <span>Velocidad</span>
                  <span className="text-amber-300">{rotSpeed.toFixed(1)}x</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={rotSpeed}
                  onChange={(e) => setRotSpeed(Number(e.target.value))}
                  className="accent-amber-400"
                />
              </label>
            </div>
          )}

          {/* Odyssey Director Timeline & Quick Act Jumps */}
          {dockOpen && (
            <div className="w-full bg-black/90 border border-rose-500/35 rounded-xl p-2 shadow-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (stagePhase !== 'odyssey') {
                        handleStartOdyssey(true);
                      } else {
                        setOdysseyPlaying((v) => !v);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/30 border border-rose-500/50 text-white text-[11px] font-mono uppercase flex items-center gap-1 hover:bg-rose-600/50 cursor-pointer"
                  >
                    {stagePhase === 'odyssey' && odysseyPlaying ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Pausar Viaje</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>{stagePhase === 'odyssey' ? 'Reanudar Viaje' : 'Modo Cine 04:20'}</span>
                      </>
                    )}
                  </button>

                  {stagePhase === 'odyssey' && !cameraTakeover && (
                    <button
                      type="button"
                      onClick={() => setCameraTakeover(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[11px] font-mono uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Film className="w-3 h-3" />
                      <span>Reanudar Cámara</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setOdysseySpeed((s) => (s === 1 ? 2 : 1))}
                    className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono tabular-nums cursor-pointer"
                  >
                    {odysseySpeed}x
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToBlackSilence}
                    title="Volver al Vacío Inicial (Negro & Silencio)"
                    className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] font-mono cursor-pointer"
                  >
                    Negro 00:00
                  </button>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                  {ODYSSEY_ACTS.map((act, idx) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleJumpToAct(idx)}
                      title={`${act.roman}: ${act.title}`}
                      className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors ${
                        stagePhase === 'odyssey' && currentAct.id === act.id
                          ? 'bg-amber-400/25 text-amber-200 border border-amber-400/60'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {act.roman}
                    </button>
                  ))}
                </div>
              </div>

              {/* Odyssey progress bar */}
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-rose-400 to-amber-400 transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Camera presets & Shader toggles */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {(
                  [
                    ['all', '00 Cosmos'],
                    ['planet', '01 Planeta'],
                    ['machine', '02 Máquina'],
                    ['key', '03 Llave'],
                    ['diamonds', '04 Diamantes'],
                    ['galaxy', '05 Galaxia 44'],
                  ] as [CosmosFocusId, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setStagePhase('free_orbit');
                      setOdysseyPlaying(false);
                      onFocusChange(id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                      stagePhase === 'free_orbit' && focusPreset === id
                        ? 'bg-rose-600/30 text-amber-300 border border-amber-400/50'
                        : 'text-zinc-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShatteredMode((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    shatteredMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                      : 'text-zinc-300 hover:text-white border border-rose-500/30'
                  }`}
                >
                  <Gem className="w-3 h-3" />
                  <span>{shatteredMode ? 'Espejos Abiertos' : 'Fracturar Espejos'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShaderDrawerOpen((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    shaderDrawerOpen
                      ? 'bg-rose-600/25 text-white border border-rose-400/50'
                      : 'text-zinc-300 hover:text-white border border-rose-500/30'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>Shaders</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleDrone}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                    droneActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                      : 'text-zinc-300 hover:text-white border border-rose-500/30'
                  }`}
                >
                  {droneActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>432 Hz</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStagePhase('free_orbit');
                    setOdysseyPlaying(false);
                    onFocusChange('all');
                    setShatteredMode(false);
                  }}
                  title="Resetear cámara"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white border border-transparent cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            title="Mostrar/ocultar dock de cámara [H]"
            className="px-3 py-1 rounded-lg bg-black/85 border border-rose-500/35 text-[11px] font-mono text-zinc-300 hover:text-amber-300 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span>{dockOpen ? 'Ocultar HUD [H]' : 'Controles del Viaje [H]'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
