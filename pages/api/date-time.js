import axios from "axios";
import { z, ZodError } from "zod";
var STORE = []; // eventos

export default async function handlerTime(req, res) {
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
      return res.status(200).json(STORE, "evento recibido");
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
