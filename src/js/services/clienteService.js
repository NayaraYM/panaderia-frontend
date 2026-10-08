import { httpRequest } from "../api/httpClient.js";

const ENDPOINT = "/clientes";


export async function listarClientes() {

    return await httpRequest(ENDPOINT);

}


export async function obtenerCliente(id) {

    return await httpRequest(
        `${ENDPOINT}/${id}`
    );

}