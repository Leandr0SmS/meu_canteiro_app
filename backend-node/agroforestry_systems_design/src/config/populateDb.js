import Canteiro from '../models/canteiro.js';

export async function populateDb() {
  const canteirosIniciais = [
    {
      nome_canteiro: "Canteiro1",
      x_canteiro: 1100,
      y_canteiro: 250,
      plantas_canteiro: {
        plantas: [
          {
            espacamento: 200,
            estrato: "emergente",
            nome_planta: "Embaúba",
            sombra: 20,
            tempo_colheita: 1095
          },
          {
            espacamento: 100,
            estrato: "alto",
            nome_planta: "Jucara",
            sombra: 40,
            tempo_colheita: 2555
          },
          {
            espacamento: 50,
            estrato: "medio",
            nome_planta: "Pimenta-do-reino",
            sombra: 60,
            tempo_colheita: 1460
          },
          {
            espacamento: 40,
            estrato: "baixo",
            nome_planta: "Abacaxi",
            sombra: 80,
            tempo_colheita: 730
          }
        ]
      }
    },
    {
      nome_canteiro: "Canteiro2",
      x_canteiro: 800,
      y_canteiro: 300,
      plantas_canteiro: {
        plantas: [
          {
            espacamento: 200,
            estrato: "emergente",
            nome_planta: "Coco",
            sombra: 30,
            tempo_colheita: 1095
          },
          {
            espacamento: 60,
            estrato: "alto",
            nome_planta: "Amora (Fruta)",
            sombra: 50,
            tempo_colheita: 1800
          },
          {
            espacamento: 50,
            estrato: "medio",
            nome_planta: "Almeirão / Radiche",
            sombra: 65,
            tempo_colheita: 70
          },
          {
            espacamento: 40,
            estrato: "baixo",
            nome_planta: "Abóbora",
            sombra: 75,
            tempo_colheita: 90
          }
        ]
      }
    }
  ];

  const count = await Canteiro.count();
  if (count === 0) {
    await Canteiro.bulkCreate(canteirosIniciais);
    console.log("Canteiros de exemplo inseridos.");
  } else {
    console.log(`Base já possui ${count} canteiro(s), não inserindo mocks`);
  }
}