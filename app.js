const API_URL = "https://tareas-backend-i1pv.onrender.com/tareas";

// Variables globales para controlar si estamos editando
let modoEdicion = false;
let idTareaAEditar = null;

// READ: Traer y mostrar las tareas
async function obtenerTareas() {
  try {
    const res = await fetch(API_URL);
    const tareas = await res.json();
    
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; 
    
    tareas.forEach(t => {
      lista.innerHTML += `
        <li class="${t.prioridad}" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px;">
          <div>
            <span><strong>${t.titulo}</strong></span>
            <br>
            <small>⚠️ ${t.prioridad}</small>
          </div>
          
          <div style="display: flex; gap: 5px;">
            <button onclick="prepararEdicion('${t._id}', '${t.titulo}', '${t.prioridad}')" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
              ✏️ Editar
            </button>
            
            <button onclick="eliminarTarea('${t._id}')" style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
              🗑️ Borrar
            </button>
          </div>
        </li>
      `;
    });
  } catch (err) {
    console.error("Error al cargar tareas:", err);
  }
}

// Función para poner los datos de la tarea en el formulario y activar la edición
function prepararEdicion(id, titulo, prioridad) {
  document.getElementById("titulo").value = titulo;
  document.getElementById("prioridad").value = prioridad;
  
  // Cambiamos el texto del botón del formulario para avisar al usuario
  const botonFormulario = document.querySelector("#formTarea button");
  if (botonFormulario) botonFormulario.innerText = "💾 Guardar Cambios";
  
  modoEdicion = true;
  idTareaAEditar = id;
}

// CREATE / UPDATE: Manejar el envío del formulario
document.getElementById("formTarea").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosTarea = {
    titulo: document.getElementById("titulo").value,
    prioridad: document.getElementById("prioridad").value
  };

  try {
    let res;
    
    if (modoEdicion) {
      // Si estamos editando, hacemos un PUT (UPDATE)
      res = await fetch(`${API_URL}/${idTareaAEditar}`, {
        method: "MODELO_HTTP_PUT", // Cambiar por PUT si usas minúsculas en tu mente, pero formalmente: "PUT"
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTarea)
      });
      
      // Resetear estados de edición
      modoEdicion = false;
      idTareaAEditar = null;
      const botonFormulario = document.querySelector("#formTarea button");
      if (botonFormulario) botonFormulario.innerText = "Agregar Tarea";
      
    } else {
      // Si no estamos editando, hacemos un POST (CREATE)
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTarea)
      });
    }

    if (res.ok) {
      document.getElementById("formTarea").reset();
      obtenerTareas(); // Recargar la lista
    }
  } catch (err) {
    console.error("Error al procesar la tarea:", err);
  }
});

// DELETE: Eliminar una tarea de la base de datos
async function eliminarTarea(id) {
  const confirmar = confirm("¿De verdad quieres eliminar esta tarea?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      obtenerTareas(); 
    }
  } catch (err) {
    console.error("Error al eliminar la tarea:", err);
  }
}

// Inicializar la app
obtenerTareas();