import { z, ZodError } from "zod";
var STORE = [];

export default async function handler(req, res) {
  const objectSchema = z.object({
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
      STORE.push(obj);
      obj.timestamp = new Date().getTime();
      console.log(STORE);
      return res.json("Objeto recibido");
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          "Tipo requerido": e.issues[0].type,
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
