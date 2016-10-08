# require_relative 'environment'
#
# class CreateUsers < ActiveRecord::Migration[5.0]
#   def up
#     create_table :users do |t|
#       t.integer :age
#       t.string :gender
#       t.string :occupation
#       t.integer :zip_code
#     end
#   end
#
#   def drop
#     drop_table :users
#   end
# end
#
# class CreateMovies < ActiveRecord::Migration[5.0]
#   def up
#     create_table :movies do |t|
#       t.string :title
#       t.string :release_date
#       t.string :video_release
#       t.string :imdb_url
#       t.integer :unknown_genre
#       t.integer :action
#       t.integer :adventure
#       t.integer :animation
#       t.integer :children
#       t.integer :comedy
#       t.integer :crime
#       t.integer :documentary
#       t.integer :drama
#       t.integer :fantasy
#       t.integer :film_noir
#       t.integer :horror
#       t.integer :musical
#       t.integer :mystery
#       t.integer :romance
#       t.integer :sci_fi
#       t.integer :thriller
#       t.integer :war
#       t.integer :western
#     end
#   end
#
#   def drop
#     drop_table :movies
#   end
# end
#
#   class CreateRatings < ActiveRecord::Migration[5.0]
#     def up
#       create_join_table :users, :movies, table_name: :ratings do |t|
#         t.belongs_to :movie, index: true, foreign_key: true
#         t.belongs_to :user, index: true, foreign_key: true
#         t.float :rating
#         t.string :timestamp
#       end
#     end
#
#     def drop
#       drop_table :ratings
#     end
# end
#
# def main
#   action = (ARGV[0] || :up).to_sym
#
#   CreateUsers.migrate(action)
#   CreateMovies.migrate(action)
#   CreateRatings.migrate(action)
#
# end
#
# main if __FILE__ == $PROGRAM_NAME
