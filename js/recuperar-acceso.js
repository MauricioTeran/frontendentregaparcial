document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("tipo-identificacion");
    const input = document.getElementById("input-identificacion");
    const btnContinuar = document.getElementById("btn-continuar");

    select.addEventListener("change", () => {
        if (select.value === "telefono") {
            input.type = "tel";
            input.placeholder = "Ingresa tu número de teléfono";
            input.value = "";
        } else {
            input.type = "email";
            input.placeholder = "Ingresa un email";
            input.value = "";
        }
    });

    btnContinuar.addEventListener("click", () => {
        const valorIngresado = input.value.trim();

        if (!valorIngresado) {
            alert("Por favor, ingresa tu dato de identificación.");
            return;
        }

        if (select.value === "email") {
            localStorage.setItem("emailRecuperacion", valorIngresado);
            window.location.href = "email-enviado.html";
        } else {
            alert("Se ha enviado un código SMS al número: " + valorIngresado);
            window.location.href = "index.html"; 
        }
    });
});