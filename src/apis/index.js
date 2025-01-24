import axios from "axios";
import { API_ROOT } from "~/utils/constants";
export const fetchBoardDetailsAPI = async (boardId) => {
  try {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("fetchBoardDetailsAPI error: ", error);
    return null;
  }
}

