require 'test_helper'

describe AgendaItemsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new agenda item' do
      post :create, agenda_item: {title: 'Last weeks review'}
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
    end

    it 'creates agenda item' do
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id }, format: :json
      }.must_change 'AgendaItem.count'

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal @current_user.id, agenda_item['data']['relationships']['owner']['data']['id']
    end

    it 'updates the agenda item' do
      patch :update, id: @agenda_item.id, agenda_item: { title: 'Changed title' }, format: :json

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Changed title', agenda_item['data']['attributes']['title']
    end

    it 'archive agenda item' do
      patch :update, id: @agenda_item.id, agenda_item: { archived: true }

      assert_response :success
      expect(@agenda_item.reload).must_be :archived?

      agenda_item = JSON.parse(response.body)
      assert_equal true, agenda_item['data']['attributes']['archived']
    end

    it 'should freeze archived agenda items' do
      patch :update, id: @agenda_item.id, agenda_item: { archived: true }
      expect {
        patch :update, id: @agenda_item.id, agenda_item: { title: 'changed title' }
      }.must_raise ActiveRecord::RecordNotFound
    end
  end
end
