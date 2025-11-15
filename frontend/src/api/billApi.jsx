import axios from "axios";

export const uploadBill = (formData) =>
  axios.post("http://localhost:5000/api/bills/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getFraudReport = () =>
  axios.get("http://localhost:5000/api/bills/report/latest");
