import { io } from "socket.io-client";
import { backendUrl } from "./api";
 
export default io(backendUrl());