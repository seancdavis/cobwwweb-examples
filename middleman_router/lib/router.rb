class Router < Middleman::Extension

  attr_accessor :routes

  # def initialize(app, options_hash={}, &block)
  #   super
  #   @data = app.data
  # end

  def add(name, options = {})
    options.reverse_merge!(template: name.singularize)
    options[:template] = "templates/#{options[:template]}"

    data = app.data.send(name).map { |obj| options.merge(path: obj.send()) }
  end

  private

  def path_from_object(obj, config)
    path = "/#{config.path}/index.html"
    substitutions_for_route(config, :path).each do |sub|
      path.gsub!(/\{#{sub}\}/, obj.send(sub))
    end
    path
  end

end

::Middleman::Extensions.register(:router, Router)
