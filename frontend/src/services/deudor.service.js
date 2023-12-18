import axios from "./root.service";
/**
 * Obtiene todos los deudores
 * @returns
 */
export const getDeudores = async () => {
  try {
    const response = await axios.get("/deudor");
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
 * crear un nuevo deudor
 */
export const createDeudor = async ({
  nombre,
  apellido,
  rut,
  telefono,
  email,
}) => {
  try {
    const response = await axios.post("/deudor", {
      nombre,
      apellido,
      rut,
      telefono,
      email,
    });
    const { status, data } = response;
    if (status === 201) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Elimina un deudor siempre que no tenga cobros
 */

export const deleteDeudor = async (id) => {
  try {
    const response = await axios.delete(`/deudor/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return { success: true, data: data.data };
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return { success: false, message: "El deudor tiene cobros asociados" };
    }
    // console.log(error);
    throw error;
  }
};

/**
 * Edita un deudor
 */
export const updateDeudor = async (id, body) => {
  try {
    const response = await axios.put(`/deudor/${id}`, body);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
