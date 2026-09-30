# Fundo "ordem-alternauta" — composição própria: um Radiante genérico de costas,
# em Shadesmar (céu de nuvens correndo pro sol distante, mar de contas), a mão
# erguida soltando fitas de luz que viram cristais (Transformação), e um espreno
# de tinta anguloso ao lado. Formas no tom do pergaminho, luz mais clara em volta.
import math, random, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ferramentas import rasterizar, webp
random.seed(21)
W, H = 960, 2000
BASE = '#d9cdb8'    # tom mais escuro permitido = o pergaminho
FRIO = '#cbcfd0'    # azul-acinzentado com a MESMA luminância do pergaminho
LUZ = '#fbfaf5'
LUZ_FRIA = '#eef3f5'
IRIS = '#ece6f1'    # brilho de óleo do espreno de tinta, bem apagado
SOLX, SOLY = 600, 430


def pts(lista):
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in lista) + ' Z'


P = []
A = P.append
A(f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>html,body{{margin:0}}</style>
<defs>
 <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#e3e3dc"/><stop offset="0.6" stop-color="#e9e8e2"/><stop offset="0.68" stop-color="#e2dfd6"/><stop offset="1" stop-color="#dfd8ca"/>
 </linearGradient>
 <radialGradient id="sol" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="{LUZ}"/><stop offset="0.25" stop-color="{LUZ}" stop-opacity="0.9"/><stop offset="1" stop-color="{LUZ}" stop-opacity="0"/>
 </radialGradient>
 <radialGradient id="halo" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="{LUZ}"/><stop offset="1" stop-color="{LUZ}" stop-opacity="0"/>
 </radialGradient>
 <filter id="nuvem" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="5" seed="4"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.968  0 0 0 0 0.965  1.8 0 0 0 -0.7"/>
 </filter>
 <filter id="grao" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="8"/>
  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.98  0.9 0 0 0 -0.38"/>
 </filter>
 <filter id="pincel" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="10" result="d"/>
  <feGaussianBlur in="d" stdDeviation="1.4"/>
 </filter>
 <filter id="rastro" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="3" seed="6" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="40" result="d"/>
  <feGaussianBlur in="d" stdDeviation="6"/>
 </filter>
 <filter id="borrar"><feGaussianBlur stdDeviation="7"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#ceu)"/>
<rect width="{W}" height="1400" filter="url(#nuvem)"/>
''')

# nuvens de Shadesmar correndo pro sol distante: cunhas longas que convergem nele
A('<g filter="url(#rastro)">')
for i in range(15):
    ang = -math.pi + (i + random.uniform(-0.3, 0.3)) * (2 * math.pi / 15)
    if math.sin(ang) > 0.55:     # nada saindo pra baixo, onde fica o mar
        continue
    comp = random.uniform(900, 1500)
    larg = random.uniform(0.05, 0.1)
    x1, y1 = SOLX + comp * math.cos(ang - larg), SOLY + comp * math.sin(ang - larg)
    x2, y2 = SOLX + comp * math.cos(ang + larg), SOLY + comp * math.sin(ang + larg)
    xi, yi = SOLX + 70 * math.cos(ang), SOLY + 70 * math.sin(ang)
    A(f'<path d="M{xi:.0f},{yi:.0f} L{x1:.0f},{y1:.0f} L{x2:.0f},{y2:.0f} Z" fill="{FRIO}" opacity="0.55"/>')
A('</g>')
A(f'<circle cx="{SOLX}" cy="{SOLY}" r="170" fill="url(#sol)"/>')
A(f'<circle cx="{SOLX}" cy="{SOLY}" r="26" fill="{LUZ}"/>')

# mar de contas: em perspectiva, pequenas no horizonte e grandes embaixo
HOR = 1360
A(f'<rect x="0" y="{HOR}" width="{W}" height="{H - HOR}" fill="#e4e1d8"/>')
A('<g filter="url(#pincel)">')
y = HOR + 4
while y < H + 30:
    t = (y - HOR) / (H - HOR)
    r = 3 + 26 * t ** 1.4
    x = random.uniform(-r, r)
    while x < W + r:
        yy = y + random.uniform(-r * 0.3, r * 0.3)
        A(f'<circle cx="{x:.1f}" cy="{yy:.1f}" r="{r:.1f}" fill="{random.choice([FRIO, BASE, '#d6d1c6'])}" opacity="{0.55 + 0.35 * (1 - t):.2f}"/>')
        if r > 6:
            A(f'<circle cx="{x - r * 0.35:.1f}" cy="{yy - r * 0.35:.1f}" r="{r * 0.28:.1f}" fill="{LUZ}" opacity="0.45"/>')
        x += r * random.uniform(2.05, 2.4)
    y += r * 1.55 + 2
A('</g>')

# halo de luz atrás do Radiante (é o que recorta a silhueta)
A(f'<ellipse cx="420" cy="1330" rx="330" ry="560" fill="url(#halo)"/>')
# anéis próprios da composição (não é o glifo da ordem): losangos concêntricos
A(f'<g fill="none" stroke="{LUZ}" stroke-width="4" opacity="0.9" filter="url(#pincel)">')
for k, s in enumerate((250, 330, 410)):
    A(f'<path d="{pts([(430, 1150 - s * 1.25), (430 + s, 1150), (430, 1150 + s * 1.25), (430 - s, 1150)])}"/>')
A('</g>')

# plataforma de pedra flutuante
A(f'<g filter="url(#pincel)"><path d="{pts([(280, 1742), (610, 1738), (575, 1790), (500, 1840), (455, 1905), (400, 1830), (320, 1795)])}" fill="{BASE}"/>'
  f'<path d="M285,1740 L605,1736" stroke="{LUZ}" stroke-width="5"/></g>')

# o Radiante, de costas, casaco longo batido pelo vento, braço esquerdo erguido
corpo = ('M442,1146 C468,1148 496,1160 512,1178 C524,1215 516,1275 506,1330 '
         'C528,1420 580,1515 690,1655 C650,1650 612,1668 578,1694 C530,1712 476,1722 432,1726 '
         'C402,1728 378,1726 356,1722 C370,1620 382,1520 392,1420 C398,1360 396,1300 392,1252 '
         'C388,1226 390,1198 398,1180 C410,1160 426,1148 442,1146 Z')
# manto curto sobre os ombros, levantado pelo vento pra direita
manto = ('M396,1176 C420,1158 470,1154 512,1174 C540,1200 576,1240 610,1300 '
         'C570,1296 540,1290 512,1296 C480,1290 440,1292 398,1290 C392,1250 390,1210 396,1176 Z')
braco = ('M392,1186 C372,1150 352,1105 340,1068 C330,1035 318,998 304,972 L322,962 '
         'C336,990 348,1020 358,1046 C372,1068 392,1106 410,1150 C414,1162 414,1174 410,1184 Z')
manga = 'M342,1060 C352,1098 372,1140 398,1172 C384,1150 364,1112 356,1070 Z'
A(f'<g filter="url(#pincel)">'
  f'<path d="{corpo}" fill="{BASE}"/>'
  f'<path d="{manto}" fill="{BASE}"/>'
  f'<path d="{braco}" fill="{BASE}"/>'
  f'<path d="{manga}" fill="{BASE}"/>'
  f'<ellipse cx="446" cy="1104" rx="32" ry="40" fill="{BASE}"/>'
  f'<ellipse cx="452" cy="1060" rx="19" ry="16" fill="{BASE}"/>'
  f'<path d="M430,1134 L458,1134 L462,1160 L426,1160 Z" fill="{BASE}"/>'
  f'<ellipse cx="312" cy="962" rx="15" ry="14" fill="{BASE}"/>'
  f'<path d="M420,1758 L426,1726 L446,1726 L448,1758 Z M466,1758 L470,1722 L490,1720 L494,1758 Z" fill="{BASE}"/>'
  # só dois toques de luz: a borda do manto e uma dobra do casaco
  f'<path d="M398,1290 C440,1292 480,1290 512,1296 C540,1290 570,1296 610,1300" stroke="{LUZ}" stroke-width="5" fill="none" opacity="0.85"/>'
  f'<path d="M478,1320 C505,1440 548,1560 620,1672" stroke="{LUZ}" stroke-width="4" fill="none" opacity="0.6"/>'
  '</g>')

# luz de borda vinda da mão: realce borrado no lado esquerdo da figura (volume, à maneira de pintura)
A(f'<clipPath id="silhueta"><path d="{corpo}"/><path d="{manto}"/><path d="{braco}"/>'
  f'<ellipse cx="446" cy="1104" rx="32" ry="40"/><ellipse cx="452" cy="1060" rx="19" ry="16"/></clipPath>')
A(f'<linearGradient id="luzlateral" gradientUnits="userSpaceOnUse" x1="300" y1="1000" x2="470" y2="1150">'
  f'<stop offset="0" stop-color="{LUZ}" stop-opacity="0.75"/><stop offset="1" stop-color="{LUZ}" stop-opacity="0"/></linearGradient>')
A(f'<g clip-path="url(#silhueta)"><rect x="250" y="900" width="500" height="900" fill="url(#luzlateral)"/></g>')

# luz na mão erguida + fitas que sobem e viram cristais (Transformação)
A(f'<circle cx="310" cy="955" r="90" fill="url(#halo)"/>')
A(f'<g fill="none" stroke="{LUZ}" stroke-linecap="round" filter="url(#pincel)">')
fitas = ['M310,955 C250,900 300,820 240,760 C190,710 220,640 170,590',
         'M310,955 C360,880 300,800 350,730 C390,675 360,610 400,560',
         'M310,955 C260,930 200,930 160,880 C125,835 90,840 60,800']
for d in fitas:
    A(f'<path d="{d}" stroke-width="7" opacity="0.95"/>')
A('</g>')
for (cx, cy, s) in [(170, 590, 26), (400, 560, 22), (60, 800, 20), (215, 520, 14), (440, 500, 12), (120, 760, 12)]:
    cristal = pts([(cx, cy - s * 1.6), (cx + s * 0.6, cy - s * 0.3), (cx + s * 0.35, cy + s), (cx - s * 0.4, cy + s * 0.9), (cx - s * 0.6, cy - s * 0.4)])
    A(f'<g filter="url(#pincel)"><path d="{cristal}" fill="{FRIO}"/>'
      f'<path d="M{cx},{cy - s * 1.6} L{cx - s * 0.05},{cy + s * 0.95}" stroke="{LUZ}" stroke-width="3"/></g>')

# espreno de tinta: esguio e anguloso — gola alta pontuda, casaco rígido de abas
# cortantes — de pé numa lasca de pedra à direita, um pouco menor que o Radiante
ex, ey = 700, 1120      # ey = cintura
esp = [
    # cabeça: losango alongado
    pts([(ex, ey - 190), (ex + 13, ey - 168), (ex + 8, ey - 142), (ex, ey - 134), (ex - 8, ey - 142), (ex - 13, ey - 168)]),
    # gola alta em duas pontas + tronco em cunha
    pts([(ex - 34, ey - 150), (ex - 20, ey - 128), (ex + 20, ey - 128), (ex + 34, ey - 150), (ex + 30, ey - 118),
         (ex + 26, ey - 40), (ex + 12, ey), (ex - 12, ey), (ex - 26, ey - 40), (ex - 30, ey - 118)]),
    # casaco: abas em lascas até os pés
    pts([(ex - 14, ey - 6), (ex + 14, ey - 6), (ex + 40, ey + 70), (ex + 62, ey + 132), (ex + 30, ey + 112),
         (ex + 14, ey + 140), (ex, ey + 104), (ex - 16, ey + 140), (ex - 30, ey + 110), (ex - 56, ey + 128), (ex - 36, ey + 66)]),
    # braços retos e angulosos, colados ao corpo
    pts([(ex + 28, ey - 118), (ex + 42, ey - 70), (ex + 38, ey - 20), (ex + 30, ey - 26), (ex + 30, ey - 70)]),
    pts([(ex - 28, ey - 118), (ex - 42, ey - 70), (ex - 38, ey - 20), (ex - 30, ey - 26), (ex - 30, ey - 70)]),
]
A(f'<ellipse cx="{ex}" cy="{ey - 20}" rx="130" ry="230" fill="url(#halo)" opacity="0.95"/>')
A('<g filter="url(#pincel)">')
for d in esp:
    A(f'<path d="{d}" fill="{BASE}"/>')
# brilho de óleo iridescente: só filetes finos nas arestas
A(f'<path d="M{ex - 30},{ey - 118} L{ex - 26},{ey - 40} L{ex - 12},{ey} M{ex - 36},{ey + 66} L{ex - 56},{ey + 128} '
  f'M{ex - 13},{ey - 168} L{ex},{ey - 190}" stroke="{IRIS}" stroke-width="3.5" fill="none"/>'
  f'<path d="M{ex + 30},{ey - 118} L{ex + 26},{ey - 40} M{ex + 40},{ey + 70} L{ex + 62},{ey + 132}" stroke="{LUZ_FRIA}" stroke-width="3" fill="none"/>')
A(f'<path d="{pts([(ex - 80, ey + 150), (ex + 84, ey + 146), (ex + 52, ey + 186), (ex + 12, ey + 236), (ex - 44, ey + 184)])}" fill="{BASE}"/>')
A(f'<path d="M{ex - 76},{ey + 148} L{ex + 80},{ey + 144}" stroke="{LUZ}" stroke-width="4"/>')
A('</g>')

A(f'<rect width="{W}" height="{H}" filter="url(#grao)" opacity="0.5"/>')
A('</svg>')

aqui = os.path.dirname(os.path.abspath(__file__))
svg = os.path.join(aqui, 'alternauta.svg')
png = os.path.join(aqui, 'alternauta.png')
open(svg, 'w', encoding='utf-8').write('\n'.join(P))
rasterizar(svg, png)
if len(sys.argv) > 1:
    print(webp(png, sys.argv[1]))
