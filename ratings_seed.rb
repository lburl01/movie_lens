require 'csv'
# require_relative 'environment'
require_relative 'models/rating'
require_relative 'db/migrate/003_create_ratings'
# require_relative 'schema'

def main
  conn = ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
  conn.exec(select setval(pg_get_serial_sequence('users', 'id'),
            (select max(id) from users)
     ))
  csv = CSV.read('u.data', encoding: 'windows-1252', col_sep: "\t")
  csv.each do |line|
    user_id = line[0].to_i
    movie_id = line[1].to_i
    rating = line[2].to_f
    timestamp = line[3]

    Rating.create!(user_id: user_id, movie_id: movie_id, rating: rating, timestamp: timestamp)
    ActiveRecord::Base.connection.close

  end

end
main if __FILE__ == $PROGRAM_NAME
