const API_URL = "http://localhost:8000/api/items";
const API_CREATOR = "http://localhost:8000/api/jimenez";


const tabla = document.getElementById("tabla");
const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const btnCrear = document.getElementById("crear");

let editando = null;

async function obtenerDatos() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTabla(data);
}

async function crearElemento() {
  const nombre = nombreInput.value.trim();
  const edad = edadInput.value.trim();

  if (!nombre || !edad) {
    alert("Completa todos los campos");
    return;
  }

  const metodo = editando ? "PUT" : "POST";
  const url = editando ? `${API_URL}/${editando}` : API_URL;

  const res = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, edad }),
  });

  if (res.ok) {
    nombreInput.value = "";
    edadInput.value = "";
    editando = null;
    obtenerDatos();
  } else {
    alert("Error al guardar los datos");
  }
}

async function eliminarElemento(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (res.ok) obtenerDatos();
}

function renderTabla(data) {
  tabla.innerHTML = "";
  data.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>${item.edad}</td>
      <td>
        <button class="btn editar" data-id="${item.id}" data-nombre="${item.nombre}" data-edad="${item.edad}">✏️</button>
        <button class="btn eliminar" data-id="${item.id}">🗑️</button>
      </td>
    `;

    tabla.appendChild(fila);
  });

  document.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const { id, nombre, edad } = e.target.dataset;
      nombreInput.value = nombre;
      edadInput.value = edad;
      editando = id;
      btnCrear.textContent = "Actualizar";
    })
  );

  document.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", (e) => eliminarElemento(e.target.dataset.id))
  );
}

const btnCreador = document.getElementById("btn-creador");
const infoCreador = document.getElementById("info-creador");

btnCreador.addEventListener("click", async () => {
  try {
    const res = await fetch(API_CREATOR);
    const data = await res.json();
    infoCreador.textContent = `Creador: ${data.nombre_completo}`;
  } catch (error) {
    infoCreador.textContent = "Error al obtener la información del creador";
  }
});

btnCrear.addEventListener("click", crearElemento);

obtenerDatos();
