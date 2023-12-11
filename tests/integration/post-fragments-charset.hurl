# POST http://localhost:8080/v1/fragments
# Content-Type: text/plain; charset=utf-8
# [BasicAuth]
# user1@email.com:password1
# `This is a fragment!`

# We expect to get back an HTTP 201
# HTTP/1.1 201
# [Asserts]
# header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# jsonpath "$.status" == "ok"
# jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
# jsonpath "$.fragments.created" isString
# jsonpath "$.fragments.updated" isString
# jsonpath "$.fragments.type" == "text/plain; charset=utf-8"
# jsonpath "$.fragments.size" == 19
