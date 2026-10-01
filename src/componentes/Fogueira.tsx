/* arquivo: Fogueira.tsx */
import { useState } from 'react'
import type { Personagem } from '../tipos/personagem'
import { ICONE, SIMBOLO_RECURSO } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// A fogueira embaixo da foto, no cabeçalho: toca e escolhe o descanso — curto
// (rola o dado de recuperação na mão e divide entre Vida e Foco) ou longo
// (confirma antes). É o único lugar do app que descansa. Regra:
// transcricao/09-aventurando-se/10-descanso.md · a conta: regras/descanso.ts.

type Props = {
  ficha: Personagem
  fazerDescansoCurto: (vida: number, foco: number) => void
  fazerDescansoLongo: () => void
}

export default function Fogueira({ ficha, fazerDescansoCurto, fazerDescansoLongo }: Props) {
  const { t, tx } = useIdioma()
  const [aberta, setAberta] = useState(false)
  const [vida, setVida] = useState('')
  const [foco, setFoco] = useState('')
  const [confirmandoLongo, setConfirmandoLongo] = useState(false)
  const { recursos, derivados } = ficha

  function fechar() {
    setAberta(false)
    setVida('')
    setFoco('')
    setConfirmandoLongo(false)
  }

  return (
    <>
      <button type="button" className="cf-fogueira" onClick={() => setAberta(true)}>
        <DesenhoFogueira />
        <span>{tx.cabecalho.descansar}</span>
      </button>

      {aberta && (
        // fundo escurecido: toca fora → fecha (o mesmo painel do ControleRecurso)
        <div className="cr-overlay" onClick={fechar}>
          <div className="cr-painel desc-painel" onClick={(e) => e.stopPropagation()}>
            <div className="cr-cabeca">
              <span className="cr-titulo desc-titulo">
                <DesenhoFogueira />
                {t(tx.descanso.titulo)}
              </span>
              <button className="cr-fechar" onClick={fechar} aria-label={tx.geral.fechar}>
                {ICONE.fechar}
              </button>
            </div>

            {/* curto: o jogador rola o dado de recuperação na mão e divide */}
            <section className="desc-cartao">
              <h3 className="desc-nome">
                {t(tx.descanso.curto)} <small>{t(tx.descanso.curtoDuracao)}</small>
              </h3>
              <p className="desc-texto">{t(tx.descanso.curtoComo, { dado: derivados.dadoRecuperacao })}</p>
              <div className="desc-campos">
                <label className="desc-campo desc-vida">
                  <span>
                    <i className="desc-simbolo">{SIMBOLO_RECURSO.vida}</i> {tx.recursos.vida} +
                  </span>
                  <input type="number" inputMode="numeric" min={0} value={vida} onChange={(e) => setVida(e.target.value)} />
                </label>
                <label className="desc-campo desc-foco">
                  <span>
                    <i className="desc-simbolo">{SIMBOLO_RECURSO.foco}</i> {tx.recursos.foco} +
                  </span>
                  <input type="number" inputMode="numeric" min={0} value={foco} onChange={(e) => setFoco(e.target.value)} />
                </label>
              </div>
              <button
                type="button"
                className="botao-gerenciar"
                disabled={!vida && !foco}
                onClick={() => {
                  fazerDescansoCurto(Number(vida) || 0, Number(foco) || 0)
                  fechar()
                }}
              >
                {tx.geral.aplicar}
              </button>
            </section>

            {/* longo: tudo cheio — confirma antes, porque não tem volta */}
            <section className="desc-cartao">
              <h3 className="desc-nome">
                {t(tx.descanso.longo)} <small>{t(tx.descanso.longoDuracao)}</small>
              </h3>
              <ul className="desc-efeitos">
                <li className="desc-vida">
                  <i className="desc-simbolo">{SIMBOLO_RECURSO.vida}</i> {t(tx.descanso.vidaCheia, { n: recursos.vida.max })}
                </li>
                <li className="desc-foco">
                  <i className="desc-simbolo">{SIMBOLO_RECURSO.foco}</i> {t(tx.descanso.focoCheio, { n: recursos.foco.max })}
                </li>
                <li>{t(tx.descanso.exaustoMenos1)}</li>
                <li>{t(tx.descanso.superficialCura)}</li>
              </ul>
              {confirmandoLongo ? (
                <div className="desc-confirma">
                  <button type="button" className="botao-gerenciar" onClick={() => { fazerDescansoLongo(); fechar() }}>
                    {t(tx.descanso.confirmarDescansoLongo)}
                  </button>
                  <button type="button" className="turno-discreto" onClick={() => setConfirmandoLongo(false)}>
                    {tx.geral.cancelar}
                  </button>
                </div>
              ) : (
                <button type="button" className="botao-gerenciar" onClick={() => setConfirmandoLongo(true)}>
                  {t(tx.descanso.descansar)}
                </button>
              )}
            </section>

            <p className="desc-nota">{t(tx.descanso.lesaoLeveGraveConta)}</p>
          </div>
        </div>
      )}
    </>
  )
}

/** Lenha cruzada e a chama com uma gema no meio — a Luz das Tempestades no lugar da brasa. */
function DesenhoFogueira() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <path className="fogueira-lenha" d="M5 28 L27 22 M5 22 L27 28" />
      <path className="fogueira-chama" d="M16 2 C20 8 24 11 22.5 17.5 C21.5 21.5 19 24 16 24 C13 24 10.5 21.5 9.5 17.5 C8 11 12 8 16 2 Z" />
      <path className="fogueira-gema" d="M16 11 L19.5 16.5 L16 22 L12.5 16.5 Z" />
    </svg>
  )
}
