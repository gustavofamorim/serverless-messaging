import { Messages } from '../Messages';

export const list = (event, context, cb) => {
  const message = new Messages();
  message.fetchAll(cb);
}
