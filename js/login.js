function login() {
    const email = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Por favor, ingresa tu usuario y contraseña.");
        return;
    }

    console.log("Intentando iniciar sesión con:", email);

    fetch("https://7i866xq21k.execute-api.us-east-1.amazonaws.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Usuario o contraseña incorrectos");
        }

        return data;
    })
    .then(data => {
        console.log("Login OK:", data);

        localStorage.setItem("session", JSON.stringify(data));
        
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        
        if (data.usuario) {
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
        } else {
            localStorage.setItem("usuario", JSON.stringify(data));
        }

        window.location.href = "home.html";
    })
    .catch(error => {
        console.error("Error en petición:", error);
        alert("Error al iniciar sesión: " + error.message);
    });
}