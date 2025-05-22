import Planta from '../models/Planta.js';
import { apresentaPlantas, apresentaPlanta } from '../schemas/plantas.js';

export const getPlantas = async (req, res) => {
  try {
    const plantas = await Planta.findAll();
    res.status(200).json(apresentaPlantas(plantas));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar plantas', error: error.message });
  }
};

export const getPlantaById = async (req, res) => {
  try {
    const { id_planta } = req.params;
    if (!id_planta) return res.status(400).json({ message: 'ID não informado' });
    
    const planta = await Planta.findByPk(id_planta);
    if (!planta) return res.status(404).json({ message: 'Planta não encontrada' });
    
    res.status(200).json(apresentaPlanta(planta));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar planta', error: error.message });
  }
};

export const addPlanta = async (req, res) => {
  try {
    const { nome_planta, tempo_colheita, estrato, espacamento } = req.body;
    
    // Create new plant
    const planta = await Planta.create({
      nome_planta,
      tempo_colheita,
      estrato,
      espacamento
    });

    console.log(`Planta adicionada: ${planta.nome_planta}`);
    return res.status(200).json(apresentaPlanta(planta));

  } catch (error) {
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.warn(`Erro: planta duplicada '${req.body.nome_planta}'`);
      return res.status(409).json({ 
        message: "Planta de mesmo nome já existe na base" 
      });
    }

    // Handle other errors
    console.error(`Erro ao adicionar planta: ${error.message}`);
    return res.status(400).json({ 
      message: "Não foi possível salvar nova planta",
      error: error.message 
    });
  }
};

export const updatePlanta = (req, res) => {
  res.status(200).json({ message: 'Planta atualizada!' }); // Mock
};

export const deletePlanta = (req, res) => {
  res.status(200).json({ message: 'Planta removida!' }); // Mock
};