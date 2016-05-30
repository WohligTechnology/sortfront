// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice',
    'imageupload'
]);

firstapp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    // for http request with session
    $httpProvider.defaults.withCredentials = true;

    $stateProvider

        .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'LoginCtrl'
    })

    .state('users', {
        url: "/users",
        templateUrl: "views/template.html",
        controller: 'UsersCtrl'
    })

    .state('projects', {
        url: "/projects",
        templateUrl: "views/template.html",
        controller: 'ProjectsCtrl'
    })

    .state('api', {
        url: "/api/:id",
        templateUrl: "views/template.html",
        controller: 'APICtrl'
    })
    // .state('page1', {
    //     url: "/page/:jsonName/:id",
    //     templateUrl: "views/template.html",
    //     controller: 'jsonViewCtrl'
    // })

    .state('page', {
        url: "/page/:jsonName",
        templateUrl: "views/template.html",
        controller: 'jsonViewCtrl'
    });

    $urlRouterProvider.otherwise("/page/userView");

});

firstapp.filter('uploadpath', function() {
    return function(input, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (input) {
            return imgpath + "?file=" + input + other;
        }
    };
});

firstapp.filter('getValue', function() {
    return function(input, keyVal) {
          var keyArr = keyVal.split(".");
          var returnValue = input;
          _.each(keyArr, function(n) {
              returnValue = returnValue[n];
          });
          return returnValue;
    };
});


firstapp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

firstapp.directive('uploadImage', function($http,$filter) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback"
        },
        link: function($scope, element, attrs) {
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            if($scope.model)
            {
              if(_.isArray($scope.model))
              {
                $scope.image=[];
                _.each($scope.model,function(n) {
                  $scope.image.push({url:$filter("uploadpath")(n)});
                });
              }
              else {
                $scope.image={};
                $scope.image.url=$filter("uploadpath")($scope.model);
              }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function() {
                $scope.model = [];
            };
            $scope.upload = function(image) {
                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function(data) {
                    console.log("success");
                    if ($scope.callback) {
                        $scope.callback(data);
                    } else {
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            $scope.model = data.data[0];
                        }
                    }
                });
            };
        }
    };
});

firstapp.directive('img', function($compile, $parse) {

    return {
        restrict: 'E',
        replace: false,
        link: function($scope, element, attrs) {
            var $element = $(element);

            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function() {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});

var editorG = {};
var jsonEditorNo = 0;
firstapp.directive('jsoneditor', function($compile, $parse) {
    return {
        restrict: 'EA',
        scope: false,
        link: function($scope, element, attrs) {
            $element = $(element);
            $element.css("min-height", "200px");
            var jsoneditornumber = (jsonEditorNo++);
            $element.attr("id", "jsonEditor" + jsoneditornumber);
            var editor = ace.edit("jsonEditor" + jsoneditornumber);
            editor.setTheme("ace/theme/monokai");
            editor.$blockScrolling = Infinity;
            var JsonMode = ace.require("ace/mode/json").Mode;

            editorG = editor;
            editor.session.setMode(new JsonMode());


            editor.setValue($scope.api.Response[attrs.model], 1);
            editor.on("change", function(e) {

                $scope.api.Response[attrs.model] = editor.getValue();
                $scope.$apply();
            });
            var wrapMode = true;
            setTimeout(function() {
                editor.getSession().setUseWrapMode(wrapMode);
            }, 100);

            editor.commands.addCommand({
                name: "beautify",
                bindKey: {
                    win: "Ctrl-Alt-B",
                    mac: "Ctrl-Option-B"
                },
                exec: function(editor) {
                    var value = editor.getValue();
                    var beautiVal = js_beautify(value);
                    editor.setValue(beautiVal);
                    editor.clearSelection();

                }
            });

            editor.commands.addCommand({
                name: "wrap",
                bindKey: {
                    win: "Ctrl-Alt-S",
                    mac: "Ctrl-Option-S"
                },
                exec: function(editor) {
                    wrapMode = !wrapMode;
                    editor.getSession().setUseWrapMode(wrapMode);

                }
            });
        }
    };
});

firstapp.directive('dlEnterKey', function() {
    return function(scope, element, attrs) {

        element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function() {
                    // Evaluate the expression
                    scope.$eval(attrs.dlEnterKey);
                });

                event.preventDefault();
            }
        });
    };
});
