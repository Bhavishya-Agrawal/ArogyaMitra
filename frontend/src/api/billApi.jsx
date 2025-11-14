import axios from "./axios";

export const uploadBill = (formData) =>
  axios.post("/bills/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getFraudReport = (id) => axios.get(`/fraud/${id}`);
