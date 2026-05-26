const nombreUsuario = prompt("Por favor, ingresa tu nombre:");


const edadIngresada = prompt("Por favor, ingresa tu edad:");


const edadUsuario = parseInt(edadIngresada);

if (Number.isNaN(edadUsuario) || edadIngresada === "" || edadIngresada === null) {
    

    console.error("Error: Por favor, ingresa una edad válida en números.");
    alert("Hubo un error con los datos ingresados. Revisa la consola del navegador.");

} else {
    

    if (edadUsuario < 18) {
        
       
        console.log(`Hola ${nombreUsuario}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`);
        alert(`Hola ${nombreUsuario}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`);
        
    } 

    else {
        
        console.log(`Hola ${nombreUsuario}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`);
        alert(`Hola ${nombreUsuario}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`);
        
    }
}