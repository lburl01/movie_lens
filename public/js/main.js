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
    data: {},
    dataType: 'json'
  };

  $.ajax(settings).done(function(response){
    console.log(response);
  });

}

function handleError(){
  console.log("There was an error :shrug:");
}

function movieSearch(string){
  collapseSearch();
  console.log("did a movie search for: " + string);
  apiGet('movieTitle', string);
}

function userSearch(string){
  collapseSearch();
  console.log("did a user search for " + string);
}

function collapseSearch(){
  movieSearchField.removeClass('open').addClass('closed');
}

function expandSearch(){
  movieSearchField.removeClass('closed').addClass('open');
}





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
