

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
	console.log( {'name': name} )
	let repeateroondeo = window.cf7_oondeo_fields.repeateroondeo[name];
	if( !repeateroondeo.objects ){
		repeateroondeo.objects = []
	}
	let element = jQuery(repeateroondeo.content)
	console.log( {'repeateroondeo': repeateroondeo, 'element':element} )

	let fields = element.find('input,select,textarea')
	console.log({'fields': fields})

	let objNull = {};

	fields.each( function(){
		objNull[jQuery(this).attr('name')] = null;
	} )

	console.log({'objNull':objNull})

	repeateroondeo.objects.push( objNull )

	print_repeateroondeo( name )
}

function refresh_repeater_main_input_value( name, data ){
	//Refresh main repeater tasas input
	jQuery(`[name="${name}"]`).val( JSON.stringify( data ) )
}

async function print_repeateroondeo( name ){
	console.log(`function print_repeateroondeo(${name})`)
	let repeaterWrapper = jQuery(".repeater-wrapper");

	let repeateroondeo = window.cf7_oondeo_fields.repeateroondeo[name];
	let objects = repeateroondeo.objects;
	let numObjects = objects.length;
	console.log({'objects': objects, 'numObjects': numObjects, 'wrapper': repeaterWrapper})

	refresh_repeater_main_input_value( name, objects )
	let htmlElement, inputContainer, inputs
	
	repeaterWrapper.html('')

	for( let i=0; i<numObjects; i++){
		htmlElement = jQuery(
			`<div id="repeater_tasas__${i}" class="repeater-item repeater-closed">
				<div class="repeater-item-header">
					<h4>${ ( repeateroondeo.itemTitle ? repeateroondeo.itemTitle : 'Repeater') } ${i + 1}</h4>
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

				</div>
			</div>`
		);

		inputContainer = htmlElement.find('.repeater-input-container')
		console.log( `objects[${i}]` )
		console.log( objects[i] )
		inputContainer.html( repeateroondeo.content )
		
		inputs = inputContainer.find('input, select, textarea')
		inputs.each( function(){
			// Set nombres con el sufijo de índice __1
			let inputName = jQuery(this).attr('name')
			jQuery(this).attr('name', `${jQuery(this).attr('name')}__${i}`)

			if( objects[i][inputName] ){
				console.log({'inputName':inputName, 'valueObj': objects[i][inputName]})
				jQuery(this).val(objects[i][inputName]);
			}

		} )
		inputs.change( function(evt){
			console.log("input change");
      let el = evt.target;
      console.log({'el': el, 'nameEl': el.name, 'evt': evt})

      let [nameField, index] = el.name.split("__");
      console.log( {'nameField': nameField, 'index':index, 'value': el.value } )
      let objects = window.cf7_oondeo_fields.repeateroondeo[name].objects;
      objects[index][nameField] = el.value;
      console.log({ 'objects': objects });

      refresh_repeater_main_input_value(name, objects);
		} )

		repeaterWrapper.append( htmlElement )
	}

	jQuery(`[id^='repeater'] button`).click( function(evt){
		console.log('NAME')
		console.log(name)
		evt.preventDefault()
		let btn = jQuery(this)[0]
		let idBtn = btn.id;
		// console.log(btn)
		// console.log({'btn':btn, 'idBtn': idBtn});
		let idBtnSplit = idBtn.split('__')
		let numRepeater = idBtnSplit[idBtnSplit.length - 1]
		// console.log({'btn':btn, 'idBtn': idBtn, 'numRepeater': numRepeater});
		let repeateroondeo = window.cf7_oondeo_fields.repeateroondeo[name];
		let objects = repeateroondeo.objects;

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
				console.log({'idBtn': idBtn, 'numRepeater': numRepeater, 'objects': objects});
				if( objects[numRepeater] ){
					
					// console.log("duplicate(antes)");
					// console.log(tasas[numRepeater])

					objects.push({...objects[numRepeater]})
					// console.log("duplicate(despues)");
					// console.log(tasas[numRepeater])
					print_repeateroondeo( name )
				}
				break;

			case idBtn.includes('remove'):
				// console.log({'idBtn': idBtn, 'numRepeater': numRepeater, 'tasas': tasas});
				if(objects[numRepeater]){
					objects = objects.splice( numRepeater, 1 )
					print_repeateroondeo(name)
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