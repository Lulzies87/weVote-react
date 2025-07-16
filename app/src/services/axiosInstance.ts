import axios from "axios";

export const server = axios.create({
    baseURL: "http://wevote-api.lilachelayza.com",
});