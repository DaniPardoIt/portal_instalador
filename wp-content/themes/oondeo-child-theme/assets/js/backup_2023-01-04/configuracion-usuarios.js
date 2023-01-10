
/* CONFIGURACIÓN GLOBAL */
const users_per_page = 4;

/* FIN CONFIGURACIÓN GLOBAL */


jQuery('document').ready(function(){
	console.log(window.users)

	jQuery('#tecnico').click();
})

function get_actual_user_type(){
	return jQuery(".user-type-btn.selected").attr('id');
}

async function reload_users( user_type ){
	const response = await fetch(`/wp-json/oondeo/v1/get_public_users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
	const data = await response.json();
	if( data ){
		window.users = JSON.parse(data);
		return window.users
	}else{
		return false;
	}
}

function change_user_list_wrapper( user_type ){
	console.log(`user_type = ${user_type}`)

	jQuery('.user-type-btn').removeClass('selected')
	jQuery(`#${user_type}`).addClass('selected')

	let user_list_container = jQuery('.user-list-container')

	jQuery('[name="type_user"]').val( user_type )

	switch( user_type ){
		case 'tecnico':
			build_dom_tecnico( user_list_container )
			break;

		case 'inspector':
			build_dom_inspector( user_list_container )
			break;
	}
}

async function build_dom_tecnico( user_list_container ){

	html = `
		<div class="row">
			<button id="add_user" class="btn btn-success" onclick="add_user('tecnico')">
				<i class="fa-solid fa-user-plus"></i> 
				<span>Añadir Técnico</span>
			</button>
			<input type="hidden" name="type_user" value="tecnico"/>
		</div>
	
		<div class="user-list-wrapper grid-1-col">
			<div class="user-list-search-container">
				SEARCH ZONE
			</div>
			<div class="user-list grid-1-col mt-30">
				TÉCNICO
			</div>
		</div>

		<div class="row user-list-navigation-wrapper">

		</div>
	`;

	console.log(user_list_container)
	await user_list_container.html( html )

	filtered_users = window.users.filter((u) => {
    if (u.roles.includes("tecnico") && !u.roles.includes("administrator"))
      return u;
  });
	window.users.filtered_users = filtered_users;
	console.log( filtered_users )

	const user_pages = Math.ceil( filtered_users.length / users_per_page )
	console.log(`user_pages: ${user_pages}`);

	let user_list = jQuery('.user-list')
	user_list.html(
    `
		<div 
			class="user-list-item user-list-item-header">
			<div class="user-name">Usuario</div>
			<div class="user-firstname">Nombre</div>
			<div class="user-lastname">Apellidos</div>
			<div class="user-email">Email</div>
			<div class="user-actions">Acciones</div>
		</div>
		`
  );

	filtered_users.forEach((fu) => {
		let user_enabled = fu.meta_data['wp-approve-user'] == "1" ? true : false;

		console.log(`user_enabled: ${user_enabled}`)

    let html_user = `
			<div 
			class="user-list-item ${user_enabled ? "enabled" : "disabled"}" 
			data_username="${fu.data.user_login}">
				<div class="user-name">${fu.data.user_login}</div>
				<div class="user-firstname">${fu.meta_data.first_name}</div>
				<div class="user-lastname">${fu.meta_data.last_name}</div>
				<div class="user-email">${fu.data.user_email}</div>
				<div class="user-actions">
					<button class="btn" onclick="edit_user(this)">
						<span>Editar</span> 
						<i class="fa-solid fa-pencil"></i>
					</button>
					${
            user_enabled
              ? `<button class="btn btn-error" onclick="click_enable_disable_user(this, 'disable')"><span>Desactivar</span><i class="fa-regular fa-circle-xmark"></i></button>`
              : `<button class="btn btn-success" onclick="click_enable_disable_user(this, 'enable')"><span>Activar</span><i class="fa-regular fa-circle-check"></i></button>`
          }
					
				</div>
			</div>
		`;

		user_list.append( html_user )
  });
}
async function build_dom_inspector( user_list_container ){

	html = `
		<div class="row">
			<button id="add_user" class="btn btn-success" onclick="add_user('inspector')">
				<i class="fa-solid fa-user-plus"></i> 
				<span>Añadir Inspector</span>
			</button>
			<input type="hidden" name="type_user" value="inspector"/>
		</div>
	
		<div class="user-list-wrapper grid-1-col">
			<div class="user-list grid-1-col mt-30">
				INSPECTOR
			</div>
		</div>
		

		<div class="row user-list-navigation-wrapper">

		</div>
	`;

	console.log(user_list_container)
	await user_list_container.html( html )

	filtered_users = window.users.filter((u) => {
    if (u.roles.includes("inspector") && !u.roles.includes("administrator"))
      return u;
		}
	);
	console.log(filtered_users);

  let user_list = jQuery(".user-list");
  user_list.html(
    `
		<div 
			class="user-list-item user-list-item-header">
			<div class="user-name">Usuario</div>
			<div class="user-firstname">Nombre</div>
			<div class="user-lastname">Apellidos</div>
			<div class="user-email">Email</div>
			<div class="user-actions">Acciones</div>
		</div>
		`
  );

  filtered_users.forEach((fu) => {
    let user_enabled = fu.meta_data["wp-approve-user"] == "1" ? true : false;

    console.log(`user_enabled: ${user_enabled}`);

    let html_user = `
			<div 
			class="user-list-item ${user_enabled ? "enabled" : "disabled"}"
			data_username="${fu.data.user_login}">
				<div class="user-name">${fu.data.user_login}</div>
				<div class="user-firstname">${fu.meta_data.first_name}</div>
				<div class="user-lastname">${fu.meta_data.last_name}</div>
				<div class="user-email">${fu.data.user_email}</div>
				<div class="user-actions">
					<button class="btn" onclick="edit_user(this)">
						<span>Editar</span> 
						<i class="fa-solid fa-pencil"></i>
					</button>
					${
            user_enabled
              ? `<button class="btn btn-error" onclick="click_enable_disable_user(this, 'disable')"><span>Desactivar</span><i class="fa-regular fa-circle-xmark"></i></button>`
              : `<button class="btn btn-success" onclick="click_enable_disable_user(this, 'enable')"><span>Activar</span><i class="fa-regular fa-circle-check"></i></button>`
          }
					
				</div>
			</div>
		`;

    user_list.append(html_user);
  });
}

function add_user(user_type = jQuery('[name="type_user"]').val()) {
  console.log(`add_user() user_type: ${user_type}`);
	window.location.href= `/usuario/?type=${user_type}`
}

async function click_enable_disable_user( button, action ){
	console.log(`click_enable_disable_user( action:${action} )`);
  console.log(button);

  let user = await get_user_to_be_modified(button);
	let msg;

	if( action == 'enable' ){
		msg = `El usuario ${user.userName} ha sido desactivado`;
		console.log( msg )
		enable_user( user, (msg)=>{
			console.log(`msg: ${msg}`);
			addNotification( msg, ``, 'success' );
		} )
	}else if( action == 'disable' ){
		msg = `El usuario ${user.userName} ha sido desactivado`;
		console.log( msg )
		disable_user( user, (msg)=>{
			console.log(`msg: ${msg}`)
			addNotification( msg, ``, 'error' );
		} )
	}
	return;
}

function disable_user( user, callback ){
	console.log('callback')
	console.log(callback)
	let html_modal = `
	<strong>¿Seguro que deseas desactivar el usuario?</strong>
	<p>Si haces click en sí, se desactivará el usuario</p>
	<div class="buttons-container"><button onclick="
		modify_user_status('${user.userName}', 0 ${ (callback) ? ", "+callback : "" });
		removeModal();
	">Sí</button><button onclick="removeModal()">No</button></div>
`;
	buildModal(html_modal, "xs");
}

function enable_user( user, callback ){
	console.log('callback')
	console.log(callback)
	let html_modal = `
    <strong>¿Seguro que deseas activar el usuario?</strong>
    <p>Si haces click en sí, se activará el usuario</p>
    <div class="buttons-container"><button onclick="
      modify_user_status('${user.userName}', 1 ${ (callback) ? ", "+callback : "" });
      removeModal();
    ">Sí</button><button onclick="removeModal()">No</button></div>
  `;
  buildModal(html_modal, "xs");
}

async function modify_user_status( userName, status, callback=null ){
	console.log(`do_enable_user( ${userName} )`);
	const response = await fetch(
		`/wp-json/oondeo/v1/modify_user_status?username=${userName}&status=${status}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
	const data = await response.json();

	console.log("Respuesta do_enable_user -> fetch");
	console.log(data)

	$users = await reload_users()
	if( !users ) return false 

	user_type = await get_actual_user_type();
	await change_user_list_wrapper(user_type);

	// if( status == 1 ){
	// 	addNotification( `El usuario ${userName} ha sido activado`, ``, 'success' );
	// }else{
	// 	addNotification( `El usuario ${userName} ha sido desactivado`, ``, 'error' );
	// }

	if( callback ){
		await callback();
		console.log('yep');
	}

	return data;
}

async function edit_user( button ){
	console.log('edit_user')
	console.log(button)

	const user = await get_user_to_be_modified(button)

	window.location.href = `/usuario?username=${user.userName}`
}

function get_user_to_be_modified( button ){

	console.log(button);

	let userListItem = jQuery(button).closest(".user-list-item");
	let user = {
		userName: userListItem.find(".user-name").text(),
		firstName: userListItem.find(".user-firstname").text(),
		lastName: userListItem.find(".user-last").text(),
		emailName: userListItem.find(".user-email").text(),
	};

	console.log({ user: user, userListItem: userListItem });

	return user;
}