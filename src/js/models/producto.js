export class Producto {

    constructor({
        id = null,
        codigo = "",
        nombre = "",
        categoria = "",
        presentacion = "",
        tamano = "",
        sabor = "",
        precio = 0,
        stock = 0,
        marca = "",
        ingrediente = "",
        disponibilidad = "",
        descuento = 0,
        imagen = "",
        descripcion = ""
    } = {}) {

        this.id = id;

        this.codigo = codigo;

        this.nombre = nombre;

        this.categoria = categoria;

        this.presentacion = presentacion;

        this.tamano = tamano;

        this.sabor = sabor;

        this.precio =
            Number(precio);

        this.stock =
            Number(stock);

        this.marca = marca;

        this.ingrediente = ingrediente;

        this.disponibilidad = disponibilidad;

        this.descuento =
            Number(descuento);

        this.imagen = imagen;

        this.descripcion = descripcion;
    }

    get precioFinal() {

        return (
            this.precio -
            (
                this.precio *
                this.descuento /
                100
            )
        );
    }

    get tieneStockBajo() {

        return this.stock < 10;
    }

}
