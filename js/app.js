(function() { //iffy
  'use strict';

  // push api data to movies
  var movies = [];

// update HTML funcionality
  var renderMovies = function() {
    for (var i = 0; i < movies.length; i++) {
      console.log(movies[i]);
    }
    $('#listings').empty();

    for (var movie of movies) {
      var $col = $('<div class="col s6">');
      var $card = $('<div class="card hoverable">');
      var $content = $('<div class="card-content center">');
      var $title = $('<h6 class="card-title truncate">');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50, });
      $title.text(movie.title);

      var $poster = $('<img class="poster">');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      var $action = $('<div class="card-action center">');
      var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      var $modal = $(`<div id="${movie.id}" class="modal">`);
      var $modalContent = $('<div class="modal-content">');
      var $modalHeader = $('<h4>').text(movie.title);
      var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      var $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // submission listener
  $(function() {
    $("#search_button").on("click", function(event) {
      event.preventDefault();
      // check if form is blank
      if ($("#search").val()) {
        // form is not blank, find results
        searchResults($("#search").val());
      } else {
        // Toast message
        Materialize.toast("search field is empty")
      }
      // reset form
      $("#search").val("");
    });
  });

  function searchResults(searchWord) {
    var $xhr = $.getJSON('http://www.omdbapi.com/?s='+searchWord);

    // get a reference to all of the movie IDs that match the search criteria
    $xhr.done(function(data) {
      var movieIDs = [];
      for (var i = 0; i < data["Search"].length; i++) {
        movieIDs.push(data["Search"][i]["imdbID"]);
      }

      // build and push movie objects to be rendered
      for (var i = 0; i < movieIDs.length; i++) {
        var $xhrPlot = $.getJSON('http://www.omdbapi.com/?i='+movieIDs[i]);
        $xhrPlot.done(function(data) {
          var movieObj = {
            id: data["imdbID"],
            poster: data["Poster"],
            title: data["Title"],
            year: data["Year"],
            plot: data["Plot"]
          };

          var validData = true;
          for (var key in movieObj) {
            if (movieObj[key] === "N/A") {
              validData = false;
            }
          }

          if (validData) {
            movies.push(movieObj);
            renderMovies();
          }
        });
      };
    });
  }
})();
