require('tsconfig-paths').register({
  baseUrl: __dirname + '/..',
  paths: {
    '@config/*': ['dist/config/*'],
    '@config': ['dist/config'],
    '@controllers/*': ['dist/controllers/*'],
    '@controllers': ['dist/controllers'],
    '@services/*': ['dist/services/*'],
    '@services': ['dist/services'],
    '@models/*': ['dist/models/*'],
    '@models': ['dist/models'],
    '@typings/*': ['dist/types/*'],
    '@typings': ['dist/types'],
    '@middleware/*': ['dist/middleware/*'],
    '@middleware': ['dist/middleware'],
    '@routes/*': ['dist/routes/*'],
    '@routes': ['dist/routes'],
  },
});

require('../dist/index.js');
