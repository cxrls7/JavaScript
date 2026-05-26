

const inputNota = document.getElementById("inputNota");
const btnAgregar = document.querySelector("#btnAgregar");
const listaNotas = document.getElementById("listaNotas");


console.log("--- Inspección inicial de elementos seleccionados ---");
console.log("Input:", inputNota);
console.log("Botón:", btnAgregar);
console.log("Lista UL:", listaNotas);


let notas = notasGuardadas ? JSON.parse(notasGuardadas) : [];

console.log(`Carga inicial: Se recuperaron ${notas.length} notas del Local Storage.`);

function cargarNotasIniciales() {
    notas.forEach((textoNota) => {
        crearElementoNotaEnDOM(textoNota);
    });
}



function crearElementoNotaEnDOM(textoNota) {

    const nuevoLi = document.createElement("li");
    
  
    const textoSpan = document.createElement("span");
    textoSpan.textContent = textoNota;
    

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-eliminar";

    
    btnEliminar.addEventListener("click", () => {
      
        listaNotas.removeChild(nuevoLi);
        
      
        notas = notas.filter(n => n !== textoNota);
        
        
        guardarEnLocalStorage();
        console.log(`Nota eliminada: "${textoNota}". Lista actualizada.`);
    });


    nuevoLi.appendChild(textoSpan);
    nuevoLi.appendChild(btnEliminar);
    listaNotas.appendChild(nuevoLi);
}


btnAgregar.addEventListener("click", () => {
    const texto = inputNota.value.trim();

 
    if (texto === "") {
        alert("¡Error! No puedes agregar una nota vacía.");
        return;
    }


    crearElementoNotaEnDOM(texto);
    notas.push(texto);
    

    guardarEnLocalStorage();
    console.log(`Nota agregada con éxito: "${texto}"`);

    inputNota.value = "";
    inputNota.focus();
});



function guardarEnLocalStorage() {
    localStorage.setItem("notas", JSON.stringify(notas));
}


cargarNotasIniciales();