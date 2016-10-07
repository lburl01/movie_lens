//code??


// when this is called, be sure to create this:
// var list = $('<li>').attr('id', 'results');
// $(list).appendTo('.content');

function displayMovieResult(movieTitle, ratingCount, average, listElem){
  var source = $("#movie-result").html();
  var template = Handlebars.compile(source);
  var context = {
    title: movieTitle,
    ratingCount: ratingCount,
    ratingAverage: average
  };
  var html = template(context);
  $(html).appendTo(listElem);
}

function displayMovieInfo(){
  $('.content').empty(); // clear content area
  console.log(source);
}

displayMovieInfo();

// $('.content').empty();
// var list = $('<li>').attr('id', 'results');
// $(list).appendTo('.content');
//
// displayMovieResult("Bad Boys II", 457, 3.2, list);
