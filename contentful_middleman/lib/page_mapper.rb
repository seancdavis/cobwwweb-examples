class PageMapper < ContentfulMiddleman::Mapper::Base

  def map(context, entry)
    super
    context.path = "/#{context.slug}/"
    context.file_path = "#{context.path}index.html"
    context.template = "templates/page/#{context.template_name.parameterize}.html"
  end

end
