const { Router } = require('express');
const pokemons = require('./pokemons.js');
const types = require('./types.js');
const { getSortedPokemons } = require('../middlewares/middleware.js');


const router = Router();

router.use('/pokemons', pokemons);
router.use('/types', types)

router.get("/sorted/:by/:order", async (req, res) => {
  const { by, order } = req.params;

  const sortedPokemons = await getSortedPokemons(by, order);

  res.json(sortedPokemons);
});

module.exports = router;