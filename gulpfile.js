
var gulp =   require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename');

var plumberErrorHandler={
  errorHandler: notify.onError({
    title: 'Gulp',
    message:'Error: <%=error.message %>',
  })
};
gulp.task('js', function(){
    gulp.src('./js/*.js') // what files do we want gulp to consume?
      .pipe(plumber(plumberErrorHandler))
      .pipe(uglify()) //uglify minifies the files //.pipe chains files together
      .pipe(rename({ extname: '.min.js' })) //  we're renaming the uglify file
      .pipe(gulp.dest('./build/js')) // Where are we putting the result?
    });

gulp.task('sass', function() {
   gulp.src('./sass/style.scss')
      .pipe(plumber(plumberErrorHandler))
      .pipe(sass())
      .pipe(autoprefixer({
         browsers: ['last 2 versions']
      }))
      .pipe(gulp.dest('./build/css'))
      .pipe(cssnano())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('./build/css'));
});

gulp.task('browser-sync', function() {
   browserSync.init({
       server: {
           baseDir: './'
}
});

   gulp.watch(['build/css/*.css', 'build/js/*.js',]).on('change', browserSync.reload);//Keep this inside browser-sync function
});

   gulp.task('eslint', function() {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src([
      '**/*.js',
      '!node_modules/**',
      '!client/config.js',
      '!client/jspm_packages{,/**'
      ])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());

});
  gulp.task('watch',function() {
     gulp.watch('js/*.js', ['js', 'eslint']);
     gulp.watch('sass/*.scss', ['sass']);
  });

 
  gulp.task('default', ['browser-sync', 'watch']);
