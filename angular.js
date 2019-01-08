(function() {
  var Pokemons = angular.module("Pokemons", []);

  Pokemons.controller("pokemonCtrl", function($http, pokemonFactory) {
    var p = this;
    p.pokemons = [];
    p.colors = [];
    p.pokemonAbilities;
    p.singlePokemonImage = "";
    p.foundPokemon = null;
    p.pokemonByColor = [];
    p.pokemonsByColorWithImage = [];
    p.foundColor = null;
    p.loading = false;
    p.pok = [];

    p.searchBtn = searchButtonClick;

    activate();

    /////////////////////////////

    function activate() {
      // ako treba nesto
      // get colors
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
          p.colors = fetchedColors.map(function(color) {
            return color.name;
          });
          console.log(p.colors);
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
    }

    function searchButtonClick() {
      if (p.inputVal === undefined || p.inputVal === "") {
        return;
      }

      if (p.colors.indexOf(p.inputVal) > -1) {
        getPokemonByColor();
        p.foundColor = true;
        p.foundPokemon = false;
      } else {
        p.foundColor = false;
        getPokemonByName();
      }

      function getPokemonByName() {
        $http({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon/${p.inputVal}/`
        }).then(
          function successCallback(response) {
            p.foundPokemon = true;
            var abilities = [];
            var ability = [];
            p.pok = response.data;
            console.log(response.data.abilities);
          },
          function errorCallback(response) {
            console.log(response.xhrStatus);
            response.xhrStatus === "error" ? (p.foundPokemon = false) : null;
          }
        );
      }

      function getPokemonByColor() {
        $http({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon-color/${p.inputVal}/`
        }).then(
          function successCallback(response) {
            var fetchedColor = [];
            for (let key in response.data.pokemon_species) {
              fetchedColor.push({
                ...response.data.pokemon_species[key]
              });
            }
            p.pokemonByColor = fetchedColor.map(function(pok) {
              return pok.name;
            });
            p.pokemonByColorHandler();
            p.pokemonsByColorWithImage = [];
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      }
      p.inputVal = "";
    }

    p.pokemonByColorHandler = function() {
      for (let pok of p.pokemonByColor) {
        $http({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon/${pok}/`
        }).then(
          function successCallback(response) {
            p.pokemonsByColorWithImage.push({
              name: response.data.name,
              image: response.data.sprites.front_shiny
            });
            p.loading = true;
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
      }
      p.loading = false;
      console.log(p.loading);
    };

    p.sort = function() {
      p.pokemonsByColorWithImage.sort((a, b) => a.name.localeCompare(b.name));
    };

    p.onPokemonClick = function(name) {
      console.log(name);
      if (name !== "") {
        p.foundPokemon = true;
        $http({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon/${name}/`
        }).then(
          function successCallback(response) {
            var abilities = [];
            var ability = [];
            p.pok = response.data;
            p.singlePokemonImage = response.data.sprites.front_shiny;

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

            p.pokemonAbilities = ability.map(function(abi) {
              return abi.name;
            });
          },
          function errorCallback(response) {
            console.log(response);
          }
        );
        p.foundColor = false;
      } else {
        console.log(false);
        p.foundPokemon = false;
      }
    };
    console.log(p.loading);
  });
})();
