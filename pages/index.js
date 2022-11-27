import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useRef } from "react";

let socket;

export default function Home() {
  const [error, setError] = useState();
  const [msg, setmsg] = useState();
  const nameRef = useRef();
  const imageRef = useRef();
  const messageRef = useRef();
  const typeRef = useRef();

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

  useEffect(() => socketInitializer(), []);

  const socketInitializer = (e) => {
    fetch("/api/date-time")
      .then((res) => {
        const socket = io();
        socket.on("connect", () => {
          console.log("connected");
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSocket = (e) => {
    e.preventDefault;
    const socket = io();
    try {
      socket.on("server:evento", () => {
        socket.emit("client:obj", {
          name: nameRef.current.value, //string
          image: imageRef.current.value, //string
          message: messageRef.current.value, //string
          type: typeRef.current.value,
        });
      });
      socket.on("server:sendevent", (e) => {
        setmsg(e.name);
      });
    } catch (err) {
      console.log(err);
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
          <h3>Socket FreeWaves</h3>
          {/* no lo pinta al msg */}
          <h2>{msg}</h2> 
        </form>
      </div>
    </>
  );
}
