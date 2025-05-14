export const getPlantas = (req, res) => {
  res.status(200).json([]); // Mock: retorna lista vazia
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