
export abstract class AbstractDriver {
  abstract all(fields, callback);
  abstract create(obj, callback);
  abstract update(id, obj, callback);
  abstract delete(id, callback);
  abstract find(id, fields, callback);
  abstract findBy(field, value, fields, callback);
}
