'use strict';

// 1] Подключить модули
const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const sleep = require('sleep');

// 2] Задача №1: Обработка scss-файлов
gulp.task('styles', function(callback){

	// 3.1] Найти и обработать .scss файлы, записать в public
	return gulp.src('frontend/styles/main.scss')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('public'));

	// 3.2] Сигнализировать о завершении задачи
	//callback();

});

// 3] Задача №2: копирует всё из assets в public
gulp.task('assets', function(){
	return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
			.pipe(gulp.dest('public'));
});

// 5] Задача №3:
// - Параллельно выполняет задачи styles и assets
gulp.task('build', gulp.series(
	gulp.parallel('styles', 'assets')
));

// 6] Задача №4: следить за файлами, запускать задачу при их изменении
gulp.task('watch', function(){
	gulp.watch('frontend/styles/**/*.*', {usePolling: true}, gulp.series('styles'));
	gulp.watch('frontend/assets/**/*.*', {usePolling: true}, gulp.series('assets'));
});

// 7] Задача №6: запустить сервер browser-sync
gulp.task('serve', function(){

	// 7.1] Запустить proxy
	browserSync.init({
		server: "public",
		port: 3000,
		ui: {
		  port: 3001
		}		
	});

	// 7.2] Отслеживать изменения в указанных файлах
	browserSync.watch('public/*.css', {usePolling: true}).on('change', browserSync.reload);

});

// 8] Задача №5: сначала запустить build, затем параллельно watch и serve
gulp.task('dev',
		gulp.series('build', gulp.parallel('watch', 'serve')));



