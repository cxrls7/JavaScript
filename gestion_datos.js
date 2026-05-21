
const inventarioProductos = {
    "PROD001": { id: "PROD001", nombre: "Laptop Gamer", precio: 1200 },
    "PROD002": { id: "PROD002", nombre: "Mouse Óptico", precio: 25 },
    "PROD003": { id: "PROD003", nombre: "Monitor 4K", precio: 350 },
    "PROD004": { id: "PROD004", nombre: "", precio: -10 } 
};

console.log("--- VALIDACIÓN DE PRODUCTOS ---");


function validarProducto(producto) {
  
    if (!producto.id || typeof producto.id !== "string") return false;
    if (!producto.nombre || producto.nombre.trim() === "") return false;
    if (typeof producto.precio !== "number" || producto.precio <= 0) return false;
    return true;
}


const productosValidos = {};
Object.entries(inventarioProductos).forEach(([clave, producto]) => {
    if (validarProducto(producto)) {
        productosValidos[clave] = producto;
    } else {
        console.error(`Producto inválido detectado y descartado: ID ${producto.id}`);
    }
});



console.log("\n--- TRABAJANDO CON SETS (VALORES ÚNICOS) ---");

const idContratistas = new Set([101, 102, 101, 103, 102, 104]);


console.log("Contenido inicial del Set (sin duplicados):", idContratistas);


idContratistas.add(105);
console.log("Set después de agregar el 105:", idContratistas);


const existeCientoTres = idContratistas.has(103);
console.log("¿El número 103 existe en el Set?:", existeCientoTres);


idContratistas.delete(101);
console.log("Set después de eliminar el 101:", idContratistas);



console.log("\n--- TRABAJANDO CON MAPS (DICCIONARIOS ASOCIATIVOS) ---");


const categoriasProductos = new Map();

categoriasProductos.set("Computación", productosValidos["PROD001"].nombre); 
categoriasProductos.set("Accesorios", productosValidos["PROD002"].nombre);  
categoriasProductos.set("Pantallas", productosValidos["PROD003"].nombre);   



console.log("\n--- ITERANDO EL OBJETO CON FOR...IN ---");
for (const propiedad in productosValidos) {
    console.log(`Clave en inventario: ${propiedad} -> Producto: ${productosValidos[propiedad].nombre}, Precio: $${productosValidos[propiedad].precio}`);
}


console.log("\n--- ITERANDO EL SET CON FOR...OF ---");
for (const id of idContratistas) {
    console.log(`ID Único de contratista: ${id}`);
}


console.log("\n--- ITERANDO EL MAP CON FOREACH() ---");
categoriasProductos.forEach((producto, categoria) => {
    console.log(`Categoría: ${categoria} | Producto Asociado: ${producto}`);
});


console.log("\n--- MÉTODOS DE OBJETOS (KEYS, VALUES, ENTRIES) ---");
console.log("Object.keys():", Object.keys(productosValidos));
console.log("Object.values():", Object.values(productosValidos));