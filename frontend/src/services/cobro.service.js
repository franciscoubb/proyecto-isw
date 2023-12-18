import axios from "./root.service";

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
