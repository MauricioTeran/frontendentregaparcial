document.addEventListener("DOMContentLoaded", () => {
    const btnReenviar = document.getElementById("btn-reenviar");
    const emailSentText = document.getElementById("email-sent-text");

    const emailRecuperacion = localStorage.getItem("emailRecuperacion");
    
    if (emailRecuperacion) {
        const partes = emailRecuperacion.split("@");
        if (partes.length === 2) {
            const nombre = partes[0];
            const dominio = partes[1];
            const nombreOfuscado = nombre.charAt(0) + "****" + nombre.charAt(nombre.length - 1);
            emailSentText.textContent = `Te enviamos el enlace a ${nombreOfuscado}@${dominio} para que puedas crear tu nueva contraseña.`;
        }
    }

    let tiempoRestante = 298;
    let temporizador;

    function iniciarTemporizador() {
        btnReenviar.disabled = true;
        btnReenviar.className = "btn-disabled";

        temporizador = setInterval(() => {
            const minutos = Math.floor(tiempoRestante / 60);
            let segundos = tiempoRestante % 60;
            
            segundos = segundos < 10 ? "0" + segundos : segundos;

            if (tiempoRestante > 0) {
                btnReenviar.textContent = `Reenviar enlace en ${minutos}:${segundos}`;
                tiempoRestante--;
            } else {
                clearInterval(temporizador);
                btnReenviar.textContent = "Reenviar enlace ahora";
                btnReenviar.className = "btn-primary"; 
                btnReenviar.disabled = false;
                btnReenviar.style.cursor = "pointer";
            }
        }, 1000);
    }

    btnReenviar.addEventListener("click", () => {
        alert("¡Finta exitosa! Un nuevo enlace de recuperación ha sido enviado a tu correo.");
        
        tiempoRestante = 300; 
        iniciarTemporizador();
    });

    iniciarTemporizador();
});