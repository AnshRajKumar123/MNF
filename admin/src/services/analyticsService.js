import api from "../config/axios";

export const getDashboardAnalytics = async () => {

    const { data } = await api.get("/admin/analytics");

    return data.analytics;

};