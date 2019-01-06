angular.module("Pokemons", []).controller("pokemonCtrl", function($http) {
  var pokemon = this;
  pokemon.pokemons = [];
  pokemon.pokemonColors = [];
  pokemon.pokemonAbilities;
  pokemon.pokemonWeight = [];
  pokemon.pokemonHeight = [];
  pokemon.singlePokemonName = [];
  pokemon.singlePokemonImage = "";
  pokemon.foundPokemon = null;
  pokemon.pokemonByColor = [];
  pokemon.pokemonsByColorWithImage = [];
  pokemon.foundColor = null;
  pokemon.loading = false;

  $http({
    method: "GET",
    url: "https://pokeapi.co/api/v2/pokemon/"
  }).then(
    function successCallback(response) {
      var fetchedPokemons = [];
      for (let key in response.data.results) {
        fetchedPokemons.push({
          ...response.data.results[key]
        });
      }
      pokemon.pokemons = fetchedPokemons.map(function(pok) {
        return pok.name;
      });
    },
    function errorCallback(response) {
      console.log(response);
    }
  );

  $http({
    method: "GET",
    url: "https://pokeapi.co/api/v2/pokemon-color/"
  }).then(
    function successCallback(response) {
      var fetchedColors = [];
      for (let key in response.data.results) {
        fetchedColors.push({
          ...response.data.results[key]
        });
      }
      pokemon.pokemonColors = fetchedColors.map(function(color) {
        return color.name;
      });
    },
    function errorCallback(response) {
      console.log(response);
    }
  );

  pokemon.searchBtn = function(keyEvent) {
    // if (keyEvent.which === 13) alert("I am an alert");

    if (pokemon.inputVal === undefined) {
      return;
    }

    if (pokemon.pokemons.indexOf(pokemon.inputVal) > -1) {
      pokemon.foundPokemon = true;
      $http({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${pokemon.inputVal}/`
      }).then(
        function successCallback(response) {
          var abilities = [];
          var ability = [];
          pokemon.pokemonWeight = response.data.weight;
          pokemon.pokemonHeight = response.data.height;
          pokemon.singlePokemonName = response.data.name;
          pokemon.singlePokemonImage = response.data.sprites.front_shiny;

          for (let key in response.data.abilities) {
            abilities.push({
              ...response.data.abilities[key]
            });
          }
          for (let key in abilities) {
            ability.push({
              ...abilities[key].ability
            });
          }

          pokemon.pokemonAbilities = ability.map(function(abi) {
            return abi.name;
          });
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
    } else {
      pokemon.foundPokemon = false;
    }

    if (pokemon.pokemonColors.indexOf(pokemon.inputVal) > -1) {
      pokemon.foundColor = true;
      $http({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon-color/${pokemon.inputVal}/`
      }).then(
        function successCallback(response) {
          var fetchedColor = [];
          for (let key in response.data.pokemon_species) {
            fetchedColor.push({
              ...response.data.pokemon_species[key]
            });
          }
          pokemon.pokemonByColor = fetchedColor.map(function(pok) {
            return pok.name;
          });
          pokemon.pokemonByColorHandler();
          pokemon.pokemonsByColorWithImage = [];
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
    } else {
      pokemon.foundColor = false;
    }
    pokemon.inputVal = "";
  };

  pokemon.pokemonByColorHandler = async function() {
    for (let pok of pokemon.pokemonByColor) {
      await $http({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${pok}/`
      }).then(
        function successCallback(response) {
          pokemon.pokemonsByColorWithImage.push({
            name: response.data.name,
            image: response.data.sprites.front_shiny
          });
          pokemon.loading = true;
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
    }
    pokemon.loading = false;
    console.log(pokemon.loading);
  };

  pokemon.sort = function() {
    pokemon.pokemonsByColorWithImage.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  pokemon.onPokemonClick = function(name) {
    if (name !== "") {
      pokemon.foundPokemon = true;
      $http({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${name}/`
      }).then(
        function successCallback(response) {
          var abilities = [];
          var ability = [];
          pokemon.pokemonWeight = response.data.weight;
          pokemon.pokemonHeight = response.data.height;
          pokemon.singlePokemonName = response.data.name;
          pokemon.singlePokemonImage = response.data.sprites.front_shiny;

          for (let key in response.data.abilities) {
            abilities.push({
              ...response.data.abilities[key]
            });
          }
          for (let key in abilities) {
            ability.push({
              ...abilities[key].ability
            });
          }

          pokemon.pokemonAbilities = ability.map(function(abi) {
            return abi.name;
          });
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
      pokemon.foundColor = false;
    } else {
      console.log(false);
      pokemon.foundPokemon = false;
    }
  };
  console.log(pokemon.loading);
});
