import '../css/detallecliente.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientesService from "../services/clientesService";

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const res = await clientesService.getClientePorId(id);
        if (!res || (res.ok !== undefined && !res.ok)) {
          throw new Error('No se pudo encontrar el cliente solicitado (Error ' + (res?.status || 404) + ')');
        }
        setCliente(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarCliente();
  }, [id]);

  const eliminarCliente = async () => {
    try {
      const respuesta = await clientesService.eliminarCliente(id);

      if (respuesta) {
        setMensaje("Cliente eliminado correctamente");
        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      }
    } catch (error) {
      setMensaje("Error al eliminar cliente");
    }
  };
  
  if (loading) {
    return <h2>Cargando cliente...</h2>;
  }

  if (error || !cliente) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <p>{error || "Error al cargar el detalle del cliente."}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/clientes")}
          >
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }

  const enmascarar = (str) => '•'.repeat(str?.length || 8); //crea una mascara de puntos para la contraseña y que tenga un minimo de 8 caracteres

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>

      {mensaje && <p className = 'mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      <h2>Credenciales</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      <p>
        <strong>Contraseña:</strong> {enmascarar(cliente.password)}
      </p>

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar'onClick={eliminarCliente}>
          Eliminar Cliente
        </button>
      )}
    </div>
  );
};

export default DetalleCliente;