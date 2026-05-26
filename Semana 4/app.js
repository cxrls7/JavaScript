// =========================================================================
// SECCIÓN 1: CONFIGURACIÓN GLOBAL Y CAPTURA DE ELEMENTOS DEL DOM
// En este bloque se define la URL de la API pública que usaremos para simular
// las peticiones en la nube y se seleccionan mediante selectores nativos
// (getElementById y querySelector) todos los elementos interactivos de la interfaz.
// También se inicializa el arreglo global en memoria que actuará como nuestro
// inventario vivo durante la sesión.
// =========================================================================
const URL_API = "https://jsonplaceholder.typicode.com/posts"; 

const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const btnAgregar = document.getElementById("btnAgregar");
const btnSincronizar = document.querySelector("#btnSincronizar");
const listaProductosDOM = document.getElementById("listaProductos");
const panelMensaje = document.getElementById("panelMensaje");

let inventario = [];


// =========================================================================
// SECCIÓN 2: INTEGRACIÓN CON FETCH API (OPERACIONES ASÍNCRONAS CRUD)
// Aquí se gestiona toda la comunicación con el servidor remoto usando async/await
// y bloques try...catch para el manejo de errores. Contiene las funciones para:
// - GET: Traer datos iniciales del servidor y mapearlos a nuestra estructura.
// - POST: Registrar un nuevo producto en la nube al ser creado.
// - PUT: Simular la actualización de un recurso mediante doble clic.
// - DELETE: Informar al servidor la baja de un producto del inventario.
// =========================================================================
async function obtenerProductosServidor() {
    try {
        mostrarMensaje("Conectando con el servidor remoto...", "exito");
        const respuesta = await fetch(`${URL_API}?_limit=3`);
        
        if (!respuesta.ok) throw new Error("No se pudo obtener la respuesta del servidor.");
        
        const datosServidor = await respuesta.json();
        
        inventario = datosServidor.map((item) => ({
            id: item.id,
            nombre: `Prod Importado: ${item.title.substring(0, 15)}`,
            precio: Math.floor(Math.random() * 100000) + 50000
        }));

        actualizarLocalStorage();
        renderizarInventario();
        mostrarMensaje("Sincronización exitosa: Datos traídos del servidor.", "exito");
        console.log("FETCH GET EXITOSO. Inventario cargado:", inventario);
    } catch (err) {
        console.error("Error en operación GET:", err);
        mostrarMensaje(`Error de red: ${err.message}`, "error");
    }
}

async function enviarProductoServidor(nuevoProducto) {
    try {
        const respuesta = await fetch(URL_API, {
            method: "POST",
            body: JSON.stringify({
                title: nuevoProducto.nombre,
                body: `Precio: ${nuevoProducto.precio}`,
                userId: 1
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });

        if (!respuesta.ok) throw new Error("Fallo al registrar en el servidor.");
        
        const resultado = await respuesta.json();
        console.log("FETCH POST EXITOSO. Servidor registró:", resultado);
        mostrarMensaje(`Sincronizado en la nube con ID asignado: ${resultado.id}`, "exito");
    } catch (err) {
        console.error("Error en operación POST:", err);
    }
}

async function actualizarProductoServidor(id) {
    try {
        const respuesta = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id: id, title: 'Producto Editado', body: 'Precio actualizado', userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        const datos = await respuesta.json();
        console.log(`FETCH PUT EXITOSO en ID ${id}:`, datos);
    } catch (err) {
        console.error("Error en operation PUT:", err);
    }
}

async function eliminarProductoServidor(id) {
    try {
        const respuesta = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            console.log(`FETCH DELETE EXITOSO. ID ${id} eliminado del servidor virtual.`);
        }
    } catch (err) {
        console.error("Error en operación DELETE:", err);
    }
}


// =========================================================================
// SECCIÓN 3: PERSISTENCIA DE DATOS (LOCAL STORAGE)
// Este bloque se encarga de la permanencia de los datos en el navegador del usuario.
// Transforma el arreglo global a una cadena de texto (JSON.stringify) para salvarlo 
// en el disco local, y realiza el proceso inverso (JSON.parse) para recuperar 
// la información guardada de sesiones anteriores de forma automática al recargar la web.
// =========================================================================
function actualizarLocalStorage() {
    localStorage.setItem("inventario_m3s4", JSON.stringify(inventario));
    console.log("Local Storage actualizado con éxito.");
}

function cargarDesdeLocalStorage() {
    const datosLocal = localStorage.getItem("inventario_m3s4");
    if (datosLocal) {
        inventario = JSON.parse(datosLocal);
        console.log(`Carga de Local Storage exitosa. Se encontraron ${inventario.length} productos.`);
        renderizarInventario();
    } else {
        obtenerProductosServidor();
    }
}


// =========================================================================
// SECCIÓN 4: MANIPULACIÓN DEL DOM, VALIDACIONES Y EVENTOS DE USUARIO
// Contiene la lógica del núcleo interactivo de la app. Renderiza dinámicamente 
// los elementos de la lista en pantalla formateando los precios a Pesos Colombianos (COP),
// escucha los clics para agregar productos realizando una validación previa 
// de campos vacíos, maneja la eliminación de nodos (removeChild) y acciona los 
// pequeños banners dinámicos de notificación para asegurar una gran experiencia visual.
// =========================================================================
function renderizarInventario() {
    listaProductosDOM.innerHTML = "";

    const formateadorCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0 
    });

    for (const producto of inventario) {
        const nuevoLi = document.createElement("li");

        const contenedorInfo = document.createElement("div");
        contenedorInfo.className = "info-prod";
        
        const spanNombre = document.createElement("span");
        spanNombre.className = "nombre-prod";
        spanNombre.textContent = producto.nombre;

        const spanPrecio = document.createElement("span");
        spanPrecio.className = "precio-prod";
        spanPrecio.textContent = formateadorCOP.format(producto.precio);

        contenedorInfo.appendChild(spanNombre);
        contenedorInfo.appendChild(spanPrecio);

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", async () => {
            listaProductosDOM.removeChild(nuevoLi);
            inventario = inventario.filter(p => p.id !== producto.id);
            actualizarLocalStorage();
            mostrarMensaje(`Eliminado: ${producto.nombre}`, "error");
            await eliminarProductoServidor(producto.id);
        });

        contenedorInfo.addEventListener("dblclick", async () => {
            await actualizarProductoServidor(producto.id);
            mostrarMensaje(`Simulación PUT ejecutada en ID: ${producto.id}`, "exito");
        });

        nuevoLi.appendChild(contenedorInfo);
        nuevoLi.appendChild(btnEliminar);
        listaProductosDOM.appendChild(nuevoLi);
    }
}

btnAgregar.addEventListener("click", async () => {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);

    if (nombre === "" || isNaN(precio) || precio <= 0) {
        mostrarMensaje("Campos inválidos. Verifica que el nombre no esté vacío y el precio sea mayor a 0.", "error");
        console.warn("Validación de entrada rechazada.");
        return;
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: precio
    };

    inventario.push(nuevoProducto);
    actualizarLocalStorage();
    renderizarInventario();

    mostrarMensaje(`Producto "${nombre}" guardado localmente.`, "exito");

    inputNombre.value = "";
    inputPrecio.value = "";
    inputNombre.focus();

    await enviarProductoServidor(nuevoProducto);
});

btnSincronizar.addEventListener("click", obtenerProductosServidor);

function mostrarMensaje(texto, tipo) {
    panelMensaje.textContent = texto;
    panelMensaje.className = `mensaje ${tipo}`;
    panelMensaje.style.display = "block";
    
    setTimeout(() => {
        panelMensaje.style.display = "none";
    }, 4000);
}

window.addEventListener("DOMContentLoaded", cargarDesdeLocalStorage);