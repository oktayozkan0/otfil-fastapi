import $ from "jquery";
import { ObjectHelper } from "./ObjectHelper";

function getValidationResult(formId: string) {
  var result = true;
  $(`form#${formId} :input`).each(function () {
    var hasError = $(this).attr("has-error");
    if (hasError == "true") {
      var inputId = $(this).attr("id");
      $(this).addClass("has-error");
      var alertSelector = "validation-error";
      var alertContainer = $(`#${alertSelector}_${inputId}`);
      if (alertContainer.length > 0) {
        $(alertContainer).removeClass("hidden");
      }
      result = false;
    }
  });
  return result;
}

function clearValidationResult(inputId?: string) {
  if (inputId) {
    var input = $(`#${inputId}`);
    if (input.length > 0) $(input).removeClass("has-error");
    var alertSelector = "validation-error";
    var alertContainer = $(`#${alertSelector}_${inputId}`);
    if (alertContainer.length > 0) {
      $(alertContainer).addClass("hidden");
    }
  }
}

export { getValidationResult, clearValidationResult };
