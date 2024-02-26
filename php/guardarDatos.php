<?php
$conn = pg_connect("host=localhost port=5432 dbname=proyecto-final user=postgres password=password");

if (!$conn) {
    die("Error al conectar a la base de datos");
}

$nombre = pg_escape_string($_POST['nombreP']);
$telefono = pg_escape_string($_POST['telefonoP']);
$correo = pg_escape_string($_POST['correoP']);
$nombreLugar = pg_escape_string($_POST['nombrelugar']);
$geomLugar = json_decode($_POST['geomLugar']);

$query = "INSERT INTO public.\"reporte\" (nombre_persona, telefono_persona, email_persona, nombre_sitio, geom) 
        VALUES ('$nombre', '$telefono', '$correo', '$nombreLugar', 
        ST_SetSRID(ST_MakePoint($geomLugar[0], $geomLugar[1]), 4326))";

$result = pg_query($conn, $query);

pg_close($conn);
?>
