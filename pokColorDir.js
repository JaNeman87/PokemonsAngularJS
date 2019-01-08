(function() {
  angular.module("Pokemons").directive("pokColor", pokColor);

  function pokColor() {
    var directive = {
      templateUrl: "pokColorDir.html",
      bindToController: true,
      controller: Controller,
      controllerAs: "vm",
      restrict: "E",
      scope: {
        pok: "=",
        visible: "=",
        clicker: "&"
      }
    };
    return directive;
  }

  function Controller() {
    var vm = this;

    vm.newFunc = newFunc;

    function newFunc(par) {
      if (vm.clicker) {
        vm.clicker()(par);
      }
    }
    console.log(vm.pok);
  }
})();
