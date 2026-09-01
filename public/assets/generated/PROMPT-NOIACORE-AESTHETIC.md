# NOIACORE Visual Identity — Generative Prompt

## Core Aesthetic (900 words)

**NOIACORE** exists in the liminal space between abandoned industrial architecture and cosmic void. Every frame is a collision of the terrestrial and the interstellar — concrete monoliths floating in deep space, brutalist structures eroded by acidic rain from alien atmospheres, corridors of reinforced cement that stretch into event horizons.

**MATERIALS**: Cold-rolled steel with patina of oxidized copper and burnt titanium. Raw concrete — not polished, but scarred. The kind of concrete that has survived nuclear winters and orbital bombardments. Surfaces are wet, reflecting cold light from sources that shouldn't exist — bioluminescent fungi growing in the cracks of load-bearing walls, plasma conduits running through ventilation shafts, the pale glow of distant supernovae bleeding through shattered viewport glass. Water is never clean — it's black, viscous, carrying the memory of dissolved metals and forgotten algorithms. It pools in the joints of architecture, drips from exposed rebar, forms perfect mirrors on horizontal surfaces that reflect realities that don't match the room.

**LIGHT**: There is no warm light in NOIACORE. Every photon is cold — clinical white, surgical blue, radioactive green. Light sources are hidden, indirect, emerging from behind walls and beneath floors. Volumetric fog catches beams and scatters them into visible cones. The primary illumination is always from above and slightly behind — creating long shadows that stretch across floors like reaching hands. Secondary lights pulse rhythmically, suggesting machinery that breathes. Red emergency lighting exists only as accent — never primary, always warning. It bleeds through door frames, outlines escape routes that lead nowhere, highlights the edges of objects like a bloodstain on blueprints.

**ARCHITECTURE**: Brutalist geometry dominates — massive rectangular volumes, impossible cantilevers, staircases that descend into darkness or ascend into void. The scale is wrong — doorways are too tall, corridors too wide, ceilings lost in shadow 40 meters up. Everything suggests a civilization that built for beings larger than human, or for humans who had already begun to transcend their bodies. Surfaces are textured with micro-detail: rivets, welds, circuit traces embedded in concrete, data cables running like veins beneath translucent floor panels. Some walls are cracked, revealing the void of space behind them — the structure exists simultaneously inside and outside, in atmosphere and vacuum.

**ATMOSPHERE**: The air is heavy, visible. Particulate matter floats in light beams — dust, ash, ice crystals sublimating from cryogenic leaks. There's always a sense of aftermath — something catastrophic happened here, or is about to. Machinery is present but dormant, or operating autonomously without human oversight. Screens flicker with data streams in languages that mix Cyrillic, kanji, and mathematical notation. The silence is not empty — it hums with sub-bass frequencies, the resonance of massive structures under stress, the whisper of recycled air moving through ducts that span kilometers.

**HUMAN ELEMENT**: When figures appear, they are silhouettes against light, or reflected in wet surfaces, or visible through layers of glass and fog. They wear utilitarian garments — technical fabrics, sealed seams, integrated displays on forearms. Their faces are rarely visible — obscured by environmental masks, holographic visors, or simply turned away. They move with purpose through spaces that seem designed to resist human habitation. They are not explorers — they are inhabitants, maintaining systems that predate them by centuries.

**COLOR PALETTE**:
- Primary: Concrete gray (#2a2a2e), void black (#0a0a0c), surgical white (#e8e8ec)
- Secondary: Oxidized copper (#4a6b5a), cold steel blue (#3a4a5a), deep navy (#1a2030)
- Accent: Radioactive green (#22c55e at 30% opacity), plasma blue (#3b82f6), warning amber (#eab308)
- Highlight: Blood red (#ff2d2d) — used sparingly, only for critical information and danger

**COMPOSITION RULES**:
1. Rule of thirds with primary subject in lower third — sky/void dominates upper two-thirds
2. Leading lines from architecture guide eye toward vanishing points in deep space
3. Atmospheric perspective: foreground sharp, midground hazy, background dissolving into starfields
4. Asymmetrical balance: massive structures on one side, tiny human figure on the other
5. Frame within frame: doorways, viewports, and corridors create nested compositions

**MOOD**: Contemplative isolation. Not loneliness — chosen solitude in spaces designed for focus. The architecture demands attention, rewards observation, punishes haste. Every surface tells a story of use and endurance. This is not a place of fear — it's a place of work, of observation, of quiet mastery over systems too complex to fully comprehend.

---

## Image Generation Prompts (Variations)

### 1. HERO — Cosmic Brutalist Facade
```
A massive brutalist concrete structure floating in deep space, scarred grey cement walls 200 meters tall with deep vertical grooves, oxidized copper panels integrated into the facade, the structure casting long shadows from a distant cold blue star, volumetric fog venting from industrial exhaust ports, tiny human figure visible at the base for scale, background is the Milky Way galaxy with nebula clouds in deep navy and surgical white, ice crystals floating in zero gravity catching cold light, cinematic composition, ultra detailed, 8k resolution, moody atmosphere, photorealistic, dark sci-fi aesthetic
```

### 2. CORRIDOR — Infinite Industrial Passage
```
Endless brutalist corridor with raw concrete walls and exposed steel rebar, floor is wet black water reflecting cold white LED strips running along the ceiling 30 meters above, atmospheric fog fills the passage, red emergency lighting bleeds through a distant doorway, volumetric light beams cut through particulate matter, cables and conduits run along the walls like veins, the corridor stretches to a vanishing point that dissolves into starfield visible through a massive viewport, abandoned industrial machinery lines the walls, cinematic depth of field, ultra detailed, 8k, dark atmosphere
```

### 3. CONTROL ROOM — Neural Operations Center
```
Vast circular control room with curved concrete walls rising into darkness, multiple holographic displays projecting data streams in cyan and green, a central console of brushed steel with embedded touchscreens, operator figure silhouetted against the main display, overhead lighting creates dramatic shadows, floor is polished black stone reflecting the holographic light, walls have embedded circuit traces that pulse with faint blue glow, viewports in the ceiling show deep space with distant galaxies, cables descend from above like neural pathways, cinematic lighting, ultra detailed, 8k resolution, industrial sci-fi
```

### 4. LABORATORY — Biomechanical Research Bay
```
Industrial laboratory with concrete walls and steel workstations, glass containment units hold glowing green bioluminescent specimens, robotic arms extend from ceiling mounted rails, workstations have multiple monitors showing DNA sequences and molecular models, floor is grating over a sublevel where black water pools, cold white surgical lighting from above, some equipment shows signs of heavy use with scorch marks and oxidized metal, a researcher in technical garments examines a holographic projection, atmospheric haze from coolant systems, ultra detailed, 8k, dark clinical aesthetic
```

### 5. OBSERVATION DECK — Cosmic Vista
```
Massive observation deck with floor-to-ceiling viewports made of thick reinforced glass, the view shows a planet's atmosphere from orbit with swirling storm clouds in deep navy and grey, the deck interior is brutalist concrete with steel railings, a single figure stands at the viewport silhouetted against the planetary light, overhead industrial lighting is dimmed, control panels along the walls glow with amber and green indicators, the floor is dark polished stone, atmospheric dust particles float in the light beams, the scale is immense suggesting this is a space station or orbital platform, cinematic composition, ultra detailed, 8k
```

### 6. ARCHIVE — Data Crypt
```
Towering archive room with concrete pillars and steel shelving units reaching 20 meters high, thousands of glowing data storage units emit cold blue light, a central aisle leads to a terminal station with holographic interface, floor is wet concrete with shallow black water reflecting the blue glow, atmospheric fog drifts between the shelves, overhead lighting is minimal creating deep shadows, cables run along the ceiling connecting the storage units to central processors, the room suggests centuries of accumulated knowledge, cinematic lighting, ultra detailed, 8k, dark knowledge repository aesthetic
```

---

## Technical Specs for Generation

**API**: Pollinations.ai (free, no auth)
**Endpoint**: `https://image.pollinations.ai/prompt/{encoded_prompt}`
**Parameters**: 
- Model: flux
- Width: 1920
- Height: 1080
- Seed: random
- Enhance: true
- Nologo: true

**Output Format**: JPG
**Naming**: `noiacore-{scene}-{variant}.jpg`
