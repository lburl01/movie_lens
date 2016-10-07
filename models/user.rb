require 'active_record'
require_relative '../schema'
require_relative '../environment'

class User < ActiveRecord::Base
  validates :age, :gender, :occupation, :zip_code, presence: true
  has_many :ratings
  has_many :movies, through: :ratings
end
