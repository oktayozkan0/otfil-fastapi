import _ from "lodash";
import { mdlApiResponseMessage, mdlBaseApiResponseHeader, mdlServiceResponse } from "../models/service-models/common/ServiceResponse";

export namespace ObjectHelper {
  export function prepareResponseHeader(message: string) {
    var response = new mdlServiceResponse();
    var responseHeader = new mdlBaseApiResponseHeader();
    responseHeader.success = false;
    var headerMessage = new mdlApiResponseMessage();
    headerMessage.message = message;
    responseHeader.messages = [headerMessage];
    response.header = responseHeader;
    return response;
  }

  export function getErrorMessage(messages?: Array<mdlApiResponseMessage>) {
    var messageArray: string[] = [];
    _.each(messages, function (message) {
      if (message.message) messageArray.push(message.message);
    });
    return messageArray.join(",");
  }

  export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
