import api from "../config/axios";

export const getSettings = async () => {

    const { data } = await api.get("/settings");

    return data;

};