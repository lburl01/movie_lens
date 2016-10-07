require 'csv'
# require_relative 'environment'
require_relative 'models/rating'
require_relative 'schema'

def main
  csv = CSV.read('u.data', encoding: 'windows-1252', col_sep: "\t")
  csv.each do |line|
    user_id = line[0].to_i
    movie_id = line[1].to_i
    rating = line[2].to_f
    timestamp = line[3]

    Rating.create!(user_id: user_id, movie_id: movie_id, rating: rating, timestamp: timestamp)

  end

end
main if __FILE__ == $PROGRAM_NAME
