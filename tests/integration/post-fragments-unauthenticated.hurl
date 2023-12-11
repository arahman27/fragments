POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
1234@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 401
HTTP/1.1 401
