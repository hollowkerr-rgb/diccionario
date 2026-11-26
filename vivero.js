// =====================================================
// SISTEMA DE GESTIÓN DE UN VIVERO - GRUPO 9
// Diccionario: plantas (clave = código de planta)
// Arreglo: pedidos (códigos de plantas solicitadas)
// =====================================================

// Diccionario: cada clave es el código de la planta (texto, por si empieza con cero)
const plantas = {};

// Arreglo: guarda SOLO claves que existen en el diccionario
let pedidos = [];

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

// Pide un texto y lo devuelve sin espacios extra. Si cancela, devuelve ""
function leerTexto(mensaje, valorInicial) {
    let entrada = prompt(mensaje, valorInicial === undefined ? "" : valorInicial);
    if (entrada === null) {
        return "";
    }
    return entrada.trim();
}

// Pide un número. Devuelve null si el valor es inválido
function leerNumero(mensaje, nombreCampo, valorInicial, soloEnteros) {
    let texto = leerTexto(mensaje, valorInicial);
    if (texto === "") {
        alert("El campo " + nombreCampo + " no puede estar vacío.");
        return null;
    }
    let numero = Number(texto);
    if (isNaN(numero) || numero < 0) {
        alert("El campo " + nombreCampo + " debe ser un número válido mayor o igual a 0.");
        return null;
    }
    if (soloEnteros && !Number.isInteger(numero)) {
        alert("El campo " + nombreCampo + " debe ser un número entero.");
        return null;
    }
    return numero;
}

// Pide si la planta está activa. Devuelve true, false o null si es inválido
function leerEstado(valorInicial) {
    let texto = leerTexto("Estado activo (si / no):", valorInicial).toLowerCase();
    if (texto === "si" || texto === "sí" || texto === "true") {
        return true;
    }
    if (texto === "no" || texto === "false") {
        return false;
    }
    alert("Estado inválido. Escriba 'si' o 'no'.");
    return null;
}

function textoEstado(estado) {
    return estado ? "Activa" : "Inactiva";
}

function textoEstadoInput(estado) {
    return estado ? "si" : "no";
}

// Pide los 5 atributos (menos la clave). Devuelve el objeto o null si algo es inválido.
// Si recibe una ficha actual, la muestra como valor sugerido (para editar).
function pedirDatosPlanta(actual) {
    let especie = leerTexto("Especie:", actual ? actual.especie : "");
    if (especie === "") {
        alert("La especie no puede estar vacía.");
        return null;
    }

    let nombreComun = leerTexto("Nombre común:", actual ? actual.nombreComun : "");
    if (nombreComun === "") {
        alert("El nombre común no puede estar vacío.");
        return null;
    }

    let precio = leerNumero("Precio (USD):", "precio", actual ? actual.precio : "", false);
    if (precio === null) {
        return null;
    }

    let cantidad = leerNumero("Cantidad disponible:", "cantidad disponible", actual ? actual.cantidad : "", true);
    if (cantidad === null) {
        return null;
    }

    let estado = leerEstado(actual ? textoEstadoInput(actual.estado) : "");
    if (estado === null) {
        return null;
    }

    return {
        especie: especie,
        nombreComun: nombreComun,
        precio: precio,
        cantidad: cantidad,
        estado: estado
    };
}

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================
function principal() {
    let opcion = -1;

    while (opcion !== 0) {
        let entrada = prompt(
            "MENÚ PRINCIPAL - VIVERO\n" +
            "1. Gestionar diccionario (plantas)\n" +
            "2. Gestionar arreglo (pedidos)\n" +
            "0. Salir"
        );
        opcion = (entrada === null) ? 0 : Number(entrada);

        switch (opcion) {
            case 1:
                gestionarDiccionario();
                break;
            case 2:
                gestionarArreglo();
                break;
            case 0:
                alert("Programa finalizado");
                break;
            default:
                alert("Opción inválida. Elija 1, 2 o 0.");
        }
    }
}

// =====================================================
// PARTE 1: CRUD DEL DICCIONARIO
// =====================================================
function gestionarDiccionario() {
    let opcion = -1;

    while (opcion !== 0) {
        let entrada = prompt(
            "GESTIÓN DEL DICCIONARIO\n" +
            "1. Registrar\n" +
            "2. Consultar\n" +
            "3. Listar\n" +
            "4. Editar\n" +
            "5. Eliminar\n" +
            "0. Regresar"
        );
        opcion = (entrada === null) ? 0 : Number(entrada);

        switch (opcion) {
            case 1:
                registrarPlanta();
                break;
            case 2:
                consultarPlanta();
                break;
            case 3:
                listarPlantas();
                break;
            case 4:
                editarPlanta();
                break;
            case 5:
                eliminarPlanta();
                break;
            case 0:
                break;
            default:
                alert("Opción inválida. Elija una opción del 0 al 5.");
        }
    }
}

function registrarPlanta() {
    let codigo = leerTexto("Código de la planta:");
    if (codigo === "") {
        alert("El código no puede estar vacío.");
        return;
    }
    if (plantas[codigo] !== undefined) {
        alert("La clave ya se encuentra registrada.");
        return;
    }

    let datos = pedirDatosPlanta(null);
    if (datos === null) {
        return;
    }

    plantas[codigo] = datos;
    alert("Planta registrada correctamente: " + datos.nombreComun);
}

function consultarPlanta() {
    let codigo = leerTexto("Código de la planta a consultar:");
    if (codigo === "") {
        alert("El código no puede estar vacío.");
        return;
    }
    if (plantas[codigo] === undefined) {
        alert("Registro no encontrado.");
        return;
    }

    let planta = plantas[codigo];
    alert(
        "Código: " + codigo + "\n" +
        "Especie: " + planta.especie + "\n" +
        "Nombre común: " + planta.nombreComun + "\n" +
        "Precio: $" + planta.precio + "\n" +
        "Cantidad disponible: " + planta.cantidad + "\n" +
        "Estado: " + textoEstado(planta.estado)
    );
}

function listarPlantas() {
    let claves = Object.keys(plantas);

    if (claves.length === 0) {
        alert("No hay plantas registradas.");
        return;
    }

    let listado = "LISTADO DE PLANTAS\n";
    for (let i = 0; i < claves.length; i++) {
        let clave = claves[i];
        let planta = plantas[clave];
        listado += clave + " - " + planta.nombreComun + " (" + planta.especie + ") - $" + planta.precio + "\n";
    }
    alert(listado);
}

function editarPlanta() {
    let codigo = leerTexto("Código de la planta a editar:");
    if (codigo === "") {
        alert("El código no puede estar vacío.");
        return;
    }
    if (plantas[codigo] === undefined) {
        alert("Registro no encontrado.");
        return;
    }

    // La clave se conserva; se piden los 5 atributos con el valor actual como sugerencia
    let datos = pedirDatosPlanta(plantas[codigo]);
    if (datos === null) {
        return;
    }

    plantas[codigo] = datos;
    alert("Planta editada correctamente.");
}

function eliminarPlanta() {
    let codigo = leerTexto("Código de la planta a eliminar:");
    if (codigo === "") {
        alert("El código no puede estar vacío.");
        return;
    }
    if (plantas[codigo] === undefined) {
        alert("Registro no encontrado.");
        return;
    }

    delete plantas[codigo];

    // Si la clave estaba en pedidos, se quita para no dejar claves inexistentes
    let quitados = 0;
    for (let i = pedidos.length - 1; i >= 0; i--) {
        if (pedidos[i] === codigo) {
            pedidos.splice(i, 1);
            quitados++;
        }
    }

    let mensaje = "Planta eliminada correctamente.";
    if (quitados > 0) {
        mensaje += "\nTambién se quitó " + quitados + " vez(veces) de la lista de pedidos.";
    }
    alert(mensaje);
}

// =====================================================
// PARTE 2: CRUD DEL ARREGLO (PEDIDOS)
// =====================================================
function gestionarArreglo() {
    let opcion = -1;

    while (opcion !== 0) {
        let entrada = prompt(
            "GESTIÓN DEL ARREGLO (PEDIDOS)\n" +
            "1. Agregar\n" +
            "2. Listar\n" +
            "3. Editar\n" +
            "4. Eliminar\n" +
            "0. Regresar"
        );
        opcion = (entrada === null) ? 0 : Number(entrada);

        switch (opcion) {
            case 1:
                agregarPedido();
                break;
            case 2:
                listarPedidos();
                break;
            case 3:
                editarPedido();
                break;
            case 4:
                eliminarPedido();
                break;
            case 0:
                break;
            default:
                alert("Opción inválida. Elija una opción del 0 al 4.");
        }
    }
}

function agregarPedido() {
    let codigo = leerTexto("Ingrese el código de la planta:");
    if (codigo === "") {
        alert("El código no puede estar vacío.");
        return;
    }
    if (plantas[codigo] === undefined) {
        alert("Primero debe registrar esa clave en el diccionario.");
        return;
    }

    pedidos.push(codigo);
    alert(plantas[codigo].nombreComun + " fue agregada correctamente al pedido.");
}

function listarPedidos() {
    if (pedidos.length === 0) {
        alert("El arreglo de pedidos está vacío.");
        return;
    }

    let listado = "PLANTAS SOLICITADAS\n";
    for (let i = 0; i < pedidos.length; i++) {
        let clave = pedidos[i];
        let planta = plantas[clave];
        listado += (i + 1) + ". " + clave + " - " + planta.nombreComun + " (" + planta.especie + ")\n";
    }
    alert(listado);
}

// Devuelve la posición (1..n) elegida por el usuario o null si es inválida
function pedirPosicion(accion) {
    let posicion = leerNumero("Ingrese la posición que desea " + accion + ":", "posición", "", true);
    if (posicion === null) {
        return null;
    }
    if (posicion < 1 || posicion > pedidos.length) {
        alert("La posición " + posicion + " no existe.");
        return null;
    }
    return posicion;
}

function editarPedido() {
    if (pedidos.length === 0) {
        alert("El arreglo de pedidos está vacío.");
        return;
    }

    listarPedidos();
    let posicion = pedirPosicion("modificar");
    if (posicion === null) {
        return;
    }
    let indice = posicion - 1;

    let nuevaClave = leerTexto("Ingrese la nueva clave:");
    if (nuevaClave === "") {
        alert("La clave no puede estar vacía.");
        return;
    }
    if (plantas[nuevaClave] === undefined) {
        alert("Primero debe registrar esa clave en el diccionario.");
        return;
    }

    pedidos[indice] = nuevaClave;
    alert("Elemento actualizado: " + plantas[nuevaClave].nombreComun);
}

function eliminarPedido() {
    if (pedidos.length === 0) {
        alert("El arreglo de pedidos está vacío.");
        return;
    }

    listarPedidos();
    let posicion = pedirPosicion("eliminar");
    if (posicion === null) {
        return;
    }
    let indice = posicion - 1;

    let clave = pedidos[indice];
    let nombre = plantas[clave].nombreComun;
    pedidos.splice(indice, 1);
    alert(nombre + " fue eliminada del pedido.");
}
