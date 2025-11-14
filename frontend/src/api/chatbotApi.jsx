import axios from "./axios";

export const sendChat = (msg) => axios.post("/chatbot/ask", { message: msg });
