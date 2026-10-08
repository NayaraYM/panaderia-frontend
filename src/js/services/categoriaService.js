import { httpRequest } from "../api/httpClient.js";

const ENDPOINT = "/categorias";


export async function listarCategorias() {

    return await httpRequest(ENDPOINT);

}


export async function obtenerCategoria(id) {

    return await httpRequest(
        `${ENDPOINT}/${id}`
    );

}