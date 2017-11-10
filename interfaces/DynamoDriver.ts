import uuid = require('uuid');
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { AbstractDriver } from './AbstractDriver';

export class DynamoDriver extends AbstractDriver {

  protected tableName: string;
  protected db = new DynamoDB.DocumentClient();

  constructor(tableName: string){
    super();
    this.tableName = tableName;
  }

  public all(fields = [], callback){
    const obj = {
        TableName: this.tableName
    };

    this.db.scan(obj, callback);
  }

  public create(obj, callback){
    const item = {
      TableName: this.tableName,
      Item: obj
    };

    item.Item.id = uuid.v4()
    item.Item.created_at = Date.now();
    item.Item.updated_at = Date.now();

    this.db.put(item, callback);
  }

  public update(id, obj, callback){

  }

  public delete(id, callback){
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      },
    };

    this.db.delete(params, callback);
  }

  public find(id, fields = [], callback){
    const params = {
      TableName: this.tableName,
      Key: {
        id: id
      },
      AttributesToGet: fields
    };

    this.db.get(params, callback);
  }

  public findBy(field, value, fields = [], callback){
    const params = {
      TableName : this.tableName,
      FilterExpression : field + ' = :value',
      ExpressionAttributeValues : {':value' : value}
    };

    this.db.scan(params, callback);
  }

}
