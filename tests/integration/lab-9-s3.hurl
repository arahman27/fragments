POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
