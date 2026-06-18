// URL de tu proyecto en Render
const API_URL = "https://tareas-backend-i1pv.onrender.com/tareas";

// Variables globales para controlar el estado de edición
let modoEdicion = false;
let idTareaAEditar = null;

// READ: Traer tareas de MongoDB y mostrarlas en el HTML
async function obtenerTareas() {
  try {
    const res = await fetch(API_URL);
    const tareas = await res.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar lista antes de cargar
    
    tareas.forEach(t => {
      lista.innerHTML += `
        <li class="${t.prioridad}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          <div>
            <span><strong>${t.titulo}</strong></span>
            <br>
            <small>⚠️ ${t.prioridad}</small>
          </div>
          
          <div style="display: flex; gap: 5px;">
            <button onclick="prepararEdicion('${t._id}', '${t.titulo}', '${t.prioridad}')" style="background-color: #f39c12; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
              ✏️ Editar
            </button>
            
            <button onclick="eliminarTarea('${t._id}')" style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
              🗑️ Borrar
            </button>
          </div>
        </li>
      `;
    });

    // Si hay texto escrito en el buscador, volver a aplicar el filtro al recargar
    if (document.getElementById("buscador")) {
      filtrarTareas();
    }
  } catch (err) {
    console.error("Error al cargar tareas:", err);
  }
}

// Función para rellenar el formulario con los datos viejos y activar la edición
function prepararEdicion(id, titulo, prioridad) {
  document.getElementById("titulo").value = titulo;
  document.getElementById("prioridad").value = prioridad;
  
  // Cambiar el texto del botón del formulario
  const botonFormulario = document.querySelector("#formTarea button");
  if (botonFormulario) botonFormulario.innerText = "💾 Guardar Cambios";
  
  modoEdicion = true;
  idTareaAEditar = id;
}

// CREATE / UPDATE: Manejar el envío del formulario para agregar o editar
document.getElementById("formTarea").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosTarea = {
    titulo: document.getElementById("titulo").value,
    prioridad: document.getElementById("prioridad").value
  };

  try {
    let res;
    
    if (modoEdicion) {
      // Si estamos editando hacemos una petición PUT (UPDATE)
      res = await fetch(`${API_URL}/${idTareaAEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTarea)
      });
      
      // Resetear el estado de edición al terminar
      modoEdicion = false;
      idTareaAEditar = null;
      const botonFormulario = document.querySelector("#formTarea button");
      if (botonFormulario) botonFormulario.innerText = "Agregar Tarea";
      
    } else {
      // Si no estamos editando hacemos una petición POST (CREATE)
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTarea)
      });
    }

    if (res.ok) {
      document.getElementById("formTarea").reset();
      obtenerTareas(); // Recargar la lista automáticamente
    }
  } catch (err) {
    console.error("Error al procesar la tarea:", err);
  }
});

// DELETE: Eliminar una tarea por su ID único de MongoDB
async function eliminarTarea(id) {
  const confirmar = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      obtenerTareas(); // Recargar la lista automáticamente
    }
  } catch (err) {
    console.error("Error al eliminar la tarea:", err);
  }
}

// BUSCADOR: Filtrar las tareas en tiempo real según lo que se escriba
function filtrarTareas() {
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
  const elementosTarea = document.querySelectorAll("#lista li");

  elementosTarea.forEach(li => {
    const tituloTarea = li.querySelector("strong").innerText.toLowerCase();

    // Mostrar si coincide con la búsqueda, ocultar si no coincide
    if (tituloTarea.includes(textoBusqueda)) {
      li.style.display = "flex"; 
    } else {
      li.style.display = "none";
    }
  });
}

// Cargar las tareas al iniciar la página por primera vez
obtenerTareas();