import { AbstractController } from './interfaces/AbstractController';
import { DynamoDriver } from './interfaces/DynamoDriver';

export class Messages extends AbstractController {

  constructor(){
    super(process.env.DYNAMODB_TABLE,
          new DynamoDriver(process.env.DYNAMODB_TABLE));
  }

  public create(obj, callback){
    if(obj.title && obj.body && (obj.email || obj.phone)){

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

  public fetchAll(callback){
    this.dbDriver.all(null, (error, data) => {
      this.defaultResponse(error, data.Items, callback);
    });
  }

  public find(id, callback){
    this.dbDriver.find(id, null, (error, data) => {
      this.defaultResponse(error, data.Item, callback);
    });
  }

  public delete(id, callback){
    this.dbDriver.delete(id, (error, data) => {
      this.defaultResponse(error, data, callback);
    });
  }
}
