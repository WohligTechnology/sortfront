// var adminurl = "http://blazen.io/";
var adminurl = "http://localhost:1337/";
var imgurl = "http://192.168.1.122:81/upload/";
var imgpath = imgurl + "readFile";
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
  var navigation = [{
    name: "Funds",
    classis: "active",
    link: "#/page/viewFunds",
    subnav: []
  }, {
    name: "Projects",
    classis: "active",
    link: "#/projects",
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
    saveApi: function(data,apiName, successCallback, errorCallback) {
      console.log(data);
      $http.post(adminurl + apiName, data).success(successCallback).error(errorCallback);
    },
    deleteProject: function(apiName,urlParams, successCallback, errorCallback) {
      $http.post(adminurl + apiName, urlParams).success(successCallback).error(errorCallback);
    },
    findProjects: function(apiName,pagination, successCallback, errorCallback) {
      $http.post(adminurl + apiName,pagination).success(successCallback).error(errorCallback);
    },
    findOneProject: function(apiName,urlParams, successCallback, errorCallback) {
      console.log(apiName);
      console.log(urlParams);
      $http.post(adminurl + apiName,urlParams).success(successCallback).error(errorCallback);
    },
    // saveApi: function(data, successCallback, errorCallback) {
    //   $http.post(adminURL + "api/save", data).success(successCallback).error(errorCallback);
    // },
    deleteApi: function(data, successCallback, errorCallback) {
      $http.post(adminURL + "api/delete", data).success(successCallback).error(errorCallback);
    },

  };
});
