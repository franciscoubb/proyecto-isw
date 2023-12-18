import axios from "./root.service";
import dayjs from "dayjs";
/**
 * crear un nuevo cobro
 */
export const createCobro = async ({
  tipoTramite,
  monto,
  plazoMaximoPago,
  deudorId,
}) => {
  try {
    const response = await axios.post("/cobro", {
      tipoTramite,
      monto,
      plazoMaximoPago,
      deudorId,
    });
    const { status, data } = response;
    if (status === 201) {
      return data.data;
    }
    if (status === 204) {
      return [];
    }
    if (status === 500) {
      console.log("Error");
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Obtiene todos los cobros
 * @returns
 */
export const getCobros = async () => {
  try {
    const response = await axios.get("/cobro");
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
    if (status === 204) {
      return [];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
import dayjs from "dayjs";
/**
 * crear un nuevo cobro
 */
export const createCobro = async ({
  tipoTramite,
  monto,
  plazoMaximoPago,
  deudorId,
}) => {
  try {
    const response = await axios.post("/cobro", {
      tipoTramite,
      monto,
      plazoMaximoPago,
      deudorId,
    });
    const { status, data } = response;
    if (status === 201) {
      return data.data;
    }
    if (status === 204) {
      return [];
    }
    if (status === 500) {
      console.log("Error");
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Obtiene todos los cobros
 * @returns
 */
export const getCobros = async () => {
  try {
    const response = await axios.get("/cobro");
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
    if (status === 204) {
      return [];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Edita un cobro
 */
export const updateCobro = async (id, body) => {
  try {
    console.log(body);
    const response = await axios.put(`/cobro/${id}`, body);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * Eliminar un cobro
 */
export const eliminarCobro = async (id) => {
  try {
    const response = await axios.delete(`/cobro/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * obtiene el archivo excel desde el servidor
 */
export const obtenerExcel = async () => {
  try {
    const response = await axios.get("/cobro/descargar/excel", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Crear un enlace (a) para descargar el archivo
    const a = document.createElement("a");
    a.href = url;
    const formattedToday = dayjs().format("DD-MM-YYYY");
    a.download = `cobros_${formattedToday}.xlsx`; // Puedes cambiar el nombre del archivo según tu necesidad

    // Agregar el enlace al DOM y simular un clic para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Eliminar el enlace del DOM después de la descarga
    document.body.removeChild(a);
    console.log(response);
    console.log(typeof response.data);

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Obtiene un cobro por su id
 * @returns
 */
export const getCobroById = async (id) => {
  try {
    const response = await axios.get(`/cobro/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
    if (status === 204) {
      return [];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
