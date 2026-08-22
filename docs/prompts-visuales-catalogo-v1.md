# Prompts visuales — catálogo v1

## Modo de generación

- Herramienta: ImageGen integrado de Codex/OpenAI.
- Estrategia: una generación por asset, con inspección visual y reintento puntual
  ante errores visibles.
- Referencias de estilo: los assets previamente aprobados de `Pecho + bíceps`.
- El selector del modo integrado no expone el nombre/configuración del modelo;
  por eso este documento no atribuye una variante técnica no verificable.

## Prompt base de ejercicio

```text
Use case: scientific-educational
Asset type: exercise movement plate for Entrena Casa
Input images: Image 1 is a style reference only; do not edit or reproduce its exercise.
Scene/backdrop: warm ivory #fbf8f3, clean and empty.
Subject: the same adult male anatomical figure twice, full body and fully visible.
LEFT: safe starting position. RIGHT: safe finishing position.
Style/medium: precise grayscale medical atlas illustration, graphite muscle fibers,
charcoal shorts, charcoal bench when needed and black hex dumbbells.
Composition/framing: landscape 3:2, movement reads left to right, same camera,
scale and equipment, generous center gap and margins.
Color palette: primary muscles in muted terracotta #b55d49; secondary muscles in
lighter muted salmon; all other anatomy grayscale.
Constraints: biomechanically plausible, neutral controlled spine, natural joint
angles, clear hand contact, hands/feet/equipment complete.
Avoid: barbell, rack, cable, machine, spotter, extra limbs, merged equipment,
cropping, text, arrows, labels, logos, watermark, UI, gym setting, glossy 3D.
```

## Variables aplicadas

| Asset | Movimiento | Músculos resaltados |
| --- | --- | --- |
| `seated-alternating-dumbbell-curl-v2.png` | Sentado, ambos brazos abajo → un brazo flexionado y supinado; ambas mancuernas visibles | Bíceps; braquial y braquiorradial secundarios |
| `incline-dumbbell-curl.png` | Banco 45–60°, brazos extendidos → curl bilateral | Bíceps; braquial secundario |
| `concentration-curl.png` | Codo contra cara interna del muslo, extensión → flexión | Bíceps; braquial secundario |
| `one-arm-dumbbell-row.png` | Mano y rodilla apoyadas, peso abajo → remo hacia cadera | Dorsal y romboides; bíceps y deltoide posterior secundarios |
| `chest-supported-dumbbell-row.png` | Pecho en banco inclinado, brazos abajo → remada a costillas | Espalda media y dorsal; bíceps secundario |
| `lying-dumbbell-triceps-extension.png` | Mancuernas sobre pecho → flexión controlada junto a la cabeza | Tríceps |
| `seated-overhead-dumbbell-triceps-extension.png` | Mancuerna detrás de cabeza → extensión vertical | Tríceps, énfasis porción larga |
| `bench-supported-triceps-kickback.png` | Codo fijo flexionado → extensión atrás | Tríceps; deltoide posterior secundario |
| `seated-dumbbell-shoulder-press.png` | Mancuernas en hombros → press vertical | Deltoide anterior/medio; tríceps secundario |
| `seated-dumbbell-lateral-raise.png` | Brazos abajo → elevación hasta hombros | Deltoide medio |
| `incline-bench-reverse-fly.png` | Pecho apoyado, brazos abajo → apertura posterior | Deltoide posterior; romboides/trapecio medio secundarios |
| `dumbbell-scaption.png` | Brazos abajo → elevación 30° por delante, pulgares arriba | Deltoide medio/anterior; serrato secundario |
| `suitcase-carry.png` | Postura de inicio → paso controlado con carga unilateral | Oblicuos/core; antebrazo/glúteos/trapecio secundarios |
| `incline-plank-dumbbell-drag.png` | Plancha sobre banco, peso de un lado → arrastre al otro | Oblicuos/transverso; serrato/hombro secundarios |
| `weighted-bench-crunch.png` | Supino con peso al pecho → crunch corto | Recto abdominal; oblicuos secundarios |
| `dumbbell-dead-bug.png` | Tabletop con peso estable → extensión de una pierna | Core anti-extensión; serrato secundario |

## Prompt base de mapa muscular

```text
Vertical 2:3, 1024x1536. Show the same anatomical male figure front and back,
full body, neutral standing position, warm ivory background. Grayscale medical
atlas style, charcoal shorts. Highlight only the requested section muscles in
muted terracotta and lighter salmon. No weights, bench, movement sequence, text,
labels, arrows, logos, UI or decorative background.
```

Se aplicó a `back-triceps-muscle-map.png`, `shoulders-muscle-map.png` y
`abs-muscle-map.png`; `chest-biceps-muscle-map.png` ya existía y estaba aprobado.

La primera salida quedó archivada en
`design/rejected/exercise-visuals/seated-alternating-dumbbell-curl-v1-rejected.png`
porque ocultaba una mancuerna en la posición final. El cuadro usa exclusivamente
la versión corregida `-v2`.
