require 'csv'
# require_relative 'environment'
require_relative 'models/user'
require_relative 'db/migrate/001_create_users'
# require_relative 'schema'

# database_config = YAML::load(File.open('config/database.yml'))
#
# ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])

# before do
#   ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
#   content_type :json
# end
#
# after do
#   ActiveRecord::Base.connection.close
# end

def main
  conn = ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
  conn.exec(select setval(pg_get_serial_sequence('users', 'id'),
            (select max(id) from users)
     ))
  csv = CSV.read('u.user', encoding: 'windows-1252', col_sep: "|")
  csv.each do |line|
    id = line[0].to_i
    age = line[1].to_i
    gender = line[2]
    occupation = line[3]
    zip_code = line[4].to_i

    User.create!(id: id, age: age, gender: gender, occupation: occupation, zip_code: zip_code)

  end

end
main if __FILE__ == $PROGRAM_NAME
