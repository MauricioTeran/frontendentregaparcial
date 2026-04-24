function login() {
    const usuarioInput = document.getElementById("usuario").value;
    const passwordInput = document.getElementById("password").value;

    console.log("Intento de login:", usuarioInput);

    // ============================
    // 🟢 MODO SIN BACKEND (ACTIVO)
    // ============================

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioGuardado) {
        alert("No existe usuario registrado");
        return;
    }

    if (
        usuarioGuardado.email === usuarioInput &&
        usuarioGuardado.password === passwordInput
    ) {
        alert("Login exitoso (modo local)");
        window.location.href = "home.html";
    } else {
        alert("Credenciales incorrectas");
    }

    // ============================
    // 🔵 MODO CON BACKEND (FUTURO)
    // ============================
    /*
    fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuarioInput,
            password: passwordInput
        })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Error en login");
        }

        return data;
    })
    .then(data => {
        alert("Login exitoso");
        console.log(data);

        // Guardar sesión
        localStorage.setItem("session", JSON.stringify(data));

        window.location.href = "home.html";
    })
    .catch(error => {
        console.error(error);
        alert("Error: " + error.message);
    });
    */
}