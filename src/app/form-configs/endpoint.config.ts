import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { HTTP_METHODS } from '../clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { USER_ROLE_ENUM } from '../clazz/validation/aggregate/user/interfaze-user';
import { CLIENT_ROLE_LIST, SCOPE_LIST } from '../clazz/validation/constant';

export const FORM_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "text",
            "display": false,
            "label": "ID",
            "key": "id",
            "position": {
                "row": "0",
                "column": "0"
            }
        },
        {
            "type": "paginated-select",
            "display": true,
            "label": "ENTER_RESOURCE_ID",
            "key": "resourceId",
            "position": {
                "row": "1",
                "column": "0"
            },
            options:[],
            required: true,
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_DESCRIPTION",
            "key": "description",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_ENDPOINT",
            "key": "path",
            "position": {
                "row": "3",
                "column": "0"
            },
            required: true,
        },
        {
            "type": "radio",
            "display": true,
            "label": "IS_WEBSOCKET",
            "key": "isWebsocket",
            "position": {
                "row": "4",
                "column": "0"
            },
            "options": [
                { label: 'NO', value: "no" },
                { label: 'YES', value: "yes" },
            ],
        },
        {
            "type": "select",
            "display": false,
            "label": "SELECT_METHOD",
            "key": "method",
            "position": {
                "row": "5",
                "column": "0"
            },
            "options": HTTP_METHODS,
            required: true,
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "secured",
            "position": {
                "row": "6",
                "column": "0"
            },
            "options": [
                { label: 'PROTECTED_ENDPOINT', value: "true" },
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "csrf",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                { label: 'CSRF_ENABLED', value: "true" },
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "cors",
            "position": {
                "row": "8",
                "column": "0"
            },
            "options": [
                { label: 'CORS_ENABLED', value: "true" },
            ],
        },
        {
            "type": "text",
            "display": false,
            "label": "ALLOWED_ORIGIN",
            "key": "allowedOrigin",
            "position": {
                "row": "9",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": false,
            "label": "ALLOWED_HEADERS",
            "key": "allowedHeaders",
            "position": {
                "row": "10",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": false,
            "label": "EXPOSED_HEADERS",
            "key": "exposedHeaders",
            "position": {
                "row": "11",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": false,
            "label": "MAX_AGE",
            "key": "maxAge",
            "position": {
                "row": "12",
                "column": "0"
            },
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "",
            "key": "credentials",
            "position": {
                "row": "13",
                "column": "0"
            },
            "options": [
                { label: 'ALLOW_CREDENTIAL', value: "true" },
            ],
        },
        {
            "type": "radio",
            "display": false,
            "label": "PLEASE_LIMIT_ACCESS",
            "key": "limitAccess",
            "position": {
                "row": "14",
                "column": "0"
            },
            "options": [
                { label: 'NONE', value: "" },
                { label: 'EP_USER_ONLY', value: "userOnly" },
                { label: 'EP_CLIENT_ONLY', value: "clientOnly" },
            ],
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "EP_CLIENT_ROLES",
            "key": "clientRoles",
            "position": {
                "row": "15",
                "column": "0"
            },
            "options": CLIENT_ROLE_LIST,
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "EP_CLIENT_SCOPES",
            "key": "clientScopes",
            "position": {
                "row": "16",
                "column": "0"
            },
            "options": SCOPE_LIST,
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "EP_USER_ROLES",
            "key": "userRoles",
            "position": {
                "row": "17",
                "column": "0"
            },
            "options": [...USER_ROLE_ENUM, { label: "USER_ROLE_ROOT", value: "ROLE_ROOT" }],
        },
    ],
}
