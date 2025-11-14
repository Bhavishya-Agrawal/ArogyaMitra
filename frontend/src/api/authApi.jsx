import axios from "./axios";

export const login = (payload) => axios.post("/auth/login", payload);
export const register = (payload) => axios.post("/auth/register", payload);
export const verifyPmjay = (payload) => axios.post("/auth/verify", payload);
