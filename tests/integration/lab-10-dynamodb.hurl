#1 & 2__________________________________________________________________________________
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{ "service": "DynamoDB" }`

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragments.id"

#3______________________________________________________________________________________
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}

#4 & 5__________________________________________________________________________________
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**.`

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragments.id"

#6______________________________________________________________________________________
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}

#7______________________________________________________________________________________
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments[*]" == {{fragment1_id}}
jsonpath "$.fragments[*]" == {{fragment2_id}}

#8 & 9__________________________________________________________________________________
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

#10 & 11________________________________________________________________________________
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

#12_____________________________________________________________________________________
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments[*]" != {{fragment1_id}}
jsonpath "$.fragments[*]" == {{fragment2_id}}


