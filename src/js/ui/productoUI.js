const tabla =
    document.querySelector(
        "#tablaProductos"
    );

const loader =
    document.querySelector(
        "#loader"
    );

const tablaContainer =
    document.querySelector(
        "#tablaContainer"
    );

const errorContainer =
    document.querySelector(
        "#errorContainer"
    );

const errorMessage =
    document.querySelector(
        "#errorMessage"
    );

const totalProductos =
    document.querySelector(
        "#totalProductos"
    );

const stockTotal =
    document.querySelector(
        "#stockTotal"
    );

const valorInventario =
    document.querySelector(
        "#valorInventario"
    );

const formTitle =
    document.querySelector(
        "#formTitle"
    );

const btnGuardar =
    document.querySelector(
        "#btnGuardar"
    );

const btnCancelar =
    document.querySelector(
        "#btnCancelar"
    );

const form =
    document.querySelector(
        "#formProducto"
    );

export function mostrarLoader() {

    loader.classList.remove(
        "hidden"
    );

    tablaContainer.classList.add(
        "hidden"
    );

    errorContainer.classList.add(
        "hidden"
    );
}

export function ocultarLoader() {

    loader.classList.add(
        "hidden"
    );
}

export function mostrarError(
    mensaje
) {

    ocultarLoader();

    tablaContainer.classList.add(
        "hidden"
    );

    errorContainer.classList.remove(
        "hidden"
    );

    errorMessage.textContent =
        mensaje;
}

export function mostrarTabla() {

    ocultarLoader();

    errorContainer.classList.add(
        "hidden"
    );

    tablaContainer.classList.remove(
        "hidden"
    );
}

export function mostrarProductos(
    productos
) {

    tabla.innerHTML = "";


    if (
        !productos ||
        productos.length === 0
    ) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    style="text-align:center;padding:40px"
                >
                    No existen productos.
                </td>
            </tr>
        `;

        actualizarEstadisticas(
            []
        );

        return;
    }


    productos.forEach(
        producto => {

            const fila =
                document.createElement(
                    "tr"
                );


            const stockClass =
                producto.tieneStockBajo
                    ? "stock-low"
                    : "stock-good";


            fila.innerHTML = `

                <td>
                    ${producto.id}
                </td>


                <td>

                    <div
                        class="product-cell"
                    >

                        <img
                            class="product-image"
                            src="${producto.imagen}"
                            alt="${producto.nombre}"
                            onerror="
                                this.src='https://via.placeholder.com/80x100?text=Sin+imagen'
                            "
                        >

                        <div>

                            <div
                                class="product-name"
                            >
                                ${producto.nombre}
                            </div>

                            <div
                                class="product-code"
                            >
                                ${producto.codigo}
                            </div>

                        </div>

                    </div>

                </td>


                <td>
                    ${producto.categoria}
                </td>


                <td>
                    ${producto.presentacion}
                </td>


                <td>
                    S/
                    ${producto.precio.toFixed(2)}
                </td>


                <td>

                    <span
                        class="${stockClass}"
                    >
                        ${producto.stock}
                    </span>

                </td>


                <td>

                    ${
                        producto.descuento > 0

                        ? `
                            <span class="discount">
                                -${producto.descuento}%
                            </span>
                        `

                        : "—"
                    }

                </td>


                <td>

                    <button class="btn btn-primary" data-action="cart" data-id="${producto.id}">Añadir al carrito</button>
                    <button
                        class="btn btn-view"
                        data-action="view"
                        data-id="${producto.id}"
                    >
                        Ver
                    </button>


                    <button
                        class="btn btn-edit"
                        data-action="edit"
                        data-id="${producto.id}"
                    >
                        Editar
                    </button>


                    <button
                        class="btn btn-delete"
                        data-action="delete"
                        data-id="${producto.id}"
                    >
                        Eliminar
                    </button>

                </td>

            `;


            tabla.appendChild(
                fila
            );

        }
    );


    actualizarEstadisticas(
        productos
    );
}

function actualizarEstadisticas(
    productos
) {

    const total =
        productos.length;


    const stock =
        productos.reduce(
            (
                acumulado,
                producto
            ) =>
                acumulado +
                producto.stock,
            0
        );


    const valor =
        productos.reduce(
            (
                acumulado,
                producto
            ) =>
                acumulado +
                (
                    producto.precio *
                    producto.stock
                ),
            0
        );


    totalProductos.textContent =
        total;


    stockTotal.textContent =
        stock;


    valorInventario.textContent =
        `S/ ${valor.toFixed(2)}`;
}

export function
obtenerDatosFormulario() {

    return {

        codigo:
            document
                .querySelector("#codigo")
                .value
                .trim(),

        nombre:
            document
                .querySelector("#nombre")
                .value
                .trim(),

        categoria:
            document
                .querySelector("#categoria")
                .value,

        presentacion:
            document
                .querySelector("#presentacion")
                .value,

        tamano:
            document
                .querySelector("#tamano")
                .value
                .trim(),

        sabor:
            document
                .querySelector("#sabor")
                .value
                .trim(),

        precio:
            Number(
                document
                    .querySelector("#precio")
                    .value
            ),

        stock:
            Number(
                document
                    .querySelector("#stock")
                    .value
            ),

        marca:
            document
                .querySelector("#marca")
                .value
                .trim(),

        ingrediente:
            document
                .querySelector("#ingrediente")
                .value
                .trim(),

        disponibilidad:
            document
                .querySelector("#disponibilidad")
                .value,

        descuento:
            Number(
                document
                    .querySelector("#descuento")
                    .value
            ),

        imagen:
            document
                .querySelector("#imagen")
                .value
                .trim(),

        descripcion:
            document
                .querySelector("#descripcion")
                .value
                .trim()
    };
}

export function
cargarFormulario(
    producto
) {

    document
        .querySelector("#productoId")
        .value =
            producto.id;


    document
        .querySelector("#codigo")
        .value =
            producto.codigo;


    document
        .querySelector("#nombre")
        .value =
            producto.nombre;


    document
        .querySelector("#categoria")
        .value =
            producto.categoria;


    document
        .querySelector("#presentacion")
        .value =
            producto.presentacion;


    document
        .querySelector("#tamano")
        .value =
            producto.tamano;


    document
        .querySelector("#sabor")
        .value =
            producto.sabor;


    document
        .querySelector("#precio")
        .value =
            producto.precio;


    document
        .querySelector("#stock")
        .value =
            producto.stock;


    document
        .querySelector("#marca")
        .value =
            producto.marca;


    document
        .querySelector("#ingrediente")
        .value =
            producto.ingrediente;


    document
        .querySelector("#disponibilidad")
        .value =
            producto.disponibilidad;


    document
        .querySelector("#descuento")
        .value =
            producto.descuento;


    document
        .querySelector("#imagen")
        .value =
            producto.imagen;


    document
        .querySelector("#descripcion")
        .value =
            producto.descripcion;


    formTitle.textContent =
        "Editar producto";


    btnGuardar.textContent =
        "Actualizar producto";


    btnCancelar.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export function
limpiarFormulario() {

    form.reset();


    document
        .querySelector("#productoId")
        .value = "";


    document
        .querySelector("#descuento")
        .value = 0;


    formTitle.textContent =
        "Nuevo producto";


    btnGuardar.textContent =
        "Guardar producto";


    btnCancelar.classList.add(
        "hidden"
    );
}

export function
mostrarDetalle(
    producto
) {

    const modal =
        document.querySelector(
            "#modal"
        );

    const modalBody =
        document.querySelector(
            "#modalBody"
        );


    modalBody.innerHTML = `

        <h2>
            ${producto.nombre}
        </h2>

        <p>
            ${producto.descripcion}
        </p>


        <div
            class="detail-grid"
        >

            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Código
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.codigo}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Categoría
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.categoria}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Marca
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.marca}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Ingrediente principal
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.ingrediente}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Tamaño
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.tamano}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Sabor
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.sabor}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Precio
                </span>

                <span
                    class="detail-value"
                >
                    S/ ${producto.precio.toFixed(2)}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Precio con descuento
                </span>

                <span
                    class="detail-value"
                >
                    S/ ${producto.precioFinal.toFixed(2)}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Stock
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.stock}
                </span>

            </div>


            <div class="detail-item">

                <span
                    class="detail-label"
                >
                    Disponibilidad
                </span>

                <span
                    class="detail-value"
                >
                    ${producto.disponibilidad}
                </span>

            </div>

        </div>

    `;


    modal.classList.remove(
        "hidden"
    );
}

export function cerrarModal() {

    document
        .querySelector("#modal")
        .classList.add(
            "hidden"
        );
}

export function mostrarToast(
    mensaje
) {

    const toast =
        document.querySelector(
            "#toast"
        );


    toast.textContent =
        mensaje;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}
