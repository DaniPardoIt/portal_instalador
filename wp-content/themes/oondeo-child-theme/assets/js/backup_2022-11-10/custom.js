
debugON = false;

window.addEventListener('load', () => {

/* HOME PAGE */
	if( window.location.href.includes('home') ){
		let btn_solicitudesAbiertas = document.querySelector('#solicitudes-abiertas-container');
		let btn_solicitudesCerradas = document.querySelector('#solicitudes-cerradas-container');
		let btn_nuevaSolicitud = document.querySelector('#nueva-solicitud-container');

		btn_solicitudesAbiertas.addEventListener('click', ()=>{
			window.location.href='/solicitudes-abiertas';
		})
		btn_solicitudesCerradas.addEventListener('click', ()=>{
			window.location.href='/solicitudes-cerradas';
		})
		btn_nuevaSolicitud.addEventListener('click', ()=>{
			window.location.href='/nueva-solicitud';
		})
	}
/* FIN HOME PAGE */


/* NUEVA SOLICITUD UI */
	if( window.location.href.includes('nueva-solicitud-ui/') ){
		console.log('Nueva Solicitud')
		window.catSeleccionada = {
			categoria : '', 
			subcategoria : '', 
			tipoSolicitud: ''
		}
	}
/* NUEVA SOLICITUD UI */

})


// /* NOTIFICATIONS */
// function addNotification( title, message, type ){
// 	let notificationWrapper = document.querySelector('#notification-popup-wrapper')
// 	let notification = document.createElement('div')
// 	notification.className = 'notification'
// 	console.log(type)

// 	switch(type){
// 		case "error": 
// 			notification.classList.add('error');
// 			break;

// 		case "success": 
// 			notification.classList.add('success');
// 			break;
// 			console.log('success????')

// 		case "warning":
// 			notification.classList.add('warning');
// 			break;
		
// 		case "tip": 
// 			notification.classList.add('tip');
// 			break;
// 	}
// 		let btn = document.createElement('button')
// 		btn.className = 'close-button'
// 		btn.addEventListener('click', e => {
// 			let notif = e.target;
// 			while ( ! notif.classList.contains('notification') ){
// 				notif = notif.parentElement
// 			}
// 			removeChildFromParent( notif )
// 		})
// 			let i = document.createElement('i')
// 			i.classList.add('fa-solid', 'fa-xmark')
// 			btn.appendChild(i)
// 		notification.appendChild(btn)

// 		let notificationTitle = document.createElement('div')
// 		notificationTitle.className = 'notification-title'
// 			notificationTitle.appendChild(document.createTextNode( title ))
// 		notification.appendChild(notificationTitle)

// 		let notificationDescription = document.createElement('div')
// 		notificationDescription.className = 'notification-description'
// 			notificationDescription.appendChild(document.createTextNode( message ))
// 		notification.appendChild( notificationDescription )
// 	notificationWrapper.appendChild(notification)
// }

// function removeChildFromParent( child ){
// 	child.parentElement.removeChild( child )
// }
// /* FIN NOTIFICATIONS */
