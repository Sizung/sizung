require 'test_helper'

describe ConversationObjectsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to list any conversation objects' do
      get :index, conversation_id: '123', parent_type: 'Conversation', format: :json
      assert_response 401
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @agenda_item  = FactoryGirl.create(:agenda_item, conversation: @conversation)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
    end

    it 'list conversation objects for conversation' do
      get :index, conversation_id: @conversation, parent_type: 'Conversation', format: :json

      assert_response :success
      conversation_objects = JSON.parse(response.body)
      assert_equal @agenda_item.id, conversation_objects['data'][0]['id']
    end

    it 'list conversation objects for agenda item' do
      @comment_old = FactoryGirl.create(:comment, commentable: @agenda_item, created_at: DateTime.now - 2.days)
      @comment = FactoryGirl.create(:comment, commentable: @agenda_item)
      get :index, agenda_item_id: @agenda_item, parent_type: 'AgendaItem', format: :json

      assert_response :success
      conversation_objects = JSON.parse(response.body)
      assert_equal @comment.id, conversation_objects['data'][0]['id']
      assert_equal @comment_old.id, conversation_objects['data'][1]['id']
    end
  end
end
