import axios from "./rootDeudor.service";

/**
 * Obtiene todos los cobros
 * @returns
 */
export const getMisDeudas = async () => {
  try {
    const response = await axios.get("/deudores");
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
 *
 * @param {*} param0
 * @returns
 */
export const getDeuda = async (id) => {
  try {
    const response = await axios.get(`/deudores/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
    return {};
  } catch (error) {
    console.log(error);
  }
};
/**
 * crear un nuevo pago
 */
export const createPago = async ({ monto, tipo, cobroId }) => {
  try {
    const response = await axios.post("/deudores", {
      monto,
      tipo,
      cobroId,
    });
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
