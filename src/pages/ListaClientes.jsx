import "../css/listaclientes.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormCliente from "../components/FormCliente";
import clientesService from "../services/clientesService";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
  const cargarClientes = async () => {
    try {
      // Usamos await para esperar a Axios
      const data = await clientesService.getClientes();
      setClientes(data);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  cargarClientes();
}, []);

  const handleClienteCreado = (nuevoCliente) => {
    setClientes((prevClientes) => [nuevoCliente, ...prevClientes]);
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.name?.lastname
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      cliente.address?.city
        ?.toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return <h2>Cargando clientes...</h2>;
  }

  if (error) {
    return <h2>Error al cargar los clientes.</h2>;
  }

  return (
    <div className="clientes-container">

      <h1>Clientes</h1>
      <FormCliente onClienteCreado={handleClienteCreado} />

      <hr />

      <div className="contenedor-buscador">

        <h2 className="titulo-buscador">
          Buscar Clientes
        </h2>

        <input
          className="buscador"
          type="text"
          placeholder="Buscar por apellido o ciudad"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <p className="cantidad-clientes">
          Clientes encontrados: {clientesFiltrados.length}
        </p>

      </div>
      <table className="tabla-clientes">

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>

              <td>{cliente.id}</td>

              <td>
                {cliente.name?.firstname} {cliente.name?.lastname}
              </td>

              <td>{cliente.email}</td>

              <td>{cliente.phone}</td>

              <td>{cliente.address?.city}</td>

              <td>
                <Link
                  className="btn-ficha"
                  to={`/clientes/${cliente.id}`}
                >
                  Ver Ficha Completa
                </Link>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ListaClientes;