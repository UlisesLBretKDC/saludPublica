var defaultTheme = getRandom(4);

var today = new Date();

var active_events = [];

var week_date = [];

var curAdd, curRmv;

var d;
var n;
var myEvents;

function getRandom(a) {
    return Math.floor(Math.random() * a);
}

function getDocumentos(){
    fetch('api/public/api/mensajes-clave',{
        method: 'GET',
        headers: {
            //'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(resp2 => {
        if(resp2.status == "success"){
            console.log('success');
            //Se asignan los mensajes claves al array
            arrayEvents = resp2.mensajes_clave;
            // Se crea el array myEvents
            myEvents = new Array();
            modal = '';
            //Se recorre el arreglo con los mensajes clave
            arrayEvents.forEach(function(evento, index, array1) {
                fecha = evento.fecha;
                //Se sustituyen los guiones por diagonales
                fecha_slash = fecha.replace(/-/g, '/');

                //Se crea el arreglo con los materiales
                arrayMateriales = evento.ids.split(',');
                //Se crea el arreglo con los descripciones largas
                arrayDescripciones = evento.descripciones.split(',');
                //Se crea el arreglo con las rutas
                arrayRutas = evento.rutas.split(',');

                //Se crean los botones
                description = "<ul>";
                    arrayMateriales.forEach(function(elemento2, indice2, array2) {
                        console.log('materiales',elemento2, indice2);
                        description +="<li>";
                        description +="<button type='button' class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#exampleModal"+elemento2+indice2+"'>"+arrayDescripciones[indice2]+"</button>";
                        description +="</li>";    
                    });
                description += "</ul>";

                //Se agrega cada evento al array de myEvents
                myEvents.push({ 
                    id: 'id'+index,
                    name: evento.descripcion_corta, 
                    date: fecha_slash, 
                    type: "event", 
                    description: description,
                    everyYear: true 
                });

                //Se crean las modales
                arrayMateriales.forEach(function(elemento, indice, array) {
                    let nombre_material= arrayRutas[indice];
                    let nombre_archivo = nombre_material.split("/");
                    let ext = nombre_archivo[1].split(".");
                    let extension = ext[1];

                    modal += '<!-- Modal -->';
                    modal += '<div class="modal fade" id="exampleModal'+elemento+indice+'" tabindex="-1" aria-labelledby="exampleModalLabel'+elemento+indice+'" aria-hidden="true">';
                    modal += '<div class="modal-dialog">';
                    modal += '<div class="modal-content">';
                    modal += '<div class="modal-header">';
                    modal += '<h5 class="modal-title" id="exampleModalLabel">'+evento.descripcion_corta+'</h5>';
                    modal += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    modal += '</div>';
                    modal += '<div class="modal-body">';
                    if(extension == 'mp4'){
                        modal += '<video src="api/storage/'+arrayRutas[indice]+'" width="466" height="466" autoplay loop></video>';
                    }else if(extension == 'jpg'){
                        modal += '<img src="api/storage/'+arrayRutas[indice]+'" alt="">';
                    }
                    
                    modal += '</div>';
                    modal += '</div>';
                    modal += '</div>';
                    modal += '</div>';
                });
            });

            //Se integran las modales al html
            document.getElementById("modales").innerHTML = modal;

            //Se dibuja el calendario
            $('#calendar').evoCalendar({
                theme: 'Royal Navy',
                language: 'es',
                format: "yyyy/mm/dd",
                titleFormat: "MM",
                calendarEvents: myEvents,
            });

            
        }else{
            console.log('Ocurrió un error')
        }
    })
    .catch(error => {
        console.log('Error en la petición');
        console.log(error);
    });
}

$(document).ready(function() {
    getDocumentos();    
})