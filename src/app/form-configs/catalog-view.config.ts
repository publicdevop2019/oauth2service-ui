import { IForm } from 'mt-form-builder/lib/classes/template.interface';
export const FORM_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "radio",
            "display": true,
            "label": "PLEASE_SELECT_VIEW",
            "key": "view",
            "position": {
                "row": "0",
                "column": "0"
            },
            "options": [
                { label: 'TREE_VIEW', value: "TREE_VIEW" },
                { label: 'LIST_VIEW', value: "LIST_VIEW" },
            ],
        },
    ],
}
