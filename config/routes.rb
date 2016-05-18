Rails.application.routes.draw do

  require 'sidekiq/web'
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  namespace :api do
    concern :list_conversation_objects do |options|
      resources :conversation_objects, options.merge(only: [:index])
    end

    concern :unseen_objects do |options|
      delete 'unseen_objects', to: 'unseen_objects#destroy_all', defaults: options
      get 'unseen_objects', to: 'unseen_objects#index', defaults: options
      # resources :unseen_objects, options.merge(only: [:destroy_all])
    end

    concern :attachments do |options|
      resources :attachments, options.merge(only: [:new, :create])
    end


    
    resources :organizations, shallow: true do
      concerns :unseen_objects, parent_type: 'Organization'

      resources :conversations do
        resources :agenda_items, only: [:index]
        concerns :list_conversation_objects, parent_type: 'Conversation'
        concerns :unseen_objects, parent_type: 'Conversation'
        concerns :attachments, parent_type: 'Conversation'
      end

      resources :organization_members, only: [:index, :create, :destroy]
    end

    resources :agenda_items, only: [:create, :show, :update] do
      concerns :list_conversation_objects, parent_type: 'AgendaItem'
      concerns :unseen_objects, parent_type: 'AgendaItem'
      concerns :attachments, parent_type: 'AgendaItem'
    end

    resources :deliverables, only: [:create, :show, :update] do
      concerns :list_conversation_objects, parent_type: 'Deliverable'
      concerns :unseen_objects, parent_type: 'Deliverable'
      concerns :attachments, parent_type: 'Deliverable'
    end

    resources :comments
    resources :conversation_members, only: [:create, :destroy]
    resources :organization_members, only: [:create, :destroy]
    resources :meetings, only: [:create]
    resources :users, only: [:index, :create, :update], shallow: true do
      concerns :unseen_objects, parent_type: 'User'
    end
    resources :conversations, only: [:create, :update, :destroy]
    devise_scope :user do
      resources :session_tokens, only: [:create, :show]
    end
  end

  resources :attachments, only: [:show]
  
  resources :organizations, shallow: true do
    resources :organization_members, only: [:index, :destroy]
    resources :conversations
  end

  get 'agenda_items/:id', to: 'react_routes#index', as: :agenda_item
  get 'deliverables/:id', to: 'react_routes#index', as: :deliverable
  get 'signup', to: 'react_routes#new_registration', as: :signup
  get 'organizations/:id/settings', to: 'react_routes#index', as: :settings

  # Old routes are redirected to new shallow routes
  get 'conversations/:id/agenda_items/:agenda_item_id/deliverables/:deliverable_id', to: redirect('/deliverables/%{deliverable_id}')
  get 'conversations/:id/agenda_items/:agenda_item_id', to: redirect('/agenda_items/%{agenda_item_id}')

  devise_for :users, controllers: {
                       registrations: 'users/registrations',
                       sessions:      'users/sessions',
                       invitations:   'users/invitations'
                   }
  resources :samples, only: [:index]

  resources :apidocs, only: [:index]
  
  authenticated :user do
    root to: 'organizations#index', as: :authenticated_root
  end

  authenticate :user, lambda { |u| u.email == 'gugl@guenterglueck.com' } do
    mount Sidekiq::Web => '/sidekiq'
  end

  match '/websocket', to: ActionCable.server, via: [:get, :post]

  # root 'landing_page#index'
  devise_scope :user do
    root to: 'users/sessions#new'
  end
end
