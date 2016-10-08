require 'active_record'

class CreateRatings < ActiveRecord::Migration[5.0]
  def up
    create_join_table :users, :movies, table_name: :ratings do |t|
      t.belongs_to :movie, index: true, foreign_key: true
      t.belongs_to :user, index: true, foreign_key: true
      t.float :rating
      t.string :timestamp
    end
  end

  def down
    drop_table :ratings
  end
end

def main
  action = (ARGV[0] || :up).to_sym

  CreateMovies.migrate(action)

end

main if __FILE__ == $PROGRAM_NAME
