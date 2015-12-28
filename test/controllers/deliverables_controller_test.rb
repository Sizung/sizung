require 'test_helper'

describe DeliverablesController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new deliverable' do
      post :create, deliverable: {title: 'Next big thing'}
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
      @agenda_item  = FactoryGirl.create(:agenda_item, conversation: @conversation, owner: @current_user)
      @deliverable = FactoryGirl.create(:deliverable, owner: @current_user, assignee: @current_user, agenda_item: @agenda_item)
    end

    it 'creates deliverable' do
      expect {
        post :create, deliverable: { title: 'Another big thing', agenda_item_id: @agenda_item.id }, format: :json
      }.must_change 'Deliverable.count'

      assert_response :success
      deliverable = JSON.parse(response.body)
      assert_equal 'Another big thing', deliverable['data']['attributes']['title']
      assert_equal @current_user.id, deliverable['data']['relationships']['owner']['data']['id']
    end

    it 'updates the deliverable' do
      patch :update, id: @deliverable.id, deliverable: { title: 'Changed title' }, format: :json

      assert_response :success
      deliverable = JSON.parse(response.body)
      assert_equal 'Changed title', deliverable['data']['attributes']['title']
    end

    it 'archive deliverable' do
      patch :update, id: @deliverable.id, deliverable: { archived: true }

      assert_response :success

      expect(@deliverable.reload).must_be :archived?
    end
  end
end
