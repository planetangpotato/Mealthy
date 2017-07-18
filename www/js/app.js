angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom'); 
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('loading', {
    url: '/loading',
    templateUrl: 'templates/loading.html'
  })

   .state('log', {
    url: '/log',
    templateUrl: 'templates/log.html'
  })


  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })


  .state('tab.home', {
    url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home.html'
        }
      }
  })

  .state('results', {
    url: '/results',
    templateUrl: 'templates/results.html'
  })

   .state('resultsri', {
    url: '/resultsri',
    templateUrl: 'templates/resultsri.html'
  })

  .state('details', {
    url: '/details',
    templateUrl: 'templates/details.html'
  })

  .state('detailsf', {
    url: '/detailsf',
    templateUrl: 'templates/detailsf.html'
  })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/search.html'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
          templateUrl: 'templates/chat-detail.html'
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loading');

});
