# BELENTANI ECOSYSTEM

This repository is one surface of the Belentani ecosystem.

## Canonical layers

- **BELENTANI** — identity, public presence and creative technology.
- **JUDAS** — narrative/music/immersive experience layer.
- **OMEGA** — system/template/experimental integration layer.
- **STUDIO** — production tooling and reusable infrastructure.
- **LABS** — experiments, prototypes and research.

## Repository relationship

```text
BELENTANI
├── identity / web / portfolio
├── creative technology
├── music / audio / visual
│
├── JUDAS
│   ├── experience
│   ├── era
│   ├── monograph
│   └── mobile / experimental surfaces
│
├── OMEGA
│   ├── templates
│   ├── master builds
│   └── experimental variants
│
└── STUDIO / LABS
    ├── AI
    ├── automation
    ├── agents
    ├── tooling
    └── research
```

## Integration rule

Do not force separate projects into one codebase merely for cosmetic unification. Unification happens through **shared conventions, documentation, metadata and interfaces**.

Each project should answer:

1. What layer does this belong to?
2. What does it consume?
3. What does it produce?
4. Which other Belentani/Judas/Omega systems can consume that output?
5. Is it an idea, lab, prototype, beta, production system or archive?

## Naming

Use `BELENTANI` for the umbrella ecosystem, `JUDAS` for the artistic/narrative universe and `OMEGA` for system-level variants/integration. Existing repository names are preserved for history.

## Safety

This file does not expose credentials, private configuration, or deployment secrets. It is structural documentation only.
