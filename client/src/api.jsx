import axiosClient from "./apiClient";

export const sendToken = (token) => {
    return axiosClient().post("send-token", { token }).then(response => response.data);
}