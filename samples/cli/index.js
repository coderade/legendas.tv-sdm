var legendasTv = require('../../../legendas-tv');
var help = require('./help');

var menuHandler,
  optionGlobalChosen;

var backToMovies = function () {
  if (optionGlobalChosen === 'a') {
    legendasTv.onHighlightsReady(function (movies) {
      help.showMovies(movies, legendasTv.fetchDate().toString());
      showMoviesOptions();
    });
  }

  if (optionGlobalChosen === 'b') {
    legendasTv.onHighlightsReady(function (movies) {
      help.showMovies(movies.bluRay(), legendasTv.fetchDate().toString());
      showMoviesOptions();
    });
  }
}

var showMovieOptions = function (idMovie) {
  help.showMovieOptions();

  menuHandler = function (option) {
    switch (option) {
      case 'b':
        backToMovies();
        break;
      case 'd':
        legendasTv.onDownloadSubtitle(idMovie, function (filename) {
          console.log('\n' + filename + ' downloaded');
          backToMovies();
        });
        break;
      default:
        showMovieOptions(idMovie);
    }
  };
};

var showMoviesOptions = function () {
  help.showMoviesOptions();

  menuHandler = function (option) {
    if (option === 'b') {
      showGlobalOptions();
      return;
    }

    if (/\d{1,}/g.test(option)) {
      try {
        legendasTv.onFetchSynopsis(option, function (movie) {
          help.showMovieDetails(movie);
          showMovieOptions(option);
        });
      } catch (error) {
        console.log(error.message);
      }

      return;
    }

    help.showMoviesOptions();
  };
};

var showGlobalOptions = function () {
  help.showGlobalOptions();

  menuHandler = function (option) {
    optionGlobalChosen = option;

    switch (option) {
      case 'a':
        legendasTv.onHighlightsReady(function (movies) {
          help.showMovies(movies, legendasTv.fetchDate().toString());
          showMoviesOptions();
        });
        break;
      case 'b':
        legendasTv.onHighlightsReady(function (movies) {
          help.showMovies(movies.bluRay(), legendasTv.fetchDate().toString());
          showMoviesOptions();
        });
        break;
      case 'q':
        process.exit();
        break;
      default:
        help.showGlobalOptions();
    };
  };
};

(function () {
  help.showSystemHeader();
  showGlobalOptions();

  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk) menuHandler(chunk.toString().replace(/[\r\n]+/, ''));
  });
})();

