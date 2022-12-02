import { Server } from "socket.io"; // Conecto el servver HTTP a Socket.io, utilizamos la clase Server del paquete Socket.IO.
import { v4 as RandomId } from "uuid";

var DATA_WS = [];
const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket ya esta inicializado");
  } else {
    console.log("Socket esta inicializando");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("id user : ", socket.id);
      socket.on("cliente:EVENTO", (data) => {
        // console.log("EVENTO: ", data);
        const dataEvento = { ...data, id: RandomId() };
        // console.log(dataEvento);
        DATA_WS.push(dataEvento);
        socket.broadcast.emit("server:EVENTO", dataEvento);
      });
    });
  }
  res.end();
};

export default SocketHandler;
