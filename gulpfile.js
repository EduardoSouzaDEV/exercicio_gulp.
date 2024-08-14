const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const obfuscate = require('gulp-obfuscate');
const imagemin = require('gulp-imagemin');

// Tarefa para comprimir JavaScript
function comprimirJs() {
    console.log('Comprimindo JavaScript...');
    return gulp.src('./source/scripts/*.js')
        .pipe(uglify())
        .pipe(obfuscate())
        .pipe(gulp.dest('./build/scripts'));
}

// Tarefa para comprimir imagens
function comprimirImagens() {
    console.log('Comprimindo imagens...');
    return gulp.src('./source/images/*.{png,jpg,jpeg,gif,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/images'));
}

// Tarefa para compilar SASS
function compilaSass() {
    console.log('Compilando SASS...');
    return gulp.src('./source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/styles'));
}

// Tarefa para executar todas as tarefas
const build = gulp.series(
    gulp.parallel(compilaSass, comprimirJs, comprimirImagens)
);

// Tarefa de watchers
function watchFiles() {
    gulp.watch('./source/styles/*.scss', { ignoreInitial: false }, gulp.series(compilaSass));
    gulp.watch('./source/scripts/*.js', { ignoreInitial: false }, gulp.series(comprimirJs));
    gulp.watch('./source/images/*.{png,jpg,jpeg,gif,svg}', { ignoreInitial: false }, gulp.series(comprimirImagens));
}

// Exporta as tarefas
exports.compilaSass = compilaSass;
exports.comprimirJs = comprimirJs;
exports.comprimirImagens = comprimirImagens;
exports.build = build;
exports.default = gulp.series(build, watchFiles);