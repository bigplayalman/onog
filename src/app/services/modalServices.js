angular.module('onog.services.modal', [])
  .service('modalServices', function ($uibModal, $state, Parse) {

    return {
      showLogin : showLogin,
      showRegister: showRegister,
      showTourneyRegistration: showTourneyRegistration,
      showCancelRegistration: showCancelRegistration,
      showEditRegistration: showEditRegistration,
      createTournament: createTournament
    };

    function createTournament (tourney) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament.html',
        controller: 'onog.controllers.modal.tournament.create.ctrl',
        size: 'lg',
        backdrop: 'static',
        resolve: {
          tournament: function () {
            return tourney;
          }
        }
      });
    }

    function showEditRegistration (player) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament-registration.html',
        controller: 'onog.controllers.modal.tournament.registration.edit.ctrl',
        size: 'md',
        backdrop: 'static',
        resolve: {
          player: function () {
            return player;
          }
        }
      });
    }

    function showLogin () {
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/modals/login.html',
        controller: 'onog.controllers.modal.login.ctrl',
        size: 'sm',
        backdrop: 'static'
      });
    }

    function showRegister () {
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/modals/register.html',
        controller: 'onog.controllers.modal.register.ctrl',
        size: 'sm',
        backdrop: 'static'
      });
    }

    function showTourneyRegistration (tourney) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament-registration.html',
        controller: 'onog.controllers.modal.tournament.registration.ctrl',
        size: 'md',
        backdrop: 'static',
        resolve: {
          tourney: function () {
            return tourney;
          }
        }
      });
    }

    function showCancelRegistration (player, tourney) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament-cancel.html',
        controller: 'onog.controllers.modal.tournament.cancel.ctrl',
        size: 'sm',
        backdrop: 'static',
        resolve: {
          player: function () {
            return player;
          },
          tourney: function () {
            return tourney;
          }
        }
      });
    }


  });

