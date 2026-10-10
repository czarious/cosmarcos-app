/* arquivo: medir-toque.mjs */

/**
 * Alvo de toque — roda DENTRO da página (teste-iphone.mjs → p.evaluate).
 *
 * Todo botão precisa de 44×44px de área de toque: o próprio botão, ou o botão mais
 * a área invisível do ::before (base.css → "ÁREA DE TOQUE INVISÍVEL"). E a área de
 * um não pode invadir a de outro, senão o toque cai no vizinho.
 * Exceção decidida: o topo fixo (premissas.md → "Letra maior e alvo de toque").
 * Ali o mínimo é 24px, o da WCAG.
 *
 * Devolve só os problemas, um por classe: { classe, texto, problema }.
 */
export function medirToque() {
  const MINIMO = 44
  const MINIMO_TOPO = 24
  const TOPO = ['cf-seta', 'cf-escudo', 'cf-valor', 'cf-fogueira', 'cf-condicoes']
  const TOLERANCIA = 0.5 // arredondamento de rem em px
  const SELETOR = [
    'button',
    'a[href]',
    'select',
    'textarea',
    'input:not([type=hidden])',
    'label:has(input[type=checkbox])',
    'label:has(input[type=radio])',
    '[role=button]',
  ].join(',')

  const px = (v) => parseFloat(v) || 0
  const alvos = []
  for (const el of document.querySelectorAll(SELETOR)) {
    if (el.tagName === 'INPUT' && el.closest('label')) continue // quem recebe o toque é o rótulo
    if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true })) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    let x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom
    const antes = getComputedStyle(el, '::before')
    if (antes.content !== 'none' && antes.position === 'absolute') {
      // o ::before mede a partir da borda de dentro do botão
      const bordaDir = r.width - el.clientLeft - el.clientWidth
      const bordaBaixo = r.height - el.clientTop - el.clientHeight
      x0 = Math.min(x0, r.left + el.clientLeft + px(antes.left))
      y0 = Math.min(y0, r.top + el.clientTop + px(antes.top))
      x1 = Math.max(x1, r.right - bordaDir - px(antes.right))
      y1 = Math.max(y1, r.bottom - bordaBaixo - px(antes.bottom))
    }
    const classe = el.tagName.toLowerCase() + [...el.classList].map((c) => '.' + c).join('')
    // camada: janela aberta por cima, o topo que não rola (.topo-fixo) e a página que passa por baixo dele não se misturam
    const camada = el.closest('.cr-overlay') ? 'janela' : el.closest('.topo-fixo') ? 'topo' : 'pagina'
    alvos.push({ el, x0, y0, x1, y1, classe, camada, texto: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30) })
  }

  const problemas = new Map()
  const anotar = (a, problema) => {
    if (!problemas.has(a.classe)) problemas.set(a.classe, { classe: a.classe, texto: a.texto, problema })
  }

  for (const a of alvos) {
    const minimo = TOPO.some((c) => a.el.classList.contains(c)) ? MINIMO_TOPO : MINIMO
    const w = a.x1 - a.x0, h = a.y1 - a.y0
    if (w + TOLERANCIA < minimo || h + TOLERANCIA < minimo) anotar(a, `${Math.round(w)}×${Math.round(h)}px (mínimo ${minimo})`)
  }

  for (let i = 0; i < alvos.length; i++) {
    for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i], b = alvos[j]
      if (a.camada !== b.camada || a.el.contains(b.el) || b.el.contains(a.el)) continue
      const sx = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
      const sy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)
      if (sx > 1 && sy > 1) anotar(a, `área invade ${b.classe} «${b.texto}» (${Math.round(sx)}×${Math.round(sy)}px)`)
    }
  }
  return [...problemas.values()]
}
