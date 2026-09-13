import '../css/detallecliente.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";
import useAutorizaciones from "../hooks/useAutorizaciones";

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAutorizaciones();

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

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

  const solicitarEliminacion = () => {
    if (admin?.sector?.trim() !== "Gerencia") {
      setMensaje("No tienes permisos para eliminar clientes.");
      return;
    }

    setMostrarConfirmacion(true);
  };

  const eliminarCliente = async () => {
    setMostrarConfirmacion(false);
    setEliminando(true);
    try {
      await clientesService.eliminarCliente(id);
      setMensaje("Cliente eliminado correctamente. Volviendo a la lista...");
      setTimeout(() => navigate("/clientes"), 1500);
    } catch (err) {
      setMensaje(`No se pudo eliminar el cliente: ${err.message}`);
      setEliminando(false);
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

      {admin?.sector?.trim() === "Gerencia" && (
        <button className='btn-eliminar' onClick={solicitarEliminacion} disabled={eliminando}>
          {eliminando ? (
            <>
              <Spinner animation="border" size="sm" role="status" />
              <span className="texto-spinner">Eliminando...</span>
            </>
          ) : "Eliminar Cliente"}
        </button>
      )}

      <Modal
        show={mostrarConfirmacion}
        onHide={() => setMostrarConfirmacion(false)}
        centered
        className="modal-confirmacion"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro de que desea eliminar al cliente{' '}
            <strong>{cliente.name.firstname} {cliente.name.lastname}</strong>?
          </p>
          <span className="texto-advertencia">
            Esta acción no se puede deshacer.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setMostrarConfirmacion(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCliente}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetalleCliente;