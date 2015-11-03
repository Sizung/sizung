require 'test_helper'

describe AgendaItemsController do
  include Devise::TestHelpers

  describe 'visitor' do
    it 'should not be allowed to create a new agenda item' do
      post :create, agenda_item: {title: 'Last weeks review'}
      assert_response :redirect
      assert_redirected_to new_user_session_path
    end
  end

  describe 'signed in' do
    setup do
      @conversation = FactoryGirl.create(:conversation)
      @agenda_item  = FactoryGirl.create(:agenda_item)
      @request.env['devise.mapping'] = Devise.mappings[:user]
      @current_user = @conversation.organization.owner
      sign_in @current_user
    end

    it 'creates agenda item' do
      expect {
        post :create, agenda_item: { title: 'Last months review', conversation_id: @conversation.id }, format: :json
      }.must_change 'AgendaItem.count'

      @initial_comment = Comment.last
      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal 'Last months review', agenda_item['data']['attributes']['title']
      assert_equal @current_user.id, agenda_item['data']['relationships']['owner']['data']['id']
      assert_equal @initial_comment.id, agenda_item['data']['relationships']['initial_comment']['data']['id']
      assert_equal @initial_comment.id, agenda_item['included'][0]['id']
      assert_equal 'comments', agenda_item['included'][0]['type']
    end

    it 'destroys agenda item' do
      expect {
        delete :destroy, id: @agenda_item
      }.must_change 'AgendaItem.count', -1

      assert_response :success
      agenda_item = JSON.parse(response.body)
      assert_equal @agenda_item.title, agenda_item['data']['attributes']['title']
    end
  end
end
