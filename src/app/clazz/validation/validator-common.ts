export type TValidatorContext = 'CREATE' | 'UPDATE' | 'DELETE'
export interface ErrorMessage {
    type: string,
    key: string
    formId?: string
    message?: string
}
export type TValidator = (value: any, payload?: any) => ErrorMessage[];
export interface IAggregateValidator {
    validate: (payload: any, context: TValidatorContext) => ErrorMessage[];
}
export class StringValidator {
    public static greaterThanOrEqualTo(var0: string, arg1: number, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0.length < arg1) {
            results.push({ type: "greaterThanOrEqualTo", message: 'STRING_GREATER_THAN_OR_EQUAL_TO', key: key })
            return false
        } else {
            return true
        }
    }
    public static lessThanOrEqualTo(var0: any, arg1: number, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0.length > arg1) {
            results.push({ type: "lessThanOrEqualTo", message: 'STRING_LESS_THAN_OR_EQUAL_TO', key: key });
            return false
        } else {
            return true
        }
    }
    public static isString(var0: string, results: ErrorMessage[], key: string): boolean {
        if (typeof var0 !== 'string') {
            results.push({ type: "typeMatch", message: 'STRING_TYPE_MATCH', key: key })
            return false
        } else {
            return true
        }
    }
    public static lessThan(var0: string, length: number, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0.length >= length) {
            results.push({ type: "lessThan", message: 'STRING_LESS_THAN', key: key })
            return false
        } else {
            return true
        }
    }
    public static greaterThan(var0: string, length: number, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0.length <= length) {
            results.push({ type: "greaterThan", message: 'STRING_GREATER_THAN', key: key })
            return false
        } else {
            return true
        }
    }
    public static notEmpty(var0: string | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0 === '') {
            results.push({ type: "notEmptyString", message: 'STRING_NOT_EMPTY_STRING', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static hasValue(var0: string | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (!StringValidator.isString(var0, results, key) || var0 === undefined || var0 === null || var0 === '') {
            results.push({ type: "hasStringValue", message: 'STRING_HAS_VALUE', key: key })
            return false;
        } else {
            return true;
        }
    }
}
export class DefaultValidator {
    public static notNull(var0: string | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (var0 === null) {
            results.push({ type: "notNull", message: 'DEFAULT_NOT_NULL', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static notUndefined(var0: string | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (var0 === undefined) {
            results.push({ type: "notUndefined", message: 'DEFAULT_NOT_NULL', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static hasValue(var0: any, results: ErrorMessage[], key: string): boolean {
        if (var0 === undefined || var0 === null) {
            results.push({ type: "hasValue", message: 'DEFAULT_NOT_NULL', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static notExist(var0: any, results: ErrorMessage[], key: string): boolean {
        if (var0 !== undefined && var0 !== null) {
            results.push({ type: "shouldNotExist", message: 'DEFAULT_SHOULD_NOT_EXIST', key: key })
            return false;
        } else {
            return true;
        }
    }
}
export class BooleanValidator {
    public static isBoolean(var0: any, results: ErrorMessage[], key: string): boolean {
        if (typeof var0 !== 'boolean') {
            results.push({ type: "isBoolean", message: 'IS_BOOLEAN', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isTrue(var0: boolean | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (!BooleanValidator.isBoolean(var0, results, key) || var0 !== true) {
            results.push({ type: "isTrue", message: 'IS_TRUE', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isFalse(var0: boolean | undefined | null, results: ErrorMessage[], key: string): boolean {
        if (!BooleanValidator.isBoolean(var0, results, key) || var0 !== true) {
            results.push({ type: "isFalse", message: 'IS_FALSE', key: key })
            return false;
        } else {
            return true;
        }
    }
}
export class ListValidator {
    public static belongsTo(var0: string, list: string[], results: ErrorMessage[], key: string): boolean {
        if (!ListValidator.isList(var0, results, key) || typeof list[0] !== typeof var0 || list.length === 0 || !list.includes(var0)) {
            results.push({ type: "belongsTo", message: 'LIST_BELONGS_TO', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isSubListOf(var0: string[], list: string[], results: ErrorMessage[], key: string): boolean {
        if (!ListValidator.isList(var0, results, key) || typeof list !== typeof var0 || list.length === 0 || var0.some(e => !list.includes(e))) {
            results.push({ type: "isSubListOf", message: 'LIST_IS_SUB_LIST_OF', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static hasValue(var0: any[], results: ErrorMessage[], key: string): boolean {
        if (!ListValidator.isList(var0, results, key) || var0 === undefined || var0 === null || var0.length === 0) {
            results.push({ type: "hasValue", message: 'LIST_HAS_VALUE', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isEmpty(var0: any[], results: ErrorMessage[], key: string): boolean {
        if (!ListValidator.isList(var0, results, key) || var0 === undefined || var0 === null || var0.length !== 0) {
            results.push({ type: "isEmpty", message: 'LIST_IS_EMPTY', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isList(var0: any, results: ErrorMessage[], key: string): boolean {
        if (!Array.isArray(var0)) {
            results.push({ type: "isList", message: 'LIST_IS_LIST', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static lengthIs(var0: any[], len: number, results: ErrorMessage[], key: string): boolean {
        if (!ListValidator.isList(var0, results, key) || var0 === undefined || var0 === null || var0.length !== len) {
            results.push({ type: "lengthIs", message: 'LIST_LENGTH_IS', key: key })
            return false;
        } else {
            return true;
        }
    }
}
export class NumberValidator {
    public static hasValue(var0: any, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 === undefined || var0 === null || typeof var0 !== 'number') {
            results.push({ type: "hasValue", message: 'NUMBER_HAS_VALUE', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isInteger(var0: any, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 === undefined || var0 === null || typeof var0 !== 'number' || !Number.isInteger(var0)) {
            results.push({ type: "isInteger", message: 'NUMBER_IS_INTEGER', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static greaterThan(var0: any, var1: number, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 <= var1) {
            results.push({ type: "greaterThan", message: 'NUMBER_GREATER_THAN', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static greaterThanOrEqualTo(var0: any, var1: number, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 < var1) {
            results.push({ type: "greaterThanOrEqualTo", message: 'NUMBER_GREATER_THAN_OREQUAL_TO', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static lessThan(var0: any, var1: number, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 >= var1) {
            results.push({ type: "lessThan", message: 'NUMBER_LESS_THAN', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static lessThanOrEqualTo(var0: any, var1: number, results: ErrorMessage[], key: string): boolean {
        if (!NumberValidator.isNumber(var0, results, key) || var0 > var1) {
            results.push({ type: "lessThanOrEqualTo", message: 'NUMBER_LESS_THAN_OR_EQUAL_TO', key: key })
            return false;
        } else {
            return true;
        }
    }
    public static isNumber(var0: any, results: ErrorMessage[], key: string): boolean {
        if (typeof var0 !== "number") {
            results.push({ type: "isNumber", message: 'NUMBER_IS_NUMBER', key: key })
            return false;
        } else {
            return true;
        }
    }
}
export function hasValue(input: any): boolean {
    return input !== null && input !== undefined && input !== '';
}