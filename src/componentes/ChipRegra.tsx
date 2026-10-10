/* arquivo: ChipRegra.tsx */
import { emTopicos } from '../idioma/idioma'
import BotaoInfo from './BotaoInfo'

// Um traço como chip: com regra no catálogo, o chip é um botão de informação
// (ⓘ) que abre o que ele faz — "Ímpeto" no cartão da arma (César, 10/Out/2026).
// Sem regra, fica só o nome.

type Props = {
  nome: string
  /** O texto da regra (resumo do catálogo). Ausente: chip simples, sem toque. */
  regra?: string
  /** Uma linha a mais embaixo da regra (ex.: "só com a especialidade"). */
  nota?: string
  /** Borda vinho: traço de perito. */
  destaque?: boolean
}

export default function ChipRegra({ nome, regra, nota, destaque }: Props) {
  const classe = destaque ? 'chip chip-chave' : 'chip'
  if (!regra) return <li className={classe}>{nome}</li>
  return (
    <li>
      <BotaoInfo classe={`${classe} chip-regra`} titulo={nome} linhas={emTopicos(regra)} nota={nota}>
        {nome}
      </BotaoInfo>
    </li>
  )
}
