import { get, post, put, remove } from './js/api/httpClient.js';
import { mostrarDetalle } from './js/ui/productoUI.js';
import { listarEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from './js/services/empleadoService.js';

let bd = { productos: [], categorias: [], clientes: [], pedidos: [], empleados: [] };
const loader = document.getElementById("loader");

// ==========================================
// 1. SISTEMA DE NAVEGACIÓN (SPA - 5 PESTAÑAS)
// ==========================================
const tabs = ['productos', 'categorias', 'clientes', 'pedidos', 'empleados'];
tabs.forEach(t => {
    document.getElementById(`tab-${t}`).addEventListener('click', () => {
        tabs.forEach(x => {
            document.getElementById(`seccion-${x}`).classList.add('seccion-oculta');
            document.getElementById(`tab-${x}`).classList.remove('active');
        });
        document.getElementById(`seccion-${t}`).classList.remove('seccion-oculta');
        document.getElementById(`tab-${t}`).classList.add('active');
    });
});

function mostrarToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; 
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

// ==========================================
// 2. SINCRONIZACIÓN HÍBRIDA (PROMISE.ALL)
// ==========================================
async function cargarTodo() {
    loader.classList.remove("hidden");
    try {
        // Consumo en paralelo: Fuente 1 (API REST .NET) + Fuente 2 (Firebase Firestore)
        const [cat, prod, cli, ped, emp] = await Promise.all([
            get('/categorias').catch(() => []) || [],
            get('/productos').catch(() => []) || [],
            get('/clientes').catch(() => []) || [],
            get('/pedidos').catch(() => []) || [],
            listarEmpleados().catch(() => []) || []
        ]);

        bd.categorias = cat;
        bd.productos = prod;
        bd.clientes = cli;
        bd.pedidos = ped;
        bd.empleados = emp;

        renderizarTablas();
    } catch (error) {
        console.error("Error en sincronización híbrida:", error);
    } finally {
        loader.classList.add("hidden");
    }
}

function renderizarTablas() {
    // Selects dinámicos
    document.getElementById("prod-categoria").innerHTML = '<option value="">Seleccionar...</option>' + 
        bd.categorias.filter(c => c.activa).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
    document.getElementById("ped-clienteId").innerHTML = '<option value="">Seleccionar Cliente...</option>' + 
        bd.clientes.map(c => `<option value="${c.id}">${c.nombre} ${c.apellido}</option>`).join('');

    // Tabla Categorías (.NET)
    document.getElementById("tabla-categorias").innerHTML = bd.categorias.map(c => `
        <tr>
            <td>${c.id}</td><td><strong>${c.nombre}</strong></td><td>${c.descripcion}</td>
            <td>${c.activa ? '<span style="color:#5cb85c">Activa</span>' : '<span style="color:#c96b79">Inactiva</span>'}</td>
            <td>
                <button class="btn btn-edit" data-accion="edit" data-tipo="categorias" data-id="${c.id}">Editar</button>
                <button class="btn btn-delete" data-accion="delete" data-tipo="categorias" data-id="${c.id}">Eliminar</button>
            </td>
        </tr>`).join('') || `<tr><td colspan="5">No hay categorías.</td></tr>`;

    // Tabla Productos (.NET)
    document.getElementById("totalProductos").textContent = bd.productos.length;
    document.getElementById("stockTotal").textContent = bd.productos.reduce((s, p) => s + p.stock, 0);
    document.getElementById("valorInventario").textContent = "S/ " + bd.productos.reduce((s, p) => s + (p.stock * p.precio), 0).toFixed(2);
    document.getElementById("tabla-productos").innerHTML = bd.productos.map(p => `
        <tr>
            <td><div style="display:flex; align-items:center; gap:10px;">
                <img src="${p.imagen}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" onerror="this.src='https://via.placeholder.com/40'">
                <div><strong>${p.nombre}</strong><br><small>${p.codigo}</small></div>
            </div></td>
            <td>${p.categoria}</td><td>S/ ${p.precio.toFixed(2)}</td><td>${p.stock}</td>
            <td>
                <button class="btn btn-view" data-accion="view" data-tipo="productos" data-id="${p.id}">Ver</button>
                <button class="btn btn-edit" data-accion="edit" data-tipo="productos" data-id="${p.id}">Editar</button>
                <button class="btn btn-delete" data-accion="delete" data-tipo="productos" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>`).join('') || `<tr><td colspan="5">No hay productos.</td></tr>`;

    // Tabla Clientes (.NET)
    document.getElementById("tabla-clientes").innerHTML = bd.clientes.map(c => `
        <tr>
            <td>${c.id}</td><td><strong>${c.nombre} ${c.apellido}</strong></td>
            <td>${c.correo}<br><small>${c.telefono}</small></td><td>${c.direccion}</td>
            <td>
                <button class="btn btn-edit" data-accion="edit" data-tipo="clientes" data-id="${c.id}">Editar</button>
                <button class="btn btn-delete" data-accion="delete" data-tipo="clientes" data-id="${c.id}">Eliminar</button>
            </td>
        </tr>`).join('') || `<tr><td colspan="5">No hay clientes.</td></tr>`;

    // Tabla Pedidos (.NET)
    document.getElementById("tabla-pedidos").innerHTML = bd.pedidos.map(p => `
        <tr>
            <td>${p.id}</td><td>Cliente #${p.clienteId}</td><td>${new Date(p.fecha).toLocaleDateString()}</td>
            <td><strong>S/ ${p.total.toFixed(2)}</strong></td><td>${p.estado}</td>
            <td>
                <button class="btn btn-edit" data-accion="edit" data-tipo="pedidos" data-id="${p.id}">Editar</button>
                <button class="btn btn-delete" data-accion="delete" data-tipo="pedidos" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>`).join('') || `<tr><td colspan="6">No hay pedidos.</td></tr>`;

    // Tabla Empleados (Firebase Cloud Firestore)
    document.getElementById("tabla-empleados").innerHTML = bd.empleados.map(e => `
        <tr>
            <td><strong>${e.codigo}</strong></td>
            <td>${e.nombre} ${e.apellido}</td>
            <td><span style="background:#fdf5f6; color:#b3415e; padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:600;">${e.cargo}</span></td>
            <td>${e.correo}<br><small>${e.telefono}</small></td>
            <td>
                <button class="btn btn-edit" data-accion="edit" data-tipo="empleados" data-id="${e.id}">Editar</button>
                <button class="btn btn-delete" data-accion="delete" data-tipo="empleados" data-id="${e.id}">Eliminar</button>
            </td>
        </tr>`).join('') || `<tr><td colspan="5">No hay empleados registrados en Firebase.</td></tr>`;
}

// ==========================================
// 3. FORMULARIOS (POST/PUT REST API .NET)
// ==========================================
async function guardarDatos(tipo, endpoint, id, data) {
    loader.classList.remove("hidden");
    try {
        if (id) await put(`/${endpoint}/${id}`, data);
        else await post(`/${endpoint}`, data);
        
        document.getElementById(`form-${tipo}`).reset();
        document.getElementById(`${tipo === 'productos' ? 'prod' : tipo === 'categorias' ? 'cat' : tipo === 'clientes' ? 'cli' : 'ped'}-id`).value = "";
        document.getElementById(`title-${tipo}`).textContent = `Nuevo ${tipo.charAt(0).toUpperCase() + tipo.slice(1, -1)}`;
        
        mostrarToast("Guardado exitosamente");
        await cargarTodo(); 
    } catch (e) {
        alert("Fallo al guardar: " + e.message);
    }
}

// Submit Categorías
document.getElementById("form-categorias").addEventListener("submit", e => {
    e.preventDefault();
    guardarDatos('categorias', 'categorias', document.getElementById("cat-id").value, {
        nombre: document.getElementById("cat-nombre").value,
        descripcion: document.getElementById("cat-descripcion").value,
        activa: document.getElementById("cat-activa").value === "true"
    });
});

// Submit Productos
document.getElementById("form-productos").addEventListener("submit", e => {
    e.preventDefault();
    guardarDatos('productos', 'productos', document.getElementById("prod-id").value, {
        codigo: document.getElementById("prod-codigo").value,
        nombre: document.getElementById("prod-nombre").value,
        categoria: document.getElementById("prod-categoria").value,
        presentacion: document.getElementById("prod-presentacion").value,
        tamano: document.getElementById("prod-tamano").value,
        sabor: document.getElementById("prod-sabor").value,
        precio: parseFloat(document.getElementById("prod-precio").value),
        stock: parseInt(document.getElementById("prod-stock").value),
        marca: document.getElementById("prod-marca").value,
        ingrediente: document.getElementById("prod-ingrediente").value,
        disponibilidad: document.getElementById("prod-disponibilidad").value,
        descuento: parseFloat(document.getElementById("prod-descuento").value) || 0,
        imagen: document.getElementById("prod-imagen").value,
        descripcion: document.getElementById("prod-descripcion").value
    });
});

// Submit Clientes
document.getElementById("form-clientes").addEventListener("submit", e => {
    e.preventDefault();
    guardarDatos('clientes', 'clientes', document.getElementById("cli-id").value, {
        nombre: document.getElementById("cli-nombre").value,
        apellido: document.getElementById("cli-apellido").value,
        telefono: document.getElementById("cli-telefono").value,
        correo: document.getElementById("cli-correo").value,
        direccion: document.getElementById("cli-direccion").value
    });
});

// Submit Pedidos
document.getElementById("form-pedidos").addEventListener("submit", e => {
    e.preventDefault();
    guardarDatos('pedidos', 'pedidos', document.getElementById("ped-id").value, {
        clienteId: parseInt(document.getElementById("ped-clienteId").value),
        total: parseFloat(document.getElementById("ped-total").value),
        estado: document.getElementById("ped-estado").value
    });
});

// ==========================================
// 4. SUBMIT FORMULARIO EMPLEADOS (FIREBASE)
// ==========================================
document.getElementById("form-empleados").addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("emp-id").value;
    const dataEmpleado = {
        codigo: document.getElementById("emp-codigo").value,
        nombre: document.getElementById("emp-nombre").value,
        apellido: document.getElementById("emp-apellido").value,
        cargo: document.getElementById("emp-cargo").value,
        telefono: document.getElementById("emp-telefono").value,
        correo: document.getElementById("emp-correo").value
    };

    loader.classList.remove("hidden");
    try {
        if (id) {
            await actualizarEmpleado(id, dataEmpleado);
            mostrarToast("Empleado actualizado en Firebase");
        } else {
            await crearEmpleado(dataEmpleado);
            mostrarToast("Empleado registrado en Firebase");
        }
        document.getElementById("form-empleados").reset();
        document.getElementById("emp-id").value = "";
        document.getElementById("title-empleados").textContent = "Nuevo Empleado (Firebase)";
        await cargarTodo();
    } catch (err) {
        alert("Error al guardar en Firebase: " + err.message);
    } finally {
        loader.classList.add("hidden");
    }
});

// ==========================================
// 5. DELEGACIÓN GLOBAL (EDITAR, ELIMINAR, VER)
// ==========================================
document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-accion]");
    if (!btn) return;
    
    const accion = btn.dataset.accion;
    const tipo = btn.dataset.tipo;
    const id = btn.dataset.id;

    if (accion === "delete") {
        if (confirm(`¿Estás seguro de eliminar este registro?`)) {
            loader.classList.remove("hidden");
            try {
                if (tipo === 'empleados') {
                    await eliminarEmpleado(id);
                    mostrarToast("Empleado eliminado de Firebase");
                } else {
                    await remove(`/${tipo}/${id}`);
                    mostrarToast("Eliminado correctamente");
                }
                await cargarTodo();
            } catch (err) {
                alert("Error al eliminar: " + err.message);
            } finally {
                loader.classList.add("hidden");
            }
        }
    }

    if (accion === "edit") {
        const item = bd[tipo].find(x => String(x.id) === String(id));
        if (!item) return;

        window.scrollTo({ top: 0, behavior: "smooth" });
        document.getElementById(`title-${tipo}`).textContent = `Editar Registro #${item.codigo || item.id}`;
        
        if (tipo === 'categorias') {
            document.getElementById("cat-id").value = item.id;
            document.getElementById("cat-nombre").value = item.nombre;
            document.getElementById("cat-descripcion").value = item.descripcion;
            document.getElementById("cat-activa").value = item.activa ? "true" : "false";
        }
        else if (tipo === 'productos') {
            document.getElementById("prod-id").value = item.id;
            document.getElementById("prod-codigo").value = item.codigo;
            document.getElementById("prod-nombre").value = item.nombre;
            document.getElementById("prod-categoria").value = item.categoria;
            document.getElementById("prod-presentacion").value = item.presentacion || "Unidad";
            document.getElementById("prod-tamano").value = item.tamano || "";
            document.getElementById("prod-sabor").value = item.sabor || "";
            document.getElementById("prod-precio").value = item.precio;
            document.getElementById("prod-stock").value = item.stock;
            document.getElementById("prod-marca").value = item.marca || "";
            document.getElementById("prod-ingrediente").value = item.ingrediente || "";
            document.getElementById("prod-disponibilidad").value = item.disponibilidad || "Disponible";
            document.getElementById("prod-descuento").value = item.descuento || 0;
            document.getElementById("prod-imagen").value = item.imagen || "";
            document.getElementById("prod-descripcion").value = item.descripcion || "";
        }
        else if (tipo === 'clientes') {
            document.getElementById("cli-id").value = item.id;
            document.getElementById("cli-nombre").value = item.nombre;
            document.getElementById("cli-apellido").value = item.apellido;
            document.getElementById("cli-telefono").value = item.telefono;
            document.getElementById("cli-correo").value = item.correo;
            document.getElementById("cli-direccion").value = item.direccion;
        }
        else if (tipo === 'pedidos') {
            document.getElementById("ped-id").value = item.id;
            document.getElementById("ped-clienteId").value = item.clienteId;
            document.getElementById("ped-total").value = item.total;
            document.getElementById("ped-estado").value = item.estado;
        }
        else if (tipo === 'empleados') {
            document.getElementById("emp-id").value = item.id;
            document.getElementById("emp-codigo").value = item.codigo;
            document.getElementById("emp-nombre").value = item.nombre;
            document.getElementById("emp-apellido").value = item.apellido;
            document.getElementById("emp-cargo").value = item.cargo;
            document.getElementById("emp-telefono").value = item.telefono;
            document.getElementById("emp-correo").value = item.correo;
        }
    }

    if (accion === "view" && tipo === "productos") {
        const p = bd.productos.find(x => String(x.id) === String(id));
        if (p) mostrarDetalle(p);
    }
});

cargarTodo();