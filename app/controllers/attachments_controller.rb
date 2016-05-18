class AttachmentsController < ApplicationController
  before_filter :authenticate_user!

  def show
    attachment = Attachment.find(params[:id])
    redirect_to generate_target_url(attachment)
  end

  protected

  def generate_target_url(attachment)
      storage = Fog::Storage.new(
        provider:              'AWS',
        aws_access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
      )

      # options = { path_style: true }
      options = { path_style: true }

      @url = storage.get_object_url(
        ENV['S3_BUCKET_NAME'],
        attachment.persistent_file_id,
        15.minutes.from_now.to_time.to_i,
        options
      )
  end
end
