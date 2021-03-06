var fs = require('fs');
var config = require('./config');
var legendasTv = require('../../../legendas-tv');

var _today = new Date();
var _movies = [];

var downloadSubtitle = function (movie) {
  if (!movie) throw new Error('Movie not found.');

  legendasTv.onDownloadSubtitle(movie.id)
    .then(filename => {
      console.log(filename + ' downloaded');
    });
};

var seekSeries = function (movies) {
  config.series.forEach((serie, i) => {
    if (_today < new Date(serie.releaseDate)) return;

    var episodeFound;
    serie.episodes.forEach((episode, j) => {

      try {
        downloadSubtitle(movies.find(serie.title, episode)[0]);
        episodeFound = j;
      } catch (err) {
        console.log(serie.title + ' ' + episode + ' ' + 'not found');
      }
    });

    if (episodeFound === undefined) return;
    serie.episodes.splice(0, ++episodeFound);
  });

  fs.writeFile('config.json', JSON.stringify(config));
};

legendasTv.onHighlightsReady()
  .then(seekSeries);