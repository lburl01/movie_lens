require 'active_record'
require_relative '../schema'
require_relative '../environment'

class Rating < ActiveRecord::Base
  validates :user_id, :movie_id, :rating, presence: true
  belongs_to :movie
  belongs_to :user
end
