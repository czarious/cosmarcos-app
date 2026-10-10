# arquivo: icones-abas.py
# Ícones das 10 abas (criação própria, estilo do Guia de Regras: simetria de glifo,
# gemas facetadas, traço único). Gera .claude/arte/icones-abas/<aba>.svg + previa.html
# e tira as capturas da prévia (1x e 2x) com o Chrome oculto, um por vez.
#
# Família: traço 1.75 · ponta e canto redondos · contorno vazado · UMA gema cheia
# (losango, sem traço) por ícone, como a luz tempestuosa presa na pedra.
import os, subprocess, math
from ferramentas import CHROME

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, 'icones-abas')
os.makedirs(PASTA, exist_ok=True)

TRACO = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'


def gema(cx, cy, w, h):
    """Losango cheio — a gema da família."""
    n = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
    return (f'<path d="M{n(cx)} {n(cy-h)}L{n(cx+w)} {n(cy)}L{n(cx)} {n(cy+h)}L{n(cx-w)} {n(cy)}Z" '
            f'fill="currentColor" stroke="none"/>')


def svg(corpo):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
            f'<g {TRACO}>{corpo}</g></svg>\n')


def raios():
    """Radiante: 10 lanças alternando longa/curta em volta de um anel."""
    partes = []
    for i in range(10):
        a = math.radians(i * 36 - 90)
        r0, r1 = 5.2, (11 if i % 2 == 0 else 8.6)
        meio, larg = (r0 + r1) / 2, 1.45
        ca, sa = math.cos(a), math.sin(a)
        pts = [(r0 * ca, r0 * sa), (meio * ca - larg * sa, meio * sa + larg * ca),
               (r1 * ca, r1 * sa), (meio * ca + larg * sa, meio * sa - larg * ca)]
        d = 'M' + 'L'.join(f'{12+x:.2f} {12+y:.2f}' for x, y in pts) + 'Z'
        partes.append(f'<path d="{d}" fill="currentColor" stroke="none"/>')
    return ''.join(partes) + '<circle cx="12" cy="12" r="2.6"/>'


ICONES = {
    # gema lapidada vista de lado: coroa, cintura e pavilhão; o facho central cheio
    'principal': svg(
        '<path d="M8 4.5H16L20.5 9.5L12 20.5L3.5 9.5Z"/>'
        '<path d="M3.5 9.5H20.5"/>'
        '<path d="M8 4.5L10 9.5M16 4.5L14 9.5"/>'
        '<path d="M10.3 9.5H13.7L12 17Z" fill="currentColor" stroke="none"/>'),
    # glifo inventado, simétrico como os rosharanos: haste, dois arcos, gema no meio
    'pericias': svg(
        '<path d="M12 3V9M12 15V21"/>'
        '<path d="M8 4.5C4.2 8.5 4.2 15.5 8 19.5M16 4.5C19.8 8.5 19.8 15.5 16 19.5"/>'
        + gema(12, 12, 2.4, 3.2)),
    # Espada Fractal de pé: lâmina longa com espora, guarda em asa, gema no pomo
    'acoes': svg(
        '<path d="M12 1.4L14.6 4.4V15.4H9.4V10.6L7.8 9L9.4 7.4V4.4Z"/>'
        '<path d="M5.2 13.4Q6.4 17.2 12 17.2Q17.6 17.2 18.8 13.4"/>'
        '<path d="M12 17.2V20.4"/>'
        + gema(12, 21.6, 1.7, 1.9)),
    # fabrial: gema grande presa por duas garras que saem de uma caixa de mecanismo
    'fabriais': svg(
        '<path d="M5.6 16.6H18.4V21H5.6Z"/>'
        '<path d="M8 16.6C6 15.2 5.4 12.6 5.6 10.4C5.8 8.4 6.6 6.8 7.8 5.8'
        'M16 16.6C18 15.2 18.6 12.6 18.4 10.4C18.2 8.4 17.4 6.8 16.2 5.8"/>'
        + gema(12, 9.6, 4, 5.4)),
    # gema rachada: a pedra perdeu a luz — um estado que te afeta; a lasca que caiu é a gema cheia
    'condicoes': svg(
        '<path d="M12 2.6L18.6 9L12 21.4L5.4 9Z"/>'
        '<path d="M15 5.6L11 10.6L14 12.8L11.6 16.8"/>'
        + gema(20, 17.4, 1.5, 2.1)),
    # dez lanças de luz (dez Ordens) em volta de um anel — sem os glifos das Ordens
    'radiante': svg(raios()),
    # bolsa de esferas: boca franzida, cordão amarrado, uma gema na frente
    'inventario': svg(
        '<path d="M9.2 7.6C5.2 10 3.9 14 4.5 17C5.2 20.2 8 21 12 21'
        'C16 21 18.8 20.2 19.5 17C20.1 14 18.8 10 14.8 7.6"/>'
        '<path d="M9.2 7.6L7.4 3.8Q12 5.4 16.6 3.8L14.8 7.6Z"/>'
        '<path d="M14.8 7.6Q17.6 8.6 18.2 11"/>'
        + gema(12, 14.8, 2.4, 3.1)),
    # árvore de talentos: raízes, tronco que se divide duas vezes, um nó-gema em cada ponta
    'talentos': svg(
        '<path d="M12 20V14.6"/>'
        '<path d="M12 18.4C11.6 20 10.4 21 8.6 21.2M12 18.4C12.4 20 13.6 21 15.4 21.2"/>'
        '<path d="M12 14.6C9.6 13.6 7.6 12.2 7 9.8M12 14.6C14.4 13.6 16.4 12.2 17 9.8"/>'
        '<path d="M7 9.8C6.6 8.8 5.6 8 4.6 7.4M7 9.8C7.6 8.8 8.6 8 9.6 7.4"/>'
        '<path d="M17 9.8C16.4 8.8 15.4 8 14.4 7.4M17 9.8C17.6 8.8 18.6 8 19.6 7.4"/>'
        + gema(4.2, 4.6, 1.6, 2.2) + gema(9.8, 4.6, 1.6, 2.2)
        + gema(14.2, 4.6, 1.6, 2.2) + gema(19.8, 4.6, 1.6, 2.2)),
    # vorinesa de havah: saia longa, mão segura coberta pela manga dobrada na cintura, gema no cinto
    'personagem': svg(
        '<circle cx="12" cy="4.6" r="2.4"/>'
        '<path d="M9.8 8.6C10.6 8 13.4 8 14.2 8.6L13.4 13.2C14.2 16 15.8 19 17.6 21H6.4C8.2 19 9.8 16 10.6 13.2Z"/>'
        '<path d="M9.8 8.9L7.6 12.4Q8.2 14.4 10.6 13.4M14.2 8.9L15.8 13.2"/>'
        + gema(12, 13.2, 1.5, 1.8)),
    # telepena: junco com o rubi na ponta de cima, escrevendo uma linha
    'anotacoes': svg(
        '<g transform="translate(-1.2 -0.6) rotate(45 12 12)">'
        '<path d="M10 4.6V15.6L12 20L14 15.6V4.6Z"/>'
        + gema(12, 1.6, 2, 2.4) + '</g>'
        '<path d="M8.6 20.6C10.6 19.2 12.2 21.6 14.2 20.4S18 19.6 20.6 20.6"/>'),
}


# as versões recusadas pelo César (10/Out/2026), só pra prévia lado a lado
ANTIGOS = {
    'fabriais': svg(
        '<circle cx="12" cy="3.4" r="1.6"/>'
        '<path d="M12 5.4C16.4 7.8 18.2 10 18.2 13C18.2 16.6 15.6 19.4 12 21'
        'C8.4 19.4 5.8 16.6 5.8 13C5.8 10 7.6 7.8 12 5.4Z"/>'
        '<path d="M12 5.4V8.3M12 17.7V21"/>'
        + gema(12, 13, 2.6, 3.4)),
    'condicoes': svg(
        '<path d="M12 3.2Q17.6 9.6 20.6 19.4Q12 21.4 3.4 19.4Q6.4 9.6 12 3.2Z"/>'
        '<path d="M12 8.2Q13.5 11.8 12 14.6Q10.5 11.8 12 8.2Z" fill="currentColor" stroke="none"/>'
        '<circle cx="12" cy="17.1" r="1.15" fill="currentColor" stroke="none"/>'),
    'personagem': svg(
        '<circle cx="12" cy="7.2" r="3.6"/>'
        '<path d="M4.4 21C4.4 16.4 7.6 13.4 12 13.4C16.4 13.4 19.6 16.4 19.6 21Z"/>'
        '<path d="M9 14L12 17.4L15 14"/>'),
}


def engrenagem():
    """Engrenagem de 8 dentes trapezoidais (aparato fabrial), aro interno vazado."""
    import math
    rb, ro, d = 8.3, 10.4, []
    for i in range(8):
        a = i * 45 - 90
        p = lambda r, g: (12 + r * math.cos(math.radians(g)), 12 + r * math.sin(math.radians(g)))
        pts = [p(rb, a - 13), p(ro, a - 8), p(ro, a + 8), p(rb, a + 13)]
        if i:
            pts = pts[1:]  # o 1º ponto já é o fim do arco anterior
        d.append(('M' if i == 0 else 'L') + 'L'.join(f'{x:.2f} {y:.2f}' for x, y in pts))
        nx, ny = p(rb, a + 45 - 13)
        d.append(f'A{rb} {rb} 0 0 1 {nx:.2f} {ny:.2f}')
    return f'<path d="{"".join(d)}Z"/><circle cx="12" cy="12" r="4.6"/>'


# os 2 botões do topo (fora das abas), mesma família
EXTRAS = {
    # Configurações: engrenagem de fabrial com a gema no eixo
    'configuracoes': svg(engrenagem() + gema(12, 12, 1.9, 2.5)),
    # backup: a gema desce pela seta até a bandeja
    'backup': svg(
        '<path d="M12 7.8V15.4M8 11.6L12 15.6L16 11.6"/>'
        '<path d="M3.8 15.8V20.6H20.2V15.8"/>'
        + gema(12, 3.8, 2.1, 2.7)),
}

NOMES = {'principal': 'Principal', 'pericias': 'Perícias', 'acoes': 'Ações',
         'fabriais': 'Fabriais', 'condicoes': 'Condições', 'radiante': 'Radiante',
         'inventario': 'Inventário', 'talentos': 'Talentos', 'personagem': 'Personagem',
         'anotacoes': 'Anotações'}
ATUAL = {'principal': '◈', 'pericias': '✧', 'acoes': '⚔︎', 'fabriais': '⚙︎', 'condicoes': '✚',
         'radiante': '☼', 'inventario': '▣', 'talentos': '❖', 'personagem': '♙',
         'anotacoes': '✎'}

for nome, conteudo in {**ICONES, **EXTRAS}.items():
    open(os.path.join(PASTA, nome + '.svg'), 'w', encoding='utf-8').write(conteudo)


def inline(nome, px):
    fonte = ANTIGOS[nome[:-6]] if nome.endswith('-velho') else {**ICONES, **EXTRAS}[nome]
    return fonte.replace('<svg ', f'<svg width="{px}" height="{px}" ', 1).strip()


linhas = ''.join(
    f'<tr><td class="nome">{NOMES[n]}</td><td class="uni">{ATUAL[n]}</td>'
    f'<td>{inline(n, 20)}</td><td>{inline(n, 24)}</td><td>{inline(n, 48)}</td>'
    f'<td class="item"><span class="ic">{inline(n, 20)}</span>{NOMES[n]}</td></tr>'
    for n in ICONES)
faixa_atual = ''.join(f'<span class="uni">{ATUAL[n]}</span>' for n in ICONES)
faixa_nova = ''.join(inline(n, 20) for n in ICONES)


def topo(nome, cor, ponto=False):
    """Os botões do topo nas cores de verdade, a 20, 24 e 48px."""
    marca = '<i class="ponto"></i>' if ponto else ''
    return (f'<span class="botao" style="color:{cor}">{inline(nome, 21)}{marca}</span>'
            f'<span style="color:{cor}">{inline(nome, 24)}</span>'
            f'<span style="color:{cor}">{inline(nome, 48)}</span>')


linhas_topo = (
    '<tr><td class="nome">Configurações</td><td class="uni" style="color:#333a56">⚙︎</td>'
    f'<td colspan="4" class="topo">{topo("configuracoes", "#333a56")}</td></tr>'
    '<tr><td class="nome">Backup em dia</td><td></td>'
    f'<td colspan="4" class="topo">{topo("backup", "#3f7d4e")}</td></tr>'
    '<tr><td class="nome">Backup a fazer</td><td></td>'
    f'<td colspan="4" class="topo">{topo("backup", "#a03b2e", True)}</td></tr>')

linhas_ab = ''.join(
    f'<tr><td class="nome">{NOMES[n]}</td>'
    f'<td>{inline(n + "-velho", 20)}</td><td>{inline(n + "-velho", 48)}</td><td class="seta">→</td>'
    f'<td>{inline(n, 20)}</td><td>{inline(n, 48)}</td></tr>'
    for n in ANTIGOS)

HTML = f'''<!doctype html><meta charset="utf-8"><title>Ícones das abas — prévia</title>
<style>
body{{margin:0;padding:16px;background:#d9cdb8;font-family:Georgia,'Times New Roman',serif;color:#2b2620}}
.cartao{{background:#f2ecdd;border:1px solid #a2937a;border-radius:6px;padding:12px 16px;width:600px}}
h1{{font-size:18px;color:#333a56;margin:0 0 8px;font-variant:small-caps}}
table{{border-collapse:collapse}} td,th{{padding:4px 10px;text-align:center;vertical-align:middle}}
th{{font-size:12px;color:#6b6252;font-weight:normal}}
td svg,.uni,.faixa svg{{color:#a03b2e}}
.uni{{font-size:1.1rem}} .nome{{text-align:left;font-weight:bold;color:#333a56;font-variant:small-caps}}
.item{{text-align:left;background:#ece3d0;border:1px solid #a2937a;border-radius:6px;padding:8px 14px;font-size:1.05rem}}
.ic{{display:inline-flex;width:1.4rem;justify-content:center;vertical-align:middle;margin-right:.75rem}}
.faixa{{display:flex;gap:14px;align-items:center;margin:6px 0}} .faixa b{{width:60px;font-size:12px;color:#6b6252}}
.topo svg{{color:inherit}} .seta{{color:#6b6252}} .velho svg{{opacity:.55}}
.topo{{text-align:left}} .topo span{{display:inline-flex;vertical-align:middle;margin-right:22px}}
.botao{{position:relative;width:44px;height:44px;justify-content:center;align-items:center;
  background:#f2ecdd;border:1px solid #a2937a;border-radius:6px}}
.ponto{{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:#a03b2e}}
.barra{{display:flex;align-items:center;gap:.6rem;background:#f2ecdd;border:1px solid #a2937a;border-radius:6px;
  padding:0 12px;min-height:44px;color:#333a56;font-weight:bold;font-variant:small-caps;width:260px;margin-top:10px}}
</style>
<div class="cartao"><h1>Refeitos: antes × depois</h1>
<table><tr><th></th><th>antes 20px</th><th>antes 48px</th><th></th><th>novo 20px</th><th>novo 48px</th></tr>{linhas_ab}</table>
<h1 style="margin-top:16px">Botões do topo</h1>
<table><tr><th></th><th>atual</th><th colspan="4">no botão (21px) · 24px · 48px</th></tr>{linhas_topo}</table>
<h1 style="margin-top:16px">Ícones das abas</h1>
<table><tr><th></th><th>atual</th><th>20px</th><th>24px</th><th>48px</th><th>no menu (20px)</th></tr>{linhas}</table>
<div class="faixa"><b>atual</b>{faixa_atual}</div>
<div class="faixa"><b>novo</b>{faixa_nova}</div>
<div class="barra"><span style="color:#a03b2e;display:inline-flex">{inline("acoes", 22)}</span>Ações</div>
</div>
'''
previa = os.path.join(PASTA, 'previa.html')
open(previa, 'w', encoding='utf-8').write(HTML)


def capturar(png, escala):
    tmp = os.path.join(os.environ.get('TEMP', '.'), 'cosmarcos-arte-perfil')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                    f'--user-data-dir={tmp}', f'--force-device-scale-factor={escala}',
                    f'--screenshot={png}', '--window-size=680,1650',
                    'file:///' + previa.replace(os.sep, '/')],
                   check=True, capture_output=True, timeout=120)


capturar(os.path.join(PASTA, 'previa-1x.png'), 1)
capturar(os.path.join(PASTA, 'previa-2x.png'), 2)
print('ok')
