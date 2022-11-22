import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [error, setError] = useState();

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
        console.log(res);
      })
      .catch((err) => {
        console.error(err.response);
        console.error(err.response.data);
        setError("Complete el formulario");
      });
    // console.log(formData);
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
        </form>
      </div>
    </>
  );
}
