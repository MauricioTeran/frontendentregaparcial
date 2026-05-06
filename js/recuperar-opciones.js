document.addEventListener("DOMContentLoaded", () => {
    const cardEmail = document.getElementById("card-email");
    const cardPhone = document.getElementById("card-phone");
    const userEmailText = document.getElementById("user-email");
    const btnContinuar = document.getElementById("btn-continuar");

    let opcionSeleccionada = null;

    const emailGuardado = localStorage.getItem("emailRecuperacion");
    
    if (emailGuardado) {
        const partes = emailGuardado.split("@");
        if (partes.length === 2) {
            const nombre = partes[0];
            const dominio = partes[1];
            const nombreOfuscado = nombre.charAt(0) + "****" + nombre.charAt(nombre.length - 1);
            userEmailText.textContent = `Te enviaremos un enlace a tu email ${nombreOfuscado}@${dominio}.`;
        }
    }

    function seleccionarOpcion(opcion) {
        cardEmail.style.border = "1px solid #e5e7eb";
        cardEmail.style.backgroundColor = "transparent";
        cardPhone.style.border = "1px solid #e5e7eb";
        cardPhone.style.backgroundColor = "transparent";

        if (opcion === 'email') {
            cardEmail.style.border = "2px solid #2563eb";
            opcionSeleccionada = 'email';
        } else if (opcion === 'phone') {
            cardPhone.style.border = "2px solid #2563eb";
            cardPhone.style.backgroundColor = "#eff6ff";
            opcionSeleccionada = 'phone';
        }

        btnContinuar.disabled = false;
        btnContinuar.style.opacity = "1";
        btnContinuar.style.cursor = "pointer";
    }

    cardEmail.addEventListener("click", () => seleccionarOpcion('email'));
    cardPhone.addEventListener("click", () => seleccionarOpcion('phone'));

    btnContinuar.addEventListener("click", () => {
        if (opcionSeleccionada === 'email') {
            window.location.href = "email-enviado.html";
        } else if (opcionSeleccionada === 'phone') {
            alert("¡Se ha enviado un SMS con el código de recuperación al teléfono registrado!");
            window.location.href = "index.html"; 
        }
    });
});