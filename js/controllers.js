var adminURL = "http://wohlig.io:81/";
window.uploadurl = "http://192.168.1.122:81/" + "upload/";
var mockURL = adminURL + "callApi/";

angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngSanitize', 'ngMaterial', 'ngMdIcons', 'ui.sortable', 'angular-clipboard', 'imageupload'])

.controller('LoginCtrl', function($scope, TemplateService, NavigationService, $timeout, $state) {
    $scope.menutitle = NavigationService.makeactive("Login");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.successmsg = "";

    $scope.user = '';
    $scope.submitLogin = function(user) {
        NavigationService.submitLogin(user, function(data) {
            console.log(data);
            if (data.value === true) {
                $state.go("page", {
                    jsonName: "userView"
                });
                $.jStorage.set("user", data);
            } else if (data.value === false) {
                $scope.successmsg = "Email or Password is wrong";
            }
        }, function() {
            console.log("Fail");
        });
    };
})

.controller('UsersCtrl', function($scope, TemplateService, NavigationService, $timeout) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("users");
    $scope.menutitle = NavigationService.makeactive("Users");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.field = {};
    $scope.onimageupload = function(data) {
        console.log(data);
    };
})

.controller('jsonViewCtrl', function($scope, TemplateService, NavigationService, $timeout, $stateParams, $http, $mdDialog, $state, $filter, $location) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("users");
    $scope.menutitle = NavigationService.makeactive("Users");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    var jsonArr = $stateParams.jsonName.split("¢");
    var jsonName = jsonArr[0];
    var urlParams = {};
    $scope.dropdown = {};
    $scope.dropdownvalues = [];
    $scope.sidemenuVal = $stateParams;
    var jsonParam1 = jsonArr[1];
    var jsonParam2 = jsonArr[2];
    var jsonParam3 = jsonArr[3];
    var jsonParam4 = jsonArr[4];
    var jsonParam5 = jsonArr[5];
    var jsonParam6 = jsonArr[6];
    var jsonParam7 = jsonArr[7];
    var jsonParam8 = jsonArr[8];
    var jsonParam9 = jsonArr[9];

    $scope.confirm = function(title, content, api, data) {
        var confirm = $mdDialog.confirm()
            .title(title)
            .textContent(content)
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            $http.post(api, data).success(function(data) {
                $state.reload();
                showToast("Deleted Successfully");
            }, function() {
                showToast("Error Deleting");
            });
        }, function() {

        });
    };

    $http.get("./pageJson/" + jsonName + ".json").success(function(data) {

        _.each(data.urlFields, function(n, key) {
            urlParams[n] = jsonArr[key + 1];
        });
        console.log(urlParams);
        $scope.json = data;
        console.log($scope.json);
        if ($scope.json.sidemenu && $scope.json.sidemenu.length > 0) {
            $scope.sidemenuThere = true;
        }
        var idForCreate = $location.absUrl().split('%C2%A2')[1];

        console.log(idForCreate);
        $scope.idForCreate = idForCreate;
        if (idForCreate) {
            $scope.goToCreatePage = function() {
                console.log("In create");
                $location.url("/page/" + $scope.json.createButtonUrl + idForCreate);
            };

        }
        if (data.pageType == "create") {
            $scope.goToCancelPageCreate = function() {
                $location.url("/page/" + $scope.json.action[1].url + idForCreate);
            };
            _.each($scope.json.fields, function(n) {
                if (n.type == "select") {
                    n.model = "";
                    n.url.unshift({
                        "value": "",
                        "name": "SELECT"
                    });
                } else if (n.type == "selectFromTable") {
                    n.model = "";
                }
            });
            // get select fields dropdown
            _.each($scope.json.fields, function(n) {
                if (n.type == "selectFromTable") {
                    NavigationService.getDropDown(n.url, function(data) {
                      console.log(data);
                        n.dropdownvalues= [];
                        if (data) {
                            for (var i = 0; i < data.data.length; i++) {


                                var dropdown = {};
                                dropdown._id = data.data[i]._id;
                                if(!n.dropDownName)
                                {
                                    dropdown.name = data.data[i].name;
                                }
                                else {
                                    dropdown.name = data.data[i][n.dropDownName];
                                }

                                n.dropdownvalues.push(dropdown);
                            }


                        }
                    }, function() {
                        console.log("Fail");
                    });
                }
            });


        } else if (data.pageType == "edit") {
            var urlid1 = $location.absUrl().split('%C2%A2')[1];
            var urlid2 = $location.absUrl().split('%C2%A2')[2];
            console.log($scope.json.action[1].url + urlid2);
            if (urlid2) {
                $scope.goToCancelPage = function() {
                    $scope.cancelUrl = $scope.json.action[1].url + urlid2;
                    console.log($scope.cancelUrl);
                    $location.url("/page/" + $scope.json.action[1].url + urlid2);
                };

            }
            console.log(urlid1);
            console.log(urlid2);
            $scope.idForEdit = urlid2;
            NavigationService.findOneProject($scope.json.preApi.url, urlParams, function(data) {

                $scope.json.editData = data.data;
                console.log($scope.json.editData);
            }, function() {
                console.log("Fail");
            });
            // get select fields dropdown
            // _.each($scope.json.fields, function(n) {
            //     if (n.type == "selectFromTable") {
            //         NavigationService.getDropDown(n.url, function(data) {
            //             if (data) {
            //                 for (var i = 0; i < data.data.length; i++) {
            //                     $scope.dropdown = {};
            //                     $scope.dropdown._id = data.data[i]._id;
            //                     $scope.dropdown.name = data.data[i].name;
            //                     $scope.dropdownvalues.push($scope.dropdown);
            //                     console.log($scope.dropdownvalues);
            //                 }
            //             }
            //         }, function() {
            //             console.log("Fail");
            //         });
            //     }
            // });
            // get select fields dropdown
            _.each($scope.json.fields, function(n) {
                if (n.type == "selectFromTable") {
                    NavigationService.getDropDown(n.url, function(data) {
                        console.log(data);
                        n.dropdownvalues = [];
                        if (data) {
                            for (var i = 0; i < data.data.length; i++) {
                                var dropdown = {};
                                dropdown._id = data.data[i]._id;
                                if (!n.dropDownName) {
                                    dropdown.name = data.data[i].name;
                                } else {
                                    dropdown.name = data.data[i][n.dropDownName];
                                }
                                n.dropdownvalues.push(dropdown);
                            }
                        }
                    }, function() {
                        console.log("Fail");
                    });
                }
            });
        } else if (data.pageType == "view") {
            var pagination = {
                "search": "",
                "pagenumber": "1",
                "pagesize": "10"
            };
            // SIDE MENU DATA
            var urlid1 = $location.absUrl().split('%C2%A2')[1];
            // var urlid2 = $location.absUrl().split('%C2%A2')[2];
            $scope.pagination1 = {};
            if (urlid1) {
                $scope.api1 = $scope.json.sidemenu[1].callFindOne;
                if ($scope.json.sidemenu[1].sendParam && $scope.json.sidemenu[1].sendParam !== '') {
                    // ARRAY
                    $scope.pagination1._id = urlid1;
                    NavigationService.sideMenu1($scope.api1, $scope.pagination1, function(data) {
                        if (data.data.nominee) {
                            $scope.json.tableData = data.data;
                            console.log("IF");
                            console.log($scope.json.tableData);
                        }
                    }, function() {
                        console.log("fail");
                    });
                } else {
                    console.log("ELSE");
                    pagination._id = urlid1;
                    NavigationService.sideMenu1($scope.api1, pagination, function(data) {
                        $scope.json.tableData = data.data.data;
                        console.log($scope.json.tableData);

                    }, function() {
                        console.log("fail");
                    });
                }
            }
            // call api for view data
            $scope.apiName = $scope.json.apiCall.url;

            NavigationService.findProjects($scope.apiName, pagination, function(data) {
                $scope.json.tableData = data.data.data;
            }, function() {
                console.log("Fail");
            });
            console.log("hij");
        }
        $scope.template = TemplateService.jsonType(data.pageType);
    }).error(function(data) {
        console.log(data);
    });

    // ACTION
    $scope.performAction = function(action, result) {
        var pageURL = "";
        // FOR EDIT
        if (action.action == 'redirect') {
            pageURL = action.jsonPage;
            if (action.fieldsToSend) {
                _.each(action.fieldsToSend, function(n) {
                    pageURL += "¢" + $filter("getValue")(result, n);
                });
            }
            $state.go("page", {
                jsonName: pageURL
            });
        } else if (action.action == 'apiCallConfirm') {
            pageURL = adminurl + action.api;
            var data = {};
            if (action.fieldsToSend) {
                _.each(action.fieldsToSend, function(n) {
                    data[n.name] = $filter("getValue")(result, n.value);
                });
            }
            $scope.confirm(action.title, action.content, pageURL, data);
        } else if (action.action == 'sidemenuRedirect') {
            pageURL = action.jsonPage;
            if (action.fieldsToSend) {
                _.each(action.fieldsToSend, function(n) {
                    pageURL += "¢" + jsonArr[n];
                });
            }
            $state.go("page", {
                jsonName: pageURL
            });
        } else if (action.action === 'changeActive') {
            $scope.defaultActive = action.active;
        }




    };

    $scope.makeReadyForApi = function() {
        $scope.urlid = $location.absUrl().split('%C2%A2')[1];
        $scope.urlid2 = $location.absUrl().split('%C2%A2')[2];
        console.log($scope.urlid2);
        var data = {};
        if (document.getElementById("funds")) {
            console.log(document.getElementById("funds").value);
        }
        if ($scope.json.pageType !== 'edit') {
            // CONVERT MODEL NAMES SAME AS FIELD NAMES
            _.each($scope.json.fields, function(n) {
                console.log(n);
                data[n.tableRef] = n.model;
            });
            $scope.formData = data;
            console.log($scope.formData);
        } else {
            $scope.formData = $scope.json.editData;
            console.log($scope.formData);
        }

        $scope.apiName = $scope.json.apiCall.url;

        // CALL GENERAL API
        NavigationService.saveApi($scope.formData, $scope.apiName, function(data) {

            console.log($scope.json.jsonPage);

            // showToast("Project Saved Successfully");
            console.log("Success");
            if ($scope.json.action[0].submitUrl && $scope.urlid && !$scope.urlid2) {
                $location.url("/page/" + $scope.json.action[0].submitUrl + $scope.urlid);

            } else if ($scope.json.action[0].submitUrl && $scope.urlid2) {
                $location.url("/page/" + $scope.json.action[0].submitUrl + $scope.urlid2);
            } else {
                $state.go("page", {
                    jsonName: $scope.json.jsonPage
                });
            }

        }, function() {
            // showToast("Error saving the Project");
            console.log("Fail");
        });


    };

    $scope.changeit = function(image) {
        console.log(image);
    };

})

.controller('ProjectsCtrl', function($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, clipboard) {

    $scope.isSearch = true;
    $scope.searchForm = {
        name: ""
    };
    $scope.mockURL = mockURL;

    $scope.makeSearch = function(val) {
        $scope.searchForm.name = val;
    };

    function showToast(text) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(text)
            .position("bottom left")
            .hideDelay(3000)
        );
    }

    //Used to name the .html file
    $scope.template = TemplateService.changecontent("projects");
    $scope.menutitle = NavigationService.makeactive("Projects");


    $scope.copyMockUrl = function(project) {
        clipboard.copyText(mockURL + project.alias);
    };
    $scope.copyLiveUrl = function(project) {
        clipboard.copyText(project.url);
    };

    function successCallback(data, status) {
        if (status == 200) {
            $scope.projects = data.data;
            if (_.isEmpty(data.data)) {
                $scope.createProject();
            }
        } else {
            errorCallback(status);
        }
    }

    $scope.saveProject = function(project) {
        NavigationService.saveProject(project, function(data) {
            project._id = data.data._id;
            showToast("Project Saved Successfully");
        }, function() {
            showToast("Error saving the Project");
        });
    };
    $scope.deleteProject = function(project) {
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete your Project?')
            .textContent('The data for the Project will also be deleted')
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            NavigationService.deleteProject(project, function(data) {
                _.remove($scope.projects, function(n) {
                    return n._id == project._id;
                });
                showToast("Project Deleted Successfully");
            }, function() {
                showToast("Error Deleting Project");
            });

        }, function() {

        });

    };

    $scope.expandProject = function(project) {
        if (!project.expand) {
            _.each($scope.projects, function(n) {
                n.expand = false;
            });
        }
        project.expand = !project.expand;
    };

    function errorCallback(err) {}

    $scope.createProject = function() {
        $scope.projects.push({
            expand: true,
            name: "",
            alias: "",
            url: ""
        });
    };
    $scope.hide = 'hideme';
    NavigationService.findProjects({}, successCallback, errorCallback);
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('APICtrl', function($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, $stateParams) {

    var isSortable = false;
    $scope.hideme = 'hide';
    $scope.isSearch = true;
    $scope.searchForm = {
        name: ""
    };

    $scope.makeSearch = function(val) {
        $scope.searchForm.name = val;
    };

    function showToast(text) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(text)
            .position("bottom left")
            .hideDelay(3000)
        );
    }

    $scope.sortableOptions = {
        update: function(e, ui) {

            setTimeout(function() {
                var newOrder = _.cloneDeep($scope.apis);
                newOrder = _.pluck($scope.apis, "_id");
                var newProject = _.cloneDeep($scope.project);
                newProject.Api = newOrder;
                NavigationService.saveProject(newProject, function() {
                    showToast("API Ordered");
                }, function() {
                    showToast("Error Ordering API");
                });
            }, 100);

        },
        axis: 'y',
        disabled: isSortable
    };

    var data = {
        "_id": $stateParams.id
    };

    function successCallback(data, status) {
        if (status == 200) {
            $scope.menutitle = data.data.name + " - API";
            TemplateService.title = $scope.menutitle;
            $scope.project = data.data;

            $scope.apis = data.data.Api;
            _.each($scope.apis, function(n) {
                n.project = $scope.project._id;
            });
            if (_.isEmpty(data.data.Api)) {
                $scope.createApi();
            }

        } else {
            errorCallback(status);
        }
    }

    function errorCallback(err) {}

    NavigationService.findOneProject(data, successCallback, errorCallback);

    $scope.expandApi = function(api) {
        if (!api.expand) {
            $scope.sortableOptions.disabled = true;
            _.each($scope.apis, function(n) {
                n.expand = false;
            });

        } else {
            $scope.sortableOptions.disabled = false;
        }
        api.expand = !api.expand;
    };

    $scope.createApi = function() {
        _.each($scope.apis, function(n) {
            n.expand = false;
        });
        $scope.apis.push({
            name: "",
            Response: {
                request: "",
                response: ""
            },
            project: $scope.project._id,
            expand: true
        });
    };
    $scope.copyApi = function(api, index) {
        var newApi = _.cloneDeep(api);
        delete newApi._id;
        delete newApi.$$hashKey;
        $scope.apis.splice(index + 1, 0, newApi);
        $scope.expandApi(newApi);
    };
    $scope.saveApi = function(api) {
        NavigationService.saveApi(api, function(data) {
            api._id = data.data._id;
            showToast("API saved Successfully");
        }, function(err) {
            showToast("Error saving API");
        });
    };
    $scope.deleteApi = function(api) {

        var confirm = $mdDialog.confirm()
            .title('Would you like to delete the API?')
            .textContent('The data for the API will also be deleted')
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {

            NavigationService.deleteApi(api, function(data) {
                _.remove($scope.apis, function(n) {
                    return api._id == n._id;
                });
                showToast("API Deleted Successfully");
            }, function(err) {
                showToast("Error Deleting API");
            });

        }, function() {

        });



    };

    //Used to name the .html file
    $scope.template = TemplateService.changecontent("api");
    $scope.menutitle = NavigationService.makeactive("API");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('HeaderCtrl', function($scope, TemplateService, $state, NavigationService) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    if ($.jStorage.get("user") === null) {
        $state.go("login");
    }
    $scope.logOut = function() {
        NavigationService.logout(function(data) {
            console.log(data);
            if (data.value === true) {
                $.jStorage.flush();
                $state.go("login");

            } else if (data.value === false) {
                $window.location.reload();
            }
        }, function() {
            console.log("Fail");
        });
    };
});
