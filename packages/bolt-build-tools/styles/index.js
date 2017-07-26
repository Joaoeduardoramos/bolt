import { events } from '@bolt/build-core';
import gulp from 'gulp';
import merge from 'merge';
import autoprefixer from 'autoprefixer';
import postcssReporter from 'postcss-reporter';
import duration from 'gulp-duration';
import size from 'gulp-size';
import cleanCSS from 'gulp-clean-css';
import defaultConfig from './config.default';

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const exportJson = require('node-sass-export');
const npmSass = require('npm-sass');
const postcss = require('gulp-postcss');
const stylelint = require('stylelint');
const join = require('path').join;
const scssSyntax = require('postcss-scss');
const del = require('del');
const sassdoc = require('sassdoc');
const debug = require('debug')('@bolt/build-styles');
// const glopImporter = require('node-sass-glob-importer');
// const magicImporter = require('node-sass-magic-importer');
const eyeglass = require('eyeglass');
const sassGlob = require('gulp-sass-glob');
const globby = require('globby');
const rimraf = require('rimraf');

import moduleImporter from 'sass-module-importer';

const postCSS = [
  postcssReporter({ clearReportedMessages: true }),
  autoprefixer()
];

// const nodeModulesPaths = [
//   'packages/',
//   '**/@bolt/*',
//   'node_modules/',
//   'packages/*component*',
//   'packages/*object*',
//   'packages/*setting*',
//   'packages/*tool*',
//   'packages/*generic*',
//   'packages/*element*',
//   'packages/*util*',
//   'sandbox/*/node_modules',
//   // '!packages/*/node_modules/*/node_modules',
//   '!packages/_*',
//   '!packages/*/node_modules/**/node_modules'
// ];
//
// const globbedIncludePaths = globby.sync(nodeModulesPaths);

// console.log(globbedIncludePaths);
// const lintCSS = [
//   ,
//   postcssReporter({ clearReportedMessages: true }),
//   autoprefixer()
// ];


function compileCSS(userConfig) {
  const config = merge({
    postCSS
  }, defaultConfig, userConfig);

  function compileCssTask(done) {
    gulp.src(config.src)
     .pipe(plumber({
       errorHandler(error) {
         notify.onError({
           title: 'CSS <%= error.name %> - Line <%= error.line %>',
           message: '<%= error.message %>'
         })(error);
       }
     }))
       // .pipe($.env.development($.sourcemaps.init()))
     .pipe(sourcemaps.init())
     .pipe(sassGlob())
     .pipe(sass(eyeglass({
      //  includePaths: globbedIncludePaths,
       includePaths: [
         'node_modules',
         'packages',
         'sandbox/pattern-library/node_modules',
         'sandbox/styleguide/node_modules'
       ],
       importer: [
         npmSass.importer
        //  moduleImporter(),
        //  glopImporter()
       ],
       functions: exportJson(config.dataDest, 'json'),
       outputStyle: 'expanded'
     })).on('error', sass.logError))
     .pipe(postcss(config.postCSS))
     .pipe(duration('CSS Compile Time'))
     .pipe(size({ title: 'Total CSS Size' }))
     .pipe(cleanCSS({
       aggressiveMerging: false,
       advanced: false,
       keepSpecialComments: 0,
       processImport: true
     }))
     .pipe(sourcemaps.write('./'))
     .pipe(gulp.dest(config.dest))
     .on('end', () => {
       events.emit('reload', join(config.dest, '**/*.css'));
       done();
     });
  }

  compileCssTask.displayName = 'styles:compile';
  compileCssTask.description = 'Compile Sass to CSS';

  return compileCssTask;
}


function watchCSS(userConfig) {
  function watchCssTask() {
    const config = merge({
      postCSS
    }, defaultConfig, userConfig);

    const watchTasks = [compileCSS(userConfig)];


    // if (config.lint === true) {
    //   watchTasks.push(lintCSS);
    // }
    const src = config.extraWatches
      ? [].concat(config.src, config.extraWatches)
      : config.src;
    // console.log(watchTasks);

    return gulp.watch(src, gulp.parallel(watchTasks));
  }

  watchCssTask.displayName = 'styles:watch';
  watchCssTask.description = 'Watch Sass files for changes to auto-recompile.';

  return watchCssTask;
}


function cleanStyles(userConfig) {
  const config = merge(defaultConfig, userConfig);

  function cleanStylesTask(cb) {
    debug('CSS Cleaned');

    rimraf(`${config.dest}/*`, cb);
    // return del().then((paths) => {
    //   console.log('Cleaning out old CSS:\n', paths.join('\n'));
    // });

    // pathExists('foo.js').then((exists) => {
    //   console.log(exists);
    //     //= > true
    // });
  }

  cleanStylesTask.description = 'Clean compiled CSS';
  cleanStylesTask.displayName = 'styles:clean';

  return cleanStylesTask;
}


function lintCSS(userConfig) {
  const config = merge({
    postCSS: [
      stylelint(),
      postcssReporter({ clearReportedMessages: true }),
      autoprefixer()
    ]
  }, defaultConfig, userConfig);


  function lintCssTask(done) {
    return gulp.src(config.src)
      .pipe(plumber({
        errorHandler(error) {
          notify.onError({
            title: 'CSS <%= error.name %> - Line <%= error.line %>',
            message: '<%= error.message %>'
          })(error);
        }
      }))
      .pipe(postcss(config.postCSS, {
        syntax: scssSyntax
      }))
      .on('end', () => {
        done();
      });
  }

  lintCssTask.displayName = 'styles:lint';
  lintCssTask.description = 'List CSS description';
  return lintCssTask;
}

export { compileCSS, watchCSS, lintCSS, cleanStyles as cleanCSS };


// export { Styles as default };
//
// module.exports = (userConfig) => {
//   const tasks = {};
//   const config = merge({
//     postcss: [
//
//     ]
//   }, defaultConfig, userConfig);
//
//
//   function lintCSS() {
//     gulp.src([
//       'packages/**/*.scss',
//       '!packages/_*/**/*'
//     ])
//       .pipe(plumber({
//         errorHandler(error) {
//           notify.onError({
//             title: 'CSS <%= error.name %> - Line <%= error.line %>',
//             message: '<%= error.message %>'
//           })(error);
//         }
//       }))
//       .pipe(postcss(processors, {
//         syntax: scssSyntax
//       }));
//     // .on('end', () => {
//     //   done();
//     // });
//   }
//   lintCSS.description = 'List CSS description';
//   // tasks.lint = lintCSS;
//
//
//   function compileCSS(done) {
//
//   compileCSS.description = 'Compile CSS';
//   compileCSS.displayName = 'styles:compile';
//   // tasks.compile = compileCSS;
//

//   watchCSS.description = 'Watch CSS for changes';
//   // tasks.watch = watchCSS;
//
//
//   return {
//     lintCSS,
//     compileCSS,
//     watchCSS
//   };
// };


//
//
//
//
// export function compile() {
//
// }
