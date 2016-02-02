Rails.application.routes.draw do
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

    resources :agenda_items, only: [:create, :show, :update] do
      concerns :list_conversation_objects, parent_type: 'AgendaItem'
      concerns :unseen_objects, parent_type: 'AgendaItem'
    end

    resources :deliverables, only: [:create, :update] do
      concerns :list_conversation_objects, parent_type: 'Deliverable'
      concerns :unseen_objects, parent_type: 'Deliverable'
    end

    resources :comments

    resources :organizations, shallow: true do
      concerns :unseen_objects, parent_type: 'Organization'

      resources :conversations do
        resources :agenda_items, only: [:index]
        concerns :list_conversation_objects, parent_type: 'Conversation'
        concerns :unseen_objects, parent_type: 'Conversation'
      end

      resources :organization_members, only: [:index, :destroy]
    end
    resources :conversation_members, only: [:create, :destroy]
  end

  resources :organizations, shallow: true do
    resources :organization_members, only: [:index, :destroy]
  end
  resources :conversations

  get 'conversations/:id/agenda_items/:agenda_item_id/deliverables/:deliverable_id', to: 'conversations#show'
  get 'conversations/:id/agenda_items/:agenda_item_id', to: 'conversations#show'
  get 'agenda_items/:agenda_item_id', to: 'react_routes#index'

  devise_for :users, controllers: {
                       registrations: 'users/registrations',
                       sessions:      'users/sessions',
                       invitations:   'users/invitations'
                   }
  resources :samples, only: [:index]

  authenticated :user do
    root to: 'organizations#index', as: :authenticated_root
  end

  match '/websocket', to: ActionCable.server, via: [:get, :post]

  root 'landing_page#index'
end
