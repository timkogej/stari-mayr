import sl from '../../messages/sl.json';

export type Messages = typeof sl;
export function getMessages() {
  return sl;
}
