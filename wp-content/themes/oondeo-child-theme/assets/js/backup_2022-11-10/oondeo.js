

function documentReady( funct ){
	document.addEventListener("DOMContentLoaded", e => { 
		funct
	});
}

function removeChilds( el ){
	while(el.hasChildNodes()){
		el.removeChild(el.firstChild)
	}
}

function removeClass( element, classToRemove ){
	// console.log('element');
	// console.log(element)
	// console.log('classToRemove')
	// console.log(classToRemove)
	if( Array.isArray( element ) ){
		element.forEach( el => {
			removeClass( el, classToRemove );
		} )
		return true;
	}
	if( Array.isArray( classToRemove ) ){
		classToRemove.forEach( c => {
			removeClass( element, c );
		} )
		return true;
	}
	element.classList.remove( classToRemove )
	//console.log( `removeClass( Element: ${element}; ClassToRemove: ${classToRemove} )` );
	return true;
}

function urlDecode( url ){
	return decodeURIComponent( url.replace(/\+/g, ' ') )
}

/* MODAL */
function buildModal() {
    let body = document.getElementsByTagName( 'body' )[0];
    let modalContainer = document.createElement( 'div' );
    modalContainer.id = 'modal-container';
    modalContainer.className = 'fade-in';
        let modal = document.createElement( 'div' );
        modal.id = 'modal';
            let closeButton = document.createElement( 'i' );
            closeButton.className = 'fa-solid fa-xmark';
            closeButton.id = 'modal-close-button';
            closeButton.addEventListener( 'click', () => {
                removeModal();
            } )
            modal.appendChild( closeButton );

            let content = document.createElement( 'div' );
            content.id = 'modal-content';
            modal.appendChild( content );
        modalContainer.appendChild( modal );
    body.appendChild( modalContainer );
    
    setTimeout( () => {
        modalContainer.classList.remove( 'fade-in' );
    }, 300 )

		return content;
}

function removeModal(){
    let body = document.getElementsByTagName( 'body' )[0];
    let modalContainer = document.getElementById( 'modal-container' );
    modalContainer.classList.add( 'opacity-0' );

    setTimeout( () => {
        body.removeChild( modalContainer )
    }, 300 )/* Debe ser el Timeout igual que el tiempo de animacion de .fade-out */
}

function showModal() {
    let modalContainer = document.getElementById( 'modal-container' );
    if(modalContainer != null){
        modalContainer.classList.remove( 'd-none' );
        modalContainer.classList.add( 'fade-in' );
        setTimeout( () => {
            modalContainer.classList.remove( 'fade-in' );
        }, 300 )
    }else{
        console.log('modalContainer no existe')
    }
}

function hideModal() {
    let modalContainer = document.getElementById( 'modal-container' );
    if(modalContainer != null){
        modalContainer.classList.add( 'fade-out' );
        setTimeout( () => {
            modalContainer.classList.remove( 'fade-out' );
            modalContainer.classList.add( 'd-none' );
        }, 20000 )
    }else{
        console.log('modalContainer no existe')
    }
}
/*! FIN MODAL  */

/* NOTIFICATIONS */
function addNotification( title, message, type ){
	let notificationWrapper = document.querySelector('#notification-popup-wrapper')
	let notification = document.createElement('div')
	setTimeout( ()=>{
		notification.parentElement.removeChild(notification)
	}, 10000 )
	notification.className = 'notification'
	console.log(type)

	switch(type){
		case "error": 
			notification.classList.add('error');
			break;

		case "success": 
			notification.classList.add('success');
			break;
			console.log('success????')

		case "warning":
			notification.classList.add('warning');
			break;
		
		case "tip": 
			notification.classList.add('tip');
			break;
	}
		let btn = document.createElement('button')
		btn.className = 'close-button'
		btn.addEventListener('click', e => {
			let notif = e.target;
			while ( ! notif.classList.contains('notification') ){
				notif = notif.parentElement
			}
			removeChildFromParent( notif )
		})
			let i = document.createElement('i')
			i.classList.add('fa-solid', 'fa-xmark')
			btn.appendChild(i)
		notification.appendChild(btn)

		let notificationTitle = document.createElement('div')
		notificationTitle.className = 'notification-title'
			notificationTitle.appendChild(document.createTextNode( title ))
		notification.appendChild(notificationTitle)

		let notificationDescription = document.createElement('div')
		notificationDescription.className = 'notification-description'
			if( Array.isArray(message) ){
				let cont = 1;
				message.forEach( m => {
					if( cont == 1){
						notificationDescription.appendChild(document.createTextNode(m));
						cont--;
					}else{
						notificationDescription.appendChild(document.createElement('br'));
						notificationDescription.appendChild(document.createTextNode(m));
					}
					
				})
			}else{
				notificationDescription.appendChild(document.createTextNode( message ))
			}
		notification.appendChild( notificationDescription )
	notificationWrapper.appendChild(notification)
}

function removeChildFromParent( child ){
	child.parentElement.removeChild( child )
}
/* FIN NOTIFICATIONS */