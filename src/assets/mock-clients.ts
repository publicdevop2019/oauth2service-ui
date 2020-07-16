export const mockClient = [
	{
		"id": 0,
		"clientId": "login-id",
		"grantTypeEnums": [
			"password",
			"refresh_token"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"refreshTokenValiditySeconds": 1800,
		"resourceIds": [
			"edge-proxy",
			"oauth2-id"
		],
		"resourceIndicator": false,
		"hasSecret": false
	},
	{
		"id": 1,
		"clientId": "oauth2-id",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_BACKEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"edge-proxy",
			"oauth2-id"
		],
		"resourceIndicator": true,
		"hasSecret": true
	},
	{
		"id": 2,
		"clientId": "register-id",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"write"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": false,
		"hasSecret": false
	},
	{
		"modifiedBy": "0",
		"modifiedAt": "2019-09-28T15:47:42.167+0000",
		"id": 3,
		"clientId": "mgfb-id",
		"grantTypeEnums": [
			"authorization_code"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			}
		],
		"scopeEnums": [
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"registeredRedirectUri": [
			"https://magicform-a4cbe.firebaseapp.com",
			"http://localhost:4200"
		],
		"resourceIds": [
			"oauth2-id",
			"light-store"
		],
		"resourceIndicator": false,
		"autoApprove": true,
		"hasSecret": false
	},
	{
		"id": 4,
		"clientId": "test-id",
		"grantTypeEnums": [
			"password"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": false,
		"hasSecret": false
	},
	{
		"id": 5,
		"clientId": "rightRoleNotSufficientResourceId",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			}
		],
		"scopeEnums": [
			"write"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": false,
		"hasSecret": false
	},
	{
		"id": 6,
		"clientId": "resource-id",
		"grantTypeEnums": [
			"password"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_BACKEND"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": true,
		"hasSecret": false
	},
	{
		"id": 7,
		"clientId": "mgfb-id-backend",
		"grantTypeEnums": [
			"authorization_code"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_FRONTEND"
			},
			{
				"grantedAuthority": "ROLE_THIRD_PARTY"
			}
		],
		"scopeEnums": [
			"write"
		],
		"accessTokenValiditySeconds": 120,
		"registeredRedirectUri": [
			"http://localhost:4200"
		],
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": false,
		"hasSecret": false
	},
	{
		"id": 8,
		"clientId": "edge-proxy",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_BACKEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"oauth2-id"
		],
		"resourceIndicator": true,
		"hasSecret": true
	},
	{
		"id": 9,
		"clientId": "block-id",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_BACKEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIds": [
			"edge-proxy",
			"oauth2-id"
		],
		"resourceIndicator": true,
		"hasSecret": true
	},
	{
		"id": 10,
		"clientId": "light-store",
		"grantTypeEnums": [
			"client_credentials"
		],
		"grantedAuthorities": [
			{
				"grantedAuthority": "ROLE_BACKEND"
			},
			{
				"grantedAuthority": "ROLE_TRUST"
			},
			{
				"grantedAuthority": "ROLE_FIRST_PARTY"
			},
			{
				"grantedAuthority": "ROLE_ROOT"
			}
		],
		"scopeEnums": [
			"read",
			"write",
			"trust"
		],
		"accessTokenValiditySeconds": 120,
		"resourceIndicator": true,
		"hasSecret": true
	}
]