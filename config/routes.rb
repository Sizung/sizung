Rails.application.routes.draw do
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

  resources :conversation_members, only: [:create, :destroy]
  resources :comments
  # resources :conversations do
  #   concerns :list_conversation_objects, parent_type: 'Conversation'
  # end
  resources :organizations, shallow: true do
    concerns :unseen_objects, parent_type: 'Organization'

    resources :conversations do
      resources :agenda_items, only: [:index]
      concerns :list_conversation_objects, parent_type: 'Conversation'
      concerns :unseen_objects, parent_type: 'Conversation'
    end

    resources :organization_members, only: [:index, :destroy]
  end

  get 'conversations/:id/agenda_items/:agenda_item_id/deliverables/:deliverable_id', to: 'conversations#show'
  get 'conversations/:id/agenda_items/:agenda_item_id', to: 'conversations#show'

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

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
