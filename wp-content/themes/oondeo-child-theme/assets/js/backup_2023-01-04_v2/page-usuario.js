
function get_form_inputs( query = null, ret_mode = 'jQuery' ){

	if( !query ){
		query = ".wpcf7-form-control";
	}

	let inputs = jQuery( query );
	if(ret_mode == 'jQuery'){
		return inputs;
	}else{
		return inputs.toArray();
	}
}

function fill_input_fields( in_to_fill = null ) {
	// console.log( typeof in_to_fill )
	// console.log( in_to_fill )

  if( !in_to_fill ) return false;
	
	let db_data = window.user.form_data;
	let input

	in_to_fill.forEach( i => {
		// console.log( i );
		input = jQuery(`[name="${i}"]`)
		
		if( db_data[i] ){
			// console.log( {
			// 	'i': 				i,
			// 	'input': 		input,
			// 	'value':		db_data[i]
			// } )
			input.val( db_data[i] )
		}

		// Disable inputs
		if( ['user_id', 'user_type', 'user_login', 'user_email', 'tipo_documento'].includes(i) ){
			input.prop("disabled", true);
		}
	} )
}

async function click_registro_btn( event, action ){
	event.preventDefault();
	const btn = event.target;
	const form = jQuery(btn).closest('form')

	console.log( {
		'action':		action,
		'btn':			btn,
		'form':			form
	} )

	switch (action) {
    case "save":
			jQuery("input:disabled, select:disabled").each(function () {
        jQuery(this).prop("disabled", false);
      });
			
			form.submit();
      break;

    case "disable":
			disable_user( { userName : window.user.data['user_login'] }, ()=>{
				location.reload();

			} )
      break;

		case "enable":
			enable_user({ userName: window.user.data["user_login"] }, () => {
        location.reload();

      });
			break;

    case "goback":
			history.back();
      break;

		default:
			break;
  }
}

jQuery('document').ready( function(){
	if( window.user.meta_data['wp-approve-user'] ){
		const isEnabled = window.user.meta_data['wp-approve-user']
		const contenedor = jQuery(".contenedor-botones-formulario");
		let button
		
		if( isEnabled == 1 ){
			button = `<button id="enable-disable-btn" class="btn-outline btn-error" onclick="click_registro_btn(event, 'disable')"><i class="fa-regular fa-thumbs-down"></i><span>Desactivar</span></button>`;
		}else{
			button = `<button id="enable-disable-btn" class="btn-outline btn-success" onclick="click_registro_btn(event, 'enable')"><i class="fa-regular fa-thumbs-up"></i><span>Activar</span></button>`;
		}

		contenedor.append(button)
	}

	jQuery('[name="user_login"]').change(function (event) {
		console.log("Change user_login");
	});

	jQuery('[name="user_email"]').change(function (event) {
		console.log("Change user_email");
	});

} )