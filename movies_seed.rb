require 'csv'
require_relative 'environment'
require_relative 'model'
require_relative 'schema'

def main
  csv = CSV.read('u.item', encoding: 'windows-1252', col_sep: "|")
  csv.each do |line|
    id = line[0].to_i
    title = line[1]
    release_date = line[2]
    video_release = line[3]
    unknown_genre = line[4].to_i
    action = line[5].to_i
    adventure = line[6].to_i
    animation = line[7].to_i
    children = line[8].to_i
    comedy = line[9].to_i
    crime = line[10].to_i
    documentary = line[11].to_i
    drama = line[12].to_i
    fantasy = line[13].to_i
    film_noir = line[14].to_i
    horror = line[15].to_i
    musical = line[16].to_i
    mystery = line[17].to_i
    romance = line[18].to_i
    sci_fi = line[19].to_i
    thriller = line[20].to_i
    war = line[21].to_i
    western = line[22].to_i

    Movie.create!(id: id, title: title, release_date: release_date, video_release: video_release, unknown_genre: unknown_genre, action: action, adventure: adventure, animation: animation, children: children, comedy: comedy, crime: crime, documentary: documentary, drama: drama, fantasy: fantasy, film_noir: film_noir, horror: horror, musical: musical, mystery: mystery, romance: romance, sci_fi: sci_fi, thriller: thriller, war: war, western: western)

  end

end
main if __FILE__ == $PROGRAM_NAME
