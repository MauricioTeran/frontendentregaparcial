document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session && session.usuario && session.usuario.nombres) {
        document.getElementById("userNombre").textContent = session.usuario.nombres;
        document.getElementById("userAvatar").textContent = session.usuario.nombres.charAt(0).toUpperCase();
    } else {
        window.location.href = "index.html";
        return; 
    }

    const inputDestino = document.getElementById('input-destino');
    const inputFechaIda = document.getElementById('input-fecha-ida');
    const selectCabina = document.getElementById('select-cabina');
    const btnBuscar = document.getElementById('btn-buscar-vuelos');
    const contenedorVuelos = document.getElementById('vuelos-container');
    const tituloResultados = document.getElementById('titulo-resultados');

    const paginationContainer = document.createElement('div');
    paginationContainer.style.display = 'flex';
    paginationContainer.style.justifyContent = 'center';
    paginationContainer.style.gap = '1rem';
    paginationContainer.style.marginTop = '2rem';
    paginationContainer.style.paddingBottom = '2rem';
    contenedorVuelos.parentNode.insertBefore(paginationContainer, contenedorVuelos.nextSibling);

    let paginaActual = 1;
    let filtrosActuales = {};

    function cargarVuelos(filtros = {}, page = 1) {
        contenedorVuelos.innerHTML = `<p style="color: white; text-align: center;">Cargando vuelos...</p>`;
        paginationContainer.innerHTML = '';
        
        const queryParams = new URLSearchParams();

        if (filtros.destino) queryParams.append("destino", filtros.destino);
        if (filtros.fecha) queryParams.append("fecha", filtros.fecha);
        
        queryParams.append("page", page);
        queryParams.append("size", 10); 

        const url = `https://7i866xq21k.execute-api.us-east-1.amazonaws.com/vuelos?${queryParams.toString()}`;
        console.log("Consultando API:", url);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Error en la API");
                return res.json();
            })
            .then(data => {
                console.log("Respuesta de AWS:", data);
                
                let listaVuelos = [];
                let hayMasPaginas = false;

                // Extraer el array del objeto paginado (Acomodado a múltiples estándares)
                if (data && data.items) {
                    listaVuelos = data.items;
                    hayMasPaginas = (data.page * data.size) < data.total;
                } else if (Array.isArray(data)) {
                    listaVuelos = data;
                    hayMasPaginas = data.length === 10; 
                }

                renderizarVuelos(listaVuelos);
                renderizarPaginacion(page, hayMasPaginas);
                
                // Título dinámico
                if (filtros.destino || filtros.fecha) {
                    tituloResultados.textContent = `Resultados filtrados`;
                } else {
                    tituloResultados.textContent = `Todos los vuelos disponibles`;
                }
            })
            .catch(error => {
                console.error("Error:", error);
                contenedorVuelos.innerHTML = `
                    <div class="no-results">
                        <h3 style="color: #ef4444;">Error al cargar los vuelos</h3>
                        <p class="text-gray">Revisa la consola (F12) o verifica tu base de datos.</p>
                    </div>`;
            });
    }

    function renderizarVuelos(resultados) {
        contenedorVuelos.innerHTML = ""; 

        if (!resultados || !Array.isArray(resultados) || resultados.length === 0) {
            contenedorVuelos.innerHTML = `
                <div class="no-results">
                    <h3>No encontramos vuelos disponibles</h3>
                    <p class="text-gray">Intenta con otros filtros o revisa los datos en PostgreSQL.</p>
                </div>
            `;
            return;
        }

        resultados.forEach(vuelo => {
            const aerolinea = vuelo.aerolinea || "ViajesAir";
            if (vuelo.fecha_salida) {
                horaSalida = vuelo.fecha_salida.split(" ")[1].substring(0, 5);
            }
            const precio = vuelo.precio_base ? vuelo.precio_base.toFixed(2) : "150.00";
            const destino = vuelo.nombre_destino || "DST";
            const horaLlegada = "10:30"; 
            const duracion = "2h 30m";
    
            const vueloString = JSON.stringify(vuelo).replace(/"/g, '&quot;');

            const card = document.createElement("div");
            card.className = "flight-card";
            card.innerHTML = `
                <div>
                    <p class="text-gray" style="font-weight: 600; margin-bottom: 0.5rem;">✈️ ${aerolinea}</p>
                    <div class="flight-times">
                        <div class="time-block">
                            <h3>${horaSalida}</h3>
                            <span class="text-gray">Lima</span>
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
                        <h3 style="color: #0d9488; font-size: 1.75rem; margin:0;">USD $${precio}</h3>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button style="background: white; border: 2px solid #0d9488; color: #0d9488; border-radius: 0.75rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600;" onclick="agregarAWishlist(${vueloString})">
                            🤍 Wishlist
                        </button>
                        <button class="btn-primary" style="width: 150px; padding: 0.5rem; height: auto;" onclick="seleccionarVuelo(${vueloString})">
                            Comprar Ticket
                        </button>
                    </div>
                </div>
            `;
            contenedorVuelos.appendChild(card);
        });
    }

    function renderizarPaginacion(paginaActual, hayMasPaginas) {
        paginationContainer.innerHTML = '';

        if (paginaActual > 1) {
            const btnAnterior = document.createElement('button');
            btnAnterior.className = 'btn-primary';
            btnAnterior.style.width = 'auto';
            btnAnterior.style.padding = '0.75rem 1.5rem';
            btnAnterior.innerText = '← Página Anterior';
            btnAnterior.onclick = () => cargarVuelos(filtrosActuales, paginaActual - 1);
            paginationContainer.appendChild(btnAnterior);
        }

        if (hayMasPaginas) {
            const btnSiguiente = document.createElement('button');
            btnSiguiente.className = 'btn-primary';
            btnSiguiente.style.width = 'auto';
            btnSiguiente.style.padding = '0.75rem 1.5rem';
            btnSiguiente.innerText = 'Página Siguiente →';
            btnSiguiente.onclick = () => cargarVuelos(filtrosActuales, paginaActual + 1);
            paginationContainer.appendChild(btnSiguiente);
        }
    }

    cargarVuelos({}, 1);

    btnBuscar.addEventListener('click', () => {
        const destinoValue = inputDestino.value.trim();
        const fechaValue = inputFechaIda.value;

        filtrosActuales = {};
        if (destinoValue) filtrosActuales.destino = destinoValue;
        if (fechaValue) filtrosActuales.fecha = fechaValue;

        cargarVuelos(filtrosActuales, 1);
    });
});

window.seleccionarVuelo = function(datosVuelo) {
    localStorage.setItem("vueloSeleccionado", JSON.stringify(datosVuelo));
    
    const cabina = document.getElementById('select-cabina').value || "Economy";
    localStorage.setItem("criteriosBusqueda", JSON.stringify({
        origen: "Lima",
        destino: datosVuelo.destino || "Destino",
        fechaIda: datosVuelo.fecha || document.getElementById('input-fecha-ida').value || "Pendiente",
        cabina: cabina,
        pasajeros: 1
    }));
    
    window.location.href = "reserva.html"; 
};

window.agregarAWishlist = function(datosVuelo) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    const yaExiste = wishlist.find(vuelo => vuelo.id_vuelo === datosVuelo.id_vuelo);
    
    if (yaExiste) {
        alert("⚠️ Este vuelo ya está en tu Wishlist.");
        return;
    }

    wishlist.push(datosVuelo);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    alert("✅ ¡Vuelo agregado a tu Wishlist correctamente!");
};

window.cerrarSesion = function() {
    const confirmar = confirm("¿Estás seguro que deseas cerrar sesión?");
    if (confirmar) {
        localStorage.removeItem("session");
        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("criteriosBusqueda");
        
        window.location.href = "index.html";
    }
};