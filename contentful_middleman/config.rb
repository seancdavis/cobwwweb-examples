require 'lib/page_mapper'
require 'lib/post_mapper'
require 'pry'

activate :dotenv

activate :contentful do |f|
  f.space         = { site: ENV['CONTENTFUL_SPACE_ID'] }
  f.access_token  = ENV['CONTENTFUL_ACCESS_TOKEN']
  f.cda_query     = { limit: 1000 }
  # f.content_types = { pages: 'page', posts: 'post' }
  f.content_types = {
    pages: { mapper: PageMapper, id: 'page' },
    posts: { mapper: PostMapper, id: 'post' }
  }
end

# Ignore all templates (saves from doing it in loop and protects against data not existing)
ignore 'templates/*.html'

if @app.data.try(:site).try(:pages)
  data.site.pages.each do |_id, page|
    next if page.template.blank?
    # path = "#{page.slug}/index.html"
    # template = "templates/page/#{page.template.parameterize}.html"
    proxy page.file_path, page.template, locals: { page: page }
  end
end

if @app.data.try(:site).try(:posts)
  data.site.posts.each do |_id, post|
    next if post.template.blank?
    # date = post.published_at
    # path = "blog/#{date.year}-#{'%02i' % date.month}-#{'%02i' % date.day}-#{post.slug}/index.html"
    proxy post.file_path, post.template, locals: { post: post }
  end
end

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end
