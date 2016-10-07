require 'active_record'
require_relative 'schema'
require_relative 'environment'

class Movie < ActiveRecord::Base
  validates :title, presence: true
  has_many :ratings
  has_many :users, through: :ratings

  attr_reader :id, :title, :release_date, :imdb_url, :genre

  def initialize(options)
    @id = options['id']
    @title = options['title']
    @release_date = options['release_date']
    @imdb_url = options['imdb_url']
    @genre = options['genre']
  end



end
