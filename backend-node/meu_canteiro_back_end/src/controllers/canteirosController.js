export const getCanteiros = (req, res) => {
  res.status(200).json([]); // Mock: retorna lista vazia
};

export const addCanteiro = (req, res) => {
  res.status(201).json({ id: 1, ...req.body }); // Mock: retorna canteiro criado
};

export const updateCanteiro = (req, res) => {
  res.status(200).json({ message: 'Canteiro atualizado!' }); // Mock
};

export const deleteCanteiro = (req, res) => {
  res.status(200).json({ message: 'Canteiro removido!' }); // Mock
};