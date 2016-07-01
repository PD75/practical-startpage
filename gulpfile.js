/*global require, __dirname*/
var src = './appdev';
var srcNode = './node_modules';
var dist = src + '/dist';
var build = 'build';
var release = 'release';
var manifest = require(src + '/manifest.json');

// Include gulp
var gulp = require('gulp');
// Include plugins
var del = require('del');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var htmlmin = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  collapseInlineTagWhitespace: true,
  removeTagWhitespace: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};
//Copy libraries to correct place from node_modules during npm install
gulp.task('installJSTree', function() {
  return gulp.src([srcNode + '/jstree/dist/**/*(*.js)', srcNode + '/jstree/dist/themes/default/**/*(*.min.css|*.png|*.gif)'], {
      base: srcNode + '/jstree/dist',
    })
    .pipe(gulp.dest(dist + '/jstree'));
});
gulp.task('installjs', function() {
  return gulp.src([srcNode + '/jquery/dist/*.js', srcNode + '/angular/angular*.js', srcNode + "/angular-drag-and-drop-lists/angular-drag-and-drop-lists*.js"])
    .pipe(gulp.dest(dist));
});
gulp.task('installngjstree', function(cb) {
  gulp.src(srcNode + '/ng-js-tree/ngJsTree.js')
    .pipe(plugins.rename({
      suffix: '.min',
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dist));

  gulp.src(srcNode + '/ng-js-tree/ngJsTree.js')
    .pipe(gulp.dest(dist));

  return cb();
});

gulp.task('install', ['installjs', 'installJSTree', 'installngjstree'], function(cb) {
  cb();
});
gulp.task('update', ['installjs', 'installJSTree', 'installngjstree', 'buildUI'], function(cb) {
  cb();
});

//Build Support libraries
//semantic-ui
var
  watchUI = require('./dist/semantic-ui/tasks/watch'),
  buildUI = require('./dist/semantic-ui/tasks/build'),
  installUI = require('./node_modules/semantic-ui/tasks/install');
// import task with a custom task name
gulp.task('watchUI', watchUI);
gulp.task('buildUI', buildUI);
gulp.task('installUI', installUI);

var buildUIA = require('./dist/ui-angular/tasks/build')(__dirname);
gulp.task('buildUIA', buildUIA);


//build
//Clean build and release folder
gulp.task('clean', function() {
  return del(['build', 'release']);
});

//combine .js Files
gulp.task('buildScripts', function() {
  return gulp.src(src + '/app/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.angularFilesort())
    .pipe(plugins.concat('startpage.js'))
    .pipe(plugins.rename({
      suffix: '.min',
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(build + '/app'));
});
//CSS
gulp.task('buildCss', function() {
  return gulp.src(src + '/app/**/*.css')
    // .pipe(plugins.csslint())
    // .pipe(plugins.csslint.reporter())
    .pipe(plugins.concat('startpage.css'))
    .pipe(plugins.rename({
      suffix: '.min',
    }))
    .pipe(plugins.cssnano({
      "zindex": false,
    }))
    .pipe(gulp.dest(build + '/app'));
});
//Get distributions
gulp.task('getDist', function() {
  return gulp.src([src + '/dist/**/*(*.min.js|*.min.css)', src + '/dist/**/!(*.js|*.css)'])
    .pipe(gulp.dest(build + '/dist'));
});
//Get code pieces
gulp.task('getHtml', function() {
  return gulp.src([src + '/app/**/*.html'])
    .pipe(plugins.htmlmin(htmlmin))
    .pipe(gulp.dest(build + '/app'));
});

gulp.task('getLocales', function() {
  return gulp.src([src + '/_locales/**/*.json'])
    .pipe(gulp.dest(build + '/_locales'));
});

gulp.task('buildConfig', function(cb) {
  gulp.src(src + '/' + manifest.chrome_url_overrides.newtab)
    .pipe(plugins.htmlReplace({
      'css': 'app/startpage.min.css',
      'js': 'app/startpage.min.js',
      'html': '<title>' + manifest.short_name + '</title>',
    }))
    .pipe(plugins
      .replace(/(dist.*\.)(js)/gm, function(r1, r2, r3) {
        return r2 + 'min.' + r3;
      })
    )
    .pipe(plugins.htmlmin(htmlmin))
    .pipe(gulp.dest(build));

  gulp.src(src + '/' + manifest.options_ui.page)
    .pipe(plugins.htmlReplace({
      'css': 'app/startpage.min.css',
      'js': 'app/startpage.min.js',
    }))
    .pipe(plugins
      .replace(/(dist.*\.)(js)/gm, function(r1, r2, r3) {
        return r2 + 'min.' + r3;
      })
    )
    .pipe(plugins.htmlmin(htmlmin))
    .pipe(gulp.dest(build));

  gulp.src(src + '/manifest.json')
    .pipe(plugins.jsonEditor({
      'name': 'Practical Startpage',
      'options_ui': {
        "page": "chrome.optionsUI.html",
        "open_in_tab": false,
      },
    }))
    .pipe(gulp.dest(build));

  gulp.src([src + '/img/*'])
    .pipe(gulp.dest(build + '/img'));
  cb();
});


gulp.task('bumpPreRelease', function() {
  return gulp.src(src + '/manifest.json')
    .pipe(plugins.jsonEditor({
      'version': bumpVersion(3),
    }))
    .pipe(gulp.dest(src));
});

gulp.task('bumpMinor', function() {
  return gulp.src(src + '/manifest.json')
    .pipe(plugins.jsonEditor({
      'version': bumpVersion(1),
    }))
    .pipe(gulp.dest(src));
});
gulp.task('bumpPatch', function() {
  return gulp.src(src + '/manifest.json')
    .pipe(plugins.jsonEditor({
      'version': bumpVersion(2),
    }))
    .pipe(gulp.dest(src));
});

function bumpVersion(index) {
  var versionArray = manifest.version.split('.');
  var i;
  for (i = 0; i <= index; i++) {
    if (typeof versionArray[i] === 'undefined') {
      versionArray[i] = '0';
    }
  }
  versionArray[index]++;
  var newVersion = versionArray[0];
  for (i = 1; i <= index; i++) {
    newVersion = newVersion + '.' + versionArray[i];
  }
  manifest.version = newVersion;
  return newVersion;
}

gulp.task('cleanRelease', function() {
  return del(['release']);
});
//Zip all files in deployment package for chrome
gulp.task('createReleasePackage', ['build'], function() {
  return gulp.src(build + '/**/*')
    .pipe(plugins.zip('practical startpage ' + manifest.version + '.zip'))
    .pipe(gulp.dest(release));
});

//Build test version
gulp.task('test', ['bumpPreRelease', 'cleanRelease'], function() {
  return gulp.src(src + '/**/*')
    .pipe(plugins.zip('practical startpage test ' + manifest.version + '.zip'))
    .pipe(gulp.dest(release));
});
gulp.task('build', function(cb) {
  runSequence('clean', ['buildScripts', 'getDist', 'buildCss', 'buildConfig', 'getHtml', 'getLocales'], cb);
});
gulp.task('release', function(cb) {
  runSequence('cleanRelease', 'bumpMinor', 'createReleasePackage', cb);
});
gulp.task('bugfix', function(cb) {
  runSequence('cleanRelease', 'bumpPatch', 'createReleasePackage', cb);
});
// Default Task
gulp.task('default', ['test']);