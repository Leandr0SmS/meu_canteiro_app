export function apresentaCanteiro(canteiro) {
  return {
    id_canteiro: canteiro.id_canteiro,
    nome_canteiro: canteiro.nome_canteiro,
    x_canteiro: canteiro.x_canteiro,
    y_canteiro: canteiro.y_canteiro,
    plantas_canteiro: canteiro.plantas_canteiro
  };
}