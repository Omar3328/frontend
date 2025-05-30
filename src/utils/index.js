// proyecto-vue/src/utils/index.js
import axios from "axios";

export async function api() {
  const options = {
    method: "GET",
    url: "http://127.0.0.1:8000/api/multas",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const respuesta = await axios.request(options);
    console.log("Multas:", respuesta.data);
    return respuesta.data; // ✅ Devuelve los datos
  } catch (error) {
    console.error("Error al obtener multas:", error);
    return []; // ✅ Devuelve array vacío si hay error
  }
}
