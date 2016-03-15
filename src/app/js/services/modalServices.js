angular.module('onog.services.modal', [])
  .service('modalServices', function ($uibModal, $state, Parse) {

    return {
      showLogin : showLogin,
      showRegister: showRegister,
      showTourneyRegistration: showTourneyRegistration,
      showCancelRegistration: showCancelRegistration,
      showTournament: showTournament
    };

    function showTournament (tourney, id) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament.html',
        controller: 'onog.controllers.modal.tournament.create.ctrl',
        size: 'lg',
        backdrop: 'static',
        resolve: {
          tournament: function () {
            return tourney;
          },
          id: function () {
            return id;
          },
          title: function () {
            if(id) {
              return 'Edit Tournament';
            }
            return 'Create Tournament';
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

    function showTourneyRegistration (tourney, player) {
      return $uibModal.open({
        templateUrl: 'templates/modals/tournament-registration.html',
        controller: 'onog.controllers.modal.tournament.registration.ctrl',
        size: 'md',
        backdrop: 'static',
        resolve: {
          tourney: function () {
            return tourney;
          },
          player: function () {
            return player;
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

