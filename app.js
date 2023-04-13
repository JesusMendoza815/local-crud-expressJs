import express from 'express';
import fs from 'fs/promises';
const server = express();
const PORT = 8080;

//middleware - convertir lo que llega en body a un json
server.use(express.json());

server.get('/', (req, res) => {
  const message = {
    message: "Binvenido a mi servidor"
  }
  res.json(message)
});

server.get('/koders', async (req, res) => {
  const response = await fs.readFile('./kodemia.json', 'utf8');
  const data = JSON.parse(response);
  res.json(data.koders);
});

server.post('/koders', async (req, res) => {
  const response = await fs.readFile('./kodemia.json', 'utf8');
  const data = JSON.parse(response);
  const koder = req.body;
  data.koders.push(koder);
  await fs.writeFile('./kodemia.json', JSON.stringify(data, null, 2));
  res.json(`Koder ${koder.name} agregado`)
});

server.patch('/koders/:id', async (req, res) => {
  try {

    const response = await fs.readFile('./kodemia.json', 'utf8');
    const data = JSON.parse(response);
    const id = req.params.id;
    const koder = data.koders.find(koder => koder.id === parseInt(id));
  
    if (!koder) res.status(404).send('Koder no encontrado');
  
    Object.assign(koder, req.body);
    await fs.writeFile('./kodemia.json', JSON.stringify(data, null, 2));
  
    res.json(req.body);

  } catch (error) {
    res.status(404).send('Upss!! Algo falló');
    throw error;
  }
});

server.delete('/koders/:id', async (req, res) => {
  try {

    const response = await fs.readFile('./kodemia.json', 'utf8');
    const data = JSON.parse(response);
    const id = req.params.id;
    const koder = data.koders.findIndex(koder => koder.id === parseInt(id));
    
    if (koder < 0) res.status(404).send('Koder no encontrado');
    data.koders.splice(koder, 1);

    await fs.writeFile('./kodemia.json', JSON.stringify(data, null, 2));
    res.json(`Koder con id: ${id} eliminado`);
    res.end();

  } catch (error) {
    res.status(404).send('Upss!! Algo falló');
    throw error;
  }
});

server.use((req, res) => {
  res.status(404).json('Parece que estas perdido 👀');
});

server.listen(PORT, () => {
  console.log(`Listening server on ${PORT} port`);
});