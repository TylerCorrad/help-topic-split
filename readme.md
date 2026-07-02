# Plugin: help-topic-split
Este plugin para osTicket tiene como objetivo dividir el menú desplegable de selección de temas de ayuda en 2: Uno para categorias de primer nivel y otro para subcategorias. Esto permite al usuario visualizar de mejor manera los temas de ayuda y evita congestión visual.

---
## Instalación
Para implementar este plugin siga los siguientes pasos:

### Paso 1:
descargue este proyecto y muevalo a la carpeta /include/plugins dentro de su instancia de osTicket

### Paso 2:
modifique los archivos de header.inc.php en las carpetas */include/client* e */include/staff/* colocando las siguientes lineas dentro del  <head> de ambos archivos:
``
<!--CSS plugin-->
    <link rel="stylesheet" href="<?php echo ROOT_PATH; ?>include/plugins/help-topic-split/assets/css/help-topic-split.css" media="screen"/>
<!--JS plugin-->
    <script type= "text/javascript" src="<?php echo ROOT_PATH; ?>include/plugins/help-topic-split/assets/js/help-topic-split.js"></script>
---
