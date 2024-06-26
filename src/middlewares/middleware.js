const fetch = require("node-fetch");
const { Pokemon, Tipo } = require("../db.js");

const info = async (by) => {
  try {
    const api = await fetch("https://pokeapi.co/api/v2/pokemon?limit=40");
    const data = await api.json();
    const bd = await Pokemon.findAll({ include: Tipo });

    let base = [...bd, ...data.results];

    if (by === "2") {
      base = [...bd];
    } else if (by === "1") {
      base = [...data.results];
    }

    let pokemonInfo = [];
    for (i = 0; i < base.length; i++) {
      if (!base[i]) return pokemonInfo;
      if (base[i].url) {
        const pokemon = await fetch(base[i].url);
        const info = await pokemon.json();

        pokemonInfo.push({
          id: info.id,
          name: info.name,
          type: info.types.map((t) => t.type.name),
          img: info.sprites.versions["generation-v"]["black-white"].animated
            .front_default,
          fuerza: info.stats[1].base_stat,
        });
      } else {
        pokemonInfo.push({
          id: base[i].id,
          idPoke: base[i].idPoke,
          name: base[i].name,
          type: base[i].tipos.map((t) => t.name),
          fuerza: base[i].fuerza,
          img: undefined,
        });
      }
    }
    // const poke = await Pokemon.findAll({ include: Tipo });
    // pokemonInfo.push({ ...poke });
    return pokemonInfo;
  } catch (error) {
    console.log('FETCH ERROR:', error)
  }
};

const getSortedPokemons = async (by, order) => {
  try {
    const pokemons = await info();
    let sortedPokemons = [];

    if (by === "fuerza") {
      order === "asc"
        ? sortedPokemons = pokemons.sort((a, b) => a.fuerza - b.fuerza)
        : sortedPokemons = pokemons.sort((a, b) => b.fuerza - a.fuerza);
    } else {
      order === "asc"
        ? sortedPokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name))
        : sortedPokemons = pokemons.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sortedPokemons;
  } catch (error) {
    console.error("Hubo un error al solicitar los pokemones", error);
  }
};

const forName = async (name) => {
  try {
    const db = await Pokemon.findOne({
      where: {
        name: name,
      },
      include: Tipo,
    });
    if (db) {
      const pokemonDb = [
        {
          id: db.id,
          idPoke: db.idPoke,
          name: db.name,
          type: db.tipos.map((t) => t.name),
          img: undefined,
        },
      ];
      return pokemonDb;
    } else {
      const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await api.json();
      const pokemonName = [
        {
          id: data.id,
          name: data.name,
          type: data.types.map((t) => t.type.name),
          img: data.sprites.versions["generation-v"]["black-white"].animated
            .front_default,
        },
      ];
      return pokemonName;
    }
  } catch (error) {
    return [];
  }
};

const forId = async (id) => {
  try {
    const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await api.json();

    const pokemonId = {
      id: data.id,
      name: data.name,
      type: data.types.map((t) => t.type.name),
      img: data.sprites.versions["generation-v"]["black-white"].animated
        .front_default,
      vida: data.stats[0].base_stat,
      fuerza: data.stats[1].base_stat,
      defensa: data.stats[2].base_stat,
      velocidad: data.stats[5].base_stat,
      height: data.height,
      weight: data.weight,
    };

    return pokemonId;
  } catch (error) {}
  try {
    const db = await Pokemon.findByPk(id, { include: Tipo });
    const pokemonDb = {
      id: db.idPoke,
      name: db.name,
      type: db.tipos.map((t) => t.name),
      img: undefined,
      vida: db.vida,
      fuerza: db.fuerza,
      defensa: db.defensa,
      velocidad: db.velocidad,
      height: db.altura,
      weight: db.peso,
    };

    return pokemonDb;
  } catch (error) {
    return {};
  }
};

const initializeDatabase = async () => {
  try {
    const api = await fetch('https://pokeapi.co/api/v2/type');
    const types = await api.json();

    for (const t of types.results) {
      const existe = await Tipo.findOne({ where: { name: t.name } });
      if (existe) return await Tipo.findAll();
      await Tipo.create({ name: t.name });
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
};


module.exports = {
  info,
  forName,
  forId,
  getSortedPokemons,
  initializeDatabase,
};
