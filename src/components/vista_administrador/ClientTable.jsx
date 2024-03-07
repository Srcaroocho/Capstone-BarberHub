import React, { useState, useEffect } from "react";
import "./styles/clienttable.css";
import { fetchClientsData } from "../../api/apiService"; // Importar la función para obtener datos de clientes
import { Toaster, toast } from "sonner";

const ClientTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientsData, setClientsData] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const promise = async () => {
          const jsonData = await fetchClientsData(); // Llamar a la función de la API para obtener datos de clientes
          setClientsData(jsonData);
        };
        toast.promise(promise(), {
          loading: "Cargando datos de los clientes...",
          success: () => "Datos recibidos",
          error: "Error al obtener los datos de los clientes",
        });
      } catch (error) {
        // Manejo de errores
        console.error("Error al obtener los datos de los clientes:", error);
      }
    }
    fetchData();
  }, []);

  const filteredClients = Array.isArray(clientsData)
    ? clientsData.filter(
        (cliente) =>
          (cliente.Nombre?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (cliente.Apellido?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (cliente.Email?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      )
    : [];

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="client-table-container">
      <Toaster />

      <div className="action-button-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="client-table">
        <thead className="client-table-header">
          <tr className="client-table-row">
            <th className="client-table-heading"></th>
            <th className="client-table-heading">Nombre</th>
            <th className="client-table-heading">Apellido</th>
            <th className="client-table-heading">Email</th>
            <th className="client-table-heading">Telefono</th>
          </tr>
        </thead>
        <tbody className="client-table-body">
          {currentItems.map((cliente) => (
            <tr key={cliente.id} className="client-table-row">
              <td className="client-table-cell"></td>
              <td className="client-table-cell">{cliente.Nombre}</td>
              <td className="client-table-cell">{cliente.Apellido}</td>
              <td className="client-table-cell">{cliente.Email}</td>
              <td className="client-table-cell">{cliente.Telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="client-pagination">
        <button
          className="pagination-button"
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        >
          |«
        </button>
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          «
        </button>
        <span className="pagination-page-info">Página {currentPage}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          »
        </button>
        <button
          className="pagination-button"
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        >
          »|
        </button>
      </div>
    </div>
  );
};

export default ClientTable;
