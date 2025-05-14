import request from 'supertest';
import app from '../src/app.js';

describe('Endpoints de Canteiros', () => {
  it('GET /canteiros deve retornar lista de canteiros', async () => {
    const res = await request(app).get('/canteiros');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /canteiros deve adicionar um canteiro', async () => {
    const res = await request(app)
      .post('/canteiros')
      .send({ nome: 'Canteiro 1', localizacao: 'Sul' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /canteiros/:id deve atualizar um canteiro', async () => {
    const res = await request(app)
      .put('/canteiros/1')
      .send({ nome: 'Canteiro Atualizado', localizacao: 'Norte' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /canteiros/:id deve remover um canteiro', async () => {
    const res = await request(app).delete('/canteiros/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});