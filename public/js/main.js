// GLOBAL VARIABLES

var movieSearchField = $('#input-field');
var userSearchField = $('#user-field');
var findUserButton = $('#user-button');
var manageUserButton = $('#manage-users');
var topRatedButton = $('top-rated');

// GLOBAL FUNCTIONS

function apiGet(queryType, query){

  var baseUrl = "https://arcane-woodland-29724.herokuapp.com";
  var endPoint;

  switch (queryType) { // query dictionary
    case 'movieTitle': // Search Method
      endPoint = '/api/movies/title?search=' + query;
      break;
    case 'userId': // get User by userID
      endPoint = '/api/users/' + query;
      break;
    case 'movieId': // get Movie by movieID
      endPoint = '/api/movies/' + query;
      break;
    case 'ratingAverage': // get average rating by movieID
      endPoint = '/api/ratings/average/' + query;
      break;
    case 'ratings': // get all ratings by movieID
      endPoint = '/api/ratings/all_ratings/' + query;
      break;
    default:
      endPoint = null;
      break;
  }

  var settings = {
    async: true,
    crossDomain: false,
    url: baseUrl + endPoint,
    method: "GET",
    processData: false,
    error: handleError,
    headers: {

    },
    data: {
      "some": "json"
    },
    dataType: 'json'
  };

  return settings;
}

function handleError(){
  console.log("There was an error :shrug:");
}

function movieSearch(string){
  collapseSearch();
  console.log("did a movie search for: " + string);
  $.ajax(apiGet('movieTitle', string)).done(function(response){
    for (var index = 0; index < response.length; index++){
      var thisMovie = new Movie(response[index]);
      //thisMovie.displaySearchResult();
      console.log(thisMovie);
      // console.log(thisMovie.getAverage());
      // console.log(thisMovie.average);
    }
  });
}

function userSearch(string){
  collapseSearch();
  $.ajax(apiGet('userId', string)).done(function(response){
    console.log(response);
  });
  console.log("did a user search for " + string);
}

function collapseSearch(){
  movieSearchField.removeClass('open').addClass('closed');
}

function expandSearch(){
  movieSearchField.removeClass('closed').addClass('open');
}

function round(value, precision) {
   var multiplier = Math.pow(10, precision || 0);
   return Math.round(value * multiplier) / multiplier;
}

// CONSTRUCTORS:

function Movie(dataObject) {
  this.id = dataObject.id;
  this.title = dataObject.title;
  this.getAverage();
  console.log(this);
}

Movie.prototype = {
  getAverage: function(){
    var average;
    $.ajax(apiGet('ratingAverage', this.id)).done((function(response, average){
      average = round(response, 1);
      console.log("Inside callback:");
      console.log(average);
      this.average = average;
      console.log(this);
    }).bind(this));
  }
};



// LAUNCH CODE:

$('#search-form').submit(function(event){
  event.preventDefault();
  var searchString = movieSearchField.val();
  movieSearchField.val('');
  movieSearch(searchString);
});

$('#user-search-form').submit(function(event){
  event.preventDefault();
  var searchString = userSearchField.val();
  userSearchField.val('');
  userSearch(searchString);
});
