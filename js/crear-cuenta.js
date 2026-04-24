function crearUsuario() {
    const usuario = {
        pais: document.getElementById("pais").value,
        tipoDocumento: document.getElementById("tipoDocumento").value,
        numeroDocumento: document.getElementById("numeroDocumento").value,
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    // 🔒 Validación básica
    if (!usuario.email || !usuario.password) {
        alert("Completa todos los campos");
        return;
    }

    console.log("Datos enviados:", usuario);

    // ============================
    // 🟢 MODO SIN BACKEND (ACTIVO) cuando haya backend solo comentar esto
    // ============================

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Usuario creado con éxito (modo local)");

    window.location.href = "index.html";


    // ============================
    // 🔵 MODO CON BACKEND (FUTURO) descomentar esto y comentar lo de arriba, lo de arriba es solo para que el frontend pueda correr sin necesidad de una bd
    // ============================
    /*
    fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Error en el servidor");
        }

        return data;
    })
    .then(data => {
        alert("Usuario creado con éxito");
        console.log(data);
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error: " + error.message);
    });
    */
}