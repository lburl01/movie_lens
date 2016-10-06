require 'sinatra'
require 'active_record'
require 'yaml'
require_relative 'character'

# database_config = YAML::load(File.open('config/database.yml'))

ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])

before do
  content_type :json
end

after do
  ActiveRecord::Base.connection.close
end

get 'api/movie/1' do
  JSON.dumps '{"id": 1, "title": "Toy Story"}'
end
