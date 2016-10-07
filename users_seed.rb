require 'csv'
# require_relative 'environment'
require_relative 'models/user'
require_relative 'schema'

def main
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
