import axios from "axios";

export const server = axios.create({
    baseURL: "https://wevote-api.lilachelayza.com",
});