document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session && session.usuario && session.usuario.nombres) {
        const nombre = session.usuario.nombres;
        document.getElementById("userNombre").textContent = nombre;
        document.getElementById("userAvatar").textContent = nombre.charAt(0).toUpperCase();
    } else {
        window.location.href = "index.html";
        return;
    }

    const criterios = JSON.parse(localStorage.getItem("criteriosBusqueda"));
    const resultados = JSON.parse(localStorage.getItem("resultadosBusqueda"));
    
    if (criterios) {
        document.getElementById("resumen-ruta").textContent = `${criterios.origen} ➔ ${criterios.destino}`;
        document.getElementById("resumen-detalles").textContent = `${criterios.fechaIda} • ${criterios.pasajeros} Pasajeros • Cabina ${criterios.cabina}`;
    }

    const contenedor = document.getElementById("vuelos-container");
    contenedor.innerHTML = "";

    if (!resultados || resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="no-results">
                <h3>No encontramos vuelos para esta ruta</h3>
                <p class="text-gray">Intenta buscar con otras fechas o destinos.</p>
            </div>
        `;
        return;
    }

    resultados.forEach(vuelo => {
        const aerolinea = vuelo.aerolinea || "ViajesAir";
        const horaSalida = vuelo.hora_salida || "08:00";
        const horaLlegada = vuelo.hora_llegada || "10:30";
        const precio = vuelo.precio || "150.00";
        const duracion = vuelo.duracion || "2h 30m";
        const origen = vuelo.origen || criterios.origen || "ORG";
        const destino = vuelo.destino || criterios.destino || "DST";
        
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
            <div class="flight-price" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <div>
                    <p class="text-gray">Precio por pasajero</p>
                    <h3>USD $${precio}</h3>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button style="background: white; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; color: #374151;" onclick="toggleWishlist(${vueloString})">
                        Guardar
                    </button>
                    <button class="btn-primary" style="width: 120px; padding: 0.5rem 1rem; height: auto;" onclick="seleccionarVuelo(${vueloString})">
                        Seleccionar
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(card);
    });
});

function seleccionarVuelo(datosVuelo) {
    localStorage.setItem("vueloSeleccionado", JSON.stringify(datosVuelo));
    window.location.href = "reserva.html"; 
}

function toggleWishlist(datosVuelo) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    const index = wishlist.findIndex(v => v.id === datosVuelo.id && v.hora_salida === datosVuelo.hora_salida);
    
    if (index === -1) {
        wishlist.push(datosVuelo);
        alert("¡Vuelo agregado a tu lista de deseos!");
    } else {
        wishlist.splice(index, 1);
        alert("Vuelo removido de tu lista de deseos");
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}