import { Server } from "Socket.IO"; // Conecto el servver HTTP a Socket.io, utilizamos la clase Server del paquete Socket.IO.

export default async function SocketHandler(req, res) {
  try {
    if (res.socket.server.io) {
      // Si este objeto io en res.socket.server no existe, entonces iniciamos una nueva conexión de socket instanciando un Server, que toma el res.socket.server como entrada.
      console.log("Socket is already running");
    } else {
      console.log("Socket is initializing");
      const io = new Server(res.socket.server);
      res.socket.server.io = io;

      io.on("connection", (socket) => {
        //dentro de la función callback, nos suscribimos al evento input-change a través de la función socket.on(), que toma como parámetros un nombre de evento y una función callback.
        socket.on("input-change", (msg) => {
          //parámetros un nombre de evento y una función callback.
          socket.broadcast.emit("update-input", msg);
          //dentro de la función callback, usamos socket.broadcast.emit(), que emite un mensaje a todos los clientes excepto al que emitió el evento input-change
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
  res.end();
}
