// REEMPLAZA ESTO por la nueva URL que te dé Render para este proyecto (+ /tareas)
const API_URL = "https://tu-nuevo-proyecto-backend.onrender.com/tareas";

// Función para traer y mostrar las tareas
async function obtenerTareas() {
  try {
    const res = await fetch(API_URL);
    const tareas = await res.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar lista
    
    tareas.forEach(t => {
      lista.innerHTML += `
        <li class="${t.prioridad}">
          <span><strong>${t.titulo}</strong></span>
          <small>⚠️ ${t.prioridad}</small>
        </li>
      `;
    });
  } catch (err) {
    console.error("Error al cargar tareas:", err);
  }
}

// Función para enviar una nueva tarea
document.getElementById("formTarea").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaTarea = {
    titulo: document.getElementById("titulo").value,
    prioridad: document.getElementById("prioridad").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaTarea)
    });

    if (res.ok) {
      document.getElementById("formTarea").reset();
      obtenerTareas(); // Recargar la lista automáticamente
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  }
});

// Cargar al iniciar la página
obtenerTareas();