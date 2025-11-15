import axios from "./axios";
import { data } from "./hospitalData";

// Mock API for hospitals (returns data like a real API)
export const getHospitals = () => {
  return Promise.resolve({ data });
};

// Get hospital by ID (slNo or hospitalId)
export const getHospitalById = (id) => {
  const newData = data.filter((item) => item.slNo === Number(id));
  return Promise.resolve({ data: newData[0] });
};
