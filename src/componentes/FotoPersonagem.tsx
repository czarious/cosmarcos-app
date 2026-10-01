/* arquivo: FotoPersonagem.tsx */
import { useLayoutEffect, useRef, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
// A biblioteca injeta o próprio <style>, que a política de segurança barra — o CSS vem pelo bundle
import 'react-easy-crop/react-easy-crop.css'
import { ICONE } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// O rosto do personagem no cabeçalho: quadrado, tocar põe (ou troca) a foto.
// Escolhida a imagem, o recorte: janela quadrada limpa no meio, o que fica de
// fora hachurado; arrastar posiciona, dois dedos ou a barra dão zoom. Sai um
// JPEG de LADO px — pequeno o bastante pra morar no save sem pesar.

const LADO = 256
/** A janela de recorte ocupa 80% do palco — os 10%/90% da hachura e da janela (base.css → .rf-hachura). */
const JANELA = 0.8

type Props = {
  foto?: string
  definirFoto: (foto: string | undefined) => void
}

export default function FotoPersonagem({ foto, definirFoto }: Props) {
  const { tx } = useIdioma()
  const seletor = useRef<HTMLInputElement>(null)
  /** A imagem escolhida, ainda inteira (blob:), enquanto recorta. */
  const [original, setOriginal] = useState<string | null>(null)
  const [opcoes, setOpcoes] = useState(false)

  function escolher() {
    setOpcoes(false)
    seletor.current?.click()
  }

  function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = '' // deixa escolher o mesmo arquivo de novo
    if (arquivo) setOriginal(URL.createObjectURL(arquivo))
  }

  function fecharRecorte() {
    if (original) URL.revokeObjectURL(original)
    setOriginal(null)
  }

  return (
    <>
      <button
        type="button"
        className="cf-foto"
        onClick={() => (foto ? setOpcoes(true) : escolher())}
        aria-label={foto ? tx.foto.trocarFoto : tx.foto.porFoto}
      >
        {foto ? <img src={foto} alt="" /> : <Silhueta />}
      </button>
      <input ref={seletor} type="file" accept="image/*" hidden onChange={aoEscolher} />

      {opcoes && (
        <div className="cr-overlay" onClick={() => setOpcoes(false)}>
          <div className="cr-painel painel-mesa" onClick={(e) => e.stopPropagation()}>
            <div className="cr-cabeca">
              <span className="cr-titulo">{tx.foto.trocarFoto}</span>
              <button className="cr-fechar" onClick={() => setOpcoes(false)} aria-label={tx.geral.fechar}>
                {ICONE.fechar}
              </button>
            </div>
            <div className="lesao-acoes">
              <button type="button" className="rodape-botao" onClick={escolher}>{tx.foto.escolherOutra}</button>
              <button type="button" className="rodape-botao rodape-perigo" onClick={() => { definirFoto(undefined); setOpcoes(false) }}>
                {tx.foto.tirar}
              </button>
            </div>
          </div>
        </div>
      )}

      {original && (
        <Recorte
          src={original}
          aoUsar={(recortada) => {
            definirFoto(recortada)
            fecharRecorte()
          }}
          aoCancelar={fecharRecorte}
        />
      )}
    </>
  )
}

function Recorte({ src, aoUsar, aoCancelar }: { src: string; aoUsar: (foto: string) => void; aoCancelar: () => void }) {
  const { tx } = useIdioma()
  const palco = useRef<HTMLDivElement>(null)
  const [lado, setLado] = useState(0)
  const [posicao, setPosicao] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  const [falhou, setFalhou] = useState(false)

  // A janela da biblioteca é em px: mede o palco (quadrado, largura do painel)
  useLayoutEffect(() => setLado(palco.current?.clientWidth ?? 0), [])

  async function usar() {
    if (!area) return
    try {
      aoUsar(await recortar(src, area))
    } catch {
      setFalhou(true)
    }
  }

  return (
    <div className="cr-overlay" onClick={aoCancelar}>
      <div className="cr-painel painel-mesa rf-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{tx.foto.recortar}</span>
          <button className="cr-fechar" onClick={aoCancelar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>
        <div className="rf-palco" ref={palco}>
          {lado > 0 && (
            <Cropper
              image={src}
              crop={posicao}
              zoom={zoom}
              aspect={1}
              cropSize={{ width: lado * JANELA, height: lado * JANELA }}
              objectFit="cover"
              maxZoom={4}
              showGrid={false}
              onCropChange={setPosicao}
              onZoomChange={setZoom}
              onCropComplete={(_, px) => setArea(px)}
              classes={{ cropAreaClassName: 'rf-janela-lib' }}
              mediaProps={{ onError: () => setFalhou(true) }}
              disableAutomaticStylesInjection
            />
          )}
          {/* o que sai do recorte fica hachurado; a janela limpa leva o contorno */}
          <div className="rf-hachura" aria-hidden />
          <div className="rf-janela" aria-hidden />
        </div>
        {falhou ? (
          <p className="erro">{tx.foto.naoAbriu}</p>
        ) : (
          <p className="rf-dica">{tx.foto.comoRecortar}</p>
        )}
        <input
          className="rf-zoom"
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label={tx.foto.zoom}
        />
        <div className="lesao-acoes">
          <button type="button" className="rodape-botao" disabled={!area || falhou} onClick={usar}>{tx.foto.usar}</button>
          <button type="button" className="rodape-botao" onClick={aoCancelar}>{tx.geral.cancelar}</button>
        </div>
      </div>
    </div>
  )
}

/** Recorta a área escolhida num quadrado de LADO px — JPEG em data URL, o que o save guarda. */
async function recortar(src: string, a: Area): Promise<string> {
  const img = new Image()
  img.src = src
  await img.decode()
  const tela = document.createElement('canvas')
  tela.width = tela.height = LADO
  const ctx = tela.getContext('2d')
  if (!ctx) throw new Error('sem canvas')
  ctx.drawImage(img, a.x, a.y, a.width, a.height, 0, 0, LADO, LADO)
  return tela.toDataURL('image/jpeg', 0.85)
}

/** Sem foto: cabeça e ombros, no traço do app. */
function Silhueta() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <circle className="silhueta" cx="16" cy="12" r="6" />
      <path className="silhueta" d="M5 30 C5 22 10 19 16 19 C22 19 27 22 27 30 Z" />
    </svg>
  )
}
