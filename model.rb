require 'active_record'
require_relative 'schema'
require_relative 'environment'

class User < ActiveRecord::Base
  validates :id, :age, :gender, :occupation, :zip_code, presence: true
  has_many :ratings
  has_many :movies, through: :ratings
end

class Movie < ActiveRecord::Base
  validates :title, presence: true
  has_many :ratings
  has_many :users, through: :ratings
end

class Rating < ActiveRecord::Base
  validates :user_id, :movie_id, :rating, presence: true
  belongs_to :movie
  belongs_to :user
end
