function cambiarEstadoH1 (){
    let tomarEstado = document.getElementById("estado-actual").value
    let tomarElemento = document.getElementById("textEstado")
     
    if (tomarEstado === ""){
        tomarElemento.innerHTML = ``
    } else {
        tomarElemento.innerHTML = `<h1>Negocio ${tomarEstado}</h1>`;
    }
}
        

  
      
        document.addEventListener("DOMContentLoaded", function () {
        const vehiculoSelect = document.getElementById("vehiculo");
        const dpaTitularGroup = document.getElementById("dpa-titular-group");
        const dpaDuenoVehiculoGroup = document.getElementById(
          "dpa-dueno-vehiculo-group"
        );

        // Función para mostrar u ocultar los campos según la selección del vehículo
        function toggleDPAFields() {
          const selectedOption = vehiculoSelect.value;

          if (selectedOption === "NUEVO") {
            dpaTitularGroup.style.display = "block";
            dpaDuenoVehiculoGroup.style.display = "none";
          } else if (selectedOption === "USADO") {
            dpaTitularGroup.style.display = "block";
            dpaDuenoVehiculoGroup.style.display = "block";
          } else {
            dpaTitularGroup.style.display = "none";
            dpaDuenoVehiculoGroup.style.display = "none";
          }
        }

        // Agregar un event listener para el cambio en el select de VEHICULO
        vehiculoSelect.addEventListener("change", toggleDPAFields);

        // Llamada inicial para establecer la visibilidad correcta al cargar la página
        toggleDPAFields();
      });

      function toggleVisibility(elementId) {
        let element = document.getElementById(elementId);
        if (element) {
          element.classList.toggle("hidden");
        }
      }

      function saveData() {
        // Obtener el formulario
        const form = document.getElementById("dataForm");

        // Verificar si todos los campos requeridos están completos
        const requiredFields = form.querySelectorAll(
          "select[required], input[required]"
        );
        for (let field of requiredFields) {
          if (!field.value) {
            alert("Por favor, complete todos los campos requeridos.");
            return; // Detener la ejecución de la función
          }
        }

        // Asignar la fecha y hora actual al input de fecha
        const fechaInput = document.getElementById("fecha");
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Meses empiezan en 0, así que agregamos 1
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        fechaInput.value = formattedDateTime;

        //asignar validador
        const validaInput = document.getElementById("elValidador").value;
        const validaOuput = document.getElementById("validador");
        validaOuput.value = validaInput;

        // Asignar una clave única de 6 caracteres al campo key
        const keyInput = document.getElementById("key");
        keyInput.value = generateUniqueKey(6);

        // Crear un objeto FormData basado en el formulario
        const formData = new FormData(form);

        // Inicializar un array para los datos
        const data = [];

        // Recorrer y almacenar los datos del formulario
        formData.forEach((value) => {
          data.push(value);
        });

        // Enviar los datos a Google Apps Script
        google.script.run.addData(data);

        // Mostrar una alerta al usuario
        alert("Datos guardados.");

        // Resetear el formulario
        form.reset();
      }

      // Función para generar una clave única de longitud especificada
      function generateUniqueKey(length) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      }

      function displayResults(data) {
        const resultDiv = document.getElementById("searchResults");
        resultDiv.innerHTML = "";
        if (data.rows.length === 0) {
          resultDiv.innerHTML = "No se encontraron datos.";
        } else {
          const table = document.createElement("table");
          const headerRow = document.createElement("tr");
          data.headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
          });
          table.appendChild(headerRow);

          data.rows.forEach((row) => {
            const rowElement = document.createElement("tr");
            row.forEach((cell) => {
              const td = document.createElement("td");
              td.textContent = cell;
              rowElement.appendChild(td);
            });
            rowElement.onclick = function () {
              loadForm(row);
            };
            table.appendChild(rowElement);
          });
          resultDiv.appendChild(table);
        }
      }

      function loadForm(data) {
        const form = document.getElementById("dataForm");
        const formData = new FormData(form);
        let i = 0;
        formData.forEach((value, key) => {
          if (key === "options") {
            const selectedValues = data[i].split(", ");
            document
              .querySelectorAll('input[name="options"]')
              .forEach((option) => {
                option.checked = selectedValues.includes(option.value);
              });
          } else {
            form.elements[key].value = data[i];
          }
          i++;
        });
      }
