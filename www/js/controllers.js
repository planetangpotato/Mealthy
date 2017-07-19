angular.module('starter.controllers', [])

// CONTROLLER ROUTING --------------------------------------------------
.controller('routing',function($rootScope){
    $rootScope.previousState;
    $rootScope.currentState;

    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        var a = localStorage.getItem('userdetails');
        if(((a != 'null') && (toState.name == 'log' || toState.name == 'loading')) || ((a == 'null' || a == '') && (fromState.name == 'log'))){
          event.preventDefault();
        }
    })
})

// CONTROLLER LOADING PAGE -----------------------------------------
.controller('loading', function($scope,$state,$rootScope) {

  var start = localStorage.getItem('userdetails');

  setTimeout(function(){
    if(start == 'null' || start == '' || start == null){
      $state.go('log');
    }else{
      $state.go('tab.home');
    }
    
  },3000)
})

// CONTROLLER LOG PAGE -------------------------------------------
.controller('log', function($rootScope,$scope,$state,$http){

  $scope.register_page = function(){
    $scope.login_page = true;
    $scope.lerror = '';
    $scope.serror = '';
  }

  $scope.flogin_page = function(){
    $scope.login_page = false;
    $scope.lerror = '';
    $scope.serror = '';
  }

  $scope.login = function(lusername,lpassword){
    var username = lusername;
    var password = lpassword;

    if(username != null && password != null){
      $scope.lerror = "Please wait....";
      $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'password' : lpassword,
          'username' : lusername,
          'action' : 'login'
        }
      })
      .then(function(response){
        $scope.lerror = response['data'][0];

        if(response['data'][0] == 'Login Successfully!'){
          document.getElementById('lusername').value = '';
          document.getElementById('lpassword').value = '';
          $scope.lerror = '';
          localStorage.setItem('userdetails',JSON.stringify(response['data'][1]));
           $state.go('tab.home');
        }else{
          document.getElementById('lpassword').value = '';
        }
        console.log(response);
      })
  }else{
    
    $scope.lerror = "Please complete the form";

  }
}

  $scope.signup = function(fullname,susername,spassword){
    var username = susername;
    var password = spassword;
    var fullname = fullname;

    if(username != null && password != null && fullname != null){
      $scope.serror = "Please wait....";
      $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'fname' : fullname,
          'password' : spassword,
          'username' : susername,
          'action' : 'signup'
        }
      })
      .then(function(response){
        $scope.serror = response['data'][0];

        if(response['data'][0] == 'Successfully Registered !'){
          document.getElementById('fullname').value = '';
          document.getElementById('susername').value = '';
          document.getElementById('spassword').value = '';
          localStorage.setItem('userdetails',JSON.stringify(response['data'][1]));
           $state.go('tab.home');
           $scope.serror = '';
        }
        console.log(response);
      })
    }else{
      $scope.serror = "Please complete the form";
    }
    
  }

})

// CONTROLLER HOME -----------------------------------
.controller('home',function($scope,$state,$http){

  $scope.$on('$ionicView.beforeEnter', function() {
    responsiveVoice.setDefaultVoice("US English Female");
      var userid = JSON.parse(localStorage.getItem('userdetails'));
      $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'userid' : userid['id'],
          'action' : 'favorites'
        }
      })
      .then(function(response){
        $scope.favoriteslist = response['data'];
        localStorage.setItem('favoriteslist',JSON.stringify(response['data']));
        console.log(response);
      })

    $http({
      url : 'http://api.yummly.com/v1/api/recipes?_app_id=ef8e13d8&_app_key=dd1ea15064341fb164c816fd125e3ef2&requirePictures=true&maxResult=8&start=0&allowedCuisine[]=cuisine^cuisine-american',
      method : 'GET'
    })
    .then(function(data){
      $scope.featured = data['data']['matches'];
      console.log($scope.featured);
    })
  })

  $scope.details = function(iddata){
      localStorage.setItem("recipe_id", iddata);
      localStorage.setItem("details_back", 'tab.home');
      $state.go('details');
  }

  $scope.searchr = function(){
    var q = $scope.recipe_data;
    if(q != null){
      localStorage.setItem("q",q);
      document.getElementById('recipe_data').value = '';
      $state.go('results');
    }
  }


})

// CONTROLLER DETAILS PAGE -------------------------------------
.controller('details',function($scope,$state,$http,$filter){



  $scope.$on('$ionicView.beforeEnter', function() {

    $scope.nutritional = false;
    $scope.save = false;

    var iddata = localStorage.getItem("recipe_id");
     $http({
      url : 'http://api.yummly.com/v1/api/recipe/'+iddata+'?_app_id=ef8e13d8&_app_key=dd1ea15064341fb164c816fd125e3ef2',
      method : 'GET'
    })
    .then(function(data){
      var favoriteslist = JSON.parse(localStorage.getItem('favoriteslist'))
      var res = $filter('filter')(favoriteslist, {'recipeid': data['data']['id']});
      if(res.length > 0){
        $scope.save = true;
      }else{
        $scope.save = false;
      }
      $scope.details = data['data'];
      console.log(data);
      $scope.text = "These are the ingredients needed in "+data['data']['name']+" recipe, " + data['data']['ingredientLines'].join(", ") + ". This recipe is cooked for "+data['data']['totalTime'];

    })
  })

  $scope.play = function(){
    console.log($scope.text);
    $scope.theText = $scope.text;
//      document.addEventListener('deviceready', function () {
//     // basic usage
//     TTS
//         .speak('hello, world!', function () {
//             alert('success');
//         }, function (reason) {
//             alert(reason);
//         });
    
//     // or with more options

// }, false);

TTS
        .speak({
            text: $scope.theText,
            locale: 'en-US',
            rate: 0.75
        }, function () { console.log('success');
    },
    function (reason) {
    });
  }

  $scope.backtohome = function(){
    localStorage.setItem("recipe_id", '');
    var back = localStorage.getItem("details_back");
    $scope.details = '';
    $state.go(back);
    localStorage.setItem("details_back", '');
  }

  $scope.nutritionalshow = function(){
    $scope.nutritional = true;
  }

  $scope.nutritionalhide = function(){
    $scope.nutritional = false;
  }

  $scope.unfollow = function(id){
      var userid = JSON.parse(localStorage.getItem('userdetails'));
      console.log(id);  
      $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'id' : id,
          'userid' : userid['id'],
          'action' : 'unsave'
        }
      })
      .then(function(response){
        console.log(response);
        var userid = JSON.parse(localStorage.getItem('userdetails'));

       $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'userid' : userid['id'],
          'action' : 'favorites'
        }
      })
      .then(function(response){
        $scope.favoriteslist = response['data'];
        localStorage.setItem('favoriteslist',JSON.stringify(response['data']));
        console.log(response);
      })
        $scope.save = true;
        $scope.save = false;
      })
    }

  $scope.saverecipe = function(id,name,img,rating,mins,ingredients,recipeurl,flavors,from){
    var userid = JSON.parse(localStorage.getItem('userdetails'));
    console.log(id+" "+img);
     $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'id' : id,
          'name' : name,
          'img' : img,
          'rating' : rating,
          'mins' : mins,
          'ingredients' : ingredients,
          'recipeurl' : recipeurl,
          // 'facts' : facts,
          'flavors' : flavors,
          'from' : from,
          'userid' : userid['id'],
          'action' : 'save'
        }
      })
      .then(function(response){
        console.log(response);
        var userid = JSON.parse(localStorage.getItem('userdetails'));

       $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'userid' : userid['id'],
          'action' : 'favorites'
        }
      })
      .then(function(response){
        $scope.favoriteslist = response['data'];
        localStorage.setItem('favoriteslist',JSON.stringify(response['data']));
        console.log(response);
      })
        $scope.save = true;
      })
  }

})

// CONTROLLER RESULTS PAGE ---------------------------------------
.controller('results', function($scope,$state,$http){

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.loadingr = false;
    var q = localStorage.getItem("q");

     $http({
      url : 'http://api.yummly.com/v1/api/recipes?q='+q+'&_app_id=ef8e13d8&_app_key=dd1ea15064341fb164c816fd125e3ef2&requirePictures=true&maxResult=8&start=0',
      method : 'GET'
    })
    .then(function(data){
      $scope.qresult = data['data']['matches'];
      console.log($scope.qresult);
      if(data['data']['matches'].length == 0){
        $scope.resultsrr = "No results found";
      }else{
        $scope.resultsrr = "Results";
      }
      $scope.loadingr = true;
    })
    
    document.getElementById('q').value = q;
    $scope.q = q;
  })

  $scope.backtohome2 = function(){
    $scope.qresult = '';
    localStorage.setItem("q",'');
    $scope.q = '';
    document.getElementById('q').value = '';
    $state.go('tab.home');
  }

    $scope.details = function(iddata){
      localStorage.setItem("recipe_id", iddata);
      localStorage.setItem("details_back", 'results');
      $state.go('details');
  }

    $scope.searchinresult = function(){

      if($scope.resq != null || $scope.resq != localStorage.getItem("q")){

      localStorage.setItem("q" , $scope.resq);
      var q = localStorage.getItem("q");

     $http({
        url : 'http://api.yummly.com/v1/api/recipes?q='+q+'&_app_id=ef8e13d8&_app_key=dd1ea15064341fb164c816fd125e3ef2&requirePictures=true&maxResult=8&start=0',
        method : 'GET'
      })
      .then(function(data){
        $scope.qresult = data['data']['matches'];
        console.log($scope.qresult);
      })
    
    document.getElementById('q').value = q;
    $scope.q = q;
    }
    } 
})


// CONTROLLER SEARCH PAGE ------------------------------------
.controller('search',function($scope,$state,$http){
  var ing = [];
  $scope.searchi = function(){
    var a = document.getElementById('ingredients').value;
      if(a != null || a != "" || a != " "){
        console.log(a);
      }
      ing.push(a);
      document.getElementById('ingredients').value = "";
      console.log(ing);
      $scope.ilist = ing;

      if(ing != ""){
        $scope.sbutton = true;
      }else{
        $scope.sbutton = false;
      }
      
  }

  $scope.del = function(id){
    ing.splice(id,1);
    $scope.ilist = ing;

    if(ing != ""){
        $scope.sbutton = true;
      }else{
        $scope.sbutton = false;
      }

  }

  $scope.searchri = function(){
    var list = "";
    var parameter = "";
    ing.forEach( function(element, index) {
      if(index == 0){
        list += element;
        element = element.replace(' ','%20');
        parameter += 'allowedIngredient[]='+element;
      }else{
        list += ','+element;
        element = element.replace(' ','%20');
        parameter += '&allowedIngredient[]='+element;
      }
    });
    console.log(list);
    console.log(parameter);
    localStorage.setItem("ri",parameter);
    localStorage.setItem("ril",list);
    $state.go('resultsri');

   
  }
})

// CONTROLLER RESULTS INGREDIENT SEARCH PAGE --------------------------
.controller('resultsri',function($scope,$state,$http){

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.loadingi = false;
    var ri = localStorage.getItem("ri");
    var ril = localStorage.getItem("ril");

     $http({
      url : 'http://api.yummly.com/v1/api/recipes?_app_id=ef8e13d8&_app_key=dd1ea15064341fb164c816fd125e3ef2&requirePictures=true&maxResult=8&start=0&'+ri,
      method : 'GET'
    })
    .then(function(data){
      $scope.loadingi = true;
      $scope.resultri = data['data']['matches'];
      console.log($scope.resultri);
      if(data['data']['matches'].length == 0){
        $scope.resultsrii = "No results found";
      }else{
        $scope.resultsrii = "Results";
      }
    })
    
    $scope.ril = ril;
  })

   $scope.backtosri = function(){
    $scope.resultri = '';
    localStorage.setItem("ril",'');
    localStorage.setItem("ri",'');
    $scope.ril = '';
    $state.go('tab.search');
  }

   $scope.details = function(iddata){
      localStorage.setItem("recipe_id", iddata);
      localStorage.setItem("details_back", 'resultsri');
      $state.go('details');
  }

})

// CONTROLLER ACCOUNT -------------------------------------------------
.controller('account',function($scope,$state,$http){

   $scope.$on('$ionicView.beforeEnter', function() {
      $scope.alabel = 'Account';
      $scope.settingsval = false;
      $scope.editval = false;
      var userdetails = JSON.parse(localStorage.getItem("userdetails"));
      $scope.afname = userdetails['fname'];
      $scope.sfname = userdetails['fname'];
      $scope.susername = userdetails['username'];
      document.getElementById('settingfname').value = userdetails['fname'];
      document.getElementById('settinguname').value = userdetails['username'];
      responsiveVoice.setDefaultVoice("US English Female");
      var userid = JSON.parse(localStorage.getItem('userdetails'));

       $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'userid' : userid['id'],
          'action' : 'favorites'
        }
      })
      .then(function(response){
        console.log(response);
        $scope.favoriteslist = response['data'];
        localStorage.setItem('favoriteslist',JSON.stringify(response['data']));
        console.log(response);
      })



  })

   $scope.logout = function(){
    $state.go('log');
    localStorage.setItem("userdetails", null);
    $state.go('log');
   }

   $scope.settings = function(){
      if($scope.settingsval == false){
        $scope.settingsval = true;
        $scope.editval = false;
        $scope.alabel = 'Hide';
      }else{
        $scope.settingsval = false;
        $scope.editval = false;
        $scope.alabel = 'Account';
      } 
   }

   $scope.editaccount = function(){
    if($scope.editval == false){
      $scope.editval = true;

      document.getElementById('settingfname').value = JSON.parse(localStorage.getItem("userdetails"))['fname'];
      document.getElementById('settinguname').value = JSON.parse(localStorage.getItem("userdetails"))['username'];
    }else{
      $scope.editval = false;
    }
   }

   $scope.savechanges = function(){
      var f = document.getElementById('settingfname').value;
      var u = document.getElementById('settinguname').value;
      var o = JSON.parse(localStorage.getItem("userdetails"))['username'];
      var id = JSON.parse(localStorage.getItem("userdetails"))['id'];
      if(f == '' || u == ''){
        $scope.selabel = "Please complete the form";
      }else{
        $scope.selabel = "Please wait";
        $http({
        url : 'https://mealthy.000webhostapp.com/action.php',
        method : 'POST',
        data : {
          'id' : id,
          'old' : o,
          'fname' : f,
          'uname' : u,
          'action' : 'update'
        }
      })
      .then(function(response){
        console.log(response['data'][0]);
        localStorage.setItem('userdetails',JSON.stringify(response['data'][0]));
        $scope.afname = response['data'][0]['fname'];
        $scope.sfname = response['data'][0]['fname'];
        $scope.susername = response['data'][0]['username'];
        document.getElementById('settingfname').value = response['data'][0]['fname'];
        document.getElementById('settinguname').value = response['data'][0]['username'];
        $scope.selabel = "";
        
      })

      }
   }

   $scope.detailsf = function(id){
    localStorage.setItem("recipe_id", id);
      localStorage.setItem("details_back", 'tab.account');
      $state.go('details');
   }

 

})


