import axios from "axios";

export const getAllParentOptions = (obj) => {
  return axios.get("http://3.6.157.5:5000/sectors", obj);
};

export const getAllParentChildren = (id) => {
  return axios.get("http://3.6.157.5:5000/sectors/" + id + "/children");
};

export const createForm = (payload) => {
  return axios.post("http://3.6.157.5:5000/create", payload);
};

export const getAllForms = (obj) => {
  return axios.get("http://3.6.157.5:5000/list", obj);
};

export const updateForm = (obj) => {
  return axios.put("http://3.6.157.5:5000/list/" + obj?.id, obj);
};

export const getCounts = () => {
  return axios.get("http://3.6.157.5:5000/getcounts");
};
