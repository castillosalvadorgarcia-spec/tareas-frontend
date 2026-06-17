// URL de tu proyecto en Render
const API_URL = "https://tareas-backend-i1pv.onrender.com/tareas";

// Función para traer y mostrar las tareas (Ahora incluye el botón de eliminar)
async function obtenerTareas() {
  try {
    const res = await fetch(API_URL);
    const tareas = await res.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar lista
    
    tareas.forEach(t => {
      // Agregamos estilos CSS en línea para que el texto y el botón queden alineados a los extremos
      lista.innerHTML += `
        <li class="${t.prioridad}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <span><strong>${t.titulo}</strong></span>
            <br>
            <small>⚠️ ${t.prioridad}</small>
          </div>
          
          <button onclick="eliminarTarea('${t._id}')" style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
            🗑️ Borrar
          </button>
        </li>
      `;
    });
  } catch (err) {
    console.error("Error al cargar tareas:", err);
  }
}

// NUEVA FUNCIÓN: Se ejecuta al presionar el botón "Borrar" y hace la petición DELETE a Render
async function eliminarTarea(id) {
  const confirmar = confirm("¿De verdad quieres eliminar esta tarea de la lista?");
  if (!confirmar) return; // Si el usuario da clic en cancelar, no pasa nada

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("¡Tarea eliminada exitosamente!");
      obtenerTareas(); // Recarga la lista en pantalla automáticamente sin recargar toda la página
    } else {
      alert("Error: No se pudo borrar la tarea.");
    }
  } catch (err) {
    console.error("Error al intentar eliminar la tarea:", err);
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