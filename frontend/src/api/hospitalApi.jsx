import axios from "./axios";

export const getHospitals = (params) => axios.get("/hospitals", { params });
export const getHospitalById = (id) => axios.get(`/hospitals/${id}`);
