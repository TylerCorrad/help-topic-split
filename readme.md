# Plugin: help-topic-split
Este plugin para osTicket tiene como objetivo dividir el menú desplegable de selección de temas de ayuda en 2: Uno para categorias de primer nivel y otro para subcategorias. Esto permite al usuario visualizar de mejor manera los temas de ayuda y evita congestión visual. 
El plugin inyecta código css y JavaScript a las plantillas php del sistema, por lo que requiere modificar el core del mismo de manera mínima.

---

<<<<<<< HEAD

## Compatibilidad
Este plugin es compátible con la versión 1.18 de osTicket, si va a implementarlo en otras verciones tenga precaución.

---

## Instalación
Para implementar este plugin siga los siguientes pasos:
=======
## Compatibilidad
Este plugin es compátible con la versión 1.18 de osTicket, si va a implementarlo en otras versiones hagalo con precaución.

---
## Instalación 
Para implementar este plugin en su instancia de osTicket siga los siguientes pasos:
>>>>>>> 8287adc18efda9f0f315e667eaa10dc0d11d459f

### Paso 1:
descargue este proyecto y muevalo a la carpeta /include/plugins dentro de su instancia de osTicket

### Paso 2
Ubique la carpeta del proyecto en el directorio /inlude/plugins de su instancia de osTicket.

### Paso 3
Modifique el archivo **header.inc.php** en las carpetas */include/client/* e */include/staff/* y agregue las siguientes lineas dentro de la etiqueta *head*.

<!--CSS plugin-->
    <link rel="stylesheet" href="<?php echo ROOT_PATH; ?>include/plugins/help-topic-split/assets/css/help-topic-split.css" media="screen"/>
<!--JS plugin-->
<<<<<<< HEAD
    <script type= "text/javascript" src="<?php echo ROOT_PATH; ?>include/plugins/help-topic-split/assets/js/help-topic-split.js"></script>
---
### Paso 3:
Esto hará que el plugin quede conectado directamente a los archivos del sistema, por lo que no requiere configuración mayor. Si desea que el plugin deje de funcionar, simplemente elimine las lineas antreriormente agregadas del código fuente
=======
    <scrip type= "text/javascript" src="<?php echo ROOT_PATH; ?>include/plugins/help-topic-split/assets/js/help-topic-split.js"></scrip
### Paso 4
<<<<<<< HEAD
Seleccione el plugin llamado *"help topic split"*. El plugin estará habilitado de manera inmediata, no importa si lo habilita o no.
>>>>>>> 8287adc18efda9f0f315e667eaa10dc0d11d459f
=======
En el panel de administrador de osTicket vaya al apartado **Administrar>Plugins** y haga click sobre *"Añadir nuevo Plugin"*.

### Paso 5
Seleccione el plugin llamado *"help topic split"*. El plugin estará habilitado de manera inmediata, no importa si lo habilita o no.
>>>>>>> parent of 8287adc (readme modificado)
