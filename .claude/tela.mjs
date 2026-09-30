/* arquivo: tela.mjs */
// Tira capturas do app em tamanho de CELULAR (412×915) pelo Chrome oculto,
// sem extensão nem dependência — fala direto com o Chrome (DevTools Protocol).
// Precisa do `npm run dev` rodando.
//
// uso:  node .claude/tela.mjs <prefixo-de-saída> ['<passos JSON>']
//   passo = { js?: "código na página", espera?: ms, foto?: "nome", cheia?: true }
//   ex.:  node .claude/tela.mjs /tmp/v1 '[{"foto":"principal"},
//          {"js":"document.querySelector(\".ss-barra\").click()","espera":400},{"foto":"menu"}]'
// Gera <prefixo>-<nome>.png. Cada execução usa um perfil novo = ficha semente.

import { spawn } from 'node:child_process'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , prefixo, passosJson = '[]'] = process.argv
if (!prefixo) {
  console.error('uso: node .claude/tela.mjs <prefixo-de-saída> [passos JSON]')
  process.exit(1)
}
const passos = JSON.parse(passosJson)
const URL_APP = process.env.URL_APP ?? 'http://localhost:5173/'
const PORTA = Number(process.env.PORTA_CHROME ?? 9333) // outra porta = duas capturas ao mesmo tempo

const chrome = spawn(
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORTA}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cosmarcos-tela-'))}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

try {
  let alvo
  for (let i = 0; i < 40 && !alvo; i++) {
    await esperar(250)
    try {
      alvo = (await (await fetch(`http://127.0.0.1:${PORTA}/json`)).json()).find((t) => t.type === 'page')
    } catch {}
  }
  if (!alvo) throw new Error('o Chrome não abriu a porta de depuração')

  const ws = new WebSocket(alvo.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  let id = 0
  const pendentes = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pendentes.has(m.id)) {
      pendentes.get(m.id)(m)
      pendentes.delete(m.id)
    }
  })
  const cdp = (method, params = {}) =>
    new Promise((r) => {
      const n = ++id
      pendentes.set(n, r)
      ws.send(JSON.stringify({ id: n, method, params }))
    })

  await cdp('Emulation.setDeviceMetricsOverride', { width: 412, height: 915, deviceScaleFactor: 2, mobile: true })
  await cdp('Page.navigate', { url: URL_APP })
  await esperar(2500)

  for (const p of passos) {
    if (p.js) {
      const r = await cdp('Runtime.evaluate', { expression: p.js, awaitPromise: true, returnByValue: true })
      const valor = r.result?.result?.value
      if (valor !== undefined) console.log(p.js.slice(0, 60), '=>', JSON.stringify(valor))
      if (r.result?.exceptionDetails) console.error('ERRO no passo:', p.js.slice(0, 60), r.result.exceptionDetails.text)
    }
    if (p.espera) await esperar(p.espera)
    if (p.foto) {
      const r = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!p.cheia })
      const arquivo = `${prefixo}-${p.foto}.png`
      writeFileSync(arquivo, Buffer.from(r.result.data, 'base64'))
      console.log('foto:', arquivo)
    }
  }
  ws.close()
} finally {
  chrome.kill()
}
