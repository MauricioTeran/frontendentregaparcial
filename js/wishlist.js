document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session && session.usuario && session.usuario.nombres) {
        document.getElementById("userNombre").textContent = session.usuario.nombres;
        document.getElementById("userAvatar").textContent = session.usuario.nombres.charAt(0).toUpperCase();
    } else {
        window.location.href = "index.html";
        return;
    }

    renderWishlist();
});

function renderWishlist() {
    const contenedor = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    contenedor.innerHTML = "";

    if (wishlist.length === 0) {
        contenedor.innerHTML = `
            <div class="no-results">
                <h3 style="font-size: 1.5rem; color: #374151;">Tu lista está vacía ✈️</h3>
                <p class="text-gray" style="margin-top: 1rem; margin-bottom: 2rem;">Aún no has guardado ningún vuelo.</p>
                <a href="home.html" class="btn-primary" style="text-decoration: none; padding: 1rem 2rem; display: inline-block; width: auto;">Buscar Vuelos</a>
            </div>
        `;
        return;
    }

    wishlist.forEach((vuelo, index) => {
        const aerolinea = vuelo.aerolinea || "ViajesAir";
        
        // CORRECCIÓN 1: Declarar horaSalida con let y su valor por defecto
        let horaSalida = "08:00";
        if (vuelo.fecha_salida) {
            horaSalida = vuelo.fecha_salida.split(" ")[1].substring(0, 5);
        }
        
        const precio = vuelo.precio_base ? vuelo.precio_base.toFixed(2) : "150.00";
        const destino = vuelo.nombre_destino || "DST";
        const horaLlegada = "10:30"; 
        const duracion = "2h 30m";
        
        // CORRECCIÓN 2: Agregar la variable origen que falta
        const origen = "Lima"; 

        const vueloString = JSON.stringify(vuelo).replace(/"/g, '&quot;');

        const card = document.createElement("div");
        card.className = "flight-card";
        
        card.innerHTML = `
            <div>
                <p class="text-gray" style="font-weight: 600; margin-bottom: 0.5rem;">✈️ ${aerolinea}</p>
                <div class="flight-times">
                    <div class="time-block">
                        <h3>${horaSalida}</h3>
                        <span class="text-gray">${origen}</span>
                    </div>
                    <div class="flight-duration">
                        <span>${duracion}</span>
                        <br>Directo
                    </div>
                    <div class="time-block">
                        <h3>${horaLlegada}</h3>
                        <span class="text-gray">${destino}</span>
                    </div>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <h3 style="color: #0d9488; margin: 0;">USD $${precio}</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <button style="background: white; border: 2px solid #ef4444; color: #ef4444; border-radius: 0.75rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600;" onclick="eliminarDeWishlist(${index})">
                        Eliminar
                    </button>
                    <button class="btn-primary" style="width: auto; padding: 0.5rem 1rem; height: auto;" onclick="comprarDesdeWishlist(${vueloString})">
                        Comprar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(card);
    });
}

function eliminarDeWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

function comprarDesdeWishlist(datosVuelo) {
    localStorage.setItem("vueloSeleccionado", JSON.stringify(datosVuelo));
    localStorage.setItem("criteriosBusqueda", JSON.stringify({
        origen: datosVuelo.origen || "ORG",
        destino: datosVuelo.destino || "DST",
        fechaIda: "Pendiente",
        cabina: "Economy",
        pasajeros: 1
    }));
    window.location.href = "reserva.html";
}