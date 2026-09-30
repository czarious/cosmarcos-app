/* arquivo: verificar.mjs */

/**
 * A revisão de organização do organizacao.md ("Revisão periódica"), executável.
 *
 * Existe porque redigitar a checagem a cada revisão é o gatilho "processamento
 * longo" em pessoa: muita digitação pra resultado pequeno. Rodar com:
 *
 *     node .claude/verificar.mjs
 *
 * Sem dependência nenhuma — só Node, que o projeto já exige.
 * Sai com código 1 se achar problema, pra poder virar passo de CI um dia.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, normalize, basename, relative, sep } from 'node:path'
import { spawnSync } from 'node:child_process'

const RAIZ = process.cwd()
/**
 * `referencia/` fica de fora por dois motivos, e os dois importam:
 *  - é material de terceiro, não versionado;
 *  - a transcrição do livro **numera de propósito** (`03-estatisticas.../07-...`),
 *    porque a ordem é a do Guia de Regras. Ali número é DADO DA FONTE, não
 *    convenção nossa — ver organizacao.md → "Como eu decido uma convenção".
 * Tirar `referencia` daqui reprovaria a transcrição inteira, errado.
 */
const IGNORAR = ['node_modules', '.git', 'referencia', 'dist', 'worktrees'] // worktrees = clones dos agentes

function varrer(dir, ext, achados = []) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.includes(nome)) continue
    const caminho = join(dir, nome)
    if (statSync(caminho).isDirectory()) varrer(caminho, ext, achados)
    else if (nome.endsWith(ext)) achados.push(caminho)
  }
  return achados
}

/** Tira code spans e blocos de código: caminho de EXEMPLO não é link quebrado. */
function semCodigo(texto) {
  return texto.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
}

const problemas = []
const docs = varrer(RAIZ, '.md')

// 1. Links relativos entre .md resolvem?
for (const doc of docs) {
  const corpo = semCodigo(readFileSync(doc, 'utf8'))
  for (const m of corpo.matchAll(/\]\(([^)#:]+\.md)(?:#[^)]*)?\)/g)) {
    const alvo = normalize(join(dirname(doc), m[1]))
    // Arquivo que o .gitignore bloqueia (livro, jogadores) só existe no PC —
    // num clone (sessão na nuvem) o link aponta pro nada, e isso é o esperado.
    if (!existsSync(alvo) && !ignoradoPeloGit(alvo)) {
      problemas.push(`link quebrado · ${relative(RAIZ, doc)} → ${m[1]}`)
    }
  }
}

// 2. Todo arquivo de src/ está no mapa-app.md? Pelo nome — ou pela PASTA citada
//    no mapa, pra pasta de dados que cresce um arquivo por personagem (as
//    imagens de src/assets/fundos/): uma linha por imagem seria ruído.
const mapaApp = readFileSync(join(RAIZ, 'mapa-app.md'), 'utf8')
const codigo = existsSync(join(RAIZ, 'src')) ? varrerTudo(join(RAIZ, 'src')) : []
for (const arq of codigo) {
  const pasta = relative(RAIZ, dirname(arq)).split(sep).join('/') + '/'
  if (!mapaApp.includes(basename(arq)) && !mapaApp.includes(`\`${pasta}\``)) {
    problemas.push(`fora do mapa-app.md · ${relative(RAIZ, arq)}`)
  }
}

// 3. Todo doc está no mapa-projeto.md? (README é índice, não precisa)
const mapaProjeto = readFileSync(join(RAIZ, '.claude', 'mapa-projeto.md'), 'utf8')
for (const doc of docs) {
  const nome = basename(doc)
  if (nome !== 'README.md' && !mapaProjeto.includes(nome) && !mapaApp.includes(nome)) {
    problemas.push(`fora dos mapas · ${relative(RAIZ, doc)}`)
  }
}

// 4. Título numerado — a convenção é por NOME, sempre.
// Numerar exigiria conferir a sequência a cada seção criada (ritual que some),
// e a falha é silenciosa: inserir seção no meio faz "§3" apontar pra outra.
// Ver organizacao.md → "Como eu decido uma convenção".
for (const doc of docs) {
  const corpo = semCodigo(readFileSync(doc, 'utf8'))
  // "3. " e "4.1 " são índice de seção; "18 perícias" é título legítimo.
  for (const m of corpo.matchAll(/^#{1,6}\s+(\d+(?:(?:\.\d+)+|[.)])\s)/gm)) {
    problemas.push(`título numerado · ${relative(RAIZ, doc)} → "${m[1].trim()}…" (seção se referencia por nome)`)
  }
}

// 5. Versão copiada em doc — número copiado mente (só o package.json manda)
const versao = JSON.parse(readFileSync(join(RAIZ, 'package.json'), 'utf8')).version
for (const doc of docs) {
  const corpo = readFileSync(doc, 'utf8')
  for (const m of corpo.matchAll(/\*\*(\d+\.\d+\.\d+)\*\*/g)) {
    if (m[1] !== versao) continue
    problemas.push(`versão copiada em doc · ${relative(RAIZ, doc)} → ${m[1]} (fonte é o package.json)`)
  }
}

// 6. Título repetido no mesmo doc — sinal de bloco colado duas vezes. Já aconteceu
// (30/Set/2026): um script procurou "## Código" e achou dentro de "### Código e
// documentação…", e metade das premissas saiu em dobro sem nenhum aviso.
for (const doc of docs) {
  const vistos = new Set()
  for (const m of semCodigo(readFileSync(doc, 'utf8')).matchAll(/^(#{1,6}\s+.+?)\s*$/gm)) {
    if (vistos.has(m[1])) problemas.push(`título repetido · ${relative(RAIZ, doc)} → "${m[1]}"`)
    vistos.add(m[1])
  }
}

function ignoradoPeloGit(caminho) {
  return spawnSync('git', ['check-ignore', '-q', caminho], { cwd: RAIZ }).status === 0
}

function varrerTudo(dir, achados = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome)
    if (statSync(caminho).isDirectory()) varrerTudo(caminho, achados)
    else achados.push(caminho)
  }
  return achados
}

console.log(`${docs.length} docs · ${codigo.length} arquivos em src/\n`)
if (problemas.length === 0) {
  console.log('✓ organização em dia')
} else {
  for (const p of problemas) console.log(`✗ ${p}`)
  console.log(`\n${problemas.length} problema(s) — ver .claude/organizacao.md`)
  process.exit(1)
}
