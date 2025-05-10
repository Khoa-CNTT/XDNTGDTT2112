import { DefaultEventsMap, Socket } from "socket.io";

export interface ISocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {}
