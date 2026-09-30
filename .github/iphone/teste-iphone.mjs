/* arquivo: teste-iphone.mjs */

/**
 * O app publicado num iPhone simulado — roda no Mac do GitHub
 * (.github/workflows/iphone.yml), porque no Windows o WebKit não abre.
 *
 * Motor WebKit (o do Safari) com tela, toque e navegador de iPhone. Passa pelo
 * que a mesa usa e grava foto de cada tela + um relatório. O que NÃO dá pra
 * simular aqui: instalar pela Tela de Início e o corte de ~7 dias do Safari.
 *
 * Uso: node teste-iphone.mjs <url> <pasta-de-saida>
 */

import { webkit, devices } from 'playwright'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const URL_APP = process.argv[2] ?? 'https://czarious.github.io/cosmarcos-app/'
const SAIDA = process.argv[3] ?? 'saida'
mkdirSync(SAIDA, { recursive: true })

const rel = { url: URL_APP, aparelho: 'iPhone 15', erros: [], passos: [] }
const passo = (nome, ok, detalhe) => rel.passos.push({ nome, ok, detalhe })

const nav = await webkit.launch()
const ctx = await nav.newContext({ ...devices['iPhone 15'], acceptDownloads: true, locale: 'pt-BR' })
const p = await ctx.newPage()
p.on('pageerror', (e) => rel.erros.push(`pageerror: ${e.message}`))
p.on('console', (m) => m.type() === 'error' && rel.erros.push(`console: ${m.text()}`))

const foto = (nome) => p.screenshot({ path: join(SAIDA, `${nome}.png`), fullPage: false })
const espera = (ms) => p.waitForTimeout(ms)

/** Troca de aba pelo nome EXATO ("Ações" não pode casar com "Anotações"). Menu que ficou aberto é fechado antes. */
async function abrirAba(nome) {
  if (await p.locator('.ss-menu').isVisible()) await p.locator('.ss-fechar').click()
  await p.locator('.ss-barra').click()
  await p.locator('.ss-item').filter({ hasText: new RegExp(`(^|\\s)${nome}$`) }).click()
  await espera(400)
}

try {
  await p.goto(URL_APP, { waitUntil: 'networkidle' })
  await espera(1500)
  const topo = await p.locator('.cabecalho-fixo').innerText()
  passo('abre e mostra a ficha', topo.includes('Eccho'), topo.replace(/\n/g, ' ').slice(0, 90))
  await foto('01-principal')

  // O que o Safari precisa ter pro app funcionar
  rel.recursos = await p.evaluate(async () => ({
    userAgent: navigator.userAgent,
    serviceWorker: 'serviceWorker' in navigator,
    swRegistrado: !!(await navigator.serviceWorker?.getRegistration()),
    storagePersist: typeof navigator.storage?.persist === 'function',
    pluralRules: typeof Intl.PluralRules === 'function',
    structuredClone: typeof structuredClone === 'function',
    randomUUID: typeof crypto.randomUUID === 'function',
    cssHas: CSS.supports('selector(:has(a))'),
    dvh: CSS.supports('height', '100dvh'),
    htmlLang: document.documentElement.lang,
  }))

  // Todas as abas
  const abas = ['Perícias', 'Ações', 'Fabriais', 'Condições', 'Radiante', 'Inventário', 'Talentos', 'Personagem', 'Anotações', 'Principal']
  for (const [i, aba] of abas.entries()) {
    try {
      await abrirAba(aba)
      const nome = await p.locator('.ss-nome').innerText()
      passo(`aba ${aba}`, nome === aba, nome)
      await foto(`${String(i + 2).padStart(2, '0')}-${aba.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()}`)
    } catch (e) {
      passo(`aba ${aba}`, false, String(e).slice(0, 200))
    }
  }

  // Turno: iniciar, lento, golpear
  await abrirAba('Ações')
  await p.getByRole('button', { name: 'Iniciar combate' }).click()
  await p.getByRole('button', { name: /Turno lento/ }).click()
  await p.locator('.ataque-usar .usar-botao').first().click()
  const gastos = await p.locator('.turno-acoes .turno-pip-gasto').count()
  passo('turno: Golpear gasta 1 ▶', gastos === 1, `${gastos} gasto(s)`)
  await foto('12-turno')
  await p.getByRole('button', { name: 'Encerrar turno' }).click()
  await p.getByRole('button', { name: 'Fim do combate' }).click()

  // Engrenagem, versão e inglês
  await p.locator('.engrenagem').click()
  const versao = await p.locator('.menu-versao').innerText()
  passo('engrenagem mostra a versão', /v\d+\.\d+\.\d+/.test(versao), versao)
  await foto('13-engrenagem')
  await p.getByRole('button', { name: 'English' }).click()
  await p.locator('.cr-fechar').first().click()
  await abrirAba('Actions')
  const emIngles = await p.locator('.cabecalho-fixo').innerText()
  passo('inglês', emIngles.includes('HEALTH'), emIngles.replace(/\n/g, ' ').slice(0, 90))
  await foto('14-ingles-acoes')
  await p.locator('.engrenagem').click()
  await p.getByRole('button', { name: 'Português' }).click()
  await p.locator('.cr-fechar').first().click()

  // Exportar e backup: o arquivo baixa?
  for (const [rotulo, nome] of [['Exportar pro Shards', 'exportar'], ['Baixar backup', 'backup']]) {
    try {
      await p.locator('.engrenagem').click()
      const [baixado] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), p.getByRole('button', { name: rotulo }).click()])
      passo(`download: ${nome}`, true, baixado.suggestedFilename())
    } catch (e) {
      passo(`download: ${nome}`, false, String(e).slice(0, 200))
      await p.keyboard.press('Escape').catch(() => {})
    }
  }

  // Importar a ficha de outro jogador e ver se ela fica depois de reabrir
  const semente = await (await p.request.get(new URL('personagens/eccho.json', URL_APP).href)).json()
  semente.characters[0].name = 'Jogador iPhone'
  semente.characters[0].id = 'teste-iphone'
  const arq = join(SAIDA, 'jogador-iphone.json')
  writeFileSync(arq, JSON.stringify(semente))
  await p.locator('.engrenagem').click()
  await p.getByRole('button', { name: 'Importar JSON' }).first().click() // pede confirmação
  const [seletor] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu-confirma .menu-perigo').click()])
  await seletor.setFiles(arq)
  await espera(800)
  await p.reload({ waitUntil: 'networkidle' })
  await espera(1200)
  const depois = await p.locator('.cabecalho-fixo').innerText()
  passo('outra ficha continua depois de reabrir', depois.includes('Jogador iPhone'), depois.replace(/\n/g, ' ').slice(0, 60))
  await foto('15-outra-ficha')
} catch (e) {
  rel.erros.push(`roteiro parou: ${String(e).slice(0, 400)}`)
  await foto('99-onde-parou').catch(() => {})
}

await nav.close()
writeFileSync(join(SAIDA, 'relatorio.json'), JSON.stringify(rel, null, 2))
const falhas = rel.passos.filter((x) => !x.ok).length
console.log(`${rel.passos.length} passos, ${falhas} falha(s), ${rel.erros.length} erro(s) de página`)
console.log(readFileSync(join(SAIDA, 'relatorio.json'), 'utf8'))
