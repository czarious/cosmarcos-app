# Fundo "trilha-erudito" — composição própria: engrenagens, anéis de astrolábio,
# pergaminho com glifos inventados e um fabrial com gema. Tudo em SVG à mão.
import math, random, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ferramentas import rasterizar, webp
random.seed(7)
W, H = 960, 2000
BASE = '#d9cdb8'   # corpo das formas = o próprio pergaminho (nunca mais escuro)
LUZ = '#fbf8f1'    # realce
NEVOA = '#f3ede1'


def engrenagem(cx, cy, r, dentes, prof=0.085, aro=0.78, cubo=0.2, raios=6):
    pts = []
    n = dentes * 4
    passo = 2 * math.pi / n
    for i in range(n):
        a = passo * i
        fase = i % 4
        rr = r if fase in (1, 2) else r * (1 - prof)
        # dente trapezoidal: topo mais estreito que a base
        ajuste = {0: -0.18, 1: 0.18, 2: -0.18, 3: 0.18}[fase] * passo
        pts.append((cx + rr * math.cos(a + ajuste), cy + rr * math.sin(a + ajuste)))
    d = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + ' Z'
    ri = r * aro
    furos = ''
    for k in range(raios):
        a0 = 2 * math.pi * k / raios + 0.12
        a1 = 2 * math.pi * (k + 1) / raios - 0.12
        r0 = r * cubo * 1.35
        r1 = ri * 0.92
        p = lambda rad, a: (cx + rad * math.cos(a), cy + rad * math.sin(a))
        x0, y0 = p(r1, a0); x1, y1 = p(r1, a1); x2, y2 = p(r0, a1 + 0.05); x3, y3 = p(r0, a0 - 0.05)
        furos += (f' M{x0:.1f},{y0:.1f} A{r1:.1f},{r1:.1f} 0 0 1 {x1:.1f},{y1:.1f}'
                  f' L{x2:.1f},{y2:.1f} A{r0:.1f},{r0:.1f} 0 0 0 {x3:.1f},{y3:.1f} Z')
    return d + furos


def glifo(cx, cy, s):
    # glifo inventado, simétrico no eixo vertical (à maneira dos glifos de Roshar, sem copiar nenhum)
    segs = [f'M{cx},{cy - s} L{cx},{cy + s}']
    for j in range(random.choice([1, 2, 3])):
        y = cy - s * 0.6 + j * s * 0.55
        w = s * random.uniform(0.35, 0.7)
        t = random.random()
        if t < 0.4:
            segs.append(f'M{cx - w:.1f},{y + s * 0.2:.1f} L{cx},{y:.1f} L{cx + w:.1f},{y + s * 0.2:.1f}')
        elif t < 0.7:
            segs.append(f'M{cx - w:.1f},{y:.1f} Q{cx},{y + s * 0.35:.1f} {cx + w:.1f},{y:.1f}')
        else:
            segs.append(f'M{cx - w:.1f},{y - s * 0.15:.1f} L{cx - w * 0.4:.1f},{y + s * 0.1:.1f} '
                        f'M{cx + w:.1f},{y - s * 0.15:.1f} L{cx + w * 0.4:.1f},{y + s * 0.1:.1f}')
    if random.random() < 0.5:
        segs.append(f'M{cx - s * 0.18:.1f},{cy + s * 0.85:.1f} L{cx},{cy + s * 1.05:.1f} L{cx + s * 0.18:.1f},{cy + s * 0.85:.1f}')
    return ' '.join(segs)


P = []
A = P.append
A(f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>html,body{{margin:0}}</style>
<defs>
 <filter id="nuvem" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0035" numOctaves="5" seed="11"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.975  0 0 0 0 0.955  0 0 0 0 0.915  1.9 0 0 0 -0.72"/>
 </filter>
 <filter id="grao" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3"/>
  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.97  0.9 0 0 0 -0.38"/>
 </filter>
 <filter id="tinta" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="5"/>
 </filter>
 <filter id="aquarela" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="12" result="d"/>
  <feGaussianBlur in="d" stdDeviation="2.2"/>
 </filter>
 <radialGradient id="halo" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="{LUZ}" stop-opacity="1"/><stop offset="1" stop-color="{LUZ}" stop-opacity="0"/>
 </radialGradient>
 <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#e9e1d1"/><stop offset="0.55" stop-color="#e4dbc9"/><stop offset="1" stop-color="#e6ddcc"/>
 </linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#ceu)"/>
<rect width="{W}" height="{H}" filter="url(#nuvem)"/>
''')

# anéis de astrolábio: grandes, cruzam a tela toda -> aparecem como arcos nas margens
A('<g fill="none" stroke-linecap="round" filter="url(#tinta)">')
for (cx, cy, rx, ry, rot, sw) in [(480, 1060, 470, 470, 0, 7), (480, 1060, 445, 150, -28, 5),
                                   (480, 1060, 445, 160, 34, 5), (480, 1060, 150, 445, 8, 4)]:
    A(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({rot} {cx} {cy})" stroke="{BASE}" stroke-width="{sw + 6}"/>')
    A(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({rot} {cx} {cy}) translate(-3 -3)" stroke="{LUZ}" stroke-width="{max(2, sw - 3)}" opacity="0.9"/>')
for i in range(72):
    a = 2 * math.pi * i / 72
    r0 = 470 - (22 if i % 6 == 0 else 11)
    x0, y0 = 480 + r0 * math.cos(a), 1060 + r0 * math.sin(a)
    x1, y1 = 480 + 462 * math.cos(a), 1060 + 462 * math.sin(a)
    A(f'<path d="M{x0:.1f},{y0:.1f} L{x1:.1f},{y1:.1f}" stroke="{BASE}" stroke-width="{5 if i % 6 == 0 else 3}"/>')
A('</g>')

# engrenagens (corpo = pergaminho, contorno de luz)
for (cx, cy, r, dn, rot) in [(830, 560, 300, 26, 4), (150, 1330, 230, 20, 9), (880, 1640, 150, 14, 0)]:
    d = engrenagem(cx, cy, r, dn)
    A(f'<g filter="url(#aquarela)" transform="rotate({rot} {cx} {cy})"><path d="{d}" fill="{BASE}" fill-rule="evenodd"/>'
      f'<path d="{d}" fill="none" stroke="{LUZ}" stroke-width="5" transform="translate(-4 -4)" opacity="0.85"/>'
      f'<circle cx="{cx}" cy="{cy}" r="{r * 0.12:.0f}" fill="none" stroke="{LUZ}" stroke-width="6"/></g>')

# pergaminho desenrolado na margem esquerda, com glifos
px, py, pw, ph = -10, 300, 190, 700
A(f'<g filter="url(#aquarela)"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="{NEVOA}"/>'
  f'<rect x="{px - 12}" y="{py - 34}" width="{pw + 24}" height="46" rx="23" fill="{BASE}"/>'
  f'<rect x="{px - 12}" y="{py + ph - 12}" width="{pw + 24}" height="46" rx="23" fill="{BASE}"/>'
  f'<rect x="{px - 12}" y="{py - 30}" width="{pw + 24}" height="12" rx="6" fill="{LUZ}"/></g>')
A(f'<g fill="none" stroke="{BASE}" stroke-width="6" stroke-linecap="round" filter="url(#tinta)">')
for linha in range(6):
    for col in range(2):
        A(f'<path d="{glifo(40 + col * 80, py + 70 + linha * 108, 34)}"/>')
A('</g>')

# glifos soltos na margem direita, como notas de estudo
A(f'<g fill="none" stroke="{BASE}" stroke-width="5" stroke-linecap="round" filter="url(#tinta)">')
for y in (1000, 1110, 1220):
    A(f'<path d="{glifo(915, y, 32)}"/>')
A('</g>')

# fabrial: gema lapidada presa numa gaiola de metal, com halo de luz
gx, gy = 470, 1780
A(f'<ellipse cx="{gx}" cy="{gy}" rx="260" ry="240" fill="url(#halo)" opacity="0.95"/>')
gema = [(gx, gy - 150), (gx + 70, gy - 80), (gx + 70, gy + 70), (gx, gy + 150), (gx - 70, gy + 70), (gx - 70, gy - 80)]
dg = 'M' + ' L'.join(f'{x},{y}' for x, y in gema) + ' Z'
A(f'<g filter="url(#tinta)"><path d="{dg}" fill="{BASE}"/>'
  f'<path d="M{gx},{gy - 150} L{gx},{gy + 150} M{gx - 70},{gy - 80} L{gx},{gy - 20} L{gx + 70},{gy - 80} '
  f'M{gx - 70},{gy + 70} L{gx},{gy + 20} L{gx + 70},{gy + 70} M{gx},{gy - 20} L{gx},{gy + 20}" stroke="{LUZ}" stroke-width="5" fill="none"/>'
  f'<path d="M{gx - 30},{gy - 110} L{gx - 52},{gy - 70} L{gx - 52},{gy + 10}" stroke="{LUZ}" stroke-width="9" fill="none" stroke-linecap="round"/></g>')
garras = (f'<path d="M{gx - 150},{gy + 40} Q{gx - 150},{gy - 120} {gx - 40},{gy - 185}"/>'
          f'<path d="M{gx + 150},{gy + 40} Q{gx + 150},{gy - 120} {gx + 40},{gy - 185}"/>')
A(f'<g fill="none" stroke="{BASE}" stroke-width="16" stroke-linecap="round" filter="url(#tinta)">{garras}'
  f'<path d="M{gx - 150},{gy + 40} Q{gx - 120},{gy + 190} {gx},{gy + 215} Q{gx + 120},{gy + 190} {gx + 150},{gy + 40}"/>'
  f'<path d="M{gx - 230},{gy + 215} L{gx + 230},{gy + 215}" stroke-width="22"/></g>')
A(f'<g fill="none" stroke="{LUZ}" stroke-width="5" stroke-linecap="round" transform="translate(-5 -5)" filter="url(#tinta)">{garras}</g>')

A(f'<rect width="{W}" height="{H}" filter="url(#grao)" opacity="0.5"/>')
A('</svg>')

aqui = os.path.dirname(os.path.abspath(__file__))
svg = os.path.join(aqui, 'erudito.svg')
png = os.path.join(aqui, 'erudito.png')
open(svg, 'w', encoding='utf-8').write('\n'.join(P))
rasterizar(svg, png)
if len(sys.argv) > 1:
    print(webp(png, sys.argv[1]))
