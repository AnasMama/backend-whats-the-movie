const app = require('./app');
require('dotenv').config;

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});