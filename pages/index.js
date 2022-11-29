import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useRef } from "react";

export default function Home() {
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [id, setId] = useState();
  const nameRef = useRef();
  const imageRef = useRef();
  const messageRef = useRef();
  const typeRef = useRef();
  const socket = io();

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
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/date-time");

      socket.on("connect", () => {
        console.log("connected");
      });
      socket.on("server:EVENTO", (evento) => {
        // console.log(evento);
        setId(evento.id);
        setImage(evento.image);
        setName(evento.name);
        setType(evento.type);
        setMsg(evento.message);
      });
    };

    return socketInitializer;
  });

  const handleSocket = (e) => {
    e.preventDefault();
    try {
      socket.emit("cliente:EVENTO", {
        name: nameRef.current.value, //string
        image: imageRef.current.value, //string
        message: messageRef.current.value, //string
        type: typeRef.current.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <h1>HOLA FREEEWAVES</h1>
        <form onSubmit={handleSubmit} className="form">
          <input ref={nameRef} type="text" name="name" placeholder="name" />
          <input ref={imageRef} type="text" name="image" placeholder="image" />
          <input
            ref={messageRef}
            type="text"
            name="message"
            placeholder="message"
          />
          <input ref={typeRef} type="text/num" name="type" placeholder="type" />
          {error && (
            <div>
              <h3>{error}</h3>
            </div>
          )}
          <button onClick={handleSocket}>Enviar Datos</button>
          <div className="socket">
            <h3>Socket FreeWaves</h3>
            <ul className="ul">
              <label>Id: {id}</label>
              <li>Name: {name}</li>
              <li>Image: {image}</li>
              <li>Message: {msg}</li>
              <li>Type: {type}</li>
            </ul>
          </div>
        </form>
      </div>
    </>
  );
}
