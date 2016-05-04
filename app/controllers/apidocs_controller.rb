# -*- coding: utf-8 -*-
class ApidocsController < ActionController::Base
  include Swagger::Blocks
  
  swagger_root do
    key :swagger, '2.0'
    info do
      key :version, '1.0.0'
      key :title, 'Sizung API'
      key :description, 'Documentation for the json API endpoints to Sizung.'
      key :termsOfService, 'http://sizung.com/terms/'
      contact do
        key :name, 'Günter Glück'
      end
    end
    tag do
      key :name, 'auth'
      key :description, 'Authorization'
      externalDocs do
        key :description, 'Find more info here'
        key :url, 'https://sizung.com'
      end
    end
    key :host, 'localhost:3000'
    key :basePath, '/api'
    key :consumes, ['application/json']
    key :produces, ['application/json']
  end

  # A list of all classes that have swagger_* declarations.
  SWAGGERED_CLASSES = [
    Api::SessionTokensController,
    self,
  ].freeze

  def index
    render json: Swagger::Blocks.build_root_json(SWAGGERED_CLASSES)
  end
end
