# Serverless Messaging API With AWS Lambda and AWS Cognito

This is an example of integration of two AWS services, the AWS Lambda and AWS Cognito.

The following topics show how you can execute this example on your AWS account. I'll suppose that you have a little bit of knowledge of AWS Lambda and Serverless Framework.

This repository is for learning reasons and if you expect automation on the deployment of this service go out of here. :smile:

## Deploying and Testing in your machine

The following steps show how can you deploy and test this service.

### Step 1: Creating AWS Cognito User Pool and Deploying

First of all we need to create a user pool.

AWS Cognito can make somethings for us in user account management. It has integration with Facebook and Google accounts providers, support oAuth 2.0, can manage all user data and make some validations.

To create a user pool, execute the script at `/utils/create_user_pool`. If you use this script in your application, make sure to define your default region at line 6 and pool name at line 12.

As you can see below, the script will return the User Pool ARN. The ARN will be used to define the authorizations on our serverless functions. As you can see on file `serverless.yml`, on lines 35 to 40 this value it's used for this purpose. You can see more details about how this code was writen [here](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

```
User Pool ARN is arn:aws:cognito-idp:us-east-1:475907963822:userpool/us-east-1_VQhNzyHVZ
```

Obviously your ARN and User Pool ID will be different. You'll need to change this data on the `serverless.yml` file at the line indicated previously and on some json files used in the following steps to test the API.

Now you can deploy the service in your AWS account using the Serverless Framework command showed below.

```
sls deploy
```

In next steps we will use some json files in `/utils` to simplify the command lines. Remember to look them for the best understanding of this tutorial.

### Step 2: Creating User Pool Client

After the creation of user pool, we need to create a user pool client to use the Cognito functionalities.

For this, we can use the AWS Client. You can [install](https://aws.amazon.com/cli) and [configure](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) it on your machine, its very simple.

The following command create a user pool client.

```
aws cognito-idp create-user-pool-client --cli-input-json file:///mnt/d/Repositórios/serverless-messaging/utils/user_pool_client_creation_template.json
```

The response will be like this:

```
{
    "UserPoolClient": {
        "UserPoolId": "us-east-1_VQhNzyHVZ",
        "LastModifiedDate": 1510262287.401,
        "ClientId": "4l0kdh361lcheaq1msvll3e5n9",
        "AllowedOAuthFlowsUserPoolClient": false,
        "ExplicitAuthFlows": [
            "ADMIN_NO_SRP_AUTH"
        ],
        "RefreshTokenValidity": 30,
        "CreationDate": 1510262287.401,
        "ClientName": "messaging_pool_client"
    }
}
```

The value of the attribute `ClientId` will be used in next steps to indicate our User Pool Client.

Pay attention because all the json files used in the next steps uses the value of `ClientId` and you'll need to change to your User Pool Client ID.

### Step 3: Creating User

With user pool client configured, we can create a new user using the following command.

```
  aws cognito-idp admin-create-user --cli-input-json file:///mnt/d/Repositórios/serverless-messaging/utils/user_template.json
```

The response will be like this:

```
{
    "User": {
        "Username": "gustavoamorim",
        "Enabled": true,
        "UserStatus": "FORCE_CHANGE_PASSWORD",
        "UserCreateDate": 1510261834.093,
        "UserLastModifiedDate": 1510261834.093,
        "Attributes": [
            {
                "Name": "sub",
                "Value": "5067acc6-dcaf-4e6f-8d53-facae62626cc"
            },
            {
                "Name": "email",
                "Value": "gustavofreitasdeamorim@gmail.com"
            }
        ]
    }
}
```

The `UserStatus` value indicates that user need to change the actual password before do anything, obviously for security reasons. This will be done soon after.

### Step 4: First Sign In

Now we can make the first sign in with the command below.

```
aws cognito-idp admin-initiate-auth --cli-input-json file:///mnt/d/Repositórios/serverless-messaging/utils/first_signin_template.json
```

The response will be like this:

```
{
    "ChallengeName": "NEW_PASSWORD_REQUIRED",
    "ChallengeParameters": {
        "USER_ID_FOR_SRP": "gustavoamorim",
        "requiredAttributes": "[]",
        "userAttributes": "{\"email\":\"gustavofreitasdeamorim@gmail.com\"}"
    },
    "Session": "4Tnm4OK8WuwF6fQihCOpn9TtVxKc7fnT7hFLiW0sA1dOHy1VVJYV7irn22_tgtwsL6GpJATn-pIjnDs2HVDOm9oP2yNjf7uXfTr1_j9b1JEbv9CBJUEV1vPGS-8RCwBtNpYohXTEuXXgj9va4CmHCX-3hnIYALb__UddVZHULWCZn1UdVlZOphnPQ8f9kNiyMuPCsu9bFOnOI-oc99zMND3CwQATDurPJnokk-9c-XVc7lUeoIRNnfo4Pwi0zLNvjbW8YCJtU-72DPwlceiCsXv8glKiXCnyuy_cGZD6XMooResgcSciNL6gx84x8FrtzU7zDrA6E08fiGLCcnC00W95Aksn4zKPk2s2MC7-NA5VCN7iWMWiaGBEwe8GsRq1Oc7YN88R4EBU0FLW7DAS5r-u8ss-bO99gZuII0l9aNb5rp6eQSIo4rwdNoghu3s4Lbe0TbareBJj9xj4iH5UewMMA-Uw5iPo5TIfVRcCwuAbbXVJV6QpWQ4LbfgvPkpwtWF_3LlwOUMg_xG3smPoApJrQOy5r49GkQcOsJeeAC_3t9_0E9SgzsAPCjEk7T9ZdMh6q6AKrXv6bebiY6fGIA217JqhhNzsR4vNUZ5YnYje3w3KDrBopE0d5g9co6u7XLtLNMHK4-9hrwhoKa2udWBVG8v5v3UrriTspx9x5kV8VH_8E_E-fm3qo5pLcniY"
}
```

With the `Session` token in our hands, we can change the password of the user and finally get the token to use the API.

### Step 5: Response auth challenge and get the Authorization token

At this step, wee need to send a new password to Cognito. It can be maded with the following command.

```
aws cognito-idp admin-respond-to-auth-challenge --cli-input-json file:///mnt/d/Repositórios/serverless-messaging/utils/challenge_response_template.json
```

The response will be like this:

```
{
    "AuthenticationResult": {
        "ExpiresIn": 3600,
        "IdToken": "eyJraWQiOiJ2MjR5eG81MkxBUjVFTkVoK0F5KzhYd2FSclpQXC9TTENQT1VRTVBHN1U3Zz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MDY3YWNjNi1kY2FmLTRlNmYtOGQ1My1mYWNhZTYyNjI2Y2MiLCJhdWQiOiI0bDBrZGgzNjFsY2hlYXExbXN2bGwzZTVuOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTEwMjY1MDg0LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9WUWhOenlIVloiLCJjb2duaXRvOnVzZXJuYW1lIjoiZ3VzdGF2b2Ftb3JpbSIsImV4cCI6MTUxMDI2ODY4NCwiaWF0IjoxNTEwMjY1MDg0LCJlbWFpbCI6Imd1c3Rhdm9mcmVpdGFzZGVhbW9yaW1AZ21haWwuY29tIn0.CgboGMcHUXclomSUDkCjiyFqoQfRn6vuozBAO-v_1BPo8ExsTQ7k_610iBeemfT7yKQ8JUFdKpVwhuyGjdqavHmFTgmMAqdD6HoKnmuPdF6l0IeIrgBbdkfyqgH0V5QNeu7KTvdHqfqp84-VXji7k967hlGGkT71ywKaypktGs1p3MmNBn_fDuHfEn_dpdB2Kp0PHKpvK9pyKLLEfeAgCClFv7WgeVOgWYjSVqRz20Oc_-9q8ydCLDqUa8iDDOHmqwMqhx2Wl70QwwYIKc9IOQcnyn4yL0UQnn8XQD9cgAAY7vFYHEbCncBMaHDayhpn6po_4d_5ypcen9qnh3gDsw",
        "RefreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.ZJ0R-VEiwlNXGLY6UWC-zq4CAkuE9WKU7IvQ1zeRtNZgOvFPbDq1tnsaxebjqoZRWYVnja_zsTDuUhUyvn2WPLLeDWwtfCZkvQ9Cx3Qqbhz5GzGwVNKoKFF9eEeBFH4YbEYpr5SuKuaPta4gABeqSZtteSf7R8gAtlGGoWUy3IhCWxt8dxQ3w63CWlG2zH4c6KcNj9Xq0LVmwR8n1Ku0NMjOGbXzPAKrTD5YWNNHo0LC0sq_ExBaRYbwoKPIuhbczDQAZ-qeJv610UdwJrNA4Aa9lXLDdSWNWsNFYl8Ydd4QZBuALJn1DV3GbJAGUud9e0tH1jdJCD4s1oVPvw2Igg.hnWril4hkyfLhcwG.DYcJALaQS0sBhbzVUXTgUfTTXeSQ9O22N5Rxm7DMlRjaP22r5EjsDuIt5JhQ4tAH9w3mcgh-p5cTauPTb_UgSQ2JzXjc_vVP3Mbi_96txvZno5qPm52lMpstawKd8tpXZtOqhJKRoiyNdL5z9HBaOBlLGZwrQcuRZsf1449UfeMrIWetSjIT7MMEPt5iwXDjV4CepxVrHJ_ejaHgY8losMCxUC87MZAAOZi8GgraPLyAYqedpgaAHGwjR-A2w8KzT2tL_NAQfVr_roSO8lyEVGqInglKmfL5dSBf6Bwtc8KbEecJOGbdhOea0l1JkVkGIF6a59isi5CduYQOoYzydvgiYv8q8ml38q_bZbQmIidhcU606FkQbBnRE0Rhr2HrFBf7r-0oIDawEdByHAhPKW0uevsWhrje-LjuzQGJmdXVbZwkQcuKFrl2pvQ8spBwhR4UFls-jWOi_7CIGIOJG0FEwWhPDygxS0DsoeT0DXSQ-zFPmcpvUyCgpg0vmJjfzpfJtXmqfv5VcscD0OYQemZWTpmLJaLiruHx4byGkUprTTKJzWIudwoSrqsHZ_dF1xiirtU15dP0FLwAApqVOLe-mhwjRz2WR9g0DojvvDEkYln3zZdH06ezouOiFx5CAT8MGtorfvTe-2jtWk4IgFJc3PlNecrVfB7VxuRrjLnuVoqEiQwWTeiCOOwx_mOsXexEA_4gcj7UaXziE7XYUnDWryKDyuLwjU7YQyVfXZsjyuJ5_iY69Y6Z9KHutvBUOk9VAFFRlpD14NApENpMp9SoXzfff5rN2c24nIKA7UYnyOevDNeAo8ev-cK3scQhaRcI8lUZXRO7OUgnMDQ_HmNToAGbF9EQ70Rl7CZFxCsMVSb0tmSQCGokFZwtidDTcnczggP--eXnFk4p8nzoh0V05OQpx14s0s5NisJuQ4cJow5XlIDZ96SIyBwFRg2cBog6brLR45T_rq990c-k1YeVUh7kdNZGBdsYVNQhgY6K9AtKQGPTv2R9XbWGZCA9QSknqpkeUgsQDkHw-_YnVziMDkGlfmz0KG-E2sBXc4fbgdKpPy6Qdp4BntwuAWGa4UTCOkRxE2-L5aL3sFkS1Eb1Vx79P2vlR_BLBPs89Q1vNOjYFQYGYzoy3xWnWBYud5cgnmhl6QvwmJ1d._UxmJt_bdMNlh6ZCuK_m7Q",
        "TokenType": "Bearer",
        "AccessToken": "eyJraWQiOiJmcXF1QXoyVlBneDI4eVZWZXNvZ0hwREVmbXpLcEJtUTdXT2FiZXdcL0VlQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MDY3YWNjNi1kY2FmLTRlNmYtOGQ1My1mYWNhZTYyNjI2Y2MiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfVlFoTnp5SFZaIiwiZXhwIjoxNTEwMjY4Njg0LCJpYXQiOjE1MTAyNjUwODQsImp0aSI6ImE3N2EyOGY3LWRiOGEtNDJkMC05ZDA1LTk4ZDJmN2FmNDEyMSIsImNsaWVudF9pZCI6IjRsMGtkaDM2MWxjaGVhcTFtc3ZsbDNlNW45IiwidXNlcm5hbWUiOiJndXN0YXZvYW1vcmltIn0.Zeb2F0leTpMnbsqQcdcs7MM9iW-Er0G2SYHv1RZqTwtNLJOiymu_R_NXh7mf3bsAzGQlti1337VJQC4BRa4s2kgv7oZalNjtPzgGUGlJi91XU_rBuqMkeq5WwQRVgf_gCQALBmfTDVqH2nlrwZkxZqRlkUgi9abPlmbnr7dRq4Cq3FqaEt_DS40teUbcd2LlBlSjJb-7IdgGFkgnChrALA5dOFz8HolnJ7UVExzLoCWZ_QLmpMn_1ortvypD_VBdmbQkQ2XkhGLC0Z3v9S5alkBGb6-mSkVQE7-QntPP6BCi02itMchj2JgF5arkVUkXVxYlH85KUQe0SAX85rfYog"
    },
    "ChallengeParameters": {}
}
```

Now we can use the API passing the `IdToken` at header of the requests as the attribute `Authorization`.

### Step 6: Using the API

Now we can use the API making HTTP requests for it using, for example, Postman.

For this, all the headers need to have the attribute `Authorization` and, of course, the attribute `IdToken`, provided on user sign in response json.

It's important to remember that the API Gateway will handle the requests. For example, if you send a JSON at the body of request and define in the header the content type the `application/json`, the body attribute of the event received in lambda function will be parsed to an object.
