class PostMapper < ContentfulMiddleman::Mapper::Base

  def map(context, entry)
    super
    date = context.published_at
    context.path = "/blog/#{date.year}-#{'%02i' % date.month}-#{'%02i' % date.day}-#{context.slug}/"
    context.file_path = "#{context.path}index.html"
    context.template = 'templates/post.html'
  end

end
