angular.module("Pokemons").factory("pokemonFactory", function($http) {
  var factory = {};
  factory.getPokemons = function() {
    return pokemons;
  };
  return factory;
});
