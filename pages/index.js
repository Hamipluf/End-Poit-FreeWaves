import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.name.value)
    axios
      .post(
        "/api/date-time", //http://localhost:3000
        {
          name: e.target.name.value, //string
          image: e.target.image.value, //string
          message: e.target.message.value, //string
          type: e.target.type.value,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        // setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.response);
        console.error(err.response.data);
        setError("Complete el formulario");
      });
    // console.log(formData);
  };

  useEffect(() => socketInitializer(), []);

  const socketInitializer = () => {
    fetch("/api/socket")
      .then((res) => {
        socket = io();
        socket.on("connect", () => {
          console.log("connected");
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onChangeHandler = (e) => {
    console.log(e.nativeEvent.data);
    setInput(e.target.value);
    //El primer parámetro de socket.emit() es el nombre único del evento, que es input-change, y el segundo parámetro es el mensaje.
    //En nuestro caso, es el valor del campo de entrada.
    socket.emit("input-change", e.nativeEvent.data);
  };

  return (
    <>
      <div>
        <h1>HOLA FREEEWAVES</h1>
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="name" placeholder="name" />
          <input type="text" name="image" placeholder="image" />
          <input type="text" name="message" placeholder="message" />
          <input type="text/num" name="type" placeholder="type" />
          {error && (
            <div>
              <h3>{error}</h3>
            </div>
          )}
          <button>Enviar Datos</button>
          <h3>Socket FreeWaves</h3>
        </form>
        <form className="form">
          <input
            type="text"
            onChange={onChangeHandler}
            placeholder="Type something"
          />
        </form>
      </div>
    </>
  );
}
