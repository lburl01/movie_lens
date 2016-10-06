require 'sinatra'

get 'api/movie/1' do
  JSON.dumps '{"id": 1, "title": "Toy Story"}'
end
