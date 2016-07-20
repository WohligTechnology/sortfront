// var adminurl = "http://blazen.io/";
// var adminurl = "http://localhost/";
var adminurl = "http://104.199.142.53/";
var imgurl = adminurl+"upload/";
var imgpath = imgurl + "readFile";
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
    var navigation = [{
        name: "Funds",
        classis: "active",
        link: "#/page/viewFunds",
        subnav: []
    }, {
        name: "Investment Type",
        classis: "active",
        link: "#/page/viewInvestmentType",
        subnav: []
    }, {
        name: "Users",
        classis: "active",
        link: "#/page/userView",
        subnav: []
    }, {
        name: "Port Folio",
        classis: "active",
        link: "#/page/viewPortFolio",
        subnav: []
    }, {
        name: "Logs",
        classis: "active",
        link: "#/page/viewLogs",
        subnav: []
    }];

    return {
      getnav: function() {
          return navigation;
      },
      makeactive: function(menuname) {
          for (var i = 0; i < navigation.length; i++) {
              if (navigation[i].name == menuname) {
                  navigation[i].classis = "active";
              } else {
                  navigation[i].classis = "";
              }
          }
          return menuname;
      },
      saveApi: function(data, apiName, successCallback, errorCallback) {
          $http.post(adminurl + apiName, data).success(successCallback).error(errorCallback);
      },
      deleteProject: function(data, successCallback, errorCallback) {
          $http.post(adminURL + "project/delete", data).success(successCallback).error(errorCallback);
      },
      findProjects: function(apiName, pagination, successCallback, errorCallback) {
          $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
      },
      findOneProject: function(apiName, urlParams, successCallback, errorCallback) {
          console.log(adminurl + apiName);
          $http.post(adminurl + apiName, urlParams).success(successCallback).error(errorCallback);
      },

      getDropDown: function(apiName, successCallback, errorCallback) {
          $http.post(adminurl + apiName).success(successCallback).error(errorCallback);
      },
      submitLogin: function(data, successCallback, errorCallback) {
          $http.post(adminurl + "register/login", data).success(successCallback).error(errorCallback);
      },
      deleteApi: function(data, successCallback, errorCallback) {
          $http.post(adminURL + "api/delete", data).success(successCallback).error(errorCallback);
      },
      logout: function(successCallback, errorCallback) {
          $http.post(adminurl + "register/logout").success(successCallback).error(errorCallback);
      },
      sideMenu1: function(apiName, pagination, successCallback, errorCallback) {
          $http.post(adminurl + apiName, pagination).success(successCallback).error(errorCallback);
      },

    };
});
