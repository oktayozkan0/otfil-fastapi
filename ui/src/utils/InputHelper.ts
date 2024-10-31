export module InputHelper {
  export function isNull(object: any): boolean {
    return object === null;
  }
  export function isUndefined(object: any): boolean {
    return object === undefined;
  }
  export function isEmpty(object: any): boolean {
    return object === "";
  }
  export function isNullOrUndefined(object: any): boolean {
    return isNull(object) || isUndefined(object);
  }
  export function isNullOrEmpty(object: any): boolean {
    return isNull(object) || isEmpty(object);
  }
  export function isNullOrUndefinedOrEmpty(object: any): boolean {
    return isNull(object) || isUndefined(object) || isEmpty(object);
  }
  export function getFirstLetters(first?: string, second?: string) {
    if (first && second) return `${first.charAt(0)}${second.charAt(0)}`;
    else return "N/A";
  }
  export function isValidMail(value?: string) {
    var isValidEmail = (email: string) => {
      var expression =
        /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return expression.test(email);
    };
    if (isNullOrUndefinedOrEmpty(value) || !isValidEmail(value!)) return false;
    else return true;
  }

  export function isValidPassword(value: any) {
    if (isNullOrUndefinedOrEmpty(value) || value.length < 8) return false;
    else return true;
  }

  export function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
