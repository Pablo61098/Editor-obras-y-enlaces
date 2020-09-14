# Editor-obras-y-enlaces  
Editor de obras y enlaces de la aplicacion Museo Virtual para la Universidad de Cuenca

* Indicaciones para uso...\n
  Este repositorio hace es parte del proyecto del Museo Virtual para la Universidad de Cuenca, Faultad de Artes.
  Su implementacion debe ser como complemento del proyecto PrivateFacArtes (privado).
  
  Para el funcionamiento de este proyecto en conjunto del MuseoVirtual mencionado se sigue los siguientes pasos:
  
  **Hacer fork a este repositorio**  
  **Correr:**  
      -$ npm install  
  **Para ajustar la altura del componente se recomienda insertar esta linea:**  
      parent.style.position = 'static';  
  **por la linea número 144 del archivo que se puede encontrar en:**  
      ./node_modules/react-360-web/js/ReactInstance.js  
  **Adeḿas se debe reemplazar la línea 150 de este mismo archivo por la línea:**  
      parent.style.height = `${window.innerHeight/(1.5)}px`;  

    Una vez reemplazadas esta líneas, el tamaño del componente 360 de este editor sera 2/3 del tamaño total del viewport.  

  **Procedemos a realizar el siguiente comando:**  
      -$ npm run bundle  
    **Lo cual creará una serie de archivos dentro de:**  
      ./build/  
    **De estos archivos nos interesan: index.bundle.js, client.bunlde.js y index.html, Debemos renombrar estos archivos de esta manera: **  
      index.bundle.js  ---->      indexEnlaces.bundle.js  
      client.bundle.js ---->      clientEnlaces.bundle.js  
      index.html       ---->      indexEnlaces.ejs  
    **Estos archivos renombrados se los debe colocar dentro del proyecto PrivateFacArtes, de esta manera:**  
      indexEnlaces.bundle.js    ----> /public/javascripts/  
      clientEnlaces.bundle.js   ----> /public/javascripts/  
      indexEnlaces.ejs          ----> /views/  
    **Como paso final debemos reemplazar el conjunto de líneas [1-22] del archivo indexEnlaces.ejs por el siguiente conjunto de líneas.**  
    ```html
         <html>
         <head>
           <title>manageLinks</title>
           <style>body { margin: 0; }</style>
           <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
           <meta name="robots" content="noindex,nofollow">
           <link rel="stylesheet" href="/stylesheets/bootstrap.min.css"/>
           <script src="/javascripts/jquery-3.5.1.slim.min.js"></script>
           <script src="/javascripts/popper.min.js"></script>
           <script src="/javascripts/bootstrap.min.js"></script>
           <link rel="stylesheet" href="/stylesheets/obrasEditor.styles.css"/>
         </head>

         <body>

           <%- include('navbar.ejs') %>
    ```
    
    **Se corre el proyecto final, donde se puede visitar a este editor en la direccion /obras**  
