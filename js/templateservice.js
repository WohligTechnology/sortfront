var templateservicemod = angular.module('templateservicemod', []);
templateservicemod.service('TemplateService', function() {
    this.title = "Home";
    this.meta = "Google";
    this.metadesc = "Home";

    var d = new Date();
    this.year = d.getFullYear();

    this.init = function() {
        this.header = "views/header.html";
        this.navigation = "views/navigation.html";
        this.aside = "views/aside.html";
        this.content = "views/content/content.html";
        this.footer = "views/footer.html";
    };

    this.changecontent = function(page) {
        this.init();
        var data = this;
        data.content = "views/content/" + page + ".html";
        return data;
    };

    this.jsonType = function(page) {
        this.init();
        var data = this;
        data.content = "views/type/" + page + ".html";
        return data;
    };

    this.init();

});
