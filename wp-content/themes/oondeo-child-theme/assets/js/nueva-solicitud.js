

jQuery('document').ready( ()=>{
	console.log( DatosInstalaciones );

	const container = document.querySelector('selector-nueva-solicitud-container wrapper');
	window.campoActuacion, window.tipoExpediente, window.tipoInstalacion, window.subtipoInstalacion;

	window.inCampoActuacion = document.querySelector('#campo_actuacion')
	window.inTipoExpediente = document.querySelector("#tipo_expediente");
	window.inSinInstalacion = document.querySelector("#sin_instalacion");
	window.inPDFSinInstalacion = document.querySelector("#pdf_sin_instalacion");
	window.inTipoInstalacion = document.querySelector("#tipo_instalacion");
	window.inSubtipoInstalacion = document.querySelector("#subtipo_instalacion");
	window.inTipoSolicitud = document.querySelector("#tipo_solicitud");
	window.inDenominacion = document.querySelector("#denominacion");
	window.btnCrearSolicitud = document.querySelector("#crear-solicitud");


	/* SELECTORES */
	buildSelectOptions( "campo_actuacion", DatosInstalaciones );

	inCampoActuacion.addEventListener( 'change', e=>{
		const inCa = e.target
		campoActuacion = DatosInstalaciones.filter( ca => {
			return ca.short_name == inCa.value;
		} )[0]
		
		let arrOpt = [...campoActuacion.subcats];

		buildSelectOptions( "tipo_instalacion", arrOpt )
		buildSelectOptions("tipo_solicitud", []);
	})

	inTipoInstalacion.addEventListener( 'change', e=>{
		const inTi = e.target
		tipoInstalacion = campoActuacion.subcats.filter( ti => {
			return ti.short_name == inTi.value;
		} )[0]

		let arrSubcats = [...tipoInstalacion.subcats];

		buildSelectOptions( "subtipo_instalacion", arrSubcats )

		let arrTiposSolicitud = [...tipoInstalacion.tipos_solicitud]
		buildSelectOptions("tipo_solicitud", arrTiposSolicitud)
	})
	/* FIN SELECTORES */


	/* TIPO EXPEDIENTE */
	buildSelectOptions( 'tipo_expediente', TiposExpediente );
	inTipoExpediente.addEventListener('change', e=>{
		inTe = e.target;
		const tipoExpedienteContenido = document.querySelector('#grupo-tipo-expediente .contenido')

		if( inTe.value == 'mod' ){
			tipoExpedienteContenido.classList.remove('d-none')
		}else{
			tipoExpedienteContenido.classList.add("d-none");
		}
	})

	inSinInstalacion.addEventListener('change', e => {
		inSi = e.target;
		const tipoExpedienteFileContainer = document.querySelector('#grupo-tipo-expediente .file-input-container')

		if( inSi.checked ){
			tipoExpedienteFileContainer.classList.remove('d-none')
		}else{
			tipoExpedienteFileContainer.classList.add("d-none");
		}
	})
	/* FIN TIPO EXPEDIENTE */


	/* BOTON CREAR SOLICITUD */
	btnCrearSolicitud.addEventListener('click', e=>{
		btn = e.target;
		checkNuevaSolicitudInputs()
	})
	/* FIN BOTON CREAR SOLICITUD */
} 
)

function checkNuevaSolicitudInputs(){
	let nuevaSolicitudOK = true;
	let msgError = [];

	let arrInputs = [ inCampoActuacion, inTipoExpediente, inTipoInstalacion, inSubtipoInstalacion, inTipoSolicitud, inDenominacion ]

	arrInputs.forEach( input => {
		// console.log(`Input ID = ${input.id}`)
		subcats = null;
		if( input.id == 'subtipo_instalacion' && typeof tipoInstalacion !== 'undefined' ){
			subcats = tipoInstalacion.subcats
			// console.log(tipoInstalacion)
		}
		// Primera condicion input sin valor y subcats == null
		// Segunda condición input sin valor, subcats es array con valores (Si subcats es array vacío, quiere decir que el tipo de instalación no tiene subcategoría, así que es correcto que el campo subtipo_instalación esté vacío)
		if( (!input.value && !subcats) || (!input.value && subcats && subcats.length > 0) ){
			console.log('Subcats: ')
			console.log(subcats)
			let parent = input;
			// console.log('error Input')
			// console.log(input)
			// console.log(parent)
			while( !parent.classList.contains('grupo-input') && parent.tagName !='MAIN' ){
				parent = parent.parentElement;
			}
			
			// console.log("error Input (Despues de While)");
      // console.log(input);
      // console.log(parent);
			if (parent.classList.contains("grupo-input")){
        parent.classList.add("error");
				msgError.push(`Debes rellenar el campo: ${input.getAttribute('data-name')}.\n`)
				nuevaSolicitudOK = false;
			}
		}else{
			let parent = input;
      // console.log("error Input");
      // console.log(input);
      // console.log(parent);
      while ( !parent.classList.contains("grupo-input") && parent.tagName != "MAIN") {
        parent = parent.parentElement;
      }
			if (parent.classList.contains("grupo-input")) {
				if(parent.classList.contains('error')){
					parent.classList.remove('error')
				}
        parent.classList.add("success");
      }
		}
	} )

	if( nuevaSolicitudOK ){
		window.location.href = `/solicitud-formulario?campo_actuacion=${inCampoActuacion.value}&tipo_expediente=${inTipoExpediente.value}&tipo_instalacion=${inTipoInstalacion.value}&subtipo_instalacion=${inSubtipoInstalacion.value}&tipo_solicitud=${inTipoSolicitud.value}&denominacion=${inDenominacion.value}&debug=false`;
	}else{
		addNotification(
			'Error',
			msgError,
			'error'
		)
	}
}

//construye las opciones del selector
function buildSelectOptions( idSelect, arrOpt ){
	const select = document.querySelector(`#${idSelect}`)

	if( idSelect == 'campo_actuacion' ){
		removeChilds( select )
		removeChilds( inTipoInstalacion )
		removeChilds( inSubtipoInstalacion )
	}else if( idSelect == "tipo_instalacion" ) {
    removeChilds( select );
		removeChilds( inSubtipoInstalacion );
  }else{
		removeChilds( select )
	}
	
	//opcion por defecto en blanco
	opt = document.createElement("option");
	opt.setAttribute('disabled','')
	opt.setAttribute('selected','')
	select.appendChild(opt)

	arrOpt.forEach( dataOpt => {
		opt = document.createElement('option')
		opt.id = dataOpt.slug
		opt.value = dataOpt.short_name
		opt.appendChild(document.createTextNode(dataOpt.name))
		select.appendChild( opt )
	})
}

