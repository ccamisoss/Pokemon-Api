const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const PORT = process.env.PORT || 3001

conn.sync({force: true}).then(() => {
  server.listen(PORT, () => {
    console.log('listening at 3001'); // eslint-disable-line no-console
  });
});