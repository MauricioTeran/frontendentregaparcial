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

    if (!usuario.email || !usuario.password) {
        alert("Completa todos los campos");
        return;
    }

    console.log("Datos enviados al API Gateway:", usuario);

    fetch("https://7i866xq21k.execute-api.us-east-1.amazonaws.com/usuarios", {
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
        alert("Usuario creado con éxito en la base de datos");
        console.log("Respuesta del servidor:", data);
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        alert("Error: " + error.message);
    });
}