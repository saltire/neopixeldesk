'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');


gulp.task('babel', () => {
    gulp.src('js/*.js')
        .pipe(babel({presets: ['es2015', 'react']}))
        .on('error', (err) => console.log('Error parsing with Babel:', err.message))
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
            'node_modules/react-dom/dist/react-dom.js',
            // Using non-minified Vue libs for debugging purposes.
            'node_modules/vue/dist/vue.js',
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('static', () => {
    gulp.src('static/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('js/*.js', ['babel']);
    gulp.watch('static/*', ['static']);
});

gulp.task('start', () => {
    nodemon({watch: 'app'});
});

gulp.task('build', ['babel', 'libs', 'static']);
gulp.task('default', ['build', 'watch', 'start']);
