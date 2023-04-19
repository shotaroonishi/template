const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass = require("gulp-dart-sass");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");

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

const compileSass = () => {
  return (
    gulp
      .src(paths.cssSrc)
      .pipe(
        plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
      )
      .pipe(sass({ outputStyle: "expanded" }))
      .pipe(autoprefixer())
      // .pipe(cleanCSS())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(paths.cssDist))
      .pipe(browserSync.stream())
  );
};
exports.compileSass = compileSass;

const compilePug = () => {
  const options = {
    filters: {
      php: (text) => {
        text = "<?php " + text + " ?>";
        return text;
      },
    },
  };
  return gulp
    .src([paths.pug, "!./src/pug/**/_*.pug"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      pug({
        pretty: true,
        basedir: "./src/pug",
      })
      // 圧縮する場合は以下のように追記します。
      // pug(options, {
      //   pretty: true,
      //   basedir: "./src/pug",
      //   options: true,
      // })
    )
    .pipe(gulp.dest(paths.php))
    .pipe(browserSync.stream());
};
exports.compilePug = compilePug;

const compileJs = () => {
  return gulp
    .src(paths.jsSrc)
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.jsDist))
    .pipe(browserSync.stream());
};
exports.compileJs = compileJs;

const imageMin = () => {
  return gulp
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
    .pipe(gulp.dest("./public/img/"))
    .pipe(browserSync.stream());
};
exports.imageMin = imageMin;

const serve = () => {
  browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    reloadOnRestart: true,
  });
};
exports.serve = serve;

const watchFiles = () => {
  gulp.watch(paths.cssSrc, compileSass);
  gulp.watch(paths.pug, compilePug);
  gulp.watch(paths.jsSrc, compileJs);
  gulp.watch(paths.img, imageMin);
  gulp.watch("*.{html,php}").on("change", browserSync.reload);
};
exports.watchFiles = watchFiles;

exports.default = gulp.series(
  gulp.parallel(compileSass, compilePug, compileJs, imageMin),
  gulp.parallel(watchFiles, serve)
);
