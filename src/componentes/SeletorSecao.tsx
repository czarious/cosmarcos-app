/* arquivo: SeletorSecao.tsx */

// As abas — padrão DDB (uma seção por vez). Todas no MVP (decisão do César).
// Barra rolável na horizontal; a aba ativa fica em destaque vinho.

export const SECOES = [
  'Principal',
  'Perícias',
  'Ações',
  'Condições',
  'Radiante',
  'Inventário',
  'Talentos',
  'Personagem',
  'Anotações',
] as const

export type Secao = (typeof SECOES)[number]

type Props = {
  ativa: Secao
  aoTrocar: (s: Secao) => void
}

export default function SeletorSecao({ ativa, aoTrocar }: Props) {
  return (
    <nav className="seletor-secao" aria-label="Seções da ficha">
      {SECOES.map((s) => (
        <button
          key={s}
          className={`aba${s === ativa ? ' aba-ativa' : ''}`}
          onClick={() => aoTrocar(s)}
          aria-current={s === ativa ? 'page' : undefined}
        >
          {s}
        </button>
      ))}
    </nav>
  )
}
