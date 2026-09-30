/* arquivo: ControleMarcos.tsx */

// As 3 caixas de MARCO DE HISTÓRIA — o mesmo controle serve pros Objetivos
// (livro, cap. 8 "Objetivos") e pros Ideais do Radiante ("Jurando Ideais"):
// três marcos, e só então dá pra concluir. O livro deixa esperar o momento
// dramático — por isso concluir é um botão à parte, nunca automático.

type Props = {
  marcos: number
  concluido: boolean
  /** "Concluir" / "Jurar" */
  rotuloConcluir: string
  /** "Concluído" / "Jurado" */
  rotuloConcluido: string
  aoMarcar: (marcos: number) => void
  aoConcluir: (concluido: boolean) => void
}

export default function ControleMarcos({ marcos, concluido, rotuloConcluir, rotuloConcluido, aoMarcar, aoConcluir }: Props) {
  if (concluido) {
    return (
      <div className="marcos">
        <span className="marcos-concluido">✓ {rotuloConcluido}</span>
        <button type="button" className="rodape-botao" onClick={() => aoConcluir(false)}>
          Desfazer
        </button>
      </div>
    )
  }
  return (
    <div className="marcos">
      <span className="marcos-caixas" role="group" aria-label={`Marcos de história: ${marcos} de 3`}>
        {[1, 2, 3].map((k) => (
          <button
            key={k}
            type="button"
            className={`marco${k <= marcos ? ' marco-cheio' : ''}`}
            // tocar no último marcado desmarca; tocar noutro marca até ele
            onClick={() => aoMarcar(k === marcos ? k - 1 : k)}
            aria-pressed={k <= marcos}
            aria-label={`Marco ${k}`}
          />
        ))}
      </span>
      {marcos === 3 && (
        <button type="button" className="rodape-botao rodape-perigo" onClick={() => aoConcluir(true)}>
          {rotuloConcluir}
        </button>
      )}
    </div>
  )
}
