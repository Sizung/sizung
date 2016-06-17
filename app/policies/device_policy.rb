class DevicePolicy < ApplicationPolicy
  def create?
    user.id == record.user.id
  end

  class Scope < Scope
    def resolve
      scope.where(user: user)
    end
  end
end
