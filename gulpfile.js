const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass = require("gulp-dart-sass");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync");
//画像圧縮
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");

//js
const babel = require("gulp-babel");

//css
const cleanCSS = require("gulp-clean-css");

//setting : paths
const paths = {
  root: "./public/",
  pug: "./src/pug/**/*.pug",
  php: "./public/",
  img: "./src/img/",
  cssSrc: "./src/scss/**/*.scss",
  cssDist: "./public/css/",
  jsSrc: "./src/js/**/*.js",
  jsDist: "./public/js/",
};

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require("gulp");

//Sass
task("sass", function () {
  return src(paths.cssSrc)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      sass({
        outputStyle: "expanded", // Minifyするなら'compressed'
      })
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(paths.cssDist));
});

//Pug
task("pug", function () {
  const options = {
    filters: {
      php: (text) => {
        text = "<?php " + text + " ?>";
        return text;
      },
    },
  };
  return src([paths.pug, "!./src/pug/**/_*.pug"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      pug(options, {
        pretty: true,
        basedir: "./src/pug",
        options: true,
      })
    )
    .pipe(
      rename({
        extname: ".php",
      })
    )
    .pipe(dest(paths.php));
});

//JS Compress
task("js", function () {
  return src(paths.jsSrc)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(dest(paths.jsDist));
});

//画像圧縮
gulp.task("img", function (done) {
  gulp
    .src("src/img/*.{jpg,jpeg,png,gif,svg}")
    .pipe(changed("./public/img/"))
    .pipe(
      imagemin([
        pngquant({
          quality: [0.6, 0.7], // 画質
          speed: 1, // スピード
        }),
        mozjpeg({ quality: 65 }), // 画質
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle({ optimizationLevel: 3 }), // 圧縮率
      ])
    )
    .pipe(gulp.dest("./public/img/"));
  done();
});

// browser-sync
task("browser-sync", () => {
  return browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

// browser-sync reload
task("reload", (done) => {
  browserSync.reload();
  done();
});

//watch
task("watch", (done) => {
  watch([paths.cssSrc], series("sass", "reload"));
  watch([paths.jsSrc], series("js", "reload"));
  watch([paths.pug], series("pug", "reload"));
  watch([paths.img], series("img", "reload"));
  done();
});
task("default", parallel("watch", "browser-sync"));
