document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar sesión
    const session = JSON.parse(localStorage.getItem("session"));
    if (session && session.usuario && session.usuario.nombres) {
        document.getElementById("userNombre").textContent = session.usuario.nombres;
        document.getElementById("userAvatar").textContent = session.usuario.nombres.charAt(0).toUpperCase();
        
        document.getElementById("titular-nombres").value = session.usuario.nombres;
        document.getElementById("titular-apellidos").value = session.usuario.apellidos || "";
    } else {
        window.location.href = "index.html";
        return;
    }

    // 2. Cargar datos del vuelo
    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const criterios = JSON.parse(localStorage.getItem("criteriosBusqueda"));

    if (!vuelo || !criterios) {
        alert("No hay ningún vuelo seleccionado. Redirigiendo al inicio...");
        window.location.href = "home.html";
        return;
    }

    // 3. Extraer los datos CORRECTOS de la base de datos (PostgreSQL / FastAPI)
    const precioNumerico = parseFloat(vuelo.precio_base || 150.00);
    const destinoReal = vuelo.nombre_destino || "Destino Desconocido";
    
    // Sacar solo la fecha de "2026-05-12 19:39:56"
    let fechaReal = "Pendiente";
    if (vuelo.fecha_salida) {
        fechaReal = vuelo.fecha_salida.split(" ")[0]; 
    }

    const pasajeros = parseInt(criterios.pasajeros || 1);
    const impuestos = 25.00;
    const total = (precioNumerico * pasajeros) + impuestos;

    // 4. Pintar en el HTML
    document.getElementById("resumen-ruta").textContent = `Lima ➔ ${destinoReal}`;
    document.getElementById("resumen-vuelo").textContent = `${fechaReal} • ${vuelo.aerolinea || 'ViajesAir'} • Cabina ${criterios.cabina || 'Economy'}`;
    
    document.getElementById("resumen-pasajeros").textContent = pasajeros;
    document.getElementById("resumen-precio-unitario").textContent = `$${precioNumerico.toFixed(2)}`;
    document.getElementById("resumen-total").textContent = `USD $${total.toFixed(2)}`;
});

function confirmarReserva() {
    const btnPagar = document.getElementById("btn-pagar");
    btnPagar.disabled = true;
    btnPagar.textContent = "Procesando pago...";

    // 1. PRIMERO obtenemos las variables (¡Si lo hacemos después, da error!)
    const session = JSON.parse(localStorage.getItem("session"));
    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const criterios = JSON.parse(localStorage.getItem("criteriosBusqueda"));

    // 2. LUEGO calculamos el total usando precio_base
    const precioNumerico = parseFloat(vuelo.precio_base || 150.00);
    const pasajeros = parseInt(criterios.pasajeros || 1);
    const totalPagar = (precioNumerico * pasajeros) + 25.00;

    // 3. Armamos el payload con los nombres exactos para Node.js y MongoDB
    const payloadReserva = {
        id_usuario: session.usuario.id || 1, 
        id_vuelo: vuelo.id_vuelo,             
        precio_total: totalPagar,             
        asiento: "1A"                         
    };

    console.log("Enviando reserva al backend:", payloadReserva);

    // 4. Enviamos a la API
    fetch("https://7i866xq21k.execute-api.us-east-1.amazonaws.com/reservas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadReserva)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Error al procesar la reserva");
        return data;
    })
    .then(data => {
        alert("¡Pago exitoso! Tu reserva ha sido confirmada.");
        
        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("criteriosBusqueda");

        window.location.href = "home.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema procesando el pago. Intenta nuevamente.");
        btnPagar.disabled = false;
        btnPagar.textContent = "Confirmar y Pagar";
    });
}