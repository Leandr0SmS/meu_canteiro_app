// Formata uma planta individual
export function apresentaPlanta(planta) {
  return {
    id_planta: planta.id_planta,
    nome_planta: planta.nome_planta,
    tempo_colheita: planta.tempo_colheita,
    estrato: planta.estrato,
    espacamento: planta.espacamento,
  };
}

// Formata uma lista de plantas
export function apresentaPlantas(plantas) {
  return {
    plantas: plantas.map(apresentaPlanta)
  };
}