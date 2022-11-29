import { Server } from "socket.io"; // Conecto el servver HTTP a Socket.io, utilizamos la clase Server del paquete Socket.IO.
import { z, ZodError } from "zod";
import { v4 as RandomId } from "uuid";
var STORE = []; // objetos

export async function handler(req, res) {
  const objectSchema = z.object({
    // Verificacion Inputs
    name: z.string().min(1, "Name es requerido"),
    image: z.string().min(1, "image es requerida"),
    message: z.string().min(1, "message es requerido"),
    type: z.string().min(1, "type es requerido"),
  });

  if (req.method === "POST") {
    try {
      // console.log(req.body);
      const schemaResult = objectSchema.parse(req.body);
      // console.log(schemaResult);
      const obj = req.body;
      // console.log(obj)
      const evento_en_store = STORE.filter((ev) => ev.type == obj.type)[0];

      if (!evento_en_store) {
        const primer_evento_del_tipo = {
          name: obj.name,
          image: obj.image,
          message: obj.message,
          type: obj.type,
          count: 1,
          timestamp: new Date().getTime(), // creando el timestamp en el primer evento del tipo
        };
        STORE.push(primer_evento_del_tipo);
      } else {
        evento_en_store.count++;
        evento_en_store.timestamp = new Date().getTime(); // creando el timestamp en cada evento nuevo
        STORE = STORE.filter(
          (evento_en_store) => evento_en_store.type !== obj.type
        );
      }

      // console.log(STORE);
      return res.json(STORE, "objeto recivido");
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          "Tipo requerido": e.issues[0].type, // errores input
          "Error message": e.issues[0].message,
          "El error es en": e.issues[0].path[0],
        });
      } else {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  } else {
    return res.status(400).json({ error: "El metodo no existe" });
  }
}

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
