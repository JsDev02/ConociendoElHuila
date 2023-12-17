<?php
// Conectarse a la base de datos PostgreSQL (reemplaza con tus credenciales)
$conn = pg_connect("host=localhost port=5432 dbname=proyecto-final user=postgres password=1590");

// Verificar la conexión
if (!$conn) {
    die("Error de conexión: " . pg_last_error());
}

// Consulta SQL para obtener todos los datos de la tabla reporte
$sql = "SELECT * FROM reporte";
$result = pg_query($conn, $sql);

// Construir la tabla HTML con los datos obtenidos
if ($result) {
    echo "<div class='table-responsive'>";
    echo "<table class='table table-bordered'>";
    echo "<thead class='thead-dark'>";
    echo "<tr><th>Nombre Persona</th><th>Teléfono Persona</th><th>Email Persona</th><th>Nombre Sitio</th><th>Geom</th></tr>";
    echo "</thead>";
    echo "<tbody>";

    // Mostrar los datos de cada fila
    while ($row = pg_fetch_assoc($result)) {
        echo "<tr>";
        echo "<td>" . $row["nombre_persona"] . "</td>";
        echo "<td>" . $row["telefono_persona"] . "</td>";
        echo "<td>" . $row["email_persona"] . "</td>";
        echo "<td>" . $row["nombre_sitio"] . "</td>";
        echo "<td>" . $row["geom"] . "</td>";
        echo "</tr>";
    }

    echo "</tbody>";
    echo "</table>";
    echo "</div>";
} else {
    echo "<p class='text-center'>No se encontraron resultados en la tabla reporte.</p>";
}


// Cerrar la conexión a la base de datos
pg_close($conn);
?>
