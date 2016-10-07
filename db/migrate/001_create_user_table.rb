
class CreateUserTable < ActiveRecord::Migration[5.0]
  def up
    create_table :users do |t|
      t.integer :age
      t.string :gender
      t.string :occupation
      t.integer :zip_code
    end
  end

  def drop
    drop_table :users
  end
end

def main
  action = (ARGV[0] || :up).to_sym

  CreateUserTable.migrate(action)

end

main if __FILE__ == $PROGRAM_NAME
