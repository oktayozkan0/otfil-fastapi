class mdlExceptionMessage {
  message?: string;
  stackTracing?: string;
  source?: string;
  detail?: string;
}
class mdlApiResponseMessage {
  id?: number;
  code?: string;
  message?: string;
  url?: string;
  exception?: mdlExceptionMessage;
  detail?: string;
  provider?: string;
}

class mdlBaseApiResponseHeader {
  requestId?: string;
  success?: boolean;
  responseTime?: string;
  messages?: Array<mdlApiResponseMessage>;
}
class mdlServiceResponse<T> {
  header: mdlBaseApiResponseHeader;
  body?: T;
  constructor();
  public constructor(pHeader?: mdlBaseApiResponseHeader) {
    if (pHeader == null) pHeader = new mdlBaseApiResponseHeader();
    this.header = pHeader;
  }
}
export { mdlServiceResponse, mdlApiResponseMessage, mdlBaseApiResponseHeader };
