# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

namespace :test do
  desc 'run NPM tests'
  Rake::TestTask.new(:npm_test) do |t|
    puts `npm test`
  end
end

Rake::Task[:test].enhance { Rake::Task["test:npm_test"].invoke }