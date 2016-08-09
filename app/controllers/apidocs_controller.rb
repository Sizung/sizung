# -*- coding: utf-8 -*-
class ApidocsController < ActionController::Base
  include Swagger::Blocks

  swagger_schema :errors, required: [:errors] do
    property :errors, type: :array do
      items do
        property :source, type: :object do
          property :pointer, type: :string
        end
        property :detail, type: :string
      end
    end
  end
  
  swagger_root do
    key :swagger, '2.0'
    info do
      key :title, 'Sizung API'
      key :description, 'Documentation for the json API endpoints to Sizung.'
      key :version, '1.0.0'
      key :termsOfService, 'http://sizung.com/terms/'

      contact do
        key :name, 'Günter Glück'
      end
    end

    key :host, ENV['SIZUNG_HOST'].split('//').last
    key :basePath, '/api'

    tag do
      key :name, 'auth'
      key :description, 'Authorization'
      externalDocs do
        key :description, 'Find more info here'
        key :url, 'https://sizung.com'
      end
    end
    key :consumes, ['application/json']
    key :produces, ['application/json']

    security_definition :bearer do
      key :type, :apiKey
      key :name, :Authorization
      key :in, :header
    end
  end

  # A list of all classes that have swagger_* declarations.
  SWAGGERED_CLASSES = [
    Api::SessionTokensController,
    Api::OrganizationsController,
    Api::OrganizationMembersController,
    Api::ConversationsController,
    Api::AttachmentsController,
    Api::CommentsController,
    Api::AgendaItemsController,
    Api::DeliverablesController,
    Api::DevicesController,
    Api::UnseenObjectsController,
    Api::UsersController,
    Api::LongLivedTokensController,
    OrganizationSerializer,
    OrganizationMemberSerializer,
    ConversationSerializer,
    AttachmentSerializer,
    CommentSerializer,
    AgendaItemSerializer,
    DeliverableSerializer,
    DeviceSerializer,
    UnseenObjectSerializer,
    UserSerializer,
    self,
  ].freeze

  def index
    render json: Swagger::Blocks.build_root_json(SWAGGERED_CLASSES)
  end
end
