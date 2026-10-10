# Placa de cuidado atrás do AvisoCuidado — composição própria, no processo dos fundos
# (erudito.py): traço de tinta irregular, aquarela e realce deslocado (relevo).
# Só o contorno do triângulo e o "!" — o César pediu simples (10/Out/2026).
# Fundo transparente: a cor da caixa (--cor-cuidado tingido) aparece em volta.
# Gerar: python .claude/arte/placa-cuidado.py src/assets/aviso-placa.webp
import os, sys, io, subprocess
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ferramentas import CHROME

W, H = 440, 400
CLARO = '#f4b860'   # topo do degradê
MEDIO = '#e0862a'   # parente do --cor-cuidado
ESCURO = '#a5530e'  # base, o tom mais fundo
LUZ = '#fff3df'     # realce do relevo
SOMBRA = '#7a3c08'

TRI = 'M220 30 L410 360 H30 Z'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>html,body{{margin:0;background:transparent}}</style>
<defs>
 <linearGradient id="tom" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="{CLARO}"/><stop offset="0.5" stop-color="{MEDIO}"/><stop offset="1" stop-color="{ESCURO}"/>
 </linearGradient>
 <filter id="tinta" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="5"/>
 </filter>
 <filter id="aquarela" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="9" result="r"/>
  <feDisplacementMap in="SourceGraphic" in2="r" scale="9" result="d"/>
  <feGaussianBlur in="d" stdDeviation="1.4"/>
 </filter>
</defs>
<g fill="none" stroke-linejoin="round" stroke-linecap="round">
 <!-- contorno: sombra deslocada, corpo em degradê, realce por cima (relevo) -->
 <path d="{TRI}" stroke="{SOMBRA}" stroke-width="30" opacity="0.3" transform="translate(5 6)" filter="url(#aquarela)"/>
 <path d="{TRI}" stroke="url(#tom)" stroke-width="30" filter="url(#aquarela)"/>
 <path d="{TRI}" stroke="{LUZ}" stroke-width="4" opacity="0.75" transform="translate(-4 -4)" filter="url(#tinta)"/>
</g>
<!-- o "!": haste que afina + ponto, nos mesmos tons e relevo -->
<g filter="url(#aquarela)">
 <path d="M202 120 H238 L227 262 H213 Z" fill="{SOMBRA}" opacity="0.3" transform="translate(4 5)"/>
 <circle cx="224" cy="310" r="21" fill="{SOMBRA}" opacity="0.3"/>
 <path d="M202 120 H238 L227 262 H213 Z" fill="url(#tom)"/>
 <circle cx="220" cy="305" r="21" fill="{ESCURO}"/>
</g>
<g fill="none" stroke="{LUZ}" stroke-linecap="round" opacity="0.75" filter="url(#tinta)">
 <path d="M205 124 L214 250" stroke-width="3.5"/>
 <path d="M206 298 A15 15 0 0 1 222 290" stroke-width="3.5"/>
</g>
</svg>'''

aqui = os.path.dirname(os.path.abspath(__file__))
caminho_svg = os.path.join(aqui, 'placa-cuidado.svg')
png = os.path.join(aqui, 'placa-cuidado.png')
open(caminho_svg, 'w', encoding='utf-8').write(svg)
tmp = os.path.join(os.environ.get('TEMP', '.'), 'cosmarcos-arte-perfil')
subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', f'--user-data-dir={tmp}',
                f'--screenshot={png}', f'--window-size={W},{H}', '--default-background-color=00000000',
                'file:///' + caminho_svg.replace(os.sep, '/')], check=True, capture_output=True, timeout=120)
if len(sys.argv) > 1:
    im = Image.open(png).convert('RGBA')
    b = io.BytesIO(); im.save(b, 'WEBP', quality=82, method=6)
    open(sys.argv[1], 'wb').write(b.getvalue())
    print(im.size, b.tell(), 'bytes')
