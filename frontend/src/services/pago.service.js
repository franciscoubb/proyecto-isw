import axios from "./root.service";
/**
 * Obtiene todos los cobros
 * @returns
 */
export const getPagosByCobroId = async (id) => {
  try {
    const response = await axios.get(`/cobro/pagos/${id}`);
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
 * Obtiene todos los pagos no confirmados
 * @returns
 */
export const getPagosNoConfirmados = async () => {
  try {
    const response = await axios.get("/confirmarPagos");
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
 * Confirma un pago
 * @returns
 */
export const confirmaPago = async (id) => {
  try {
    const response = await axios.post(`/confirmarPagos/${id}`);
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
