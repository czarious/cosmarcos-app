/* arquivo: Principal.tsx */
import type { Personagem } from '../../tipos/personagem'

// Aba Principal — atributos, defesas, recursos E derivados subiram todos pro
// CabecalhoFixo (pedido do César: a parte fixa é a ficha oficial em miniatura).
// Aqui: especializações — consulta rápida que não muda em combate.

type Props = { ficha: Personagem }

export default function Principal({ ficha }: Props) {
  const { especializacoes } = ficha
  return (
    <div className="secao principal">
      <h2 className="titulo-secao">Especializações</h2>
      <ul className="lista-chips">
        {especializacoes.map((e) => (
          <li className="chip" key={e.nome}>
            <i>{e.tipo === 'cultural' ? 'Cultural' : 'Especialista'}</i>
            {e.nome}
          </li>
        ))}
      </ul>
    </div>
  )
}
