const { Router } = require("express");
const { Pokemon } = require("../db.js");
const { info, forName, forId } = require("../middlewares/middleware.js");

const router = Router();

router.get("/", async (req, res) => {
  let { name, by } = req.query;
  let pokemonInfo = [];
  if (name) {
    name = name.toLowerCase();
    pokemonInfo = await forName(name);
    if (!pokemonInfo.length) return res.json([]);
    return res.json(pokemonInfo);
  }

  pokemonInfo = await info(by);
  if (!pokemonInfo.length) return res.json({ info: "No hay mas registros" });

  res.json(pokemonInfo);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pokemonInfo = await forId(id);
  if (!pokemonInfo.id) return res.json([]);
  res.json(pokemonInfo);
});

router.post("/", async (req, res) => {
  try {
    let tipos = req.body.tipos;
    const { name, height, weight, hp, attack, defense, speed } =
      req.body.pokemon;

    if (
      isNaN(hp) ||
      isNaN(attack) ||
      isNaN(defense) ||
      isNaN(speed) ||
      isNaN(height) ||
      isNaN(weight)
    ) {
      return res.json({ info: "Alguno de los argumentos no es un numero" });
    }
    if (!name) return res.json({ info: "El nombre es obligatorio" });
    
    const existe = await Pokemon.findOne({ where: { name: name.toLowerCase() } });
    if (existe) return res.json({ info: "El pokemon ya existe" });

    const pokemon = await Pokemon.create({
      name: name.toLowerCase(),
      vida: hp,
      fuerza: attack,
      defensa: defense,
      velocidad: speed,
      altura: height,
      peso: weight,
    });

    if (tipos.length === 0) {
      tipos = [1];
    }
    
    await pokemon.setTipos(tipos)

    res.json({ info: "Pokemon creado" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;