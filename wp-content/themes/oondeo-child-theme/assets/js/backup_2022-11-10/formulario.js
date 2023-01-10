const configuracionFormularioSolicitud = {
	debug: false,
	verbose: false,
	selectores: {
		existen: true,
		navegacion: "libre"
	}
};
configuracionFormularioSolicitud.selectores.existen = !getDataFromURL()['debug']



/* SELECTORES DEL FORMULARIO */
let arraySelectorBotones = [
	{ 
		id: "btn-datos-generales", 
		name: "Datos Generales de la Solicitud" 
	},
	{ 
		id: "btn-datos-titular", 
		name: "Datos Titular" 
	},
	{ 
		id: "btn-emplazamiento-instalacion", 
		name: "Emplazamiento de la Instalación" 
	},
	{ 
		id: "btn-datos-tecnicos-instalacion", 
		name: "Datos Técnicos de la Instalación" 
	},
	{ 
		id: "btn-nueva-entidad-interesada", 
		name: "Nueva Entidad Interesada" 
	},
	{ 
		id: "btn-datos-representante", 
		name: "Datos Representante" 
	},
	{ 
		id: "btn-datos-empresa-instaladora-electricista", 
		name: "Datos Empresa Instaladora Electricista" 
	},
	{ 
		id: "btn-datos-instalador-electricista", 
		name: "Datos Instalador Electricista" 
	},
	{ 
		id: "btn-datos-proyectista", 
		name: "Datos Proyectista" 
	},
	{ 
		id: "btn-datos-director-obra", 
		name: "Datos Director de Obra" 
	},
	{ 
		id: "btn-tasas-presupuesto", 
		name: "Tasas y Presupuesto" 
	},
	{ 
		id: "btn-documentos-adjuntos", 
		name: "Documentos Adjuntos" 
	},
	{ 
		id: "btn-certificados-informes", 
		name: "Certificados e Informes" 
	}
]
let arraySelectorBotonesClean = [...arraySelectorBotones]

//Eliminar Botones del Selector. Se le debe pasar un array.
function limpiarArraySelectorBotones( idsToRemove ){
		idsToRemove.forEach( idToRem => {
			arraySelectorBotonesClean = arraySelectorBotonesClean.filter( elBtn => {
					return elBtn.id != idToRem
			} )
		})
}

function buildSelectorButton( id, text, functionOnClick = null ){
	let btnEl = document.createElement('div')
	btnEl.id = id
	btnEl.classList.add('boton', 'desactivado')
	btnEl.addEventListener('click', ()=>{
		
		console.log( `opcionAnterior: ${opcionActual}` )
		console.log( `btn.id: ${btnEl.id}` )
		if( btnEl.id != `btn-${opcionActual}` ){
			if ( !validateRequiredInputsSection( opcionActual ) ){
				return false;
			}
		}
		//Deshabilitar la navegación a botones con la clase .desactivado pinchándoles directamente (Se debe hacer con las flechas adelante y atrás)
		if( configuracionFormularioSolicitud.selectores.navegacion == 'flechas' && btn.classList.contains('desactivado') ){
			return false;
		}

		let opcion = document.getElementsByName('opcion')[0];
		opcion.value = btnEl.id.replace( 'btn-','' )
		opcion.click();
		removeClass( botonesVisiblesSelector, 'active' )
		btnEl.classList.add( 'active' )
		btnEl.classList.remove( 'desactivado' )
		
		opcionActual = btnEl.id.substring(4)
		
		console.log(`opcionActual: ${opcionActual}`);
		
		if(functionOnClick != null){
			functionOnClick()
		}
	})

	btnEl.appendChild(document.createTextNode(text))
	return btnEl
}


function borrarBotonSelectorSolicitud( id ){
	//console.log('borrarBoton')
	arraySelectorBotonesClean = arraySelectorBotonesClean.filter( b => b.id != id )
	//console.log(arraySelectorBotonesClean)
	let selectorBotones = document.querySelector('#selector-botones')
	//console.log(selectorBotones)
	let btnBorrar = selectorBotones.querySelector(`#${id}`)
		//console.log(btnBorrar)
	if(!selectorBotones){
		//console.log('El elemento selector no es correcto:')
		//console.log(selectorBotones)
		return false;
	}
	if(!btnBorrar){
		// console.log('El elemento botón no es correcto:')
		// console.log(btnBorrar)
		return false;
	}
	selectorBotones.removeChild( btnBorrar )
}

function addBotonSelectorSolicitud( btnId, btnText, functionOnClick = null, insertBeforeElement=null, insertAfterElement=null ){
	// console.log('addBoton')
	arraySelectorBotonesClean.push( {id: btnId, name: btnText} )
	// console.log( arraySelectorBotonesClean )

	let btnAdd = buildSelectorButton( btnId, btnText, functionOnClick )
	// console.log( btnAdd )
	let selectorBotones = document.querySelector('#selector-botones')
	if( insertBeforeElement ){
		selectorBotones.insertBefore( btnAdd, insertBeforeElement )
	}else if( insertAfterElement ){
		selectorBotones.insertBefore( btnAdd, insertBeforeElement.nextSibling )
	}else{
		selectorBotones.appendChild( btnAdd )
	}
}


//Construir los botones del selector
if( configuracionFormularioSolicitud.selectores.existen ){
	jQuery('document').ready( ()=>{
		let selectorBotones = document.querySelector('#selector-botones')
		if( selectorBotones == null ){
			console.log('#selector-botones == null')
			return false;
		}
		let { subtipoInstalacion } = getDataFromURL();

		// console.log('arraySelectorBotones')
		// console.log( arraySelectorBotones )
		limpiarArraySelectorBotones(  ['btn-nueva-entidad-interesada', 'btn-datos-representante'] )
		if( subtipoInstalacion == 'mem'){
			limpiarArraySelectorBotones(  ['btn-datos-proyectista', 'btn-datos-director-obra'] )
		}
		// console.log('arraySelectorBotones después de limpiarlo')
		// console.log( arraySelectorBotones )

		let form = document.querySelectorAll('form.wpcf7-form')[0]
		form.addEventListener('submit', e=>{
			e.preventDefault()
		})
		// console.log(form)

		arraySelectorBotonesClean.forEach( b => {
			selectorBotones.appendChild( buildSelectorButton( b.id, b.name ) )
		} )

		window.botonesVisiblesSelector = Array.from(document.querySelector('.selector-botones').children);
		console.log('Botones Visibles Selector')
		console.log(botonesVisiblesSelector)
		
	} )
}

/*! FIN SELECTORES DEL FORMULARIO */

// Seleccionar la opción por defecto
if( configuracionFormularioSolicitud.selectores.existen ){
	jQuery('document').ready( ()=>{
		window.opcionActual = 'datos-generales';
		document.getElementById(`btn-${opcionActual}`).classList.remove('desactivado')
		document.getElementById(`btn-${opcionActual}`).click()
	} )
}

/* PreventDefault Botones Cancelar, Guardar, Enviar */
function prevDefaultBotonesFormulario(){
	// return false;
	const form = document.querySelector('form.wpcf7-form')
	const formAction = document.getElementsByName('form-action')[0];

	const cancelarBtn = document.querySelector('#cancelar-btn')
	cancelarBtn.addEventListener('click', e=>{
		e.preventDefault();

		// console.log(e)
	})
	

	const guardarBtn = document.querySelector('#guardar-btn')
	// guardarBtn.addEventListener('click', e=>{
	// 	$('#seccion-datos-titular').addClass('wpcf7cf-hidden');
	// 	//e.preventDefault();
	// 	// console.log(e)
	// 	// if( configuracionFormularioSolicitud.debug ){
	// 	// 	form.submit();
	// 	// 	return true;
	// 	// }
	// 	//formAction.value = "guardar"
		
	// 	// if( validateAllRequiredInputs() ){
	// 	// 	// Hay que encontrar la manera de hacer submit a todos los campos incluso los ocultos
	// 	// 	form.submit()
	// 	// }
		
	// })

	
	jQuery.fn.bindFirst = function(name, fn) {
		var elem, handlers, i, _len;
		this.bind(name, fn);
		for (i = 0, _len = this.length; i < _len; i++) {
			elem = this[i];
			handlers = jQuery._data(elem).events[name.split('.')[0]];
			handlers.unshift(handlers.pop());
		}
	};
	// jQuery("#guardar-btn").bindFirst("click", function() { 
	// 	jQuery('[name="save_button"]').val('1')
	// });

	let inSaveButton = jQuery('[name="save_button"]');
	jQuery("#guardar-btn").bindFirst("click", function() { 
		console.log('save_button before: ')
		console.log(inSaveButton.val())
		inSaveButton.val('1')
		console.log('save_button after: ')
		console.log(inSaveButton.val())

	})

  jQuery("#enviar-btn").bindFirst("click", function () {
    console.log("save_button before: ");
    console.log(inSaveButton.val());
    inSaveButton.val("0");
    console.log("save_button after: ");
    console.log(inSaveButton.val());
  });

	const anteriorBtn = document.querySelector('#anterior-btn')
	anteriorBtn.addEventListener('click', e=>{
		e.preventDefault();
		//console.log(e)
		let index = botonesVisiblesSelector.findIndex( el=>{
			return el.id == `btn-${opcionActual}`
		} )
		if( index > 0 ){
			if( !validateRequiredInputsSection(opcionActual) ){
				return false;
			}
			let botonOpcionActual = botonesVisiblesSelector[--index]
			botonOpcionActual.classList.remove('desactivado')
			botonOpcionActual.click()
			opcionActual = botonOpcionActual.id.substring(4)
			// console.log(botonOpcionActual)
			// console.log(opcionActual)
		}else{
			console.log('Es el Primer Elemento //To do-->Disable Prev Button')
		}
	})

	const siguienteBtn = document.querySelector('#siguiente-btn')
	siguienteBtn.addEventListener('click', e=>{
		e.preventDefault();
		// console.log(e)
		let index = botonesVisiblesSelector.findIndex( el=>{
			return el.id == `btn-${opcionActual}`
		} )
		if( index < botonesVisiblesSelector.length-1 ){
			if( !validateRequiredInputsSection(opcionActual) ){
				return false;
			}
			let botonOpcionActual = botonesVisiblesSelector[++index]
			botonOpcionActual.classList.remove('desactivado')
			botonOpcionActual.click()
			opcionActual = botonOpcionActual.id.substring(4)
			// console.log(botonOpcionActual)
			// console.log(opcionActual)
		}else{
			console.log('Es Ultimo Elemento //To do-->Disable Next Button')
		}
	})
}
jQuery('document').ready( prevDefaultBotonesFormulario )
/*FIN PreventDefault Botones Cancelar, Guardar, Enviar */

	

/* Gestión de Archivos e Input[type=file] */
let attatchedFiles = []

function checkIfAttatchedFileIsDuplicated( name ){
	attatchedFiles = attatchedFiles.filter( af => {
		console.log(`name : ${name}`)
		console.log( 'attatchedFiles antes de quitar duplicados' )
		console.log( attatchedFiles )
		return af.inputName != name;
	} )
	console.log( 'attatchedFiles después de quitar duplicados' )
	console.log( attatchedFiles )
	
	return attatchedFiles;
}

function updateAllAttatchedFiles(){
	let inFiles = Array.from( document.querySelectorAll("input[type='file']") )
	attatchedFiles = []
	inFiles.forEach( inFile => {
		console.log('adding:...')
		console.log( inFile.files )
		attatchedFiles.push( ...inFile.files )
	} )
	console.log('updatedAttatchedFiles:...')
	console.log(attatchedFiles)
}

function fileOnChange(){
	let inFiles = Array.from( document.querySelectorAll("#grid-documentos-adjuntos input[type='file']") )

	inFiles.forEach( i => {
		i.onchange = ({target}) => {
			console.log('change')
			console.log(target)
			let targetFiles = Array.from(target.files)
			console.log(targetFiles)
			// checkIfAttatchedFileIsDuplicated( target.name )
			// targetFiles.forEach( tf => {
			// 	tf.inputName = target.name
			// } )
			// attatchedFiles.push( ...targetFiles )
			// console.log( attatchedFiles )
			updateAllAttatchedFiles();
			if( target.name == 'otros-archivos-adjuntos' ){
				let removeFileButtons = document.querySelectorAll('.remove-file');
				removeFileButtons.forEach( rfb => {
					rfb.addEventListener( 'click', ()=>{ updateAllAttatchedFiles() } )
				} )
				return true;
			} 
			let parent = target.parentElement.parentElement.parentElement
			console.log( parent )
			let fileName = parent.querySelector(".tag-nombre-archivo")
			fileName.innerHTML = targetFiles[0].name
			console.log(fileName)
			let fileDate = parent.querySelector(".tag-fecha-adjuntado")
			fileDate.innerHTML = targetFiles[0].lastModifiedDate.toLocaleDateString('en-GB').split('/').reverse().join('-')
			console.log(targetFiles[0].lastModifiedDate.toLocaleDateString('en-GB').split('/').reverse().join('-'))
			let fileStatus = parent.querySelector('.tag-estado-envio')
			fileStatus.innerHTML = 'OK'
		}
	})
}
jQuery('document').ready( fileOnChange )
/*FIN Gestión de Archivos e Input[type=file] */


/* Validación del Formulario */
function validateAllRequiredInputs(){
	let formValido = true;

	let allActiveGroups = []
	arraySelectorBotonesClean.forEach( btn => {
		allActiveGroups.push( btn.id.substring(4) )
	})
	console.log( allActiveGroups )

	allActiveGroups.forEach( activeGroup => {
		if( validateRequiredInputsSection( activeGroup ) ){
			let sectionActive = document.querySelector(`.seccion-${activeGroup}-wrapper`)
			console.log(`.seccion-${activeGroup}-wrapper:`)
			console.log( sectionActive )
		}else{
			formValido = false;
		}
	} )
	console.log(`validateAllRequiredInputs() : ${formValido}`)
	return formValido;
	return true; //Para Pruebas Validado = true
}

function validateRequiredInputsSection( opcionActual ){
	let insToValidate = document.querySelectorAll(`.seccion-${opcionActual}-wrapper .wpcf7-validates-as-required`);
	// console.log(insToValidate)

	let allFieldsValidated = true;

	insToValidate.forEach( input => {
		input.classList.remove('error')
		if( !input.value ){
			allFieldsValidated = false;
			input.classList.add('error')
			// console.log(input)
			parent = input.parentElement
			//console.log(parent)
			while( !parent.classList.contains('grupo-formulario') ){
				//console.log(parent)
				parent = parent.parentElement
			}
			parent.classList.add('error')
		}
	} )

	if( allFieldsValidated ){
		document.querySelector(`#btn-${opcionActual}`).classList.add('validado')
		document.querySelector(`#btn-${opcionActual}`).classList.remove('error')
		return true;
	}else{
		document.querySelector(`#btn-${opcionActual}`).classList.remove('validado')
		document.querySelector(`#btn-${opcionActual}`).classList.add('error')
		return false;
	}
}
/*FIN Validación del Formulario */


/* Modificar Estilos Botón de Subida de Archivos Adjuntos */
function modificarBotonSubidaDocumentosAdjuntos(){
	let docAdjContenedor = document.querySelectorAll('.grid-documentos-adjuntos')
	let inputFIles
	docAdjContenedor.forEach( dac => {
		inputFiles = dac.querySelectorAll('input[type=file]')
		inputFiles.forEach( i => {
			i.id = i.name;
			i.classList.add('transparent')
				let label = document.createElement('label')
				label.id = `label-${i.id}`
				label.classList.add('subir-documento-btn')
				label.setAttribute( 'for', i.id )
				label.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i>'
			i.parentElement.appendChild(label)
		} )
	} )
}
jQuery('document').ready( modificarBotonSubidaDocumentosAdjuntos )
/*FIN Modificar Estilos Botón de Subida de Archivos Adjuntos */


/* Get Data From URL */
function getDataFromURL(){
  const urlParams = new URLSearchParams(window.location.search);
  const campoActuacion = urlParams.get("campo_actuacion");
  const tipoInstalacion = urlParams.get("tipo_instalacion");
  const subtipoInstalacion = urlParams.get("subtipo_instalacion");
  const tipoExpediente = urlParams.get("tipo_expediente");
  const denominacion = urlParams.get("denominacion");
  const params = {
    campoActuacion: campoActuacion,
		tipoInstalacion: tipoInstalacion,
		subtipoInstalacion: subtipoInstalacion,
		tipoExpediente: tipoExpediente,
		denominacion: denominacion
  };

	console.log('getDataFromURL()')
  console.log(`campoActuacion: ${campoActuacion}`);
  console.log(`tipoInstalacion: ${tipoInstalacion}`);
  console.log(`subtipoInstalacion: ${subtipoInstalacion}`);
  console.log(`tipoExpediente: ${tipoExpediente}`);
  console.log(`denominacion: ${denominacion}`)
  console.log('Params')
  console.log(params)
  return params;
}

function getInputsByName( arrNames ){
	let inputs = [];
	arrNames.forEach( n => {
		inputs[n] = document.querySelector(`input[name="${n}"]`)
	})
	return inputs;
}

function changeValuesFromURLParams(){
	const { campoActuacion, tipoInstalacion, subtipoInstalacion, tipoExpediente, denominacion } = getDataFromURL()

	let inputs = getInputsByName( ['denominacion', 'campo_actuacion', 'tipo_instalacion', 'subtipo_instalacion', 'tipo_expediente', 'denominacion'] );

	window.dataCampoActuacion = DatosInstalaciones.find( el => el.short_name == campoActuacion);
	window.dataTipoInstalacion = dataCampoActuacion.subcats.find( el => el.short_name == tipoInstalacion )
	window.dataSubtipoInstalacion = dataTipoInstalacion.subcats.find(
    el => el.short_name == subtipoInstalacion
  );
	window.dataTipoExpediente = TiposExpediente.find( el => {
		return el.short_name == tipoExpediente
	})
	window.dataDenominacion = denominacion

	/* INPUTS value y data-name */
	inputs["campo_actuacion"].value = dataCampoActuacion.short_name;
	inputs["campo_actuacion"].setAttribute(
		"data-name", 
		dataCampoActuacion.name
	);
	
	inputs["tipo_instalacion"].value = dataTipoInstalacion.short_name;
	inputs["tipo_instalacion"].setAttribute(
    "data-name",
    dataTipoInstalacion.name
  );

	inputs["subtipo_instalacion"].value = dataSubtipoInstalacion.short_name;
	inputs["subtipo_instalacion"].setAttribute(
    "data-name",
    dataSubtipoInstalacion.name
  );

	inputs["tipo_expediente"].value = dataTipoExpediente.short_name;
	inputs["tipo_expediente"].setAttribute(
		"data-name", 
		dataTipoExpediente.name
	);

	inputs["denominacion"].value = dataDenominacion ;
	inputs["denominacion"].setAttribute(
		"data-name", 
		dataDenominacion
	);

	console.log('INPUTS')
	console.log(inputs)
	// DEBUG
	if ( configuracionFormularioSolicitud.verbose && configuracionFormularioSolicitud.verbose ){	
		console.log('URL Params')
		console.log([campoActuacion, tipoInstalacion, subtipoInstalacion, tipoExpediente, denominacion])
		console.log("URL Params");
		console.log([
			campoActuacion,
			tipoInstalacion,
			subtipoInstalacion,
			tipoExpediente,
			denominacion,
		]);
		console.log('Inputs')
		console.log(inputs)
		console.log('Datas')
		console.log( [dataCampoActuacion, dataTipoInstalacion, dataSubtipoInstalacion, dataTipoExpediente, dataDenominacion] );
		console.log("Inputs");
		console.log(inputs)
	} 

	// Add Event Listener
	for (var key in inputs) {
    inputs[key].addEventListener( 'change', e=>{
			let input = e.target;
			let dataName = input.getAttribute("data-name");
			let parent = input.parentElement.parentElement;
			parent.querySelector(".tag-grupo-formulario").innerHTML = dataName;
		})
  }

	// Lanzar el evento change
	for( var key in inputs ){
		if( configuracionFormularioSolicitud.verbose ){
			console.log(`Value: input[${key}]: ${inputs[key].value}`)
		}
		inputs[key].dispatchEvent(new Event('change'))
	}
}
if( !configuracionFormularioSolicitud.debug ){
	//jQuery('document').ready( changeValuesFromURLParams )
}

function changeAllValuesFromURLParams(){
	
	changeTagsWhenInputsChange();
	// console.log('URL Search:')
	// console.log(window.location.search);
	const urlParams = new URLSearchParams(window.location.search);
	// console.log('URL PARAMS:')
	// console.log(urlParams)
	let input
	urlParams.forEach( (value, key) => {
		try{
			if( document.querySelector(`input[name="${key}"]`) ){
				// console.log(`${key}: ${value}`)
				input = document.querySelector(`input[name="${key}"]`)
				input.value = value;
				input.dispatchEvent( new Event('change') )
			}else{
				// console.log(`Parametro sin Input: ${key}: ${value}`)
			}
		}
		catch (err){
			console.error( "Error" )
			console.info( err )
		}
	} )

}
if (!configuracionFormularioSolicitud.debug) {
  jQuery("document").ready(changeAllValuesFromURLParams);
}

function changeTagsWhenInputsChange(){
	let inputs = jQuery(".wpcf7-form-control");
	console.log('Inputs')
	console.log(inputs)
	let value
	inputs.each( function() {
		value = jQuery(this).val(); 
		console.log(
      `INPUT = name: ${jQuery(this).attr("name")}; value: ${jQuery(this).val()}`
    );
		console.log( jQuery(this) )
		jQuery(this).on("change", () => {
      if (jQuery(this).parent().find(".tag-grupo-formulario")) {
        jQuery(this)
          .parent()
          .find(".tag-grupo-formulario")
          .text( value );
      }
    });
	})
}
/*FIN Get Data From URL */


jQuery('document').ready(()=>{
	jQuery("#formulario-principal").on( "change", "input", function(){
		console.log('CHANGE EVENT dispatched')
		console.log( jQuery(this) )
	} )
})

/* Drag And Drop Otros Documentos Adjuntos */
jQuery('document').ready(()=>{
	const box = document.querySelector('.upload-box');
	if( box == null ){
		console.log('No hay elemento .upload-box')
		return false;
	}
	const fileInput = document.querySelector('[name="otros_documentos_adjuntos[]"');
	const selectButton = document.querySelector('label strong');
	const gridOtrosDocumentos = document.querySelector('#grid-otro-documentoss-adjuntos')
	const fileList = document.querySelector('#grid-otros-documentos-adjuntos .file-list')
	const fileTypes = [
		{
			'id':	'pdf',
			'name':	'PDF',
			'icon_html': '<i class="fa-regular fa-file-pdf"></i>',
			'icon_unicode': 'f1c1'
		},
		{
			'id':	'img',
			'name':	'Image',
			'icon_html': '<i class="fa-regular fa-file-image"></i>',
			'icon_unicode': 'f1c5'
		},
		{
			'id':	'zip',
			'name':	'Zip File',
			'icon_html': '<i class="fa-regular fa-file-zipper"></i>',
			'icon_unicode': 'f1c6'
		}
	]

	function getIconFileType( id ){
		let fileType = fileTypes.filter( ft => {
			console.log(ft)
			return ft.id === id;
		} )[0]

		console.log('fileType')
		console.log(fileType)
		return fileType.icon_html
	}

	function ddmmyyyyDate( date ){
		let dd = String(date.getDate()).padStart(2, '0');
		let mm = String(date.getMonth() + 1).padStart(2, '0');
		let yyyy = date.getFullYear();

		return `${dd}/${mm}/${yyyy}`;
	}

	let droppedFiles = [];
	
	[ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( event => box.addEventListener(event, function(e) {
		e.preventDefault();
		e.stopPropagation();
	}), false );
	
	[ 'dragover', 'dragenter' ].forEach( event => box.addEventListener(event, function(e) {
			box.classList.add('is-dragover');
	}), false );
	
	[ 'dragleave', 'dragend', 'drop' ].forEach( event => box.addEventListener(event, function(e) {
			box.classList.remove('is-dragover');
	}), false );
	
	box.addEventListener('drop', function(e) {
			droppedFiles = e.dataTransfer.files;
			fileInput.files = droppedFiles;
			updateFileList();
	}, false );
	
	fileInput.addEventListener( 'change', updateFileList );
	function updateFileList() {
		console.log(fileInput.files)
		let files = Array.from( fileInput.files );
		fileList.innerHTML = ''
		files.forEach( f => {
			fileList.innerHTML += `
			<div class="grid-adjuntos-item documento-adjunto-wrapper">
				<div class="grupo-formulario">
					<span class="tag-documento-adjuntado">${getIconFileType( 'pdf' )}</span>
				</div>
				<div class="grupo-formulario">
					<span class="tag-nombre-archivo">${f.name}</span>
				</div>
				<div class="grupo-formulario">
					<span class="tag-fecha-adjuntado">${ddmmyyyyDate( new Date() )}</span>
				</div>
				<div class="grupo-formulario">
					<span class="tag-estado-envio">OK</span>
				</div>
			</div>
			`

		} )
	}
})
/*FIN Drag And Drop Otros Documentos Adjuntos */

/* FETCH SOLICITUD */
function get_solicitud( post_id ){
	fetch(`/wp-json/oondeo/v1/getsolicitud?post_id=${post_id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(function (data) {
			return data.json();
		})
		.then((myJson) => {
			console.log('MY JSON')
			console.log(myJson);
		});
}
/* FIN FETCH SOLICITUD */
