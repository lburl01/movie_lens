// GLOBAL VARIABLES

var movieSearchField = $('#input-field');
var userSearchField = $('#user-field');
var findUserButton = $('#user-button');
var manageUserButton = $('#manage-users');
var topRatedButton = $('top-rated');

// GLOBAL FUNCTIONS

function updateHash(string) {
  window.location.hash = string;
}

function apiGet(queryType, query, dataObject){

  var baseUrl = "https://arcane-woodland-29724.herokuapp.com";
  var endPoint;
  var method = "GET";
  dataObject = (!dataObject) ? {} : dataObject;
  query = (!query) ? '' : query;
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
      endPoint = '/api/movies/all/' + query;
      break;
    case 'updateUser':
      method = "PUT";
      endPoint = '/api/update_user/' + query;
    break;
    case 'newRating':
      method = "POST";
      endPoint = '/api/new_rating/' + query;
    break;
    case 'newUser':
      method = "POST";
      endPoint = '/api/new_user/';
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
    method: method,
    processData: false,
    error: handleError,
    headers: {

    },
    data: dataObject,
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
  updateHash("search=" + string);
  $.ajax(apiGet('movieTitleRatings', string)).done(function(response){
    var listElem = $('<ul>').attr('id', 'results').appendTo('.content');
    for (var index = 0; index < response.length; index++){
      var thisMovie = new Movie(response[index]);
      thisMovie.displayResult(listElem);
     }
  });
}

function userSearch(string){
  collapseSearch();
  $('.content').empty();
  $.ajax(apiGet('userId', string)).done(function(response){
    var thisUser = new User(response);
    thisUser.displayUser();
   });
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
  this.date = dataObject.release_date;
  this.imdb = dataObject.imdb_url;
  this.genre = this.getGenre(dataObject);
  this.average = round(dataObject.avg, 1);
  this.ratingsCount = dataObject.count;
  this.ratings = dataObject.ratings;
}

Movie.prototype = {

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

  displayResult: function(listElem) {
    if(!listElem) {
      console.log("listElem is not defined.");
      return;
    }
    var source = $("#movie-result").html();
    var template = Handlebars.compile(source);
    var context = {
      "movie-Id": this.id,
      title: this.title,
      ratingCount: this.ratingsCount,
      ratingAverage: this.average,
      imdb: this.imdb
    };
    var html = template(context);
    $(html).prependTo(listElem).hide().fadeIn('fast');
    var linkName = '.ratings-count[movie-Id=' + this.id + ']';
    $(linkName).click((function(event){
      event.preventDefault();
      this.displayFull();
    }).bind(this));

  },

  displayFull: function(){
    updateHash('movie=' + this.id);
    $('.content').empty();
    var listElem = $('<ul>').attr('id', 'results').appendTo('.content');
    $.ajax(apiGet('movieId', this.id)).done((function(response){
      var thisMovie = new Movie(response);
      thisMovie.displayResult(listElem);
// constuct handlebar template for movie body::
      var source = $("#movie-result-body").html();
      var template = Handlebars.compile(source);
      var context = {
      };
      var html = template(context);
      $('.movie-viewer').attr('movie-Id', thisMovie.id).append(html);
      for (var index = 0; index < thisMovie.ratings.length; index++){
        var ratingObj = thisMovie.ratings[index];
        source = $("#user-table-item").html();
        template = Handlebars.compile(source);
        context = {
          userId: ratingObj.user_id,
          userScore: ratingObj.rating
        };
        html = template(context);
        $('#mv-user-list').append(html);
        // creating an event listener for our user element
        var linkName = '.mv-user-name[user-Id=' + ratingObj.user_id + ']';
        $(linkName).click(function(event){
          event.preventDefault();
          var specId = $(this).attr('user-Id');

          $.ajax(apiGet('userId', specId)).done(function(response){
            var user = new User(response);
            user.displayUser();
          });

        });
      }
    }).bind(this));


  }

};

function User(dataObject) {
  this.id = dataObject.user.id;
  this.age = dataObject.user.age;
  this.gender = dataObject.user.gender;
  this.occupation = dataObject.user.occupation;
  this.zipCode = dataObject.user.zip_code;
  this.ratings = dataObject.ratings;
}

User.prototype = {
  displayUser: function(){
    updateHash("user=" + this.id);
    $('.content').empty();
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
    // $('.content').append(html);
    // $('.content').append(html);
    $(html).appendTo('.content').hide().fadeIn('fast');
    $('#user-delete').one('click', function(event){
      //delete a user.

    });
    $('#my-ratings').one('click', (function(event) { // list movie ratings by user
      event.preventDefault();
      // start loop here
      for (var index = 0; index < this.ratings.length; index++) {
        var ratingObj = this.ratings[index];
        var source = $('#user-info-list-item').html();
        var template = Handlebars.compile(source);
        var context = {
          "user-id": this.id,
          "movie-id": ratingObj.movie_id,
          "movie-title": ratingObj.title,
          "movie-rating": ratingObj.rating
        };
        var html = template(context);
        // $('.top-rated-list').prepend(html);
        $(html).prependTo('.top-rated-list').hide().fadeIn('fast');
        var linkName = '.movie-title[movieId=' + ratingObj.movie_id + ']';
        $(linkName).click(function(event){
          event.preventDefault();
          var specId = $(this).attr('movieId');
          $.ajax(apiGet('movieId', specId)).done(function(response){
            var movie = new Movie(response);
            movie.displayFull();
          });
        });
        this.starRating($('#star-container'), context['movie-rating']);
      }
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
  },

  editUser: function() {
    $('#edit-user-div').empty();
    if (this.id === undefined) {
      $('<p>').html('That User Does Not Exist.');
    }
    console.log(this);
    var source = $('#edit-user-body').html();
    var template = Handlebars.compile(source);
    var context = {
      "userId": this.id,
      "age": this.age,
      "occupation": this.occupation,
      "zip-code": this.zipCode
    };
    console.log(context);
    var html = template(context);
    $('#manage-users-menu').append(html);
    var gender = this.gender;
    if (gender === 'F' || gender === 'M' || gender === 'NA'){
      $('#' + gender).attr('selected', 'selected'); // set displayed gender as user's gender
    }
    $('#submit-edit').one('click', (function(event){
      event.preventDefault();
      var dataObject = {
        "age":$('#new-age').val(),
        "gender":$('#new-gender option:selected').text(),
        "occupation":$('#edit-occupation').val(),
        "zip_code":$('#edit-zip').val()
      };
      $.ajax(apiGet('updateUser', this.id, dataObject)).done((function(response){
        this.displayUser();
      }).bind(this));
    }).bind(this));
  },
};

// LAUNCH CODE:

$('#headline').click(function() {
  $('.content').empty();
  expandSearch();
});

$('#manage-users-btn').click(function(event){
  collapseSearch();
  $('.content').empty();
  var source = $('#manage-users').html();
  var template = Handlebars.compile(source);
  var context = {
  };
  var html = template(context);
  $('.content').append(html);
// Add button Behavior
  $('#add-user-btn').click(function(event){
    $('#manage-users-menu').empty();
    var source = $('#add-user').html();
    var template = Handlebars.compile(source);
    var context = {
    };
    var html = template(context);
    $('#manage-users-menu').append(html);
    $('#add-user-form').submit(function(event) {
      event.preventDefault();
    });
    $('#submit-add').one('click', function(event){
      var dataObject = {
        "age":$('#new-age').val(),
        "gender":$('#new-gender option:selected').text(),
        "occupation":$('#new-occupation').val(),
        "zip_code":$('#new-zip').val()
      };
      console.log(dataObject);
      $.ajax(apiGet('newUser','', dataObject)).done(function(response){
        console.log('sent stuff to make new user.');
        console.log(response);
      });
    });
    // $.ajax(apiGet('newUser', '')).done(function(response){
    //   var thisUser = new User(response);
    // });
  });
  //Edit Button Behavior
  $('#edit-user-btn').click(function(event){
    $('#manage-users-menu').empty();
    var source = $('#edit-user-header').html();
    var template = Handlebars.compile(source);
    var context = {
    };
    var html = template(context);
    $('#manage-users-menu').append(html);
    $('#search-users-form').submit(function(event){
      event.preventDefault();
      var searchString = $('#input-search-edit').val();
      $.ajax(apiGet('userId',searchString)).done(function(response) {
        var thisUser = new User(response);
        thisUser.editUser();
      });
      });
    });


});

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

// check for bookmarked search:
if (window.location.hash.length > 0){
  hashString = window.location.hash;
  if (hashString === "#home"){
    $('.content').empty();
    expandSearch();
  } else if (hashString.includes('search=')) {
    hashString = hashString.replace('#search=','');
    hashString = hashString.replace('#','');
    movieSearch(hashString);
  } else if (hashString.includes('user=')){
    hashString = hashString.replace('#user=','');
    hashString = hashString.replace('#','');
    userSearch(hashString);
  } else if (hashString.includes('movie=')){
    hashString = hashString.replace('#movie=','');
    hashString = hashString.replace('#','');
    $.ajax(apiGet('movieId', hashString)).done(function(response){
      var movie = new Movie(response);
      collapseSearch();
      movie.displayFull();
    });
  }
}

window.location.hash = "home";
