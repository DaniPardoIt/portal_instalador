

function build_html_repeater( json ){
	let data = JSON.parse( json );
	console.log('SOLICITUD')
	console.log(window.solicitud)
	window.solicitud.meta_data.tasas.structure = data;
	console.log()
	console.log( data )
}

function create_cf7_oondeo_repeater( name ){
	let repeaterWrapper = jQuery(".repeater-wrapper");
	let html, data
	let fields = window.cf7_oondeo_fields;
	if( !fields.tasas ){
		fields.tasas = [];
	}
	console.log("create_cf7_oondeo_repeater(Antes)");
	console.log(fields.tasas);
	fields.tasas.push({ 'justificante_pago': null, 'importe_pago': null, 'nombre_banco': null, 'entidad': null, 'cuenta_bancaria': null });
	console.log("create_cf7_oondeo_repeater(Despues)");
	console.log(fields.tasas);
	print_repeater_tasas( name )
}

function refresh_repeater_main_input_value( name, data ){
	//Refresh main repeater tasas input
	jQuery(`[name="${name}"]`).val( JSON.stringify( data ) )
}

async function print_repeater_tasas(name='tasas'){
	console.log(`function print_repeater_tasas(${name})`)
	let repeaterWrapper = jQuery(".repeater-wrapper");
	let tasas = window.cf7_oondeo_fields.tasas;
	let numTasas = tasas.length;
	console.log({'tasas': tasas, 'numTasas': numTasas, 'wrapper': repeaterWrapper})

	refresh_repeater_main_input_value( name, tasas )

	switch( name ){

		case "tasas":
			await repeaterWrapper.html('');

			for( let i=0; i<numTasas; i++){
				html = `
				<div id="repeater_tasas_${i}" class="repeater-item repeater-closed">
					<div class="repeater-item-header">
						<h4 class="repeater-item-title">Tasa ${i + 1}</h4>
						<div class="repeater-actions-container">
							<button id="edit_repeater_tasas__${i}" class="btn btn-azul">
								<i class="fa-regular fa-pen-to-square"></i>
							</button>
							<button id="duplicate_repeater_tasas__${i}" class="btn btn-naranja">
								<i class="fa-regular fa-copy"></i>
							</button>
							<button id="remove_repeater_tasas__${i}" class="btn btn-error">
								<i class="fa-regular fa-trash-can"></i>
							</button>
						</div>
					</div>
					<div class="repeater-input-container grid-2-col gap-20">
						<div id="grupo_justificante_pago__${i}" class="grupo-formulario">
							<label for="justificante_pago__${i}">Justificante de Pago</label> <input type="text" name="justificante_pago__${i}" value="${
          tasas[i].justificante_pago ? tasas[i].justificante_pago : ""
        }" class="wpcf7-form-control wpcf7-hidden">
						</div>
						<div id="grupo_importe_pago__${i}" class="grupo-formulario">
							<label for="importe_pago__${i}">Importe del Pago</label> <input type="number" name="importe_pago__${i}" value="${
          tasas[i].importe_pago ? tasas[i].importe_pago : ""
        }" class="wpcf7-form-control wpcf7-hidden">
						</div>
						<div id="grupo_nombre_banco__${i}" class="grupo-formulario">
							<label for="nombre_banco__${i}">Nombre Banco</label> <input type="text" name="nombre_banco__${i}" value="${
          tasas[i].nombre_banco ? tasas[i].nombre_banco : ""
        }" class="wpcf7-form-control wpcf7-hidden">
						</div>
						<div id="grupo_entidad__${i}" class="grupo-formulario">
							<label for="entidad__${i}">Entidad</label> <input type="text" name="entidad__${i}" value="${
          tasas[i].entidad ? tasas[i].entidad : ""
        }" class="wpcf7-form-control wpcf7-hidden">
						</div>
						<div id="grupo_cuenta_bancaria__${i}" class="grupo-formulario">
							<label for="cuenta_bancaria__${i}">Cuenta Bancaria</label> <input type="text" name="cuenta_bancaria__${i}" value="${
          tasas[i].cuenta_bancaria ? tasas[i].cuenta_bancaria : ""
        }" class="wpcf7-form-control wpcf7-hidden">
						</div>
					</div>
				</div>
				`;
				repeaterWrapper.append( html )

				repeaterWrapper.find('input').change( function(evt){
					console.log('input change')
					let el = evt.target
					// console.log({'el': el, 'nameEl': el.name, 'evt': evt})
					
					let [ nameField, index ] = el.name.split('__')
					// console.log( {'nameField': nameField, 'index':index, 'value': el.value } )
					let tasas = window.cf7_oondeo_fields.tasas;
					tasas[index][nameField] = el.value;
					console.log({'tasas': tasas})

					refresh_repeater_main_input_value("tasas", tasas);
				})
			}
			break;
			
			default:
				break;
			}
			

		jQuery(`[id^='repeater'] button`).click( function(evt){
			evt.preventDefault()
			let btn = jQuery(this)[0]
			let idBtn = btn.id;
			// console.log(btn)
			// console.log({'btn':btn, 'idBtn': idBtn});
			let idBtnSplit = idBtn.split('__')
			let numRepeater = idBtnSplit[idBtnSplit.length - 1]
			// console.log({'btn':btn, 'idBtn': idBtn, 'numRepeater': numRepeater});

			let fields = window.cf7_oondeo_fields;
			let tasas = fields.tasas;

			switch(true){
				case idBtn.includes('edit'):
					// console.log( {'idBtn': idBtn, 'btn': btn });
					let repeaterItem = jQuery(this).closest('.repeater-item')
					// console.log(repeaterItem)
					// if( !repeaterItem.hasClass('repeater-colosed') ){
					// 	repeaterItem.addClass("repeater-colosed");
					// }
					repeaterItem.toggleClass('repeater-closed')
					break;

				case idBtn.includes('duplicate'):
					console.log({'idBtn': idBtn, 'numRepeater': numRepeater, 'tasas': tasas});
					if( tasas[numRepeater] ){
						
						// console.log("duplicate(antes)");
						// console.log(tasas[numRepeater])

						tasas.push({...tasas[numRepeater]})
						// console.log("duplicate(despues)");
						// console.log(tasas[numRepeater])
						print_repeater_tasas(  )
					}
					break;

				case idBtn.includes('remove'):
					// console.log({'idBtn': idBtn, 'numRepeater': numRepeater, 'tasas': tasas});
					if(tasas[numRepeater]){
						tasas = tasas.splice( numRepeater, 1 )
						print_repeater_tasas()
					}
					break;

				default:
					console.log(`default idBtn:${idBtn}`)
					break;
			}
		} )
		jQuery(".repeater-item input, .repeater-item select, .repeater-item textarea, .btn-close-repeater-item").click( function(){
        jQuery(this).closest(".repeater-item").removeClass("repeater-closed");
		} )
		jQuery(".repeater-item-header h4").click(function () {
      jQuery(this).closest('.repeater-item').toggleClass("repeater-closed");
    });


}

function edit_repeater_tasas( numTasa ){

}

function duplicate_repeater_tasas( numTasa ){
	
}

function remove_repeater_tasas( numTasa ){
	
}

function remove_repeater_wrapper( querySelector ){
	console.log('function remove_repeater_wrapper')
	console.log({'querySelector': querySelector})
	jQuery(querySelector).html('')
}