(function() {
  angular.module("Pokemons").directive("pokipsi", pokInfo);

  function pokInfo() {
    var directive = {
      templateUrl: "pokInfoDirective.html",
      bindToController: true,
      controller: Controller,
      controllerAs: "vm",
      restrict: "E",
      scope: {
        pok: "=",
        visible: "="
      }
    };
    return directive;
  }

  function Controller() {
    var vm = this;
    console.log(vm.pok);
  }
})();
