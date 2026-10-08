import { httpRequest } from "../api/httpClient.js";
const ENDPOINT = "/pedidos";
export const listarPedidos = () => httpRequest(ENDPOINT);
export const obtenerPedido = id => httpRequest(`${ENDPOINT}/${id}`);
export const listarDetallesPedido = id => httpRequest(`${ENDPOINT}/${id}/detalle`);
