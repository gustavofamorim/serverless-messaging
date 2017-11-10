import { Messages } from '../Messages';

export const get = (event, context, cb) => {
  const message = new Messages();
  message.find(event.path.id, cb);
}
