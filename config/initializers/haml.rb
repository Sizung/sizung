module Haml::Filters
  remove_filter("Markdown") # remove the existing Markdown filter

  module Markdown
    include Haml::Filters::Base

    def render(text)
      markdown.render(text)
    end

    private

    def markdown
      render_options = {
        filter_html: true,
        hard_wrap: true,
        no_styles: true,
        prettify: true,
        safe_links_only: true,
        with_toc_data: false
      }

      extensions = {
        autolink: true,
        fenced_code_blocks: true,
        footnotes: false,
        highlight: true,
        no_images: true,
        no_intra_emphasis: true,
        quote: true,
        space_after_headers: false,
        strikethrough: true,
        superscript: true,
        tables: false,
        underline: true
      }

      renderer = Redcarpet::Render::HTML.new(render_options)
      @markdown ||= Redcarpet::Markdown.new(renderer, extensions)
    end
  end
end
