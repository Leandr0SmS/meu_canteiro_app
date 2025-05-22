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

export const addPlanta = (req, res) => {
  res.status(201).json({ id: 1, ...req.body }); // Mock: retorna planta criada
};

export const updatePlanta = (req, res) => {
  res.status(200).json({ message: 'Planta atualizada!' }); // Mock
};

export const deletePlanta = (req, res) => {
  res.status(200).json({ message: 'Planta removida!' }); // Mock
};