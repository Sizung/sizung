require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'valid user' do
    user = User.new(email: 'sam.sample@example.com',
                    first_name: 'Sam',
                    last_name: 'Sample',
                    password: 'SecurePassword',
                    password_confirmation: 'SecurePassword')

    assert user.valid?
  end

  test 'create valid user from factory' do
    user = FactoryGirl.create :user
    assert user.persisted?
  end

  test 'complains when first_name is missing' do
    user = FactoryGirl.build :user, first_name: nil
    assert_not user.valid?
    assert_equal ["can't be blank"], user.errors.messages[:first_name]
  end

  test 'complains when last_name is missing' do
    user = FactoryGirl.build :user, last_name: nil
    assert_not user.valid?
    assert_equal ["can't be blank"], user.errors.messages[:last_name]
  end

  test 'uses email address as name when first_name last_name are missing' do
    user = FactoryGirl.build :user, first_name: nil, last_name: nil
    assert_equal user.email, user.name
  end

  test 'complains when email is missing' do
    user = FactoryGirl.build :user, email: nil
    assert_not user.valid?
    assert_equal ["can't be blank"], user.errors.messages[:email]
  end

  test 'complains when password is missing' do
    user = FactoryGirl.build :user, password: nil
    assert_not user.valid?
    assert_equal ["can't be blank"], user.errors.messages[:password]
  end

  test 'complains when password_confirmation is not matching' do
    user = FactoryGirl.build :user, password: 'SuperSecret', password_confirmation: 'SuperSecret_1'
    assert_not user.valid?
    assert_equal ["doesn't match Password"], user.errors.messages[:password_confirmation]
  end

end
