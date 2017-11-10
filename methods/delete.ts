import { Messages } from '../Messages';

export const deleteMessage = (event, context, cb) => {
  const message = new Messages();
  message.delete(event.path.id, cb);
}
