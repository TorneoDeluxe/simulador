Inicio: hay 3 rutas
-Partido A
-Penales B
-Editar C

A: Partido:
Lleva al selector de equipos. Tiene que haber dos, para local y visitante. Tienen que ser iguales y se dividen en 4 partes:

1- País. Controlador con botones < > a los costados para moverse de país. Ejemplo:  < Argentina >
2- Categoría: ídem con País. Ejemplo < Primera División >
3- Lista de equipos. Parecida a la del PES 6. Filas de 5 equipos hasta llegar a la cantidad de clubes. En el hover se le tiene que mostrar en la parte 4 el nombre y la media. Al hacerle click, se lo elige.
4- Info: muestra el nombre y la media del club. Ejemplo: "River Plate - 82".

Es decir, en la PÁGINA Partido.tsx tiene que haber dos SELECTOREQUIPOS.
Al hacer clic en un equipo local, se habilitará el selector del visitante. Al hacer clic en un equipo visitante, se dirigirá a la página partido/simulacion con ambos equipos pasados como props.

Simulación: sigue la lógica de partido del componente Score. Se elige la duración del partido y si hay chances especiales, y cuántas. Con el botón de jugar, se jugará el partido. Es necesario que haya un botón para volver atrás.

B: Penales
Lleva al doble selector de equipos de la misma manera, pero al elegirlos, la página penales/simulación solo mostrará un título: "Equipo 1 vs Equipo 2". Y un botón de Jugar penales. Al hacerlo, se seguirá la lógica del componente Penalties.tsx. Aquí la media es irrelevante, no se toma en cuenta.
Al jugarse el partido, para patear cada penal habrá un setTimeout de unos segundos, para mostrar la carrera/suspenso.

C: Editar
Aquí es donde se hace el CRUD. Ver.