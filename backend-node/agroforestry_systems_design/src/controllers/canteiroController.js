import Canteiro from '../models/canteiro.js';
import { apresentaCanteiro } from '../schemas/canteiro.js';

export const createCanteiro = async (req, res) => {
  try {
    const { nome_canteiro, x_canteiro, y_canteiro, plantas_canteiro } = req.body;
    const canteiro = await Canteiro.create({ nome_canteiro, x_canteiro, y_canteiro, plantas_canteiro });
    res.status(201).json(apresentaCanteiro(canteiro));
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar canteiro', error: error.message });
  }
};

export const getCanteiro = async (req, res) => {
  try {
    const { nome_canteiro } = req.query;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    res.status(200).json(apresentaCanteiro(canteiro));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar canteiro', error: error.message });
  }
};

export const updateCanteiro = async (req, res) => {
  try {
    const { nome_canteiro, x_canteiro, y_canteiro, plantas_canteiro } = req.body;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    if (x_canteiro !== undefined) canteiro.x_canteiro = x_canteiro;
    if (y_canteiro !== undefined) canteiro.y_canteiro = y_canteiro;
    if (plantas_canteiro !== undefined) canteiro.plantas_canteiro = plantas_canteiro;
    await canteiro.save();
    res.status(200).json(apresentaCanteiro(canteiro));
  } catch (error) {
    res.status(400).json({ message: 'Erro ao editar canteiro', error: error.message });
  }
};

export const deleteCanteiro = async (req, res) => {
  try {
    const { nome_canteiro } = req.query;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    await canteiro.destroy();
    res.status(200).json({ message: 'Canteiro removido', nome_canteiro });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar canteiro', error: error.message });
  }
};

export const getAllCanteiros = async (req, res) => {
  try {
    const canteiros = await import('../models/canteiro.js').then(m => m.default.findAll());
    if (!canteiros || canteiros.length === 0) {
      return res.status(404).json({ message: 'No canteiros found' });
    }
    res.status(200).json(canteiros);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canteiros', error: error.message });
  }
};