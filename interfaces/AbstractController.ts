import { AbstractDriver } from './AbstractDriver';

export abstract class AbstractController {

  protected resourceName: string;
  protected dbDriver: AbstractDriver;

  constructor(resourceName, dbDriver){
    this.dbDriver = dbDriver;
    this.resourceName = resourceName;
  }

  public sendResponse(statusCode, headers, body, callback){
    const response = {
      statusCode: statusCode,
      headers: headers,
      body: body,
    };

    callback(null, response);
  }

  public defaultResponse(error, data, callback){
    if (error) {
        console.error(error);
        this.sendResponse(error.statusCode || 501,
          {'Content-Type': 'text/plain'},
          'Couldn\'t conclude operation on ' + this.resourceName + ' table.',
          callback);
        return;
    }

    this.sendResponse(200,
      {"Content-type": "application/json"},
      data,
      callback);
  }

  public defaultInvalidDataResponse(callback){
    this.sendResponse(501,
      { 'Content-Type': 'text/plain' },
      'Operation blocked: Invalid data received.',
      callback);
  }
}
