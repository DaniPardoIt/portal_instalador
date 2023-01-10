
configuracionFormularioSolicitud.selectores.existen = !getDataFromURL()['debug']

// jQuery('document').ready(()=>{
// 	showLoader();
// })
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

		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log( `opcionAnterior: ${opcionActual}` )
			console.log( `btn.id: ${btnEl.id}` )
    }
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
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log(`opcionActual: ${opcionActual}`);
    }

		if(functionOnClick != null){
			functionOnClick()
		}
	})

	btnEl.appendChild(document.createTextNode(text))
	return btnEl
}


function borrarBotonSelectorSolicitud( id ){
	arraySelectorBotonesClean = arraySelectorBotonesClean.filter( b => b.id != id )
	let selectorBotones = document.querySelector('#selector-botones')
	let btnBorrar = selectorBotones.querySelector(`#${id}`)
	
	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log('borrarBoton')
		console.log(arraySelectorBotonesClean)
		console.log(selectorBotones)
		console.log(btnBorrar)
  }
	if(!selectorBotones){
		if (configuracionFormularioSolicitud.log_level >= 3) {
			console.log('El elemento selector no es correcto:')
			console.log(selectorBotones)
    }
		return false;
	}
	if(!btnBorrar){
		if (configuracionFormularioSolicitud.log_level >= 3) {
			console.log('El elemento botón no es correcto:')
			console.log(btnBorrar)
    }
		return false;
	}
	selectorBotones.removeChild( btnBorrar )
}

function addBotonSelectorSolicitud( btnId, btnText, functionOnClick = null, insertBeforeElement=null, insertAfterElement=null ){
	arraySelectorBotonesClean.push( {id: btnId, name: btnText} )

	let btnAdd = buildSelectorButton( btnId, btnText, functionOnClick )
	
	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log('addBoton')
		console.log( arraySelectorBotonesClean )
		console.log( btnAdd )
  }
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
function buildBotonesSelector(){
	let selectorBotones = document.querySelector("#selector-botones");
	if (selectorBotones == null) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("#selector-botones == null");
    }
		return false;
	}
	let { subtipoInstalacion } = getDataFromURL();
	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log('arraySelectorBotones')
		console.log( arraySelectorBotones )
  }
	limpiarArraySelectorBotones([
		"btn-nueva-entidad-interesada",
		"btn-datos-representante",
	]);
	if (subtipoInstalacion == "mem") {
		limpiarArraySelectorBotones([
			"btn-datos-proyectista",
			"btn-datos-director-obra",
		]);
	}

	let form = document.querySelectorAll("form.wpcf7-form")[0];
	form.addEventListener("submit", (e) => {
		e.preventDefault();
	});

	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log('arraySelectorBotones después de limpiarlo')
		console.log( arraySelectorBotones )
		console.log(form)
  }

	arraySelectorBotonesClean.forEach((b) => {
		selectorBotones.appendChild(buildSelectorButton(b.id, b.name));
	});

	window.botonesVisiblesSelector = Array.from(
		document.querySelector(".selector-botones").children
	);

	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log("Botones Visibles Selector");
		console.log(botonesVisiblesSelector);
  }
}
if( configuracionFormularioSolicitud.selectores.existen ){
	jQuery('document').ready( ()=>{
		//buildBotonesSelector();
	} )
}

/*! FIN SELECTORES DEL FORMULARIO */

// Seleccionar la opción por defecto
function seleccionar_opcion_defecto( oa=null ){
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log( `seleccionar_opcion_defecto( opcionActual=${oa})` )
  }
	if( !oa ){
		window.opcionActual = 'datos-generales';
	}else{
		window.opcionActual = oa;
	}
	document.getElementById(`btn-${opcionActual}`).classList.remove('desactivado')
	document.getElementById(`btn-${opcionActual}`).click()
}
if( configuracionFormularioSolicitud.selectores.existen ){
	jQuery('document').ready( ()=>{
		//seleccionar_opcion_defecto();
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

		if (configuracionFormularioSolicitud.log_level >= 3) {
			console.log(e)
    }
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
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('save_button before: ')
			console.log(inSaveButton.val())
    }

		inSaveButton.val('1')

		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('save_button after: ')
			console.log(inSaveButton.val())
    }
	})

  jQuery("#enviar-btn").bindFirst("click",  e => {
		e.preventDefault()
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("save_button before: ");
			console.log(inSaveButton.val());
    }
		
		inSaveButton.val("0");
		
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("save_button after: ");
			console.log(inSaveButton.val());
    }
		
		let validForm = validateAllRequiredInputs()
		console.log(`validForm == ${validForm}`)
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
			if (configuracionFormularioSolicitud.log_level >= 3) {
				console.log(botonOpcionActual)
				console.log(opcionActual)
      }
		}else{
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log('Es el Primer Elemento //To do-->Disable Prev Button')
      }
		}
	})

	const siguienteBtn = document.querySelector('#siguiente-btn')
	siguienteBtn.addEventListener('click', e=>{
		e.preventDefault();
		if (configuracionFormularioSolicitud.log_level >= 3) {
			console.log(e)
    }
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
			if (configuracionFormularioSolicitud.log_level >= 3) {
				console.log(botonOpcionActual)
				console.log(opcionActual)
      }
		}else{
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log('Es Ultimo Elemento //To do-->Disable Next Button')
      }
		}
	})
}
jQuery('document').ready( 
	//prevDefaultBotonesFormulario
)
/*FIN PreventDefault Botones Cancelar, Guardar, Enviar */



/* Gestión de Archivos e Input[type=file] */
let attatchedFiles = []

function checkIfAttatchedFileIsDuplicated( name ){
	attatchedFiles = attatchedFiles.filter( af => {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log(`name : ${name}`)
			console.log( 'attatchedFiles antes de quitar duplicados' )
			console.log( attatchedFiles )
    }
		return af.inputName != name;
	} )
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log( 'attatchedFiles después de quitar duplicados' )
		console.log( attatchedFiles )
  }

	return attatchedFiles;
}

function updateAllAttatchedFiles(){
	let inFiles = Array.from( document.querySelectorAll("input[type='file']") )
	attatchedFiles = []
	inFiles.forEach( inFile => {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('adding:...')
			console.log( inFile.files )
    }
		attatchedFiles.push( ...inFile.files )
	} )
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('updatedAttatchedFiles:...')
		console.log(attatchedFiles)
  }
}

function fileOnChange(){
	let inFiles = Array.from( document.querySelectorAll("#grid-documentos-adjuntos input[type='file']") )

	inFiles.forEach( i => {
		i.onchange = ({target}) => {
			let targetFiles = Array.from(target.files)

			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log('change')
				console.log(target)
				console.log(targetFiles)
      }
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
			let nombre = parent.querySelector(".tag-nombre-archivo")
			nombre.innerHTML = targetFiles[0].name
			let fecha = parent.querySelector(".tag-fecha-adjuntado")
			fecha.innerHTML = yyyymmdd_hhmmss( new Date )
			let estado = parent.querySelector('.tag-estado-envio')
			estado.innerHTML = 'OK'
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log( parent )
				console.log(nombre)
      }
			parent.querySelector('input[name^="remove_"]').value = 0;
			let borrarBtn = parent.querySelector(".borrar-documento-btn");
			borrarBtn.disabled = false;
      borrarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let parent = findParent({
          maxDepth: 5,
          find: "grid-adjuntos-item",
          element: e.target,
        });
        console.log("parent");
        console.log(parent);
        parent.querySelector('input[name^="remove_"]').value = 1;
        nombre.innerHTML = "";
        fecha.innerHTML = "";
        estado.innerHTML = "";
        borrarBtn.disabled = true;
      });
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
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log( allActiveGroups )
  }

	allActiveGroups.forEach( activeGroup => {
		if( validateRequiredInputsSection( activeGroup ) ){
			let sectionActive = document.querySelector(`.seccion-${activeGroup}-wrapper`)
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log(`.seccion-${activeGroup}-wrapper:`)
				console.log( sectionActive )
      }
		}else{
			formValido = false;
		}
	} )
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log(`validateAllRequiredInputs() : ${formValido}`)
  }
	return formValido;
	return true; //Para Pruebas Validado = true
}

function validateRequiredInputsSection( opcionActual ){
	let insToValidate = document.querySelectorAll(`.seccion-${opcionActual}-wrapper .wpcf7-validates-as-required`);
	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log(insToValidate)
  }


	if( opcionActual === 'documentos-adjuntos' ){
		console.log( 'Validate Documentos Adjuntos' )
		console.log({
			'insToValidate': insToValidate
		})

		insToValidate.forEach( i => {
			console.log({'inToValidate' : i})
		} )
	}

	let allFieldsValidated = true;

	insToValidate.forEach( input => {
		parent = findParent({ element: input, find: "grupo-formulario" });

		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log(parent)
    }
		input.classList.remove('error')
		parent.classList.remove('error')
		if( !input.value ){
			allFieldsValidated = false;
			input.classList.add('error')
			if (configuracionFormularioSolicitud.log_level >= 3) {
				console.log(input)
				console.log(parent)
      }
			parent.classList.add('error')
		}
	} )

	let opcionActualBtn = document.querySelector(`#btn-${opcionActual}`);
	if( allFieldsValidated ){
		opcionActualBtn.classList.add('validado')
		opcionActualBtn.classList.remove('error')
		opcionActualBtn.classList.remove('desactivado')
		return true;
	}else{
		opcionActualBtn.classList.remove('validado')
		opcionActualBtn.classList.add('error')
		opcionActualBtn.classList.remove('desactivado')
		return false;
	}


}
/*FIN Validación del Formulario */


/* Modificar Estilos Botón de Subida de Archivos Adjuntos */
function modificarBotonSubidaDocumentosAdjuntos(){
	let docAdjContenedor = document.querySelectorAll('.grid-documentos-adjuntos')
	let inputFiles
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
//jQuery('document').ready( modificarBotonSubidaDocumentosAdjuntos )
/*FIN Modificar Estilos Botón de Subida de Archivos Adjuntos */


/* Get Data From URL */
function getDataFromURL(){
  const urlParams = new URLSearchParams(window.location.search);
  const campoActuacion = urlParams.get("campo_actuacion");
  const tipoInstalacion = urlParams.get("tipo_instalacion");
  const subtipoInstalacion = urlParams.get("subtipo_instalacion");
  const tipoExpediente = urlParams.get("tipo_expediente");
  const tipoSolicitud = urlParams.get("tipo_solicitud");
  const denominacion = urlParams.get("denominacion");
  const params = {
    campoActuacion: campoActuacion,
		tipoInstalacion: tipoInstalacion,
		subtipoInstalacion: subtipoInstalacion,
		tipoExpediente: tipoExpediente,
		tipoSolicitud: tipoSolicitud,
		denominacion: denominacion
  };

	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('getDataFromURL()')
		console.log(`campoActuacion: ${campoActuacion}`);
		console.log(`tipoInstalacion: ${tipoInstalacion}`);
		console.log(`subtipoInstalacion: ${subtipoInstalacion}`);
		console.log(`tipoExpediente: ${tipoExpediente}`);
		console.log(`tipoSolicitud: ${tipoSolicitud}`);
		console.log(`denominacion: ${denominacion}`)
		console.log('Params')
		console.log(params)
  }
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
	const { campoActuacion, tipoInstalacion, subtipoInstalacion, tipoExpediente, tipoSolicitud, denominacion } = getDataFromURL()

	let inputs = getInputsByName( ['denominacion', 'campo_actuacion', 'tipo_instalacion', 'subtipo_instalacion', 'tipo_expediente', 'tipo_solicitud', 'denominacion'] );


	window.dataCampoActuacion = DatosInstalaciones.find( el => el.short_name == campoActuacion);
	window.dataTipoInstalacion = dataCampoActuacion.subcats.find( el => el.short_name == tipoInstalacion )
	window.dataSubtipoInstalacion = dataTipoInstalacion.subcats.find(
    el => el.short_name == subtipoInstalacion
  );
	window.dataTipoExpediente = TiposExpediente.find( el => {
		return el.short_name == tipoExpediente
	})
	window.dataTipoSolicitud = dataTipoInstalacion.tipos_solicitud.find( el => {
		return el.short_name == tipoSolicitud
	})
	window.dataDenominacion = denominacion

	/* INPUTS value y data-name */
	inputs["campo_actuacion"].value = dataCampoActuacion.short_name;
	inputs["campo_actuacion"].setAttribute(
		"data-name",
		dataCampoActuacion.name
	);

	try{
		inputs["tipo_instalacion"].value = dataTipoInstalacion.short_name;
		inputs["tipo_instalacion"].setAttribute(
			"data-name",
			dataTipoInstalacion.name
		);
	}catch{
		addNotification('Datos Vacíos', `dataTipoInstalacion no tiene datos`, 'warning')
	}

	try{
		inputs["subtipo_instalacion"].value = dataSubtipoInstalacion.short_name;
		inputs["subtipo_instalacion"].setAttribute(
			"data-name",
			dataSubtipoInstalacion.name
		);
	}catch{
		addNotification('Datos Vacíos', `dataSubtipoInstalacion no tiene datos`, 'warning')
	}

	inputs["tipo_expediente"].value = dataTipoExpediente.short_name;
	inputs["tipo_expediente"].setAttribute(
		"data-name",
		dataTipoExpediente.name
	);

	inputs["tipo_solicitud"].value = dataTipoSolicitud.short_name;
	inputs["tipo_solicitud"].setAttribute(
		"data-name",
		dataTipoSolicitud.name
	);

	inputs["denominacion"].value = dataDenominacion ;
	inputs["denominacion"].setAttribute(
		"data-name",
		dataDenominacion
	);

	if( configuracionFormularioSolicitud.log_level >= 1){
		console.log('INPUTS')
		console.log(inputs)
	}
	// DEBUG
	if ( configuracionFormularioSolicitud.verbose && configuracionFormularioSolicitud.verbose ){
		if (configuracionFormularioSolicitud.log_level >= 2) {
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

	if( configuracionFormularioSolicitud.log_level >= 1){
		console.log('Antes del addEventListener("change")')
	}

	// Lanzar el evento change
	for( var key in inputs ){
		if( configuracionFormularioSolicitud.verbose ){
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log(`Value: input[${key}]: ${inputs[key].value}`)
      }
		}
		inputs[key].dispatchEvent(new Event('change'))
	}
	if( configuracionFormularioSolicitud.log_level >= 1){
		console.log('Después del addEventListener("change")')
	}

	removeLoader();
}
if( !configuracionFormularioSolicitud.debug ){
	//jQuery('document').ready( changeValuesFromURLParams )
}

function changeAllValuesFromURLParams(){

	changeTagsWhenInputsChange();
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('URL Search:')
		console.log(window.location.search);
	}
	const urlParams = new URLSearchParams(window.location.search);
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('URL PARAMS:')
		console.log(urlParams)
	}
	let input
	urlParams.forEach( (value, key) => {
		try{
			if( document.querySelector(`input[name="${key}"]`) ){
				
				if (configuracionFormularioSolicitud.log_level >= 4) {
					console.log(`${key}: ${value}`)
				}
				input = document.querySelector(`input[name="${key}"]`)
				input.value = value;
				input.dispatchEvent( new Event('change') )
			}else{
				if (configuracionFormularioSolicitud.log_level >= 4) {
					console.log(`Parametro sin Input: ${key}: ${value}`)
				}
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
	if (configuracionFormularioSolicitud.log_level >= 3) {
		console.log('Inputs')
		console.log(inputs)
  }
	let value
	inputs.each( function() {
		value = jQuery(this).val();
		if (configuracionFormularioSolicitud.log_level >= 3) {
			console.log(
			  `INPUT = name: ${jQuery(this).attr("name")}; value: ${jQuery(this).val()}`
			);
			console.log( jQuery(this) )
		}
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
		
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('CHANGE EVENT dispatched')
			console.log( jQuery(this) )
		}
	} )
})

/* Drag And Drop Otros Documentos Adjuntos */
jQuery('document').ready(()=>{
	const box = document.querySelector('.upload-box');
	if( box == null ){
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('No hay elemento .upload-box')
		}
		return false;
	}
	const fileInput = document.querySelector('[name="otros_documentos_adjuntos[]"]');
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
			
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log(ft)
			}
			return ft.id === id;
		} )[0]

		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('fileType')
			console.log(fileType)
		}
		return fileType.icon_html
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
		
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log(fileInput.files)
		}
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
					<span class="tag-fecha-adjuntado">${yyyymmdd_hhmmss( new Date(), true )}</span>
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
// jQuery('document').ready( function(){
// 	get_solicitud_from_url();
// } )
jQuery('document').ready(()=>{ get_solicitud_from_url() });
function get_solicitud_from_url(){

	if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log(`get_solicitud_from_url() at ${new Date().getTime()}`);
  }
	const urlParams = new URLSearchParams(window.location.search);
	const post_id = urlParams.get("post_ID");
	if( post_id ){
		if( configuracionFormularioSolicitud.log_level >= 2 ) {
			console.log(`--post_id: ${post_id}`);
    }
		let input_postId = document.querySelector('[name="post_id"]');
		input_postId.value = post_id;
		get_solicitud( post_id );
	}else{
		onchange_inputs_form("form.wpcf7-form");
		changeNombreUsuario();
		changeValuesFromURLParams();

		
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('Formated Date')
		}
		change_input_byName('fecha_creacion', yyyymmdd() );
		// let formatedDate = yyyymmdd();
		// let inFechaCreacion = document.querySelector('[name="fecha_creacion"]');
		// inFechaCreacion.value = formatedDate;
		// let parent = inFechaCreacion.parentElement;
		// while (!parent.classList.contains("grupo-formulario")){
		// 	console.log('parent')
		// 	console.log(parent)
		// 	parent = parent.parentElement;
		// }
		// parent.querySelector(".tag-grupo-formulario").innerHTML = formatedDate;
	}
}

function changeNombreUsuario(){
	
}


function get_solicitud( post_id ){
	if( configuracionFormularioSolicitud.log_level >= 2 ){
		console.log(`--get_solicitud() at ${new Date().getTime()}`)
	}

	fetch(`/wp-json/oondeo/v1/getsolicitud?post_id=${post_id}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(
			( res ) => {

				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log(`----first.then ${res}`);
				}

				res.json().then(
					( data ) => {
						data = JSON.parse(data);

						if (configuracionFormularioSolicitud.log_level >= 1) {
							console.log("MY JSON");
							console.log( data );
						}

						delete data.meta_data.opcion;
						delete data.meta_data.save_button;
						window.solicitud = data;

						if (configuracionFormularioSolicitud.log_level >= 2) {
							console.log(`campo_actuacion: ${data.meta_data.campo_actuacion}`)
						}

						fill_inputs_from_json_object( data );
						validateAllRequiredInputs()
						removeLoader()
						//get_HTML_formulario( data.meta_data.campo_actuacion )
					},
					( jsonError ) => {
						console.log('JSON ERROR');
						console.error( jsonError )
					}
				)
			},
			( error ) => {
				console.error( error )
			}
		)
}
/* FIN FETCH SOLICITUD */


// /* FUNCTION BUILD FORM */
// function get_HTML_formulario( campo_actuacion ){
// 	if (configuracionFormularioSolicitud.log_level >= 2) {
//     //console.log(`get_HTML_formulario()`);
//   }
// 	fetch(`/wp-json/oondeo/v1/getformulario?campo_actuacion=${campo_actuacion}`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   }).then(
//     (res) => {
//       if (configuracionFormularioSolicitud.log_level >= 2) {
//         console.log(`----first.then ${res}`);
//       }

//       res.json().then(
//         (data) => {
//           data = JSON.parse(data)
// 					console.log( data )
// 					build_formulario( data )
// 					fill_inputs_from_json_object( data )
//         }
//       );
//     },
//     (error) => {
//       console.error(error);
//     }
//   );
// }

function build_selector_and_functionality(){
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('build_selector_and_functionality()')
  }
	onchange_inputs_form('form.wpcf7-form');
	prevDefaultBotonesFormulario();
	buildBotonesSelector();
	seleccionar_opcion_defecto();
}

function build_formulario( formulario ){
	if (configuracionFormularioSolicitud.log_level >= 2) {
    console.log(`build_formulario()`);
  }
	let main = jQuery('main');
	main.append( formulario )

	build_selector_and_functionality();
}
// /* FIN FUNCTION BUILD FORM */

/* RELLENAR INPUTS CON VALORES DEL OBJETO JSON */
function change_tag_grupo_formulario( el ){
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log("Evento Change En:");
		console.log(el);
	}
	let temp = el;

	if (
		el.tagName == "INPUT" ||
		el.tagName == "SELECT" ||
		el.tagName == "TEXTAREA"
	) {
		let maxDepth = 5;
		while (!temp.classList.contains("grupo-formulario") && maxDepth > 0) {
			
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log(`element: ${el.name}; Depth: ${maxDepth}`);
				console.log(temp);
			}
			temp = temp.parentElement;
			maxDepth--;
		}

		if (!temp.classList.contains("grupo-formulario")) {
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log(
					`El input[name="${el.name}"] no se ha cambiado (No está contenido en un padre con clase '.grupo-formulario')`
				);
			}
			return false;
		}
		let tag = temp.querySelector(".tag-grupo-formulario");
		if( tag ){
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log("Tag Grupo Formulario");
				console.log(tag);
			}
			tag.innerHTML = el.value;
		}else{
			if( configuracionFormularioSolicitud.error_log_level >= 2 ){
				console.error(`-- El grupo de formulario ${temp.id}, no contiene ningun elemento .tag-grupo-formulario`)
			}
		}
	}
}

function fill_inputs_from_json_object( solicitud ){
	//Necesitamos una variable que nos permita detectar si se está rellenando los datos del formulario o si se está rellenando los datos de una entidad en concreto. Los input de NIF tienen un event listener que detecta un cambio, haciendo un fetch al backend recuperando los datos de la entidad con el NIF introducido. Entonces cambia los inputs relacionados con esa entidad. El problema es que en la primera carga de datos( la solicitud completa ) cambia todos los inputs, lanzando así la funcionalidad relacionada con los inputs de NIF, sobreescribiendo de nuevo los datos de las entidades, aunque los de la solicitud estuvieran modificados.
	window.first_load = true;

	let key_tasas = Object.getOwnPropertyNames(solicitud.meta_data)
	key_tasas = key_tasas.filter( t => {
		if( t.includes('tasas_') && !t.includes('count') ){
			return t;
		}
	} )
	console.log('Key TASAS')
	console.log(key_tasas)

	key_tasas.forEach( async k => {
		let el = document.querySelector(`input[name="${k}"]`);
		let max_tasas_lines = 10
		while( max_tasas_lines >= 0 && (!el || typeof el == undefined || el == null) ){
			await wpcf7cf.repeaterAddSub(".wpcf7-form", "tasas");
			el = document.querySelector(`input[name="${k}"]`);
			max_tasas_lines--
		}
	} )


	if( configuracionFormularioSolicitud.log_level >= 1 ){
		console.log("fill_inputs_from_json_object( solicitud )")
	}
	let inputs = get_all_cf7_form_inputs();
	if (configuracionFormularioSolicitud.log_level >= 0) {
    console.log('INPUTS');
		console.log(inputs);
  }
	inputs.forEach( i => {
		let name = ""
		if( i.name != undefined ){

			name = i.name.replace('[]','');
		}else{
			console.log('UNDEFINED INPUT')
			console.log(i)
		}

		if (configuracionFormularioSolicitud.log_level >= 2) {
      console.log(`---------------`);
      console.log(`${name}`);
    }
		if( keyExists( solicitud, name ) ){
			let value
			if( solicitud[name] ){
				value = solicitud[name]
				if (configuracionFormularioSolicitud.log_level >= 1) {
					console.log(`OK. Se ha encontrado en solicitud[${name}]`)
        }
				i.addEventListener("change", (e) => {
					let el = e.target;
					change_tag_grupo_formulario(el);
				});
			}else if( solicitud['meta_data'][name] ){
				value = solicitud["meta_data"][name];
				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log(
						`OK. Se ha encontrado en solicitud['meta_data'][${name}]`
					);
        }
				i.addEventListener("change", (e) => {
					let el = e.target;
					change_tag_grupo_formulario(el);
				});
			}else{
				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log(`F. El atributo ${name}, no se ha encontrado en el objeto solicitud`)
        }
				return;
			}

			change_input( i, value )
		}else{
			if (configuracionFormularioSolicitud.log_level >= 1) {
        console.log(`F. Key ${name} no existe en solicitud`);
      }
		}
	} )

	//Volvemos a false la variable de la primera carga
	window.first_load = false;
}
/* FIN RELLENAR INPUTS CON VALORES DEL OBJETO JSON */

/* GET ALL CF7 FORM INPUTS */
function get_all_cf7_form_inputs(){
	if (configuracionFormularioSolicitud.log_level >= 2) {
    console.log(`get_all_cf7_form_inputs()`);
  }
	let ins = Array.from(
    document.querySelectorAll(
      "select.wpcf7-form-control, input.wpcf7-form-control, textarea.wpcf7-form-control ,input[type='checkbox']"
    )
  );
	return ins;
}
/* FIN GET ALL CF7 FORM INPUTS */


/* FUNCTION CHANGE INPUT*/
async function change_input( input, value ){
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log('Input Before')
		console.log(input)
  }
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log(`Before input.value: ${input.value}`)
    console.log(`change_input(${input.name}, ${value})`);
  }
	//console.log(input)
	switch (input.type){
		case "checkbox":
			if( value.toLowerCase != "no"){
				input.checked = true;
			}else{
				input.checked = false;
			}
			break;

		case "file":
			console.log(`FILE: input[name="${input.name}"]. Value: ${value}`)
			let files = JSON.parse(value)
			console.log(files)
			console.log(typeof files)

			if(typeof files == 'string'){
				files = JSON.parse(files)
				console.log(files);
				console.log(typeof files);
			}
			let parent;

			if(["otros_documentos_adjuntos[]"].includes(input.name)){
				console.log("otros_documentos_adjuntos[]");
				parent = document.querySelector("#grid-otros-documentos-adjuntos .file-list");
				parent.innerHTML = '';
				//console.log(files)
				//files = JSON.parse(files)
				//console.log(files)
				if( !files || files == null || typeof files == undefined ){
					return false;
				}

				files.forEach( f => {
					let html = `
					<div id="otros-documentos-row-${f.identificador}" class="grid-adjuntos-item documento-adjunto-wrapper">
						<div class="grupo-formulario">
							<span class="tag-documento-adjuntado"><i class="fa-regular fa-file-pdf"></i></span>
						</div>
						<div class="grupo-formulario">
							<span class="tag-nombre-archivo">${f.name}</span>
						</div>
						<div class="grupo-formulario">
							<span class="tag-fecha-adjuntado">
								<div class="yyyymmdd_hhmmss_datetime">
									<span>${f.fecha}</span>
								</div> 
							</span>
						</div>
						<div class="grupo-formulario">
							<span class="tag-estado-envio">OK</span>
						</div>
						<div class="grupo-formulario">
							<button id="otros-documentos-borrar-${f.identificador}" class="borrar-documento-btn"><i class="fa-regular fa-trash-can"></i></button>
						</div>
					</div>
						<input type="hidden" id="otros-documentos_remove_${f.identificador}"  name="otros-documentos_remove_${f.identificador}" value="0" />
						`;
						parent.insertAdjacentHTML( 'beforeend', html )
					document.querySelector(`#otros-documentos-borrar-${f.identificador}`).addEventListener('click', e => {
						e.preventDefault()
						let row = document.querySelector(`#otros-documentos-row-${f.identificador}`)
						row.parentElement.removeChild(row)
						document.querySelector(`#otros-documentos_remove_${f.identificador}`).value = 1;
					} )
				} )

				return true;
			}else{
				parent = findParent( {maxDepth: 5, find: 'grid-adjuntos-item', element:input } )

				console.log('Antes del bucle de files')
				console.log(`typeof files: ${typeof files}`)
				if(typeof files == "string"){
					files = JSON.parse( files )
				}
				console.log(files)
	
				files.forEach( async f => {
					console.log('file:')
					console.log(f)
	
					console.log('parent')
					console.log(parent)
	
					let nombre = parent.querySelector(".tag-nombre-archivo")
					nombre.innerHTML = f.name
	
					let fecha = parent.querySelector(".tag-fecha-adjuntado")
					fecha.innerHTML = f.fecha;
					
					let estado = parent.querySelector(".tag-estado-envio")
					estado.innerHTML = 'OK';
	
					let borrarBtn = parent.querySelector(".borrar-documento-btn");
					borrarBtn.addEventListener('click', async e=>{
						e.preventDefault();
						var grid_adjuntos_item = findParent( {maxDepth: 5, find: 'grid-adjuntos-item', element:e.target } )
						console.log('grid_adjuntos_item')
						console.log(grid_adjuntos_item)
						console.log('grid_adjuntos_item ID')
						console.log(grid_adjuntos_item.id)
						var parent = document.querySelector(`#${grid_adjuntos_item.id}`).parentElement;
						console.log('parent')
						console.log(parent)
						let qs = `input[name="remove_archivo_${grid_adjuntos_item.id.replaceAll("-","_")}"]`;
						console.log( `qs: ${qs}`)
						parent.querySelector(qs).value = 1;
						try {
							parent.removeChild( grid_adjuntos_item )
						} catch (error) {
							console.log( {'error':error} )
						}
					})
					borrarBtn.disabled = false;
	
				} ) 
				return;
			}


		default: 
			input.value = value;
	}
	input.dispatchEvent( new Event('change'));
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log('Input After')
		console.log(`input.value: ${input.value}`)
		console.log(input)
  }
}

function rellenar_documento_adjunto( parent, valores ){
	let nombre = parent.querySelector(".tag-nombre-archivo");
  nombre.innerHTML = valores.nombre;

  let fecha = parent.querySelector(".tag-fecha-adjuntado");
  fecha.innerHTML = valores.fecha;

  let estado = parent.querySelector(".tag-estado-envio");
  estado.innerHTML = valores.estado;

	let borrarBtn =  parent.querySelector(".borrar-documento-btn");
	borrarBtn.disabled = valores.borrarBtn
}

function change_input_byName( name_input, value ){
	let input = document.querySelector(`[name="${name_input}"]`)
	input.value = value;
	//input.dispatchEvent( new Event('change'));

	change_tag_input( input, value )
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log(`change_input_byName(name:${name_input}, value:${value})`)
		console.log(input)
  }
}
function change_tag_input( input, value ){
	let parent = input.parentElement;
	let maxDepth = 5;
	while( !parent.classList.contains('grupo-formulario') || maxDepth <= 0 ){
		parent = parent.parentElement
		maxDepth--
	}
	if( parent.classList.contains('grupo-formulario') ){
		parent.querySelector(".tag-grupo-formulario").innerHTML = value;
	}
}
/* FIN FUNCTION CHANGE INPUT */

/* ONCHANGE EVENT FOR FORM */
function onchange_inputs_form( query ){
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log('function onchange_inputs_form()')
	}
	let form = document.querySelector(query)
	let keys_to_replace_text = ['campo_actuacion', 'tipo_instalacion', 'subtipo_instalacion', 'tipo_expediente']
	if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log(`onchange_inputs_form( query='${query}' )`);
		console.log('FORM')
		console.log(form)
  }
	form.addEventListener('change', e => {
		let el = e.target;
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log('Evento Change En:')
			console.log(el)
    }
		let temp = el;

		if( el.tagName == 'INPUT' || el.tagName == 'SELECT' || el.tagName == 'TEXTAREA' ){

			let maxDepth = 5;
			while( !temp.classList.contains('grupo-formulario') && maxDepth > 0 ){
				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log('element: '+el.name)
					console.log(temp)
				}
				temp = temp.parentElement

				maxDepth--
			}

			if( !temp.classList.contains('grupo-formulario') ){
				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log(`El input[name="${el.name}"] no se ha cambiado (No está contenido en un padre con clase '.grupo-formulario')`)
				}
				return false;
			}
			let tag = temp.querySelector(".tag-grupo-formulario");
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log('Tag Grupo Formulario')
				console.log(tag)
      }
			if( !tag || tag == null || typeof tag == 'undefined'){
				return "Input sin Tag"
			}
			tag.innerHTML = el.value;
		}
	})
}
/* FIN ONCHANGE EVENT FOR FORM */


jQuery('document').ready(()=>{
	let numeros_documentos = document.querySelectorAll('input[name*="numero_documento_"]')
	if (configuracionFormularioSolicitud.log_level >= 2) {
		console.log('numeros_documentos')
		console.log(numeros_documentos)
  }
	numeros_documentos.forEach( i => {
		i.addEventListener('change', e=>{
			let target = e.target;
			if( window.first_load ){
				if (configuracionFormularioSolicitud.log_level >= 2) {
					console.log(`${target.name} ignorado. Razón: first_load == true`)
				}
				return;
			}
			if (configuracionFormularioSolicitud.log_level >= 2) {
				console.log('numero_documento_* change')
				console.log(e.target)
			}

			showLoader();

			fetch(`/wp-json/oondeo/v1/getentidad_by?field=numero_documento&value=${target.value}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(
        (res) => {
          if (configuracionFormularioSolicitud.log_level >= 2) {
            console.log(`----firs.then ${res}`);
          }

          res.json().then(
            (data) => {
              data = JSON.parse(data);
							
							if (configuracionFormularioSolicitud.log_level >= 2) {
								console.log("MY JSON");
								console.log(data);
							}
							let name = i.name.split('_')
							name.shift()
							name.shift()
							let entidad = name.join("_");
							if (configuracionFormularioSolicitud.log_level >= 2) {
								console.log(name)
								console.log(`entidad: ${entidad}`)
							}
							change_datos_entidad( entidad, data )
              // fill_inputs_from_json_object(data);
              //get_HTML_formulario( data.meta_data.campo_actuacion )
							removeLoader();
            },
            (jsonError) => {
              console.log("JSON ERROR");
              console.error(jsonError);
							removeLoader();
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
    })
	} )
})

function change_datos_entidad( entidad, datos, clean=false ){
	if (configuracionFormularioSolicitud.log_level >= 1) {
		console.log('entidad: '+entidad)
		console.log('datos')
		console.log(datos)
  }
	if(!clean){
		let campos_validos = ["ID", "hay", "rol", "tipo_documento", "razon_social", "descripcion_razon_social", "descripcion", "provincia", "poblacion", "tipo_via", "via", "numero", "portal", "escalera", "piso", "puerta", "telefono_fijo", "telefono_movil", "email", "codigo_postal"];
		if(entidad == "titular"){
			campos_validos.push("es_empresa");
		}
		let datos_clean = [];
		campos_validos.forEach( cv => {
			switch(cv){
				case 'hay':
					datos[cv] = "Si"
					break;

				default:
					if( datos[cv] ){
						if( Array.isArray( datos[cv] ) ){
							datos[cv] = datos[cv][0];
						}

						datos_clean[cv.toLowerCase()] = datos[cv];
					}
			}
		})
		if (configuracionFormularioSolicitud.log_level >= 1) {
			console.log("datos_clean")
			console.log(datos_clean)
		}

		datos = datos_clean
	}

	let input, in_name;
	Object.entries(datos).forEach( ([key, value]) => {
		in_name = key + "_" + entidad
		if (configuracionFormularioSolicitud.log_level >= 1) {
			console.log(`key: ${key} - value: ${value}`)
			console.log(in_name)
		}
		input = document.querySelector(`[name="${in_name}"]`)
		if (configuracionFormularioSolicitud.log_level >= 1) {
			console.log(input)
		}
		if( input ){
			input.value = value;
		}
	} )

}

/* DEBUG CF7 JS Events */
jQuery('document').ready(()=>{
	document.addEventListener(
		"wpcf7submit",
		function (event) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("wpcf7submit");
		}
			//window.location.href = "/home"
		},
		false
	);
	document.addEventListener(
		"wpcf7spam",
		function (event) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("wpcf7spam");
		}
		},
		false
	);
	document.addEventListener(
		"wpcf7mailsent",
		function (event) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("wpcf7mailsent");
		}
		},
		false
	);
	document.addEventListener(
		"mailfailed",
		function (event) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("mailfailed");
		}
		},
		false
	);
	document.addEventListener(
		"wpcf7submit",
		function (event) {
		if (configuracionFormularioSolicitud.log_level >= 2) {
			console.log("wpcf7submit");
		}
		},
		false
	);
})
// /* FIN DEBUG CF7 JS Events */