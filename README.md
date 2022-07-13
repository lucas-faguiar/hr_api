# HR API
Project to manage HR profiles and calculate statistic values on salaries.

## Building and running using Dockerfile
Build:
```
docker build . -t lucasfaguiar/hr-api
```

Run:
```
docker run -p 8080:8080 -d lucasfaguiar/hr-api
```

## Building and running using docker-compose
Build:
```
docker-compose build
```

Run:
```
docker-compose up
```

## Validation
Validation of payload is done using `ajv` library.

## Storage
For simplicity, data set is kept in-memory on a simple runtime variable.

## Tests
Tests are built on top of mocha and chai framework. They are end-to-end and test all API endpoints.
Run:
```
npm test
```

## API payload
All POST endpoints expect that payload comes as raw `JSON` in the body.
Some GET endpoints expect parameters as `query` params in the URL.

## Authentication and autorization
All profile and statistics endpoints require authentication and authorization. In order to get permission to access the resources it's required to sign in using below endpoint.

## POST login
This endpoint should be used to get authenticated and access the resources.

List of registered users
```json
[
  { username: "admin", password: "admin", permission_level: 10 },
  { username: "junior", password: "junior", permission_level: 1 },
]
```

```
GET http://localhost:8080/login
```
Body:
```json
{
    "username": "admin",
    "password": "admin"
}
```

After a successful login operation you will receive a token on the payload, like this:
```json
{
    "status": 200,
    "message": "Login was successful!",
    "payload": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoianVuaW9yIiwiaWF0IjoxNjU3Njg4MzkyfQ.TgFo425j7L1jXTx_ppInFzBwcnfYzMCcr_aWASE_PpE"
}
```

User this token on the Header of the calls to other endpoints:
```
--Header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpYXQiOjE2NDI4NDYzMzV9.gQj-qjoQwtvyU2XzER6yiT-T4DwYphjMft-kogW978c'
```

## GET is alive verification
In order to check if the API is up and running use the keep alive endpoint, it should return 200 status code. This endpoint doesn't require authentication.
```
GET http://localhost:8080/
```

## Endpoints - Profile
All endpoints for profile have `required permission level: 1`.

### GET all HR profiles
```
GET http://localhost:8080/api/v1/profiles
```

Expected result sample:
```json
{
    "status": 200,
    "message": "9 items found!",
    "payload": [
        {
            "name": "Abhishek",
            "salary": "145000",
            "currency": "USD",
            "department": "Engineering",
            "sub_department": "Platform"
        },
        {
            "name": "Anurag",
            "salary": "90000",
            "currency": "USD",
            "department": "Banking",
            "on_contract": "true",
            "sub_department": "Loan"
        },
        {
            "name": "Himani",
            "salary": "240000",
            "currency": "USD",
            "department": "Engineering",
            "sub_department": "Platform"
        },
        {
            "name": "Yatendra",
            "salary": "30",
            "currency": "USD",
            "department": "Operations",
            "sub_department": "CustomerOnboarding"
        },
        {
            "name": "Ragini",
            "salary": "30",
            "currency": "USD",
            "department": "Engineering",
            "sub_department": "Platform"
        },
        {
            "name": "Nikhil",
            "salary": "110000",
            "currency": "USD",
            "on_contract": "true",
            "department": "Engineering",
            "sub_department": "Platform"
        },
        {
            "name": "Guljit",
            "salary": "30",
            "currency": "USD",
            "department": "Administration",
            "sub_department": "Agriculture"
        },
        {
            "name": "Himanshu",
            "salary": "70000",
            "currency": "EUR",
            "department": "Operations",
            "sub_department": "CustomerOnboarding"
        },
        {
            "name": "Anupam",
            "salary": "200000000",
            "currency": "INR",
            "department": "Engineering",
            "sub_department": "Platform"
        }
    ]
}
```

### POST a new HR profile
Payload should be valid, containing only strings and no extra fields, such as:

```json
{
    "name": "John Doe",
    "salary": "1",
    "currency": "USD",
    "department": "Engineering",
    "sub_department": "Service"
}
```

```
POST http://localhost:8080/api/v1/profiles
```

### DELETE an HR profile by name
```
DELETE http://localhost:8080/api/v1/profiles/{name}
```

## Endpoints - Statistics
Statistics include `mean`, `min` and `max` values of a specific subset of profiles.
All endpoints for profile have `required permission level: 10`.

### GET statistics
Get statistics including all profiles.
```
GET http://localhost:8080/api/v1/statistics
```

Expected result sample:
```json
{
    "status": 200,
    "message": "Statistics successfully calculated!",
    "payload": [
        {
            "All": {
                "mean": 22295010,
                "min": 30,
                "max": 200000000
            }
        }
    ]
}
```

### GET statistics - on contranct
Get statistics for on contranct profiles only.
```
GET http://localhost:8080/api/v1/statistics?onContract=true
```

Expected result sample:
```json
{
    "status": 200,
    "message": "Statistics successfully calculated!",
    "payload": [
        {
            "All": {
                "mean": 100000,
                "min": 90000,
                "max": 110000
            }
        }
    ]
}
```

### GET statistics - by department
Get statistics aggregated by department. Can be used alongside `onContract` to get aggregated statistics for on contract profiles only.
```
GET http://localhost:8080/api/v1/statistics?byDepartment=true
```

Expected result sample:
```json
{
    "status": 200,
    "message": "Statistics successfully calculated!",
    "payload": [
        {
            "Engineering": {
                "mean": 40099006,
                "min": 30,
                "max": 200000000
            }
        },
        {
            "Banking": {
                "mean": 90000,
                "min": 90000,
                "max": 90000
            }
        },
        {
            "Operations": {
                "mean": 35015,
                "min": 30,
                "max": 70000
            }
        },
        {
            "Administration": {
                "mean": 30,
                "min": 30,
                "max": 30
            }
        }
    ]
}
```

### GET statistics - by sub-department
Get statistics aggregated by department and sub-department. It disregards the value of `byDepartment`. Can also be used alongside `onContract` to get aggregated statistics for on contract profiles only.
```
GET http://localhost:8080/api/v1/statistics?bySubDepartment=true
```

Expected result sample:
```json
{
    "status": 200,
    "message": "Statistics successfully calculated!",
    "payload": [
        {
            "Engineering": [
                {
                    "Platform": {
                        "mean": 40099006,
                        "min": 30,
                        "max": 200000000
                    }
                }
            ]
        },
        {
            "Banking": [
                {
                    "Loan": {
                        "mean": 90000,
                        "min": 90000,
                        "max": 90000
                    }
                }
            ]
        },
        {
            "Operations": [
                {
                    "CustomerOnboarding": {
                        "mean": 35015,
                        "min": 30,
                        "max": 70000
                    }
                }
            ]
        },
        {
            "Administration": [
                {
                    "Agriculture": {
                        "mean": 30,
                        "min": 30,
                        "max": 30
                    }
                }
            ]
        }
    ]
}
```
