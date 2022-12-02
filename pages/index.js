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
  const [name_ev, setName_ev] = useState("");
  const [image_ev, setImage_ev] = useState("");
  const [type_ev, setType_ev] = useState("");
  const [msg_ev, setMsg_ev] = useState("");
  const [count_ev, setCount_ev] = useState();
  const [timestamp_ev, setTimestamp_ev] = useState();
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
        setName_ev(res.data[0].name);
        setImage_ev(res.data[0].image);
        setMsg_ev(res.data[0].message);
        setType_ev(res.data[0].type);
        setCount_ev(res.data[0].count);
        setTimestamp_ev(res.data[0].timestamp);
        // console.log(res.data[0].name);
      })
      .catch((err) => {
        console.error(err.response);
        setError("Complete el formulario");
      });
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");

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
          <div className="btn">
            <button type="submint">Enviar evento</button>
            <button onClick={handleSocket}>Difundir el evento</button>
          </div>
        </form>
        <div className="grid">
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
          <div className="socket">
            <h3>Api FreeWaves</h3>
            <ul className="ul">
              <label>Name: {name_ev} </label>
              <li>Image: {image_ev} </li>
              <li>Message:{msg_ev}</li>
              <li>Type:{type_ev} </li>
              <li>Count:{count_ev} </li>
              <li>Timestamp:{timestamp_ev} </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
