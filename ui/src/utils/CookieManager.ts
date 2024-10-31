import { Base64 } from "./Base64";
import { InputHelper } from "./InputHelper";
import { ObjectHelper } from "./ObjectHelper";

module CookieManager {
  export function set(
    name: string,
    value: string,
    days: number = 0,
    hours: number = 0,
    toNotSafe: boolean = false
  ): void {
    var expires = "";
    var date = new Date();
    if (days > 0) {
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    if (hours > 0) {
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    if (!InputHelper.isNullOrUndefinedOrEmpty(value))
      value = toNotSafe ? value : toSafeUrl(value);
    document.cookie =
      name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "$&") +
      "=" +
      value +
      expires +
      "; path=/";
  }
  export function get(name: string): any {
    var k;
    let findedCookie =
      (k = new RegExp(
        "(?:^|;\\s*)" +
        ("" + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
        "=([^;]*)"
      ).exec(document.cookie)) && k[1];
    if (
      typeof findedCookie == "string" &&
      isSafe(findedCookie) &&
      findedCookie != "undefined"
    )
      findedCookie = toOrginal(findedCookie);
    return findedCookie;
  }

  export function remove(name: string) {
    set(name, "", -1);
  }
  export function removeAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
  export function toSafeUrl(v: string) {
    return Base64.encode(v)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  export function toOrginal(v: string): string {
    if (!InputHelper.isNullOrUndefinedOrEmpty(v)) {
      v = v.replace(/\-/g, "+").replace(/\_/g, "/");
      return Base64.decode(v);
    } else return v;
  }
  function isSafe(v: string): boolean {
    return /^[A-Za-z0-9\-_]+$/.test(v);
  }
}
export default CookieManager;
