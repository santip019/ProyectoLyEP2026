import axios from "axios";

const URL = "https://fakestoreapi.com/users";

const crearCliente = async (cliente) => {
    const respuesta = await axios.post(URL, cliente);
    return respuesta.data;
};

const getClientes = async () => {
    const respuesta = await axios.get(URL);
    return respuesta.data;
};

const getClientePorId = async (id) => {
  const respuesta = await axios.get(`${URL}/${id}`);
  return respuesta.data;
};

const eliminarCliente = async (id) => {
    const respuesta = await axios.delete(`${URL}/${id}`);
    return respuesta.data;
};

export default {
    crearCliente,
    getClientes,
    getClientePorId,
    eliminarCliente
};