'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');


gulp.task('babel', () => {
    gulp.src('js/*.js')
        .pipe(babel({presets: ['es2015', 'react']}))
        .pipe(gulp.dest('dist'));
});

gulp.task('libs', () => {
    gulp.src(
        [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/jquery/dist/jquery.min.js',
            // Using non-minified React libs for debugging purposes.
            'node_modules/react/dist/react.js',
            'node_modules/react-dom/dist/react-dom.js'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('src', () => {
    gulp.src('src/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('js/*.js', ['babel']);
    gulp.watch('src/*', ['src']);
});

gulp.task('start', () => {
    nodemon();
});

gulp.task('build', ['babel', 'libs', 'src']);
gulp.task('default', ['build', 'watch', 'start']);
