# POST http://localhost:8080/v1/fragments
# Content-Type: text/plain
# [BasicAuth]
# user1@email.com:password1
# `Hello S3!`

# We expect to get back an HTTP 201
# HTTP/1.1 201
# [Asserts]
# header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# jsonpath "$.status" == "ok"
# [Captures]
# url: header "Location"

# GET {{url}}
# [BasicAuth]
# user1@email.com:password1

# HTTP/1.1 201
# Content-Type: text/plain
# [Asserts]
# body == "Hello S3!"

# DELETE {{url}}
# [BasicAuth]
# user1@email.com:password1

# HTTP/1.1 201

# GET {{url}}
# [BasicAuth]
# user1@email.com:password1

# HTTP/1.1 401
