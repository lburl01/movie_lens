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
    case 'movieTitleRatings': // Search Method
      endPoint = '/api/movies/title_avg_rating?search=' + query;
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
  $('.content').empty();
  $.ajax(apiGet('movieTitleRatings', string)).done(function(response){
    for (var index = 0; index < response.length; index++){
      var thisMovie = new Movie(response[index]);
      var listElem = $('<ul>').attr('id', 'results').appendTo('.content');
      thisMovie.displayResult(listElem);
      console.log(thisMovie);
    }
  });
}

function userSearch(string){
  collapseSearch();
  $('.content').empty();
  $.ajax(apiGet('userId', string)).done(function(response){
    var thisUser = new User(response);
    console.log(response);
    console.log(thisUser);
    thisUser.displayUser();
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
  console.log(dataObject);
  this.id = dataObject.id;
  this.title = dataObject.title;
  this.date = dataObject.release_date;
  this.imbd = dataObject.imdb_url;
  // this.genre = this.getGenre(dataObject);
  this.average = round(dataObject.avg, 1);
  this.ratingsCount = dataObject.count;
  // this.getRatings();
}

Movie.prototype = {
  // getAverage: function(){
  //   var average;
  //   $.ajax(apiGet('ratingAverage', this.id)).done((function(response, average){
  //     average = round(response, 1);
  //     this.average = average;
  //   }).bind(this));
  // },
  getGenre: function(dataObject){
    var genreDictionary = {
      "unknown_genre":0,
      "action":0,
      "adventure":0,
      "animation":0,
      "children":0,
      "comedy":0,
      "crime":0,
      "documentary":0,
      "drama":0,
      "fantasy":0,
      "film_noir":0,
      "horror":0,
      "musical":0,
      "mystery":0,
      "romance":0,
      "sci_fi":0,
      "thriller":0,
      "war":0,
      "western":0
    };
    var genres = '';
    for (var keyName in dataObject){
      for (var genre in genreDictionary){
        if (keyName === genre && dataObject[keyName] == 1){
          genres += genre + "\n";
        }
      }
    }
    return genres;
  },

  getRatings: function(){
    $.ajax(apiGet('ratings',this.id)).done((function(response){
      console.log(response);
      for(var index = 0; index < response.length; index++){
        for (var key in response[index]){
          var currentObject = response[index];
          if(key === "user_id"){
            var name = currentObject[key];
            this.ratings[name] = currentObject.rating;
          }

        }
      }
    }).bind(this));

  },

  displayResult: function(listElem) {
    if(!listElem) {
      console.log("listElem is not defined.");
      return;
    }
    console.log(this);
    console.log(this.average);
    var source = $("#movie-result").html();
    var template = Handlebars.compile(source);
    var context = {
      movieId: this.id,
      title: this.title,
      ratingCount: this.ratingsCount,
      ratingAverage: this.average
    };
    console.log(context);
    var html = template(context);
    $(listElem).prepend(html);
  },

};

function User(dataObject) {
  this.id = dataObject.id;
  this.age = dataObject.age;
  this.gender = dataObject.gender;
  this.occupation = dataObject.occupation;
  this.zipCode = dataObject.zip_code;
}

User.prototype = {
  displayUser: function(){
    var source = $("#user-info-container").html();
    var template = Handlebars.compile(source);
    var context = {
      "user-id": this.id,
      "user-occupation": this.occupation,
      "user-gender": this.gender,
      "user-zip": this.zipCode,
      "user-age": this.age
    };
    var html = template(context);
    $('.content').append(html);

    $('#my-ratings').click((function(event) {
      event.preventDefault();
      // start loop here
      var source = $('#user-info-list-item').html();
      var template = Handlebars.compile(source);
      var context = {
        "user-id": this.id,
        "movie-id": 1,
        "movie-title": "Title of a Movie",
        "movie-year": 2016,
        "movie-info": "dummy info blah blah blah",
        "movie-rating": 3
      };
      var html = template(context);
      $('.top-rated-list').prepend(html);
      this.starRating($('#star-container'), context['movie-rating']);
      //end loop here
    }).bind(this));
  },
  starRating: function(container, rating){
    if (!rating){
      rating = 0;
    }
    for (var index = 0; index < rating; index++){
      $('<i class ="star fa fa-star"></i>').appendTo(container);
    }
    for (index = 0; index < 5-rating; index++){
      $('<i class ="star fa fa-star-o"></i>').appendTo(container);
    }
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
