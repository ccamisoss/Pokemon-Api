const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { initializeDatabase } = require('./src/middlewares/middleware.js');
const PORT = process.env.PORT || 3001

conn.sync({force: false}).then(() => {
  server.listen(PORT, async () => {
    await initializeDatabase();  
    console.log('listening at 3001'); // eslint-disable-line no-console
  });
});