import { Module} from 'react-360-web';

var text;
var museos = document.getElementById('museos');
var salas = document.getElementById('salas');
var infoButtons = document.getElementById('infoButtons');
var navButtons = document.getElementById('navButtons');
var salasDisponible = document.getElementById('salasDisponible');
var tipo = document.getElementById('tipo');
var btnAnadir = document.getElementById('btnAnadir');
var btnEliminar = document.getElementById('btnEliminar');
var btnGuardarCoordenadas = document.getElementById('btnGuardarCoordenadas');
var btnEditar = document.getElementById('btnEditar');
var numImagenes = 0;

var asignatura = document.getElementById('asignatura');
var ciclo = document.getElementById('ciclo');
var autor = document.getElementById('autor');
var titulo = document.getElementById('titulo');
var genero = document.getElementById('genero');
var facebook = document.getElementById('facebook');
var instagram = document.getElementById('instagram');
var proyectoWeb = document.getElementById('proyectoWeb');
var dimensiones = document.getElementById('dimensiones');
var fechaProduccion = document.getElementById('fechaProduccion');
var tutor = document.getElementById('tutor');
var descripcion = document.getElementById('descripcion');
// var imagenes = document.getElementById('imagenes');
var imagenesUpload = document.getElementById('imagenesUpload');
var objeto3DUpload = document.getElementById('objeto3DUpload');
var objetoName = document.getElementById('objetoName');
var youtube = document.getElementById('youtube');
var allImagenes = document.getElementById('allImagenes');
var showingImage = document.getElementById('showingImage');

var formaEditarObra = document.getElementById('formaEditarObra');

var guardarContenido = document.getElementById('guardarContenido');
var guardarImagenes = document.getElementById('guardarImagenes');
var guardarEnlace = document.getElementById('guardarEnlace');
var deleteImagenes = document.getElementById('deleteImagenes');
var guardarObjeto = document.getElementById('guardarObjeto');
var deleteObjeto = document.getElementById('deleteObjeto');

var link = '';
var salaURL;
var salaId;
var information = {};
var informationLinks;
var enlaceLinks;
var tipoElemento;




export default class Control extends Module{

    constructor(ctx){
        super('Control');
        this._rnctx = ctx;
        this._bridgeName = 'BrowserBridge';

        window.addEventListener('cambioAmbiente', e => {
            if(!this._rnctx){
                return;
            }
            console.log("PSSS");
            this._rnctx.callFunction(this._bridgeName, 'notifyEvent', ['cambioAmbiente', information ]);
        });
        

        window.addEventListener('cambioUbicacion', e => {
            if(!this._rnctx){
                return;
            }
            console.log("PSSS");
            this._rnctx.callFunction(this._bridgeName, 'notifyEvent', ['cambioUbicacion', information ]);
        });

        museos.addEventListener('change', (e) => {
            museoSeleccionado = museos.options[museos.selectedIndex];
            console.log("Heyoo: ");
            console.log(museoSeleccionado.value);
        
            this.fillSalas(museoSeleccionado.value);

            if(salas.options.selectedIndex != -1){
                salaURL = salas.options[salas.selectedIndex].getAttribute('data-foto');
                salaId = salas.options[salas.selectedIndex].getAttribute('value');
                
                this.fillInformationLinks(salaId);
                this.fillEnlaceLink(salaId);            
                this.fillCoordinates();

                console.log("\n\nHEYYYYYYYYYYY AQUIIIIIIIIII: ");
                console.log(informationLinks);
                console.log(enlaceLinks);

                information ={};

                information.salaUrl = salaURL;
                information.salaId = salaId;
                information.informationLinks = informationLinks;
                information.enlaceLinks = enlaceLinks;

                console.log(information);
                this.turnOnOffInfoData(false);
                this.turnOnOffInfoEnlaceData(false);
                window.dispatchEvent(new Event('cambioAmbiente'));
            }else{
                infoButtons.innerHTML = '';
                navButtons.innerHTML = '';
                this.fillCoordinates();
            }
            
        });
        
        salas.addEventListener('change', (e) =>{
            salaURL = salas.options[salas.selectedIndex].getAttribute('data-foto');
            salaId = salas.options[salas.selectedIndex].getAttribute('value');
           
            this.fillInformationLinks(salaId);
            this.fillEnlaceLink(salaId);
            this.fillCoordinates();

            console.log("\n\nHEYYYYYYYYYYY AQUIIIIIIIIII: ");
            console.log(informationLinks);
            console.log(enlaceLinks);

            information ={};

            information.salaUrl = salaURL;
            information.salaId = salaId;
            information.informationLinks = informationLinks;
            information.enlaceLinks = enlaceLinks;

            console.log(information);
            this.turnOnOffInfoData(false);
            this.turnOnOffInfoEnlaceData(false);
            window.dispatchEvent(new Event('cambioAmbiente'));
        });
        
        
        tipo.addEventListener('change', (e) => {
            console.log(e);
            if(tipo.selectedIndex == 0){
                infoButtons.hidden = false;
                navButtons.hidden = true;
            }else if(tipo.selectedIndex == 1){
                infoButtons.hidden = true;
                navButtons.hidden = false;
            }
            this.fillCoordinates();
            this.turnOnOffInfoData(false);
            this.turnOnOffInfoEnlaceData(false);
        });

        btnGuardarCoordenadas.addEventListener('click', (e) => {

            // idMuseo = museos.options[museos.selectedIndex].value;
            posX = document.getElementById('ejex').value;
            posY = document.getElementById('ejey').value;
            posZ = document.getElementById('ejez').value;
            
            if(tipo.selectedIndex == 0 && infoButtons.options[infoButtons.selectedIndex].value != ""){
                console.log("info");
                let idObra = infoButtons.options[infoButtons.selectedIndex].value;
                let params = `x=${posX}&y=${posY}&z=${posZ}`;
                let ajaxRequest = new XMLHttpRequest();
                ajaxRequest.open("POST", `${link}/obras/coordinates/${idObra}?_method=PUT`, false);
                ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajaxRequest.onreadystatechange = () => {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert( ajaxRequest.responseText);
                        this.fillInformationLinks(salaId);
                        this.reloadLinks();
                        for(let i=0; i<infoButtons.options.length; i++){
                            if(infoButtons.options[i].value == idObra){
                                infoButtons.selectedIndex = i;
                            }
                        }
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(params);
            }else if(tipo.selectedIndex == 1 && navButtons.options[navButtons.selectedIndex].value != ""){
                console.log("nav");
                let idEnlace = navButtons.options[navButtons.selectedIndex].value;
                let params = `x=${posX}&y=${posY}&z=${posZ}`;
                let ajaxRequest = new XMLHttpRequest();
                ajaxRequest.open("POST", `${link}/enlaces/coordinates/${idEnlace}?_method=PUT`, false);
                ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajaxRequest.onreadystatechange = () => {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert(ajaxRequest.responseText);
                        this.fillEnlaceLink(salaId);
                        this.reloadLinks();
                        for(let i=0; i<navButtons.options.length; i++){
                            if(navButtons.options[i].value == idEnlace){
                                navButtons.selectedIndex = i;
                            }
                        }
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(params);
            }else{
                alert("No se ha elegido ninguna obra o enlace a sala a actualizar.");
            }
        });

        btnAnadir.addEventListener('click', (e) => {
            if(tipo.selectedIndex == 0 ){
                let ajaxRequest = new XMLHttpRequest();
                let params = `museo=${museoSeleccionado.value}&sala=${salaId}`;
                ajaxRequest.open("POST", `${link}/obras/new/`, false);
                ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajaxRequest.onreadystatechange = () => {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert(ajaxRequest.responseText);
                        this.fillInformationLinks(salaId);
                        infoButtons.selectedIndex = infoButtons.options.length-1;
                        this.fillCoordinates();
                        this.reloadLinks();
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(params);
            }else if(tipo.selectedIndex == 1){
                let ajaxRequest = new XMLHttpRequest();
                let params = `sala=${salaId}`;
                ajaxRequest.open("POST", `${link}/enlaces/new/`, false);
                ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajaxRequest.onreadystatechange = () => {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert(ajaxRequest.responseText);
                        this.fillEnlaceLink(salaId);
                        navButtons.selectedIndex = navButtons.options.length-1;
                        this.fillCoordinates();
                        this.reloadLinks();
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(params);
            }
        });

        btnEditar.addEventListener('click', (e) => {
            this.fillContenidoEditable();
        });

        guardarContenido.addEventListener('click', (e) => {
            if(tipo.selectedIndex == 0){
                params = this.getParams(0);
                if(params){
                    console.log(imagenesUpload.files);
                    console.log(params);
                    let ajaxRequest = new XMLHttpRequest();
                    ajaxRequest.open("POST", `${link}/obras/contenido/${idObra}?_method=PUT`, false);
                    ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    ajaxRequest.onreadystatechange = () =>  {
                        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                            alert( ajaxRequest.responseText);
                            this.fillInformationLinks(salaId);
                        }else if(ajaxRequest.status == 401){
                            this.sessionExpired();
                        }
                        
                    }
                    ajaxRequest.send(params);
                }else{
                    alert('Se debe asignar almenos un Autor y un titulo');
                }
                
            }
        });

        guardarImagenes.addEventListener('click', (e) => {
            images = this.getImageParams();
            if(images != null){
                idObra = infoButtons.options[infoButtons.selectedIndex].value
                let ajaxRequest = new XMLHttpRequest();
                ajaxRequest.open("POST", `${link}/obras/imagenes/${idObra}?_method=PUT`, false);
                ajaxRequest.onreadystatechange = () => {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        info = ajaxRequest.responseText;
                        this.fillContenidoEditable();
                        alert(info);
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(images);
            }else{
                alert('Debe de elgir imagenes a subir antes de realizar esta accion');
            } 
        });

        deleteImagenes.addEventListener('click', (e) => {
            let idObra = infoButtons.options[infoButtons.selectedIndex].value;
            let ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open("DELETE", `${link}/obras/imagenes/${idObra}`, false);
            // ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            ajaxRequest.onreadystatechange = () =>  {
                if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                    alert( ajaxRequest.responseText);
                    this.fillContenidoEditable();
                }else if(ajaxRequest.status == 401){
                    this.sessionExpired();
                }
            }
            ajaxRequest.send(null);
        });

        guardarEnlace.addEventListener('click', (e) => {
            if(tipo.selectedIndex == 1 && navButtons.options[navButtons.selectedIndex].value != ""){
                let idEnlace = navButtons.options[navButtons.selectedIndex].value;
                let selectedIndex = navButtons.selectedIndex;
                params = this.getParams(1);
                if(params){
                    console.log(params);
                    let ajaxRequest = new XMLHttpRequest();
                    ajaxRequest.open("POST", `${link}/enlaces/contenido/${idEnlace}?_method=PUT`, false);
                    ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    ajaxRequest.onreadystatechange = () =>  {
                        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                            alert( ajaxRequest.responseText);
                            salaId = salas.options[salas.selectedIndex].getAttribute('value');
                            this.fillEnlaceLink(salaId);
                            navButtons.selectedIndex = selectedIndex;
                            
                        }else if(ajaxRequest.status == 401){
                            this.sessionExpired();
                        }
                    }
                    ajaxRequest.send(params);
                }else{
                    alert('No hay ninguna sala seleccionada');
                }             
            }
        });

        guardarObjeto.addEventListener('click', (e) => {
            if(objeto3DUpload.files.length != 0){
                if(objeto3DUpload.files[0].name.split('.')[1] == 'obj' && objeto3DUpload.files[0].name.split('.')[0] != `Objeto3D_Obra_${idObra}`){
                    let formData = new FormData();
                    museoId = museoSeleccionado.value;
                    let fileSendName = `Objeto3D_Obra_${idObra}`;
                    formData.append(fileSendName, objeto3DUpload.files[0]);
                    let ajaxRequest = new XMLHttpRequest();
                    ajaxRequest.open("POST", `${link}/obras/objeto3D/${idObra}?_method=PUT`, false);
                    ajaxRequest.onreadystatechange = () =>  {
                        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                            alert( ajaxRequest.responseText);
                            this.fillContenidoEditable();
                        }else if(ajaxRequest.status == 401){
                            this.sessionExpired();
                        }
                    }
                    ajaxRequest.send(formData);
                }else{
                    if(objeto3DUpload.files[0].name.split('.')[0] == `Objeto3D_Obra_${idObra}`){
                        alert('El nombre del archivo 3D que tratas de subir debe ser diferente con el que se lo guardará');
                    }else{
                        alert('El tipo del archivo de ser .obj');
                    }
                }
            }else{
                alert('Primero debes escoger un archivo .obj');
            }
        });

        deleteObjeto.addEventListener('click', (e) => {
            let ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open("DELETE", `${link}/obras/objeto3D/${idObra}`, false);
            ajaxRequest.onreadystatechange = () =>  {
                if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                    alert( ajaxRequest.responseText);
                    this.fillContenidoEditable();
                }else if(ajaxRequest.status == 401){
                    this.sessionExpired();
                }
            }
            ajaxRequest.send(null);
        });

        btnEliminar.addEventListener('click', (e) => {
            if(tipo.selectedIndex == 0 && infoButtons.options[infoButtons.selectedIndex].value != ""){
                let ajaxRequest = new XMLHttpRequest();
                idObra = infoButtons.options[infoButtons.selectedIndex].value;
                ajaxRequest.open("DELETE", `${link}/obras/${idObra}`, false);
                ajaxRequest.onreadystatechange = () =>  {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert(ajaxRequest.responseText);
                        this.fillInformationLinks(salaId);
                        this.fillCoordinates();
                        this.reloadLinks();
                        this.turnOnOffInfoData(false);
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(null);
            }else if(tipo.selectedIndex == 1 && navButtons.options[navButtons.selectedIndex].value != ""){
                let ajaxRequest = new XMLHttpRequest();
                idEnlace = navButtons.options[navButtons.selectedIndex].value;
                ajaxRequest.open("DELETE", `${link}/enlaces/${idEnlace}`, false);
                ajaxRequest.onreadystatechange = () =>  {
                    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                        alert(ajaxRequest.responseText);
                        this.fillEnlaceLink(salaId);
                        this.fillCoordinates();
                        this.reloadLinks();
                        this.turnOnOffInfoEnlaceData(false);
                    }else if(ajaxRequest.status == 401){
                        this.sessionExpired();
                    }
                }
                ajaxRequest.send(null);
            }
        });

        infoButtons.addEventListener('change', (e) => {
            this.fillCoordinates();
            this.turnOnOffInfoData(false);
            this.turnOnOffInfoEnlaceData(false);
        });
        
        navButtons.addEventListener('change', (e) => {
            this.fillCoordinates();
            this.turnOnOffInfoData(false);
            this.turnOnOffInfoEnlaceData(false);
        });

        document.getElementById('ejex').addEventListener('keyup', () =>{
            this.changeLocation();
        });
        document.getElementById('ejey').addEventListener('keyup', () =>{
            this.changeLocation();
        });
        document.getElementById('ejez').addEventListener('keyup', () =>{
            this.changeLocation();
        });
        
    }

    fillContenidoEditable(){
        if(tipo.selectedIndex == 0 && infoButtons.options[infoButtons.selectedIndex].value != ""){
            let ajaxRequest = new XMLHttpRequest();
            idObra = infoButtons.options[infoButtons.selectedIndex].value
            ajaxRequest.open("GET", `${link}/obras/api/json/${idObra}`, false);
            ajaxRequest.onreadystatechange = () => {
                if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                    info = JSON.parse(ajaxRequest.responseText);
                    console.log("info: ");
                    console.log(info);
                    if(info.idObra != null ){
                        this.fillContenidoObra(info);
                        this.turnOnOffInfoData(true);
                    }else{
                        alert('La obra que se trata de editar no existe');
                    }
                }else if(ajaxRequest.status == 401){
                    this.sessionExpired();
                }
            }
            ajaxRequest.send(null);
        }else if(tipo.selectedIndex == 1 && navButtons.options[navButtons.selectedIndex].value != ""){
            idMuseo = museos.options[museos.selectedIndex].value;
            selectedIndex = navButtons.options[navButtons.selectedIndex].getAttribute('data-destino');
            let ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open("GET", `${link}/salas/all/api/json/${idMuseo}`, false);
            ajaxRequest.onreadystatechange = () => {
                if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                    info = JSON.parse(ajaxRequest.responseText);
                    console.log("info: ");
                    console.log(info);
                    salasDisponible.innerHTML = '';
                    if(info.length > 0){
                        salaActiva = 0;
                        for(let i=0; i<info.length; i++){
                            // console.log(info[i]);
                            if(selectedIndex == info[i].idSala){
                                salaActiva = i;
                            }
                            $( "#salasDisponible" ).append( `<option value="${info[i].idSala}">${info[i].temaCuratorial}</option>` );
                        }
                        this.turnOnOffInfoEnlaceData(true);
                        salasDisponible.selectedIndex = salaActiva;
                    }else{
                        $( "#salasDisponible" ).append( `<option value="">Ninguna</option>` );
                    }
                }else if(ajaxRequest.status == 401){
                    this.sessionExpired();
                }
            }
            ajaxRequest.send(null);
        }
    }

    turnOnOffInfoData(state){
        infoData = document.getElementsByClassName('infoData');
        for(let i=0; i<infoData.length; i++){
            infoData[i].hidden = !state;
        }
    }
    
    turnOnOffInfoEnlaceData(state){
        infoEnlaceData = document.getElementsByClassName('infoEnlaceData');
        for(let i=0; i<infoEnlaceData.length; i++){
            infoEnlaceData[i].hidden = !state;
        }
    }

    getImageParams(){
        idObra = infoButtons.options[infoButtons.selectedIndex].value;
        idSala = salas.options[salas.selectedIndex].value;
        idMuseo = museoSeleccionado.value;
        let formData = new FormData();
        if(imagenesUpload.files.length != 0){
            for(let i=0; i<imagenesUpload.files.length; i++){
                formData.append(`M_${idMuseo}_Obra_${idObra}_Sala_${idSala}_${i+numImagenes}`, imagenesUpload.files[i]);
            }
            return formData;
        }else{
            return ;
        }
        
    }

    getParams(tipo){
        if(tipo == 0){
            if(autor.value != '' && titulo.value != ''){
                params = `asignatura=${asignatura.value}&ciclo=${ciclo.value}&autor=${autor.value}&titulo=${titulo.value}&genero=${genero.value}&facebook=${facebook.value}&instagram=${instagram.value}&proyectoWeb=${proyectoWeb.value}&dimensiones=${dimensiones.value}&fechaProduccion=${fechaProduccion.value}&tutor=${tutor.value}&descripcion=${descripcion.value}&youtube=${youtube.value}`;
                return params;
            }
            return ;
        }else if(tipo == 1){
            try{
                sala = salasDisponible.options[salasDisponible.selectedIndex].value;
                if(sala != ""){
                    return `sala=${sala}`;
                }else{
                    return ;
                }
            }catch(e){
                return ;
            } 
        }
    }

    changeLocation(){
        information = {};
        posX = document.getElementById('ejex').value;
        posY = document.getElementById('ejey').value;
        posZ = document.getElementById('ejez').value;
        console.log(text);
        
        if(tipo.selectedIndex == 0){
            editable = "info"+infoButtons.options[infoButtons.selectedIndex].value;
        }else if(tipo.selectedIndex == 1){
            editable = "nav"+navButtons.options[navButtons.selectedIndex].value;
        }

        if( editable == "info" || editable == "nav" ){
            console.log("Movio eje x 1");
            return ;
        }else{
            console.log("Movio eje x 2");
            information.posX = posX;
            information.posY = posY;
            information.posZ = posZ;
            information.editable = editable;
            window.dispatchEvent(new Event('cambioUbicacion'));
            return;
        }
    }

    fillSalas(idMuseo){
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", `${link}/salas/all/api/json/${idMuseo}`, false);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                info = JSON.parse(ajaxRequest.responseText);
                console.log("info: ");
                console.log(info);
                salas.innerHTML = '';
                for(let i=0; i<info.length; i++){
                    // console.log(info[i]);
                    $( "#salas" ).append( `<option value="${info[i].idSala}"  data-foto="${info[i].nombreImgFondo}" >${info[i].temaCuratorial}</option>` );
                }

            }else if(ajaxRequest.status == 401){
                this.sessionExpired();
            }
        }

        ajaxRequest.send(null);
    }

    fillMuseos(){
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", `${link}/museo/all/api/json`, false);
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                info = JSON.parse(ajaxRequest.responseText);
                console.log("info: ");
                console.log(info);
                museos.innerHTML = '';
                for(let i=0; i<info.length; i++){
                    console.log(`<option value="${info[i].idMuseo}">${info[i].nombreMuseo}</option>`);
                    $( "#museos" ).append( `<option value="${info[i].idMuseo}">${info[i].nombreMuseo}</option>` );
                }

            }else if(ajaxRequest.status == 401){
                this.sessionExpired();
            }
        }
        ajaxRequest.send(null);

        museoSeleccionado = museos.options[museos.selectedIndex];
        console.log("Heyoo: ");
        console.log(museoSeleccionado.value);

        
        this.fillSalas(museoSeleccionado.value);
        

        salaURL = salas.options[salas.selectedIndex].getAttribute('data-foto');
        salaId = salas.options[salas.selectedIndex].getAttribute('value');

        
        this.fillInformationLinks(salaId);
        this.fillEnlaceLink(salaId);
        this.fillCoordinates();

        console.log("\n\nHEYYYYYYYYYYY AQUIIIIIIIIII2: ");
        console.log(informationLinks);
        console.log(enlaceLinks);
        

        information ={};

        information.salaUrl = salaURL;
        information.salaId = salaId;
        information.informationLinks = informationLinks;
        information.enlaceLinks = enlaceLinks;

        console.log(information);

        console.log("Heyoo 22: ");
        console.log(salaURL);
        window.dispatchEvent(new Event('cambioAmbiente'));
    }

    sessionExpired(){        
        $("#modal-sesion").modal();
        $('#modal-sesion').on('hidden.bs.modal', function () {
            window.location.replace("/editor");
        });
    }

    reloadLinks(){
        information.salaUrl = salaURL;
        information.salaId = salaId;
        information.informationLinks = informationLinks;
        information.enlaceLinks = enlaceLinks;

        console.log("Heyoo 33: ");
        console.log(salaURL);
        window.dispatchEvent(new Event('cambioAmbiente'));
    }


    fillInformationLinks(idSala){

        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", `${link}/obras/all/api/json/${idSala}`, false);
        ajaxRequest.onreadystatechange  = () => {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
              informationLinks = JSON.parse(ajaxRequest.responseText);
              infoButtons.innerHTML = '';
              if(informationLinks.length==0){
                $( "#infoButtons" ).append( `<option value="">Vacio</option>` );
              }else{
                for(let i=0; i<informationLinks.length; i++){
                    if(informationLinks[i].autor == "" || informationLinks[i].autor == null || informationLinks[i].titulo == "" || informationLinks[i].titulo == null ){
                        $( "#infoButtons" ).append( `<option value="${informationLinks[i].idObra}" data-x="${informationLinks[i].posX}" data-y="${informationLinks[i].posY}" data-z="${informationLinks[i].posZ}">Autor/Titulo no definido</option>` );
                    }else{
                        $( "#infoButtons" ).append( `<option value="${informationLinks[i].idObra}" data-x="${informationLinks[i].posX}" data-y="${informationLinks[i].posY}" data-z="${informationLinks[i].posZ}">${informationLinks[i].titulo} (${informationLinks[i].autor})</option>` );
                    }
                    
                }
              }
            //   console.log("informationLinks: ");
            //   console.log(informationLinks);
              
            }else if(ajaxRequest.status == 401){
                this.sessionExpired();
            }
        }
        ajaxRequest.send(null);
      };
    
    fillEnlaceLink(idSala){

        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("GET", `${link}/enlaces/all/api/json/${idSala}`, false);
        ajaxRequest.onreadystatechange  = () => {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {
                enlaceLinks = JSON.parse(ajaxRequest.responseText); 
                navButtons.innerHTML = '';
                if(enlaceLinks.length==0){
                    $( "#navButtons" ).append( `<option value="">Vacio</option>` );
                }else{
                    console.log(enlaceLinks);
                    for(let i=0; i<enlaceLinks.length; i++){
                        if(enlaceLinks[i].idSalaDestino == "" || enlaceLinks[i].idSalaDestino == null ){
                            $( "#navButtons" ).append( `<option value="${enlaceLinks[i].idEnlace}" data-destino="" data-x="${enlaceLinks[i].posXIcono}" data-y="${enlaceLinks[i].posYIcono}" data-z="${enlaceLinks[i].posZIcono}">Enlace a sala no definida</option>` );
                        }else{
                            $( "#navButtons" ).append( `<option value="${enlaceLinks[i].idEnlace}" data-destino="${enlaceLinks[i].idSalaDestino}" data-x="${enlaceLinks[i].posXIcono}" data-y="${enlaceLinks[i].posYIcono}" data-z="${enlaceLinks[i].posZIcono}">Enlace a sala ${enlaceLinks[i].idSalaDestino}</option>` );
                        }
                        
                    }
                }
            }else if(ajaxRequest.status == 401){
                this.sessionExpired();
            }
        }
        ajaxRequest.send(null);
    };

    fillCoordinates(){
        if(salas.options.selectedIndex != -1){
            if(tipo.selectedIndex == 0){
                document.getElementById('ejex').value = infoButtons.options[infoButtons.selectedIndex].getAttribute('data-x');
                document.getElementById('ejey').value = infoButtons.options[infoButtons.selectedIndex].getAttribute('data-y');
                document.getElementById('ejez').value = infoButtons.options[infoButtons.selectedIndex].getAttribute('data-z');
            }else if(tipo.selectedIndex == 1){
                document.getElementById('ejex').value = navButtons.options[navButtons.selectedIndex].getAttribute('data-x');
                document.getElementById('ejey').value = navButtons.options[navButtons.selectedIndex].getAttribute('data-y');
                document.getElementById('ejez').value = navButtons.options[navButtons.selectedIndex].getAttribute('data-z');
            }
        }else{
            document.getElementById('ejex').value = null;
            document.getElementById('ejey').value = null;
            document.getElementById('ejez').value = null;
        }
    }

    fillContenidoObra(info){
        asignatura.value = info.asignatura;
        ciclo.value = info.ciclo;
        autor.value = info.autor;
        titulo.value = info.titulo;
        genero.value = info.genero;
        facebook.value = info.facebook;
        instagram.value = info.instagram;
        proyectoWeb.value = info.proyectoWeb;
        dimensiones.value = info.dimensiones;
        fechaProduccion.value = info.fechaProduccion;
        tutor.value = info.tutor;
        descripcion.value = info.descripcion;
        // imagenes.value = info.imagenes;
        imagenesUpload.value = null;
        objeto3DUpload.value = null;
        allImagenes.innerHTML = '';
        showingImage.setAttribute('src', ``);
        showingImage.hidden = true;
        if(info.imagenes != ''){
            separatedImages = info.imagenes.split(';');
            separatedImages = separatedImages.filter(item => item !== '');
            numImagenes = separatedImages.length;
            for(let i=0; i<separatedImages.length; i++){
                $( "#allImagenes" ).append( `<button type="button" class="btn btn-outline-info" id="button${i}" value="${separatedImages[i]}">Show ${separatedImages[i]}</button>` );
                document.getElementById(`button${i}`).addEventListener('click', (e) => {
                    console.log(e.target);
                    console.log(e.target.value);
                    showingImage.setAttribute('src', `${link}/static_assets/${e.target.value}`);
                    showingImage.hidden = false;
                });
            }
        }else{
            numImagenes = 0;
        }
        objetoName.innerHTML = info.obj;
        youtube.value = info.linkVideoYoutube;
    }


}