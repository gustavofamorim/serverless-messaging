import { Messages } from '../Messages';

export const create = (event, context, cb) => {
  const message = new Messages();
  message.create(event.body, cb);
}
