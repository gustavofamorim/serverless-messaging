import { AbstractController } from './interfaces/AbstractController';
import { DynamoDriver } from './interfaces/DynamoDriver';

export class Messages extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE));
  }

  public create(request, callback){

    var obj = JSON.parse(request.body);

    if(obj != null && obj.title && obj.body && (obj.email || obj.phone)){

      var message = {
        title: obj.title,
        body:  obj.body,
        email: obj.email,
        phone: obj.phone
      }

      this.dbDriver.create(message, (error, data) => {
        this.defaultResponse(error, message, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public fetchAll(request, callback){
    this.dbDriver.all(null, (error, data) => {
      var response = {
        itemsRetourned: data.Items.length,
        data: data.Items
      }
      this.defaultResponse(error, response, callback);
    });
  }

  public find(request, callback){
    if(request.pathParameters != null && request.pathParameters.id != null){
      this.dbDriver.find(request.pathParameters.id, null, (error, data) => {
        this.defaultResponse(error, data.Item, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }

  public delete(request, callback){
    if(request.pathParameters != null && request.pathParameters.id != null){
      this.dbDriver.delete(request.pathParameters.id, (error, data) => {
        this.defaultResponse(error, data, callback);
      });
    }
    else{
      this.defaultInvalidDataResponse(callback);
    }
  }
}
