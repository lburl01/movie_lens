require 'sinatra'
require 'yaml'
require_relative 'models/movie'
require_relative 'models/user'
require_relative 'models/rating'
require 'json'

# database_config = YAML::load(File.open('config/database.yml'))

#ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])

before do
  content_type :json
end

# after do
#   ActiveRecord::Base.connection.close
# end

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

get '/api/movies/:id' do
  movie = Movie.find_by_id(params['id'])
  if movie.nil?
    halt(404)
  end
  status 200
  movie.to_json
end
