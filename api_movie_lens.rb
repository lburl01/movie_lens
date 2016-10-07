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

# get 'api/movie/1' do
#   JSON.dumps '{"id": 1, "title": "Toy Story"}'
# end

get '/api/movies' do
  if !params['search'].nil?
    Movie.where("title like ?", "%#{params['search']}%").to_json
  end
end

get '/api/movies/:id' do
  task = Movie.find_by_id(params['id']).to_json
end
