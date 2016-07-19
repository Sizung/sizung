class ApplicationCommand
  attr_reader :description
  
  def initialize(description)
    @description = description
  end

  def execute
    raise NotImplementedError
  end
end
