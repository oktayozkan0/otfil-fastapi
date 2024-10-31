import $ from "jquery";

export module HtmlHelper {
  export const addBodyClass = (className: string) => {
    const body: HTMLElement | null = document && document.body;
    if (body) {
      if (!$(body).hasClass(className)) body.classList.add(className);
    }
  };
  export const removeBodyClass = (className: string) => {
    const body: HTMLElement | null = document && document.body;
    if (body) {
      if ($(body).hasClass(className)) body.classList.remove(className);
    }
  };

  export const clickOutside = (
    name: string,
    isOpen: boolean,
    setValue: (value: boolean) => void
  ) => {
    const clickHandler = (e: MouseEvent) => {
      if (isOpen) {
        var element = document.getElementById(name);
        var parent = element?.parentElement;
        if (!parent?.contains(e.target as Node)) {
          setValue(false);
        }
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  };
}
