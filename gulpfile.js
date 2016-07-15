var jsArray = [
  "./bower_components/jquery/dist/jquery.js",

  "./bower_components/angular/angular.js",
  "./bower_components/angular-sanitize/angular-sanitize.min.js",
  "./bower_components/ui-router/release/angular-ui-router.min.js",
  "./bower_components/angular-aria/angular-aria.js",
  "./bower_components/angular-animate/angular-animate.js",
  "./bower_components/angular-material/angular-material.js",
  "./bower_components/angular-material-icons/angular-material-icons.min.js",
  "./bower_components/svg-morpheus/compile/minified/svg-morpheus.js",
  "./bower_components/lodash/lodash.min.js",
  "./bower_components/jStorage/jstorage.min.js",
  "./bower_components/angular-clipboard/angular-clipboard.js",
  "./bower_components/js-beautify/js/lib/beautify.js",
  "./bower_components/angularjs-imageupload-directive/public/javascripts/imageupload.js",
  "./bower_components/jquery-ui/jquery-ui.js",
  "./bower_components/angular-ui-sortable/sortable.min.js",
  "./bower_components/angular-bootstrap/ui-bootstrap.min.js",
  "./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",

  "./bower_components/ace-builds/src-noconflict/ace.js",
  "./bower_components/ace-builds/src-noconflict/theme-monokai.js",
  "./bower_components/ace-builds/src-noconflict/mode-json.js",

  "./js/app.js",
  "./js/controllers.js",
  "./js/navigation.js",
  "./js/templateservice.js",

    //please do not change it
    './w/js/templates.js',
];
var replacehostFrom = "http://localhost/demo/";
var replacehostTo = "http://wohlig.co.in/demo2/";



var ftpString = "U2FsdGVkX1+jcFED/CJbcYNiOJ42eBsjlxqmrcKWSIPH9Sao/4535zPQX5Fa7VYGAHSfkKCXbDpiUfJhkRRijaerS1lJ/k+dSfqsfl45ICkzMTJ7fBNVDj/242ur9ZG4HZDhSe1O/J4vEUboWDRBhg==";

var uploadingFolder = "sortvestbackend";
var password = "";



//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');
var wait = require('gulp-wait');
var connect = require("gulp-connect");




var templateCacheBootstrap = "firstapp.run(['$templateCache', function($templateCache) {";

gulp.task('imagemin', function() {

  var imagemin = require('gulp-imagemin');

  return gulp.src('./img/**')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest('./img2/'));
});


gulp.task('deploy', function() {
  var prompt = require("gulp-prompt");
  return gulp.src('./index.html')
    .pipe(prompt.prompt([{
      type: 'password',
      name: 'password',
      message: 'Enter Encryption Password:'
    }], function(res) {
      password = res.password;
      gulp.start('ftp');
    }));
});



gulp.task('ftp', function() {
  var CryptoJS = require("crypto-js");
  var ftp = require('vinyl-ftp');
  var decrypted = CryptoJS.AES.decrypt(ftpString, password);
  var decryptedJSON = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

  decryptedJSON.log = gutil.log;
  var conn = ftp.create(decryptedJSON);


  var globs = [
    './production/**',
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, {
      base: './production',
      buffer: false
    })
    .pipe(conn.newer('/public_html/' + uploadingFolder)) // only upload newer files
    .pipe(conn.dest('/public_html/' + uploadingFolder));

});

gulp.task('clean:production', function() {
  return gulp.src('./production', {
      read: false
    })
    .pipe(wait(200))
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:indexHTML', function() {
  return gulp.src('./production/index.html', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:tmp', function() {
  return gulp.src('./tmp', {
      read: false
    })
    .pipe(wait(200))
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:w', function() {
  return gulp.src('./w', {
      read: false
    })
    .pipe(wait(200))
    .pipe(clean());
});

gulp.task('minify:css', function() {
  var replace = require('gulp-replace');
  var rename = require('gulp-rename');
  var minifyCss = require('gulp-minify-css');
  return gulp.src('./w/main.css')
    .pipe(minifyCss({
      keepSpecialComments: 0,
      rebase: false
    }))
    .pipe(rename('w.css'))
    .pipe(replace('url(../', 'url('))
    .pipe(replace("url('../", "url('"))
    .pipe(replace('url("../', 'url("'))
    .pipe(gulp.dest('./w/'));
});

gulp.task('copy:indexhtml', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./w/index.html")
    .pipe(gulpCopy("./production/", {
      prefix: 1
    }));
});

gulp.task('gzipfile', function() {
  var gzip = require('gulp-gzip');
  gulp.src('./w/index.html')
    .pipe(gzip({
      preExtension: 'gz'
    }))
    .pipe(gulp.dest('./production/'));
});

gulp.task('tarball', function() {
  var tar = require('gulp-tar');
  gulp.src('./production/**')
    .pipe(tar('production.tar'), {
      "mode": 0755,
      "type": 'directory'
    })
    .pipe(gulp.dest('./'));
});

gulp.task('inlinesource', function() {
  var inline = require('gulp-inline');
  return gulp.src('./w/index.html')
    .pipe(inline({
      base: './w',
      disabledTypes: ['svg', 'img'] // Only inline css files
    }))
    .pipe(gulp.dest('./w/'));
});



gulp.task('uglify:js', function() {
  var uglify = require('gulp-uglify');
  var stripDebug = require('gulp-strip-debug');
  return gulp.src('./w/w.js')
    // .pipe(stripDebug())
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('./w'));
});

gulp.task('concat:js', function() {
  var concat = require('gulp-concat');
  var replace = require('gulp-replace');
  return gulp.src(jsArray)
    .pipe(concat('w.js'))
    .pipe(replace(replacehostFrom, replacehostTo))
    .pipe(gulp.dest('./w'));
});

gulp.task('templatecache', function() {
  var templateCache = require('gulp-angular-templatecache');
  return gulp.src('./w/views/**/*.html')
  .pipe(templateCache({
      root: "views/",
      templateHeader: templateCacheBootstrap
    }))
    .pipe(gulp.dest('./w/js/'));
});


gulp.task('copy:img', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./img/**")
    .pipe(gulpCopy("./production/"));
});

gulp.task('copy:wjs', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./w/w.js")
    .pipe(gulpCopy("./production/"));
});
gulp.task('copy:wcss', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./w/w.css")
    .pipe(gulpCopy("./production/"));
});
gulp.task('copy:fonts', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./fonts/**")
    .pipe(gulpCopy("./production/w/"));
});
gulp.task('copy:pageJson', function() {
  var gulpCopy = require('gulp-copy');
  return gulp.src("./pageJson/**")
    .pipe(gulpCopy("./production/"));
});

gulp.task('sass:production', function() {
  var sass = require('gulp-sass');
  gulp.src('./sass/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./w'));
});

gulp.task('sass:development', function() {
  var sass = require('gulp-sass');
  var sourcemaps = require('gulp-sourcemaps');
  gulp.src('./sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});
gulp.task('minify:indexproduction', function() {
  var rename = require('gulp-rename');
  var opts = {
    conditionals: true,
    spare: true
  };
  var minifyHTML = require('gulp-minify-html');
  return gulp.src('./indexproduction.html')
    .pipe(minifyHTML(opts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./w/'));
});
gulp.task('minify:views', function() {
  var minifyHTML = require('gulp-minify-html');
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('./views/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./w/views/'));
});
gulp.task('connect:html', function() {
  gulp.src('./**/*.html')
    .pipe(connect.reload());
});
gulp.task('connect:js', function() {
  gulp.src('./js/*.js')
    .pipe(connect.reload());
});
gulp.task('watch:all', function() {
  var watch = require('gulp-watch');
  var open = require('gulp-open');
  connect.server({
    root: './',
    livereload: true
  });
  gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:8080'
    }));
  gulp.watch(['./**/*.html', './sass/*.scss', './js/*.js'], ['sass:development', 'connect:html', 'connect:js']);
});

gulp.task('zip', function() {
  var zip = require('gulp-zip');
  return gulp.src('./production/**/*')
    .pipe(zip('production.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('renamePHP', function() {
  var rename = require('gulp-rename');
  return gulp.src("./production/index.html")
    .pipe(rename("./production/index.php"))
    .pipe(gulp.dest("./"));
});

gulp.task('watch', ["sass:development", "watch:all"]);
gulp.task('default', ["sass:development", "watch:all"]);
gulp.task('development', ["sass:development", "watch:all"]);
gulp.task('minifyhtml', ["minify:indexHTML", "minify:views", "templatecache"]);
gulp.task('copy', ["copy:img", "copy:fonts"]);

gulp.task('clearimage', ["clean:pImages", "clean:pFont"]);
// gulp.task('production', gulpSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp', "concat:js", 'clean:tmp', "templatecache", "uglify:js","minify:css", 'clean:tmp', "inlinesource", 'clean:tmp', "gzipfile", 'clean:tmp', 'clean:tmp', "zip"));
// gulp.task('productionc', gulpSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp', "concat:js", 'clean:tmp', "templatecache", "uglify:js","minify:css", 'clean:tmp', "inlinesource", 'clean:tmp','clean:production', "gzipfile", 'clean:tmp', 'clean:tmp', 'zip','deploy'));
gulp.task('production', gulpSequence(["copy:img","copy:pageJson", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp',  "concat:js", 'clean:tmp',"templatecache","uglify:js", "minify:css", 'clean:tmp', 'clean:tmp', "copy:indexhtml","copy:wjs","copy:wcss", 'clean:tmp', 'clean:tmp', "zip",'renamePHP','clean:indexHTML'));
