import axios from "axios";

const URL = "https://fakestoreapi.com/users";
const CLIENTES_ELIMINADOS_KEY = "clientesEliminados";

const obtenerIdsEliminados = () => {
    try {
        const ids = JSON.parse(localStorage.getItem(CLIENTES_ELIMINADOS_KEY) || "[]");
        return Array.isArray(ids) ? ids.map(String) : [];
    } catch {
        return [];
    }
};

const guardarIdEliminado = (id) => {
    const idsEliminados = new Set(obtenerIdsEliminados());
    idsEliminados.add(String(id));
    localStorage.setItem(CLIENTES_ELIMINADOS_KEY, JSON.stringify([...idsEliminados]));
};

const crearCliente = async (cliente) => {
    const respuesta = await axios.post(URL, cliente);
    return respuesta.data;
};

const getClientes = async () => {
    const respuesta = await axios.get(URL);
    const idsEliminados = obtenerIdsEliminados();
    return respuesta.data.filter((cliente) => !idsEliminados.includes(String(cliente.id)));
};

const getClientePorId = async (id) => {
  const respuesta = await axios.get(`${URL}/${id}`);
  return respuesta.data;
};

const eliminarCliente = async (id) => {
    const respuesta = await axios.delete(`${URL}/${id}`);
    guardarIdEliminado(id);
    return respuesta.data;
};

export default {
    crearCliente,
    getClientes,
    getClientePorId,
    eliminarCliente
};