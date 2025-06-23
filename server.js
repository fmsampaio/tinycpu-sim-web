const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Serve arquivos estáticos da build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback para SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});