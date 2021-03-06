app.config(function($routeProvider,$stateProvider, $urlRouterProvider, $sceDelegateProvider){

	var checkLoggedin = function($q, $http, $location, $rootScope) {
       var deferred = $q.defer();

       $http.get('/api/loggedin').success(function(user) {
         if (user !== '0') {
           $rootScope.user = user;
           deferred.resolve();
         } else {
           deferred.reject();
           $location.url('/login');
         }
       });

       return deferred.promise;
     };

  $urlRouterProvider.otherwise("/login")

	$stateProvider
    .state("home", {
      url: "",
      templateUrl:"homepage/homepage.html",
      controller:"HomepageController",
      authenticate: true,
    })
		.state("home.stream", {
      url: "/stream/:roomId",
			templateUrl: "stream/stream.html",
			controller: "StreamController",
      authenticate: true,
      params: {
        roomId:"",
        host: false,
        currentVideo: ""
      }
		})
    .state("home.search", {
      url: "/search/:searchQuery/:searchType",
      templateUrl: "search/search.html",
      controller:"SearchController",
      params: {
        searchQuery: "",
        searchType: ""
      },
      authenticate:true
    })
		.state("login", {
      url: "/login",
			templateUrl: "auth/login.html",
			controller: "AuthController"
		})


	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.youtube.com/**'
  ]);
})