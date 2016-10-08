// GLOBAL VARIABLES

var movieSearchField = $('#input-field');
var userSearchField = $('#user-field');
var findUserButton = $('#user-button');
var manageUserButton = $('#manage-users');
var topRatedButton = $('top-rated');

// GLOBAL FUNCTIONS

function apiQuery(query, queryType){
  var url = "https://arcane-woodland-29724.herokuapp.com";
  var endPoint;

  switch (queryType) { // query dictionary
    case 'movieTitle': //
      endPoint = '/api/movies/title/?search=' + query;
      break;
    case 'userId':
      endPoint = '/api/users/' + query;
      break;
    case 'movieId':
      endPoint = '/api/movies/' + query;
      break;
    case 'ratingAverage':
      endPoint = '/api/ratings/average/' + query;
      break;
    case 'ratings':
      endPoint = '/api/ratings/all_ratings/' + query;
      break;
    default:
      endPoint = null;
      break;
  }


}

function movieSearch(string){
  collapseSearch();
  console.log("did a movie search for: " + string);

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
