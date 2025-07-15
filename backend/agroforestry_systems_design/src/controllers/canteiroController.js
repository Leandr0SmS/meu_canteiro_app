import Canteiro from '../models/canteiro.js';
import { apresentaCanteiro, apresenta_canteiro_destribuido } from '../schemas/canteiro.js';
import logger from '../config/logger.js';

export const createCanteiro = async (req, res) => {
  try {
    const { nome_canteiro, x_canteiro, y_canteiro, plantas_canteiro } = req.body;
    const canteiro = await Canteiro.create({ nome_canteiro, x_canteiro, y_canteiro, plantas_canteiro });
    logger.debug(`Criando Canteiro: ${nome_canteiro}`);
    console.log(`Canteiro criado: ${nome_canteiro}`);
    // Return the created canteiro in the response
    res.status(200).json(apresentaCanteiro(canteiro));
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar canteiro', error: error.message });
    console.error(`Erro ao criar canteiro: ${error.message}`);
    logger.debug(`Erro ao criar canteiro: ${error.message}`);
  }
};

export const getCanteiro = async (req, res) => {
  try {
    const { nome_canteiro } = req.query;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    logger.debug(`Canteiro ${nome_canteiro} encontrado`);
    console.log(`Canteiro ${nome_canteiro} encontrado`);
    // Return the found canteiro in the response
    res.status(200).json(apresentaCanteiro(canteiro));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar canteiro', error: error.message });
    console.error(`Erro ao buscar canteiro: ${error.message}`);
    logger.debug(`Erro ao buscar canteiro: ${error.message}`);
  }
};

export const getCanteiroDistribuido = async (req, res) => {
  try {
    const { nome_canteiro } = req.query;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    logger.debug(`Canteiro ${nome_canteiro} encontrado`);
    console.log(`Canteiro ${nome_canteiro} encontrado`);
    // Return the found canteiro in the response
    canteiro.plantas_canteiro_destribuidas = await canteiro.distribuirPlantas();
    // Return the distributed canteiro in the response
    res.status(200).json(apresenta_canteiro_destribuido(canteiro));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar canteiro', error: error.message });
    console.error(`Erro ao buscar canteiro: ${error.message}`);
    logger.debug(`Erro ao buscar canteiro: ${error.message}`);
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
    logger.debug(`Criando Editado: ${nome_canteiro}`);
    console.log(`Canteiro editado: ${nome_canteiro}`);
    // Return the updated canteiro in the response
    res.status(200).json(apresentaCanteiro(canteiro));
  } catch (error) {
    logger.debug(`Erro ao editar canteiro: ${nome_canteiro}`);
    console.log(`Erro ao editar canteiro: ${nome_canteiro}`);
    res.status(400).json({ message: 'Erro ao editar canteiro', error: error.message });
  }
};

export const deleteCanteiro = async (req, res) => {
  try {
    const { nome_canteiro } = req.query;
    const canteiro = await Canteiro.findOne({ where: { nome_canteiro } });
    if (!canteiro) return res.status(404).json({ message: 'Canteiro não encontrado' });
    await canteiro.destroy();
    logger.debug(`Deletando Canteiro: ${nome_canteiro}`);
    console.log(`Canteiro deletado: ${nome_canteiro}`);
    // Return a success message in the response
    res.status(200).json({ message: 'Canteiro removido', nome_canteiro });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar canteiro', error: error.message });
    console.error(`Erro ao deletar canteiro: ${error.message}`);
    logger.debug(`Erro ao deletar canteiro: ${error.message}`);
  }
};

export const getAllCanteiros = async (req, res) => {
  try {
    const canteiros = await import('../models/canteiro.js').then(m => m.default.findAll());
    if (!canteiros || canteiros.length === 0) {
      return res.status(404).json({ message: 'No canteiros found' });
    }
    logger.debug(`Canteiros Encontrados`);
    console.log(`Canteiros encontrados: ${canteiros.length}`);
    // Return the list of canteiros in the response
    res.status(200).json(canteiros);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canteiros', error: error.message });
    console.error(`Erro ao buscar canteiros: ${error.message}`);
    logger.debug(`Erro ao buscar canteiros: ${error.message}`);
  }
};