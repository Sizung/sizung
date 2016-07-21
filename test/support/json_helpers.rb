def json_included(json, key, value)
  json['included'].each do |obj|
    return true if obj[key] == value
  end
  return false
end

