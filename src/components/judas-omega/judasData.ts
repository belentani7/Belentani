import { Language } from '../../types';

export interface SignatureArchetype {
  id: 'pedro' | 'marcos' | 'santos' | 'belentani' | 'human';
  code: string;
  name: string;
  title: string;
  color: string;
  hex: number;
  freqHz: number;
  desc: string;
}

export interface JudasPhase {
  id: number;
  code: string;
  title: string;
  body: string[];
}

export interface TrackItem {
  id: string;
  title: string;
  year: string;
  prod: string;
  bpm: number;
  freq: number;
  genre: string;
  lore: string;
}

export interface GalaxyNodeItem {
  name: string;
  category: string;
  desc: string;
}

export interface LoreChapter {
  title: string;
  body: string;
}

export const SIGNATURES: SignatureArchetype[] = [
  {
    id: 'pedro',
    code: 'PEDRO.SIG',
    name: 'PEDRO',
    title: 'LA ROCA',
    color: '#D4AF37',
    hex: 0xffd45c,
    freqHz: 432,
    desc: 'El ancla fundacional. Permanencia, estructura arquitectónica y silencio ante la tormenta.',
  },
  {
    id: 'marcos',
    code: 'MARCOS.SIG',
    name: 'MARCOS',
    title: 'EL CRONISTA',
    color: '#65f7ff',
    hex: 0x65f7ff,
    freqHz: 528,
    desc: 'El observador lúcido. Registra los hechos con precisión quirúrgica sin reaccionar al ruido.',
  },
  {
    id: 'santos',
    code: 'SANTOS.SIG',
    name: 'SANTOS',
    title: 'LA ANTENA',
    color: '#b026ff',
    hex: 0xb026ff,
    freqHz: 639,
    desc: 'El canal de recepción. Traduce la intuición, los armónicos a 432 Hz y el símbolo.',
  },
  {
    id: 'belentani',
    code: 'BELENTANI.SIG',
    name: 'BELENTANI',
    title: 'EL ARTEFACTO',
    color: '#ff0033',
    hex: 0xff003c,
    freqHz: 741,
    desc: 'Integración del guerrero y el ángel. Cuero carmesí líquido y transmutación estética de la herida.',
  },
  {
    id: 'human',
    code: 'HUMAN.SIG',
    name: 'THE HUMAN',
    title: 'LA INTERFAZ',
    color: '#f7f4fa',
    hex: 0xf7f4fa,
    freqHz: 852,
    desc: 'La presencia física y vulnerable (1,94 m, Blue Yeti X) que sostiene la verdad en el mundo real.',
  },
];

export const STATIONS: string[] = [
  'EL ENTRE',
  'LA DEUDA',
  'EL ROBO',
  'EL CANTO',
  'LA VICTORIA AMARGA',
  'LA MENTIRA COMPARTIDA',
  'EL UMBRAL',
  'LA SEÑAL',
  'EL PORTAL',
  'LA CONSTELACIÓN',
];

export const JUDAS_PHASES: JudasPhase[] = [
  {
    id: 0,
    code: 'FASE 01',
    title: 'EL HOMBRE INTEGRADO',
    body: [
      'No existe un cuándo ni un dónde fijo. Existe un entre: un pliegue donde el tiempo no corre, respira.',
      'En ese umbral caminaba un hombre con cinco firmas corriendo en paralelo: La Roca, El Cronista, La Antena, El Artefacto y La Interfaz. Cinco frecuencias en una sola arquitectura.',
    ],
  },
  {
    id: 1,
    code: 'FASE 02',
    title: 'LA DEUDA IMPAGABLE',
    body: [
      'Se encontraron en un camino fuera de mapa. Judas caminaba con prisa, huyendo de aquello que llevaba dentro.',
      'Pedro ofreció franqueza, presencia y lealtad sin condiciones. Cuando el afecto es radical y transparente, el espejo se vuelve insoportable para quien vive en la sombra.',
    ],
  },
  {
    id: 2,
    code: 'FASE 03',
    title: 'EL ROBO Y EL CANTO',
    body: [
      'Judas extendió la mano hacia la Llave Dorada creyendo que el poder residía en el metal.',
      'Al activarse el artefacto, las cinco voces resonaron al unísono. En lugar de maldecir, Pedro se sentó y le cantó: convirtió la herida en frecuencia.',
    ],
  },
  {
    id: 3,
    code: 'FASE 04',
    title: 'LA VICTORIA AMARGA',
    body: [
      '«Quédate con el metal. La llave era símbolo; mi voz nadie me la puede arrebatar.»',
      'Judas celebró una victoria vacía con una llave cuya cerradura ya había sido rediseñada por el Arquitecto.',
    ],
  },
  {
    id: 4,
    code: 'FASE 05',
    title: 'LA MENTIRA COMPARTIDA',
    body: [
      'La llave nunca fue el núcleo: fue el filtro que reveló quién era quién.',
      'LA TRAICIÓN ES EL INPUT. LA VOZ ES EL OUTPUT. OMEGA_CORE PERMANECE INTACTO.',
    ],
  },
];

export const DISCOGRAPHY: TrackItem[] = [
  {
    id: 'judas',
    title: 'JUDAS (The Judas Experience · F#m)',
    year: '2026',
    prod: 'Prod. Hey Duck',
    bpm: 76,
    freq: 108,
    genre: 'Dark Pop / Electro-R&B',
    lore: 'Manifiesto central de la era. Anatomía de la traición íntima tras febrero de 2026 y transmutación del duelo en soberanía estética.',
  },
  {
    id: 'cassandra',
    title: 'Cassandra (Molhou meus olhos)',
    year: 'Nov 2026',
    prod: 'BELENTANI',
    bpm: 104,
    freq: 144,
    genre: 'MPB Nocturna / Whisper-Pop',
    lore: 'La maldición de ver el colapso antes de que ocurra. Falsete aéreo de micrófono cercano, quiebre vocal controlado ("gallo") y melancolía atlántica.',
  },
  {
    id: 'nemo',
    title: 'Nemo Throat Stone',
    year: 'Nov 2026',
    prod: 'BELENTANI',
    bpm: 96,
    freq: 128,
    genre: 'Experimental R&B / Ambient Bass',
    lore: 'El nudo en la garganta convertido en mineral abisal. Texturas subacuáticas y vocal fry sobre graves inspirados en la afinación a 432 Hz.',
  },
  {
    id: 'la-deuda',
    title: 'La Deuda',
    year: '2026',
    prod: 'Prod. Hey Duck',
    bpm: 126,
    freq: 162,
    genre: 'Funk Carioca / Dark Club',
    lore: 'Percusión carioca de los 2000s cruzada con sintetizadores industriales de Barcelona. Cobro emocional sin concesiones.',
  },
  {
    id: 'shark-eyes',
    title: 'Shark Eyes',
    year: '2026',
    prod: 'BELENTANI',
    bpm: 112,
    freq: 136,
    genre: 'Dark Pop / Synth Noir',
    lore: 'Estudio sobre la mirada depredadora, el sesgo de atribución y la frialdad necesaria para sobrevivir a entornos hostiles.',
  },
  {
    id: 'apaga-a-luz',
    title: 'Apaga a Luz',
    year: '2026',
    prod: 'BELENTANI',
    bpm: 122,
    freq: 152,
    genre: 'Brazilian Bass / R&B',
    lore: 'Intimidad nocturna en portugués; contraste entre sombra absoluta y destellos carmesí.',
  },
  {
    id: 'avesso-do-mar',
    title: 'O Avesso do Mar · Mon Amour · Therapist',
    year: '2026',
    prod: 'BELENTANI & Hey Duck',
    bpm: 98,
    freq: 116,
    genre: 'MPB / Dark Electronic Catalog',
    lore: 'Puente sonoro entre el Nordeste brasileño y el Mediterráneo junto a cortes canónicos como Mon Amour, Therapist y I Wrote a Song.',
  },
];

export const LORE_CHAPTERS: LoreChapter[] = [
  {
    title: 'I. LA DUALIDAD SAN PEDRO / JUDAS',
    body: 'Pedro frente al espejo fracturado: el nombre de la piedra fundacional enfrentado al arquetipo de la traición. Judas no es solo el otro; es el catalizador que obliga al creador a abandonar la ingenuidad y blindar su propio templo.',
  },
  {
    title: 'II. ARQUITECTURA VOCAL & 432 HZ',
    body: 'Captura íntima con Blue Yeti X: susurros cercanos al diafragma, inicios con vocal fry, falsete etéreo y el "gallo" emocional sin maquillar. El motor utiliza divisores armónicos de 432 Hz (108 / 216 / 432 / 540 Hz) y pulso de 76 BPM.',
  },
  {
    title: 'III. RED MILKY GLASSMORPHISM & ORO LÍQUIDO',
    body: 'Estética de alto contraste nacida de la obsidiana pura (#000000), sastrería de cuero carmesí neón (#FF0033), cristal translúcido teñido de sangre y oro fundido (#D4AF37) que sella las grietas como un kintsugi digital.',
  },
  {
    title: 'IV. PSICOLOGÍA DE LAS SOMBRAS',
    body: 'Cada pista y nodo de la galaxia incorpora mecanismos de psicología evolutiva y sesgos cognitivos (Error Fundamental de Atribución, Síndrome de Amapola Alta, Hipótesis del Mundo Justo) diseccionados con frialdad clínica.',
  },
  {
    title: 'V. PUENTE BARCELONA — NORDESTE BRASIL',
    body: 'Desde L’Hospitalet de Llobregat y el distrito 22@ hasta Recife y Aracaju junto al productor Hey Duck: alianza independiente que fusiona el funk melody brasileño de los 2000s con dark pop europeo e ingeniería WebGL.',
  },
  {
    title: 'VI. ECOSISTEMA SOBERANO (44 NODOS VIAJE 3D)',
    body: 'Cada planeta de la espiral VIAJE 3D enlaza una pieza musical, un ensayo psicológico o un repositorio abierto de belentani7: belentani.es, NOIACORE, Secure-T, Meta-Skill y Manos Abiertas.',
  },
];

export const VIAJE3D_NODES: GalaxyNodeItem[] = [
  { name: 'BELENTANI.ES', category: 'Core Portal', desc: 'Santuario principal y experiencia inmersiva The Judas Experience.' },
  { name: 'JUDAS MASTER', category: 'Single', desc: 'Pista titular producida junto a Hey Duck. Núcleo emocional del proyecto.' },
  { name: 'CASSANDRA', category: 'Single', desc: 'Molhou meus olhos — balada oscura de clarividencia emocional.' },
  { name: 'NEMO THROAT STONE', category: 'Single', desc: 'Piedra abisal en la garganta; frecuencias graves a 432 Hz.' },
  { name: 'LA DEUDA', category: 'Single', desc: 'Fusión funk carioca e industrial sobre cuentas pendientes.' },
  { name: 'SHARK EYES', category: 'Single', desc: 'Anatomía de la frialdad y la percepción depredadora.' },
  { name: 'APAGA A LUZ', category: 'Single', desc: 'Nocturno electrónico en portugués.' },
  { name: 'NOIACORE', category: 'AI System', desc: 'Arquitectura de orquestación multi-agente y automatización creativa.' },
  { name: 'SECURE-T', category: 'Platform', desc: 'Universidad digital abierta de ciberseguridad e inteligencia artificial.' },
  { name: 'META-SKILL', category: 'Dev Tool', desc: 'Enrutador de habilidades de cero tokens para agentes autónomos.' },
  { name: 'MANOS ABIERTAS', category: 'PWA Social', desc: 'Plataforma educativa multilingüe en 39 idiomas con currículum de IA.' },
  { name: 'ABRAZO', category: 'Web Guide', desc: 'Guía sobre límites emocionales y dinámicas interpersonales.' },
  { name: 'CRUZANDO EL CHARCO', category: 'Civic Guide', desc: 'Mapa de orientación comunitaria en L’Hospitalet y Barcelona.' },
  { name: 'HEY DUCK STUDIO', category: 'Alianza BR', desc: 'Plataforma web y press kit del productor brasileño Hey Duck.' },
  { name: 'ARTE QUE VESTE', category: 'Brand', desc: 'Identidad visual y prototipo web de moda artesanal del Nordeste.' },
  { name: 'MTAXIMO', category: 'Toolkit', desc: 'Suite de auditoría estructural, drones 432 Hz y nodos WebGL.' },
  { name: 'VFX ORCHESTRATOR', category: 'AI Video', desc: 'Pipeline de dirección artística y síntesis visual cinematográfica.' },
  { name: 'O AVESSO DO MAR', category: 'Unreleased', desc: 'Composición en desarrollo entre MPB y electrónica abisal.' },
  { name: 'CEREAL FACEBOY', category: 'Unreleased', desc: 'Sátira dark-pop sobre máscaras sociales contemporáneas.' },
  { name: "NO TE DA PA' MÁS", category: 'Unreleased', desc: 'Corte directo en español con pulso club minimalista.' },
  { name: 'CATLÓMA', category: 'Unreleased', desc: 'Pieza experimental de texturas vocales y percusión orgánica.' },
  { name: 'HEART BREAKING', category: 'Catalog', desc: 'Archivo discográfico distribuido en plataformas globales.' },
  { name: 'THERAPIST', category: 'Catalog', desc: 'Catarsis clínica convertida en canción pop.' },
  { name: 'MON AMOUR', category: 'Catalog', desc: 'Romance nocturno multilingüe.' },
  { name: 'I WROTE A SONG', category: 'Catalog', desc: 'Metacomposición sobre el oficio de escribir desde la herida.' },
  { name: 'SAN PEDRO CODEX', category: 'Lore', desc: 'Archivo filosófico sobre la dualidad del nombre y la lealtad.' },
  { name: 'THIAGO ARCHIVE', category: 'Lore', desc: 'Crónica de la ruptura de febrero de 2026 y su transmutación.' },
  { name: 'ESPEJO FRACTURADO', category: 'Visual', desc: 'Geometría de 180 fragmentos reflectantes en física orbital.' },
  { name: 'CUERO CARMESÍ', category: 'Couture', desc: 'Motivo visual insignia: sastrería brillante rojo neón sobre negro.' },
  { name: 'ORO ALQUÍMICO', category: 'Shader', desc: 'Vetas metálicas líquidas que sellan las fracturas del núcleo.' },
  { name: '432 HZ LAB', category: 'Audio', desc: 'Laboratorio de afinación natural y síntesis sub-armónica.' },
  { name: 'BLUE YETI X', category: 'Vocal Chain', desc: 'Cadena de captura íntima de susurros, vocal fry y falsete.' },
  { name: 'RVC / APPLIO', category: 'Voice AI', desc: 'Investigación local de clonación vocal y conversión audio-a-audio.' },
  { name: 'SALA AQUARELLA', category: 'Live Stage', desc: 'Memoria escénica en Gran Via de les Corts Catalanes, Barcelona.' },
  { name: 'TORRE GLÒRIES', category: 'History', desc: 'Cinco años en Trust & Safety global y seguridad digital en 22@.' },
  { name: 'SESGO DE ATRIBUCIÓN', category: 'Psychology', desc: 'Nodo sobre cómo juzgamos intenciones ajenas frente a circunstancias.' },
  { name: 'AMAPOLA ALTA', category: 'Psychology', desc: 'Estudio sobre la envidia social hacia quien destaca sin pedir permiso.' },
  { name: 'MUNDO JUSTO', category: 'Psychology', desc: 'Desmontaje de la falacia moral de que cada quien recibe lo que merece.' },
  { name: 'CARQUIDEC', category: 'Architecture', desc: 'Colaboración digital y narrativa arquitectónica.' },
  { name: 'CTG PSICOLOGÍA', category: 'Web Design', desc: 'Modernización digital para clínica psicológica en L’Hospitalet.' },
  { name: 'BELENTANI UNIFIED', category: 'Monorepo', desc: 'Ecosistema centralizado de plantillas y utilidades de estudio.' },
  { name: 'GLSL SHADER VAULT', category: 'Graphics', desc: 'Biblioteca de ruido Simplex, Fresnel y post-procesado.' },
  { name: 'FELINOS & SOMBRAS', category: 'Observation', desc: 'Estudio del lenguaje corporal felino: sigilo, caza y soberanía.' },
  { name: 'OMEGA HORIZON', category: 'Singularity', desc: 'Punto de convergencia final de la espiral de 44 mundos.' },
];

export const TERMINAL_LORE_DATABASE: Record<string, string> = {
  belentani:
    '[ID: BELENTANI] Pedro Belentani (1995) · Artista, compositor y tecnólogo creativo (São Paulo -> Barcelona). Ecosistema belentani.es y github.com/belentani7. Cuero carmesí líquido, Dark Pop / Electro-R&B / Funk Carioca.',
  judas:
    '[ID: JUDAS] Concepto central de belentani.es ("Judas Era" / Omega Core). Judas no es literal: es la máscara dramática de ruptura, deseo y duda que activa las 5 gemas IOR 2.417 y el portal VIAJE 3D.',
  'san-pedro':
    '[ID: SAN-PEDRO] El guardián de las llaves y la arquitectura. Control estructural, Dimensión Zion, código limpio y memoria de largo alcance.',
  duck:
    '[ID: HEY-DUCK] Duck Studios — productor aliado en Recife/Aracaju (BR). Co-arquitecto rítmico desde 2022 en "JUDAS" y "La Deuda".',
  thiago:
    '[ID: ARCHIVE-02] Registro cerrado. Evento catalizador de febrero de 2026. Transmutado íntegramente en materia prima sonora y arquitectura visual.',
  pedro:
    '[FIRMA 01 // PEDRO.SIG] La Roca · 432 Hz. Ancla estructural y permanencia frente al colapso.',
  marcos:
    '[FIRMA 02 // MARCOS.SIG] El Cronista · 528 Hz. Observación clínica de los hechos y memoria trazable.',
  santos:
    '[FIRMA 03 // SANTOS.SIG] La Antena · 639 Hz. Traducción de frecuencia armónica y símbolo.',
  human:
    '[FIRMA 05 // HUMAN.SIG] La Interfaz · 852 Hz. Presencia física, vocal fry, Blue Yeti X y vulnerabilidad sin filtros.',
};

export interface OdysseyAct {
  id: number;
  roman: string;
  title: string;
  startSec: number;
  endSec: number;
  camStart: [number, number, number];
  camEnd: [number, number, number];
  lookStart: [number, number, number];
  lookEnd: [number, number, number];
  fovPeak: number;
  freqHz: number;
  spotlightNode: number;
  morph: number;
  goldMix: number;
  irisOpen: number;
  shatterExpand: number;
  subtitle: string;
  visualMeaning: string;
}

export const ODYSSEY_DURATION_SEC = 260;

export const ODYSSEY_ACTS: OdysseyAct[] = [
  {
    id: 0,
    roman: 'ACTO I',
    title: 'El Vacío Negro y el Zoom a la Galaxia',
    startSec: 0,
    endSec: 28,
    camStart: [0, 108, 280],
    camEnd: [10.5, 4.4, 19.2],
    lookStart: [0, 0, 0],
    lookEnd: [0, 0, 0],
    fovPeak: 64,
    freqHz: 108,
    spotlightNode: 0,
    morph: 0.75,
    goldMix: 0.08,
    irisOpen: 0.0,
    shatterExpand: 0.0,
    subtitle: 'Inicio en negro absoluto y silencio. Antes del sonido, la cámara de descompresión cae hacia la espiral de 44 mundos.',
    visualMeaning: 'Exposición 0 -> despertar estelar -> zoom hiperbólico desde z=280 hacia el brazo dorado de VIAJE-3D.',
  },
  {
    id: 1,
    roman: 'ACTO II',
    title: 'La Espiral de los 44 Mundos (VIAJE-3D)',
    startSec: 28,
    endSec: 68,
    camStart: [10.5, 4.4, 19.2],
    camEnd: [-12.5, 6.2, 13.8],
    lookStart: [2.5, 0, 2.0],
    lookEnd: [-2.0, 0.2, 0],
    fovPeak: 50,
    freqHz: 216,
    spotlightNode: 10,
    morph: 1.05,
    goldMix: 0.22,
    irisOpen: 0.15,
    shatterExpand: 0.1,
    subtitle: 'Cada esfera de la espiral áurea guarda una obra real: JUDAS, Cassandra, NOIACORE, Manos Abiertas, Secure-T y Hey Duck.',
    visualMeaning: '44 nodos distribuidos por el ángulo áureo (137.5°) unidos por puentes orbitales de código y canción.',
  },
  {
    id: 2,
    roman: 'ACTO III',
    title: 'El Planeta Bioeléctrico y las Grietas Carmesí',
    startSec: 68,
    endSec: 108,
    camStart: [-12.5, 6.2, 13.8],
    camEnd: [0.6, 0.4, 5.2],
    lookStart: [0, 0, 0],
    lookEnd: [0, 0, 0],
    fovPeak: 46,
    freqHz: 432,
    spotlightNode: 2,
    morph: 1.65,
    goldMix: 0.35,
    irisOpen: 0.3,
    shatterExpand: 0.15,
    subtitle: 'La superficie respira con ondas Simplex y vetas arteriales carmesí (#FF0033): la vulnerabilidad vocal frente al micrófono.',
    visualMeaning: 'Vertex displacement orgánico + halo Fresnel atmosférico + anillos de acreción en F#m a 432 Hz.',
  },
  {
    id: 3,
    roman: 'ACTO IV',
    title: 'La Máquina Orgánica y la Apertura del Iris',
    startSec: 108,
    endSec: 148,
    camStart: [0.6, 0.4, 5.2],
    camEnd: [-2.8, 2.5, 4.4],
    lookStart: [0, 0, 0],
    lookEnd: [0, 0, 0],
    fovPeak: 48,
    freqHz: 528,
    spotlightNode: 7,
    morph: 1.4,
    goldMix: 0.48,
    irisOpen: 1.0,
    shatterExpand: 0.35,
    subtitle: 'Los 14 pétalos mecánicos y los tres anillos giroscópicos se abren para revelar el reactor sagrado en el centro del sistema.',
    visualMeaning: 'InstancedMesh de 36 placas defensivas abriéndose como un ojo mecánico sobre el núcleo Merkaba.',
  },
  {
    id: 4,
    roman: 'ACTO V',
    title: 'Tormenta de Espejos Rotos (Umbral DARVO)',
    startSec: 148,
    endSec: 184,
    camStart: [-2.8, 2.5, 4.4],
    camEnd: [5.4, -1.8, 8.6],
    lookStart: [0, 0, 0],
    lookEnd: [1.5, 0, 0.2],
    fovPeak: 54,
    freqHz: 639,
    spotlightNode: 27,
    morph: 1.9,
    goldMix: 0.52,
    irisOpen: 0.7,
    shatterExpand: 1.75,
    subtitle: '180 fragmentos de espejo giran en órbita: la distorsión externa se fractura hasta devolver la mirada limpia.',
    visualMeaning: 'Octaedros especulares en expansión orbital reflejando neón carmesí y luz fría cian.',
  },
  {
    id: 5,
    roman: 'ACTO VI',
    title: 'La Llave Dorada y los 5 Diamantes Arquetipo',
    startSec: 184,
    endSec: 222,
    camStart: [5.4, -1.8, 8.6],
    camEnd: [4.15, 0.45, 3.65],
    lookStart: [4.15, 0.12, 0.32],
    lookEnd: [4.15, 0.12, 0.32],
    fovPeak: 42,
    freqHz: 741,
    spotlightNode: 25,
    morph: 1.2,
    goldMix: 0.82,
    irisOpen: 0.85,
    shatterExpand: 0.55,
    subtitle: '«Quédate con el metal. La llave era símbolo; mi voz nadie me la puede arrebatar.» Cinco firmas giran con IOR 2.417.',
    visualMeaning: 'Metal físico anisotrópico (anisotropy + microtextura) orbitado por PEDRO, MARCOS, SANTOS, BELENTANI y THE HUMAN.',
  },
  {
    id: 6,
    roman: 'ACTO VII',
    title: 'Transfiguración Kintsugi · Dimensión Zion',
    startSec: 222,
    endSec: 260,
    camStart: [4.15, 0.45, 3.65],
    camEnd: [0, 5.2, 20.5],
    lookStart: [1.2, 0.1, 0],
    lookEnd: [0, 0, 0],
    fovPeak: 48,
    freqHz: 852,
    spotlightNode: 43,
    morph: 1.15,
    goldMix: 1.0,
    irisOpen: 1.0,
    shatterExpand: 0.85,
    subtitle: 'La traición entra como input; el oro líquido (#FFD45C) sella las grietas como kintsugi digital. OMEGA_CORE permanece intacto.',
    visualMeaning: 'uGoldMix -> 1.0: todas las fracturas carmesí transmutan a oro soberano ante los 44 mundos.',
  },
];

export interface VisualCodeMeaning {
  id: string;
  focus: 'all' | 'planet' | 'machine' | 'key' | 'diamonds' | 'galaxy';
  codeElement: string;
  technicalMech: string;
  symbolicMeaning: string;
}

export const VISUAL_CODE_MEANINGS: VisualCodeMeaning[] = [
  {
    id: 'void',
    focus: 'all',
    codeElement: '00. Vacío Negro & Silencio Inicial',
    technicalMech: 'Renderer en #000000 con exposición inicial 0.0 -> rampa exponencial y cámara lanzada desde z = 280.',
    symbolicMeaning: 'La cámara de descompresión antes de crear: silencio deliberado para limpiar el ruido externo antes del zoom.',
  },
  {
    id: 'planet',
    focus: 'planet',
    codeElement: '01. Planeta Bioeléctrico + Anillos de Acreción',
    technicalMech: 'Shader GLSL sobre Icosaedro con desplazamiento sinusoidal reactivo al FFT de audio y doble borde Fresnel.',
    symbolicMeaning: 'El cuerpo y la voz humana: las vetas rojas son grietas emocionales que se sellan en oro líquido (Kintsugi) al sanar.',
  },
  {
    id: 'machine',
    focus: 'machine',
    codeElement: '02. Máquina Orgánica & Reactor Interior',
    technicalMech: 'InstancedMesh de 36 placas y púas + 3 anillos giroscópicos + 14 pétalos de iris rodeando un TorusKnot sagrado.',
    symbolicMeaning: 'La coraza técnica (Trust & Safety, IA y arquitectura): cuando confía, el iris abre la armadura y muestra el núcleo vivo.',
  },
  {
    id: 'mirrors',
    focus: 'all',
    codeElement: '03. 180 Espejos Rotos Orbitales',
    technicalMech: 'InstancedMesh de octaedros metálicos especulares modulados por bajas frecuencias (bass) y expansión radial.',
    symbolicMeaning: 'Las proyecciones y mentiras compartidas (DARVO): al fracturarse y orbitar lejos del centro, dejan ver la verdad.',
  },
  {
    id: 'key-diamonds',
    focus: 'key',
    codeElement: '04. Llave Dorada PBR & 5 Diamantes (IOR 2.417)',
    technicalMech: 'Geometría talla brillante de 57 facetas con refracción física orbitando una llave compuesta de oro cepillado.',
    symbolicMeaning: 'Las 5 firmas paralelas del autor (PEDRO, MARCOS, SANTOS, BELENTANI, THE HUMAN) custodiando la soberanía creativa.',
  },
  {
    id: 'galaxy44',
    focus: 'galaxy',
    codeElement: '05. Galaxia Espiral VIAJE-3D (44 Nodos)',
    technicalMech: 'Distribución por ángulo áureo (Phyllotaxis) conectada por filamentos lineales y haz de selección por Raycaster.',
    symbolicMeaning: 'El mapa completo del ecosistema belentani.es y belentani7: canciones, código abierto, educación y memoria en órbita.',
  },
];

export const TAROT_OMEGA_CARDS: string[] = [
  'I. EL ARQUITECTO (Soberanía): Construyes santuarios donde otros solo ven ruinas.',
  'II. LA LLAVE DORADA (Ilusión de Poder): Aquello que intentaron retener solo era metal; la cerradura ya cambió.',
  'III. EL ESPEJO FRACTURADO (Lucidez): Observas en calma absoluta; cada patrón se delata en sus propios hechos.',
  'IV. LA FRECUENCIA 432 HZ (Transmutación): La traición compilada entra como input y sale convertida en canción.',
  'V. LA CONSTELACIÓN OMEGA (Integración): Cinco firmas alineadas bajo una misma órbita carmesí y oro.',
];

export const JUDAS_LOCALE_COPY: Record<
  Language,
  {
    eyebrow: string;
    heroLead: string;
    bioTitle: string;
    bioParagraph1: string;
    bioParagraph2: string;
    keyQuote: string;
    portalHint: string;
    ascendedText: string;
    phasesTitle: string;
    sonicTitle: string;
    galaxiesTitle: string;
    terminalTitle: string;
  }
> = {
  pt: {
    eyebrow: 'THE JUDAS EXPERIENCE · BELENTANI.ES · OMEGA CORE',
    heroLead:
      'Câmara de descompressão audiovisual com início em negro e silêncio absolutos, seguida de um zoom cinematográfico de 04:20 min pela galáxia espiral de 44 mundos.',
    bioTitle: 'Arquitetura Biográfica · São Paulo -> Barcelona',
    bioParagraph1:
      'BELENTANI (Pedro Belentani, 1995) é compositor, produtor e tecnólogo criativo residente em Barcelona com raízes em São Paulo. Ativo na música eletrónica desde 2016 e com cinco anos em Trust & Safety global, dirige o ecossistema belentani.es (Omega Core / Dimensão Zion) e os repositórios abertos belentani7 (ia-creativa-lab, Manos Abiertas, Secure-T, LinguaForge).',
    bioParagraph2:
      'Desde 2022 mantém aliança criativa com o produtor brasileiro Hey Duck / Duck Studios (JUDAS, La Deuda), cruzando dark pop, R&B alternativo, eletrónica industrial e funk carioca. Em Judas Era, «Judas» atua como máscara cénica de rutura e transformação.',
    keyQuote: '«Fica com o metal. A chave era símbolo; a minha voz ninguém ma pode roubar.»',
    portalHint:
      'Clica diretamente nos 5 diamantes IOR 2.417 no espaço 3D ou nos cartões abaixo para ativar a Ascensão Dourada.',
    ascendedText: 'ASCENSÃO DOURADA ATIVA · 5/5 ARQUÉTIPOS SINCRONIZADOS',
    phasesTitle: 'As 5 Fases de Judas',
    sonicTitle: 'Laboratório Sonoro 432 Hz & 76 BPM',
    galaxiesTitle: 'Matriz das 50 Galáxias (5 Assinaturas × 10 Estações)',
    terminalTitle: 'Terminal char+ & Arquivo IA',
  },
  es: {
    eyebrow: 'THE JUDAS EXPERIENCE · BELENTANI.ES · OMEGA CORE',
    heroLead:
      'Cámara de descompresión audiovisual con inicio en negro y silencio absolutos, seguida de una odisea cinematográfica de 04:20 min y zoom directo a la galaxia espiral de 44 mundos.',
    bioTitle: 'Arquitectura Biográfica · São Paulo -> Barcelona',
    bioParagraph1:
      'BELENTANI (Pedro Belentani, 1995) es artista, compositor, productor y tecnólogo creativo afincado en Barcelona con raíces en São Paulo. Desde belentani.es (Omega Core / Dimensión Zion) y github.com/belentani7 (ia-creativa-lab, Manos Abiertas, Secure-T, LinguaForge, Belentani CV Studio), cruza IA aplicada, WebGL y música electrónica.',
    bioParagraph2:
      'Junto al productor brasileño Hey Duck / Duck Studios (JUDAS, La Deuda) fusiona dark pop, R&B alternativo y funk carioca. En "Judas Era", Judas no es literal sino una máscara escénica de quiebre, deseo y duda que convierte la tensión en soberanía.',
    keyQuote: '«Quédate con el metal. La llave era símbolo; mi voz nadie me la puede arrebatar.»',
    portalHint:
      'Haz clic directamente sobre los 5 diamantes IOR 2.417 en la escena 3D o pulsa cada arquetipo inferior para desbloquear la Ascensión Dorada.',
    ascendedText: 'ASCENSIÓN DORADA ACTIVA · 5/5 ARQUETIPOS SINCRONIZADOS',
    phasesTitle: 'Las 5 Fases de Judas',
    sonicTitle: 'Laboratorio Sonoro 432 Hz & 76 BPM',
    galaxiesTitle: 'Matriz de las 50 Galaxias (5 Firmas × 10 Estaciones)',
    terminalTitle: 'Terminal char+ & Archivo IA',
  },
  en: {
    eyebrow: 'THE JUDAS EXPERIENCE · BELENTANI.ES · OMEGA CORE',
    heroLead:
      'Audiovisual decompression chamber beginning in pitch black and silence, diving via a 04:20 cinematic zoom straight through the 44-node spiral galaxy.',
    bioTitle: 'Biographical Architecture · São Paulo -> Barcelona',
    bioParagraph1:
      'BELENTANI (Pedro Belentani, 1995) is a Barcelona-based recording artist, songwriter, and creative technologist born in São Paulo. Through belentani.es (Omega Core / Dimension Zion) and github.com/belentani7 (ia-creativa-lab, Manos Abiertas, Secure-T, LinguaForge), he merges applied AI, Three.js shaders, and emotional sci-fi music.',
    bioParagraph2:
      'Working alongside Brazilian producer Hey Duck / Duck Studios (JUDAS, La Deuda), he blends dark pop, alternative R&B, and industrial percussion. In Judas Era, "Judas" acts as a dramatic threshold of rupture and creative transformation.',
    keyQuote: '"Keep the metal. The key was symbolic; nobody can steal my voice."',
    portalHint:
      'Click any of the 5 refractive diamonds (IOR 2.417) directly inside the 3D viewport or below to unlock Ascended Gold mode.',
    ascendedText: 'ASCENDED GOLD ACTIVE · 5/5 ARCHETYPES SYNCHRONIZED',
    phasesTitle: 'The 5 Phases of Judas',
    sonicTitle: '432 Hz & 76 BPM Sonic Lab',
    galaxiesTitle: '50 Galaxies Matrix (5 Signatures × 10 Stations)',
    terminalTitle: 'Terminal char+ & AI Lore Kernel',
  },
  ca: {
    eyebrow: 'THE JUDAS EXPERIENCE · BELENTANI.ES · OMEGA CORE',
    heroLead:
      'Cambra de descompressió audiovisual amb inici en negre i silenci absoluts, seguida d’un zoom cinematogràfic de 04:20 min cap a la galàxia espiral de 44 mons.',
    bioTitle: 'Arquitectura Biogràfica · São Paulo -> Barcelona',
    bioParagraph1:
      'BELENTANI (Pedro Belentani, 1995) és artista, compositor i tecnòleg creatiu establert a Barcelona amb arrels a São Paulo. Des de belentani.es (Omega Core / Dimensió Zion) i github.com/belentani7 (ia-creativa-lab, Manos Abiertas, Secure-T, LinguaForge), uneix IA aplicada, Three.js i música electrònica.',
    bioParagraph2:
      'Amb el productor brasiler Hey Duck / Duck Studios (JUDAS, La Deuda) fusiona dark pop, R&B alternatiu i funk carioca. A Judas Era, «Judas» funciona com una màscara dramàtica de ruptura i transformació.',
    keyQuote: '«Queda’t el metall. La clau era símbol; la meva veu ningú no me la pot arrabassar.»',
    portalHint:
      'Fes clic directament sobre els 5 diamants IOR 2.417 a l’espai 3D o a sota per desbloquejar l’Ascensió Daurada.',
    ascendedText: 'ASCENSIÓ DAURADA ACTIVA · 5/5 ARQUETIPS SINCRONITZATS',
    phasesTitle: 'Les 5 Fases de Judas',
    sonicTitle: 'Laboratori Sonor 432 Hz & 76 BPM',
    galaxiesTitle: 'Matriu de les 50 Galàxies (5 Signatures × 10 Estacions)',
    terminalTitle: 'Terminal char+ & Arxiu IA',
  },
};

