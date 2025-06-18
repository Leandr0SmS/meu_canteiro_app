import Planta from '../models/Planta.js';
import { apresentaPlantas, apresentaPlanta } from '../schemas/plantas.js';
import logger from '../config/logger.js';

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
    if (!id_planta) {
      return res.status(400).json({ message: 'ID não informado' });
    }
    
    const planta = await Planta.findByPk(id_planta);
    if (!planta) {
      return res.status(404).json({ message: 'Planta não encontrada' });
    }
    
    return res.status(200).json(apresentaPlanta(planta));
  } catch (error) {
    console.error(`Erro ao buscar planta: ${error.message}`);
    return res.status(500).json({ 
      message: 'Erro ao buscar planta', 
      error: error.message 
    });
  }
};

export const addPlanta = async (req, res) => {
  try {
    // Extract data from FormData
    const nome_planta = req.body.nome_planta;
    const estrato = req.body.estrato;
    const tempo_colheita = parseInt(req.body.tempo_colheita);
    const espacamento = parseFloat(req.body.espacamento);

    logger.debug(`Tentando adicionar planta: ${nome_planta}`);
    
    // Create new plant
    const planta = await Planta.create({
      nome_planta,
      tempo_colheita,
      estrato,
      espacamento
    });

    logger.debug(`Planta adicionada: ${planta.nome_planta}`);
    return res.status(200).json(apresentaPlanta(planta));

  } catch (error) {
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.warning(`Erro: planta duplicada '${req.body.nome_planta}'`);
      return res.status(409).json({ 
        message: "Planta de mesmo nome já existe na base" 
      });
    }

    // Handle other errors
    logger.error(`Erro ao adicionar planta: ${error.message}`);
    return res.status(400).json({ 
      message: "Não foi possível salvar nova planta",
      error: error.message 
    });
  }
};

export const updatePlanta = async (req, res) => {
  try {
    // Receive plant name and other fields from body (FormData)
    const plant_name = req.body.nome_planta;
    const harvest_time = req.body.tempo_colheita;
    const layer = req.body.estrato;
    const spacing = req.body.espacamento;

    if (!plant_name) {
      return res.status(400).json({ message: 'Plant name not provided' });
    }

    logger.debug(`Editing plant: ${plant_name}`);

    // Find plant by name
    const plant = await Planta.findOne({ where: { nome_planta: plant_name } });
    if (!plant) {
      const error_msg = "Plant not found in database";
      logger.warn(`Error editing plant ${plant_name}: ${error_msg}`);
      return res.status(404).json({ message: error_msg });
    }

    // Update only provided fields
    if (harvest_time !== undefined) plant.tempo_colheita = parseInt(harvest_time);
    if (layer !== undefined) plant.estrato = layer;
    if (spacing !== undefined) plant.espacamento = parseFloat(spacing);

    await plant.save();

    logger.debug(`Plant updated: ${plant_name}`);
    return res.status(200).json({
      message: "Plant updated",
      plant_name: plant.nome_planta
    });

  } catch (error) {
    logger.error(`Error updating plant: ${error.message}`);
    return res.status(400).json({
      message: "Could not update plant",
      error: error.message
    });
  }
};

export const deletePlanta = async (req, res) => {
  try {
    const { id_planta } = req.params;
    
    const planta = await Planta.findByPk(id_planta);
    if (!planta) {
      return res.status(404).json({ 
        message: "Planta não encontrada na base :/" 
      });
    }

    const nomePlanta = planta.nome_planta;
    await planta.destroy();
    
    logger.debug(`Deletada planta #${id_planta}`);
    return res.status(200).json({
      message: "Planta removida",
      nome_planta: nomePlanta
    });

  } catch (error) {
    console.error(`Erro ao deletar planta: ${error.message}`);
    return res.status(500).json({ 
      message: "Erro ao deletar planta",
      error: error.message 
    });
  }
};