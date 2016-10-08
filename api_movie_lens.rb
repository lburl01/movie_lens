require 'sinatra'
require 'yaml'
require_relative 'models/movie'
require_relative 'models/user'
require_relative 'models/rating'
require 'json'

database_config = YAML::load(File.open('config/database.yml'))

before do
  ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
  content_type :json
end

after do
  ActiveRecord::Base.connection.close
end

get '/api/movies/title' do
  if !params['search'].nil?
    movie = Movie.where("title like (?)", "%#{params['search']}%")
    if movie.empty?
      halt(404)
    end
    status 200
    movie.to_json
  end
end

get '/api/users/:id' do
  user = User.find_by_id(params['id'])
  if user.nil?
    halt(404)
  end
  status 200
  user.to_json
end

get '/api/movies_count' do
  Movie.count.to_json
end

get '/api/ratings_count' do
  Rating.count.to_json
end

get '/api/users_count' do
  User.count.to_json
end

get '/api/movies/:id' do
  movie = Movie.find_by_id(params['id'])
  if movie.nil?
    halt(404)
  end
  status 200
  movie.to_json
end

get '/api/ratings/average/:movie_id' do
  average = Rating.where(movie_id: params['movie_id']).average("rating")
  status 200
  average.to_json
end

get '/api/ratings/all_ratings/:movie_id' do
  appts = Rating.select(:movie_id, :user_id, :title, :rating).joins("FULL OUTER JOIN movies ON ratings.movie_id = movies.id").where(movie_id: params['movie_id']).joins("FULL OUTER JOIN users ON ratings.user_id = users.id").all.to_json
end

post '/api/new_user' do
  User.create(id: User.maximum(:id).next, age: params['age'], gender: params['gender'], occupation: params['occupation'], zip_code: params['zip_code']).to_json
  status 201
end

put '/api/update_user/:id' do
  u = User.find_by(id: params[:id])
  if u.nil?
    halt(404)
  end
  status 200
  u.update(
    age: params['age'],
    gender: params['gender'],
    occupation: params['occupation'],
    zip_code: params['zip_code']
  ).to_json
end

delete '/api/delete_user/:id' do
  u = User.find_by(id: params[:id])
  if u.nil?
    halt(404)
  end
  u.destroy
end
