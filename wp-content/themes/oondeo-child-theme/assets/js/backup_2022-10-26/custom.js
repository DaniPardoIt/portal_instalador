function addToWindowOnload( funct ){
	if(window.addEventListener){
		window.addEventListener('load', funct)
	}else{
		window.attachEvent('onload', funct)
	}
}

function removeChilds( el ){
	while(el.hasChildNodes()){
		el.removeChild(el.firstChild)
	}
}


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

// let DatosInstalaciones = [
// 	{
// 		id:'instalaciones-baja-tension-no-industrial',
// 		slug: 'ibtni',
// 		title: 'Instalaciones Baja Tensión No Industrial',
// 		subcats:[
// 			{
// 				id:'nueva-instalacion-alumbrado-exterior',
// 				slug:'niae',
// 				title: 'Nueva Instalación Alumbrado Exterior',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-autoconsumo',
// 				slug:'nia',
// 				title: 'Nueva Instalación Autoconsumo',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-conductores-aislados-caldeo',
// 				slug:'nicapc',
// 				title: 'Nueva Instalación Conductores Aislados para Caldeo',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-cercas-electricas',
// 				slug:'nice',
// 				title: 'Nueva Instalación Cercas Eléctricas',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-maquinas-elevacion-transporte',
// 				slug:'nimdeyt',
// 				title: 'Nueva Instalación Máquinas de Elevación y Transporte',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-instalaciones-enlace-comunes',
// 				slug:'niideyc',
// 				title: 'Nueva Instalación Instalaciones de Enlace y Comunes',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-local-especial-bombas',
// 				slug:'nileb',
// 				title: 'Nueva Instalación Local Especial / Bombas',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-garajes-no-lpc',
// 				slug:'nignlpc',
// 				title: 'Nueva Instalación Garajes (NO LPC)',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-infraestructuras-recarga-vehiculos',
// 				slug:'niidrpv',
// 				title: 'Nueva Instalación Infraestructura de Recarga para Vehículos (IRVE)',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-generacion',
// 				slug:'nig',
// 				title: 'Nueva Instalación Generación',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-local-oficina-no-lpc',
// 				slug:'nilonlpc',
// 				title: 'Nueva Instalación Local/Oficina (NO LPC)',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-lpc-otros-locales-bdx',
// 				slug:'nilob',
// 				title: 'Nueva Instalación LPC. Otros Locales BDX',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-lpc-locales-reunion-trabajo-sanitarios',
// 				slug:'nilpclrts',
// 				title: 'Nueva Instalación LPC. Locales de Reunión, Trabajo y Usos Sanitarios',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-locales-riesgo-incendio',
// 				slug:'nilri',
// 				title: 'Nueva Instalación Locales con Riesgo de Incendio o Explosión, Excepto Garajes',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-otras',
// 				slug:'nio',
// 				title: 'Nueva Instalación Otras',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-piscinas-fuentes',
// 				slug:'nipf',
// 				title: 'Nueva Instalación Piscinas y Fuentes',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-quirofanos-salas-intervencion',
// 				slug:'niqsi',
// 				title: 'Nueva Instalación Quirófanos y Salas de Intervención',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-rotulos-luminosos',
// 				slug:'nirl',
// 				title: 'Nueva Instalación Destinadas a Rótulos Luminosos Salvo Inst. de B.T. según la ITC-BT44',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-temporal',
// 				slug:'nit',
// 				title: 'Nueva Instalación Temporal',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-tensiones-especiales',
// 				slug:'nite',
// 				title: 'Nueva Instalación que Utilicen Tensiones Especiales',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			},
// 			{
// 				id:'nueva-instalacion-vivienda',
// 				slug:'niv',
// 				title: 'Nueva Instalación Vivienda',
// 				img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg',
// 				imgAlt: 'Eficiencia Energética',
// 				tiposSolicitud: [
// 					{
// 						slug: 'proyecto',
// 						title: 'proyecto',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					},
// 					{
// 						slug: 'memoria',
// 						title: 'memoria',
// 						img: '/wp-content/uploads/2022/09/Eficiencia-Energetica-Azul.svg'
// 					}
// 				]
// 			}
// 		]
// 	}
// ]

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


/* NUEVA SOLICITUD */
	if( window.location.href.includes('nueva-solicitud/') ){
		console.log('Nueva Solicitud')
		window.catSeleccionada = {
			categoria : '', 
			subcategoria : '', 
			tipoSolicitud: ''
		}
		
		// function resetCategories(categories){
		// 	categories.forEach( cat => {
		// 		cat.classList.remove('active');
		// 		cat.classList.add('disabled')
		// 	} )
		// }
		// // let categories = Array.from(document.querySelector('#categorias').children)
		// // console.log(categories.length)
		// // console.log(categories)
		// // categories.forEach( cat => {
		// // 	cat.addEventListener('click', ()=>{
		// // 		//console.log( cat.id )
		// // 		resetCategories(categories)
    // //     cat.classList.remove('disabled')
		// // 		cat.classList.add('active')
		// // 		let catData = findCategory( cat.id, DatosInstalaciones )
		// // 		console.log(catData)
		// // 		catSeleccionada.categoria = catData;
		// // 		buildSubcategorieSection(catData)
		// // 	})
		// // } )

		// function buildSubcategorieSection( data ){
		// 	// data = categoría completa
		// 	const subcatSection = document.querySelector('#subcategorias-container')
		// 	const subcatWrapper = document.querySelector('#subcategorias');
		// 	removeChilds(subcatWrapper)
		// 	const subcats = data.subcats;
		// 	// console.log(data)
		// 	// console.log(subcats)
		// 	if(!subcats){
		// 		subcatSection.classList.add('closed')
		// 		return false
		// 	}else{
		// 		subcatSection.classList.remove('closed')
		// 	}

		// 	let gridItem, gridItemIcon, gridItemTitle, subcatData;
		// 	subcats.forEach( subcat => {
		// 		gridItem = document.createElement('div')
		// 		gridItem.id = subcat.id
		// 		gridItem.classList.add('grid-item')
		// 		gridItem.addEventListener('click', e=>{
		// 			subcatData = findCategory(subcat.id, DatosInstalaciones);
		// 			let el = e.target
		// 			//console.log(el)
		// 			while( ! el.classList.contains('grid-item') ){
		// 				el = el.parentNode;
		// 				//console.log(el)
		// 			}
		// 			// console.log('subcat.id: '+subcat.id)
		// 			// console.log(DatosInstalaciones)
		// 			// console.log(subcatData)
		// 			resetCategories( Array.from( subcatWrapper.children ) )
		// 			el.classList.add('active')
		// 			el.classList.remove('disabled')
		// 			catSeleccionada.subcategoria = subcatData;
		// 			buildTiposSolicitudModal( subcatData )
		// 		})
		// 			gridItemIcon = document.createElement('img')
		// 			gridItemIcon.src = subcat.img
		// 			gridItemIcon.alt = subcat.imgAlt
		// 			gridItemIcon.classList.add('grid-item-icon')
		// 			gridItem.appendChild(gridItemIcon)

		// 			gridItemTitle = document.createElement('h3')
		// 			gridItemTitle.appendChild(document.createTextNode(subcat.title))
		// 			gridItemTitle.classList.add('grid-item-title')
		// 			gridItem.appendChild(gridItemTitle)
		// 		subcatWrapper.appendChild( gridItem )
		// 	} )
		// }

		// function buildTiposSolicitudModal( subcat ){
		// 	let modal = buildModal();
		// 	console.log( subcat )
		// 		let grid = document.createElement('div')
		// 		grid.id = 'grid-tipos-solicitud'
		// 		grid.classList.add('grid-4-col', 'grid-tipos-solicitud')
		// 			let gridItem, h3, img
		// 			subcat.tiposSolicitud.forEach( ts => {
		// 				gridItem = document.createElement('div')
		// 				gridItem.id = ts.slug
		// 				gridItem.classList.add('grid-2-col', 'grid-item')
		// 				gridItem.addEventListener( 'click', e=>{
		// 					let el = e.target;
		// 					while( !el.classList.contains('grid-item') ){
		// 						el = el.parentNode
		// 					}
		// 					catSeleccionada.tipoSolicitud = el.id;
		// 					console.log(catSeleccionada)

		// 					window.location.href = `nueva-solicitud-formulario/?campo_actuacion=${catSeleccionada.categoria.slug}&subcampo_actuacion=${catSeleccionada.subcategoria.slug}&tipo=${catSeleccionada.tipoSolicitud}`
		// 				} )
		// 					img = document.createElement( 'img' )
		// 					img.classList.add( 'icon' )
		// 					img.src = ts.img
		// 					gridItem.appendChild( img )

		// 					h3 = document.createElement('h3')
		// 					h3.appendChild(document.createTextNode(ts.title))
		// 					gridItem.appendChild( h3 )
		// 				grid.appendChild(gridItem)
		// 			})
		// 	modal.appendChild( grid )
		// }

		// function findCategory(id, catData){
		// 	// console.log('findCategory()')
		// 	// console.log( catData )
		// 	let mainCat = catData.find( c => c.id == id );
		// 	if(mainCat == undefined){
		// 		let subcat
		// 		catData.every( c => {
		// 			subcat = findSubcategory(id, c.subcats)
		// 			if( subcat != undefined ){
		// 				return false;
		// 			}
		// 			return true;
		// 		})
				
		// 		if( subcat == undefined ){
		// 			return false
		// 		}else{
		// 			return subcat;
		// 		} 
		// 	}else{
		// 		return mainCat;
		// 	}
		// }

		// function findSubcategory( id, subcatData ){
		// 	// console.log("findSubcatData()")
		// 	// console.log( id )
		// 	// console.log( subcatData )
		// 	let subcat = subcatData.find( s => s.id == id )
		// 	return subcat;
		// }

	}
/* NUEVA SOLICITUD */

})













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
			id: "btn-datos-representante", 
			name: "Datos Representante" 
		},
		{ 
			id: "btn-datos-empresa-instaladora-electricista", 
			name: "Datos Empresa Instaladora Electricista" 
		},
		{ 
			id: "btn-datos-tecnicos-instalacion", 
			name: "Datos Técnicos de la Instalación" 
		},
		{ 
			id: "btn-documentos-adjuntos", 
			name: "Documentos Adjuntos" 
		}
	]



	let arraySelectorBotonesClean = [...arraySelectorBotones]


	function buildSelectorButton( id, text, functionOnClick = null ){
		let btnEl = document.createElement('div')
		btnEl.id = id
		btnEl.classList.add('boton', 'desactivado')
		btnEl.addEventListener('click', ()=>{
			
			console.log( `opcionActual: ${opcionActual}` )
			console.log( `btn.id: ${btnEl.id}` )
			if( btnEl.id != `btn-${opcionActual}` ){
				if ( !validateRequiredInputsSection( opcionActual ) ){
					return false;
				}
			}
			// Deshabilitar la navegación a botones con la clase .desactivado pinchándoles directamente (Se debe hacer con las flechas adelante y atrás)
			// if( btn.classList.contains('desactivado') ){
			// 	return false;
			// }
			let opcion = document.getElementsByName('opcion')[0];
			opcion.value = btnEl.id.replace( 'btn-','' )
			opcion.click();
			removeClass( botonesVisiblesSelector, 'active' )
			btnEl.classList.add( 'active' )
			btnEl.classList.remove( 'desactivado' )
			
			opcionActual = btnEl.id.substring(4)
			
			if(functionOnClick != null){
				functionOnClick()
			}
		})
		btnEl.appendChild(document.createTextNode(text))
		return btnEl
	}

	function limpiarArraySelectorBotones( idsToRemove ){
			idsToRemove.forEach( idToRem => {
				arraySelectorBotonesClean = arraySelectorBotonesClean.filter( elBtn => {
						return elBtn.id != idToRem
				} )
			})
	}

	addToWindowOnload( ()=>{
		let selectorBotones = document.querySelector('#selector-botones')
		let { tipo } = getDataFromURL();

		if( tipo == 'mem' ){
			// console.log('TIPO MEM')
			// console.log( arraySelectorBotones )

			limpiarArraySelectorBotones(  ['btn-nueva-entidad-interesada', 'btn-datos-representante', 'btn-datos-proyectista', 'btn-datos-director-obra'] )
			
			// console.log('ArraySelectorBotones Final')
			// console.log( arraySelectorBotones )
		}else if( tipo == 'pr' ){
			// console.log('TIPO PR')
			// console.log( arraySelectorBotones )
			limpiarArraySelectorBotones(  ['btn-nueva-entidad-interesada','btn-datos-representante'] )
			// console.log('ArraySelectorBotones Final')
			// console.log( arraySelectorBotones )
		}

		let form = document.querySelectorAll('form.wpcf7-form')[0]
		form.addEventListener('submit', e=>{
			e.preventDefault()
		})
		console.log(form)

		function botonSelectorFunctionOnclick(){
			console.log( `opcionActual: ${opcionActual}` )
			console.log( `btn.id: ${btn.id}` )
			if( btn.id != `btn-${opcionActual}` ){
				if ( !validateRequiredInputsSection( opcionActual ) ){
					return false;
				}
			}
			// Deshabilitar la navegación a botones con la clase .desactivado pinchándoles directamente (Se debe hacer con las flechas adelante y atrás)
			// if( btn.classList.contains('desactivado') ){
			// 	return false;
			// }
			let opcion = document.getElementsByName('opcion')[0];
			opcion.value = btn.id.replace( 'btn-','' )
			opcion.click();
			removeClass( botonesVisiblesSelector, 'active' )
			btn.classList.add( 'active' )
			btn.classList.remove( 'desactivado' )
			
			opcionActual = btn.id.substring(4)
		}

		arraySelectorBotonesClean.forEach( b => {
			selectorBotones.appendChild( buildSelectorButton( b.id, b.name ) )
		} )

		window.botonesVisiblesSelector = Array.from(document.querySelector('.selector-botones').children);
		// botonesVisiblesSelector.forEach( btn => {
		// 	btn.addEventListener('click', ()=>{
		// 			// console.log('click')
		// 			// console.log(btn)
		// 			console.log( `opcionActual: ${opcionActual}` )
		// 			console.log( `btn.id: ${btn.id}` )
		// 			if( btn.id != `btn-${opcionActual}` ){
		// 				if ( !validateRequiredInputsSection( opcionActual ) ){
		// 					return false;
		// 				}
		// 			}

		// 			// Deshabilitar la navegación a botones con la clase .desactivado pinchándoles directamente (Se debe hacer con las flechas adelante y atrás)
		// 			// if( btn.classList.contains('desactivado') ){
		// 			// 	return false;
		// 			// }
		// 			let opcion = document.getElementsByName('opcion')[0];
		// 			opcion.value = btn.id.replace( 'btn-','' )
		// 			opcion.click();
		// 			removeClass( botonesVisiblesSelector, 'active' )
		// 			btn.classList.add( 'active' )
		// 			btn.classList.remove( 'desactivado' )
					
		// 			opcionActual = btn.id.substring(4)
		// 	})
		// });
	} )

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
	
	/* Seleccionar Opción Por Defecto */
	addToWindowOnload( ()=>{
		window.opcionActual = 'datos-generales';
		document.getElementById(`btn-${opcionActual}`).classList.remove('desactivado')
		document.getElementById(`btn-${opcionActual}`).click()
	} )

	/* PreventDefault Botones Cancelar, Guardar, Enviar */
	function prevDefaultBotonesFormulario(){
		const form = document.querySelector('form.wpcf7-form')
		const formAction = document.getElementsByName('form-action')[0];
	
		const cancelarBtn = document.querySelector('#cancelar-btn')
		cancelarBtn.addEventListener('click', e=>{
			e.preventDefault();

			// console.log(e)
		})
	
		const guardarBtn = document.querySelector('#guardar-btn')
		guardarBtn.addEventListener('click', e=>{
			e.preventDefault();
			// console.log(e)
			formAction.value = "guardar"
			if( validateAllRequiredInputs() ){
				// Hay que encontrar la manera de hacer submit a todos los campos incluso los ocultos
				form.submit()
			}
			
		})
		
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
	addToWindowOnload( prevDefaultBotonesFormulario )

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
		let inFiles = Array.from( document.querySelectorAll("input[type='file']") )

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
	addToWindowOnload( fileOnChange )

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
	addToWindowOnload( modificarBotonSubidaDocumentosAdjuntos )

	function getDataFromURL(){
		const urlParams = new URLSearchParams(window.location.search)
		const campoActuacion = urlParams.get('campo-actuacion')
		// console.log(campoActuacion)
		const subcampoActuacion = urlParams.get('subcampo-actuacion')
		// console.log(subcampoActuacion)
		const tipo = urlParams.get('tipo')
		// console.log(tipo)
		const params = {
			"campoActuacion": campoActuacion,
			"subcampoActuacion": subcampoActuacion,
			"tipo": tipo
		}
		// console.log('Params')
		// console.log(params)
		return params
	}

	function changeValuesFromURLParams(){
		const { campoActuacion, subcampoActuacion, tipo } = getDataFromURL()

		// console.log('URL Params')
		// console.log([campoActuacion, subcampoActuacion, tipo])

		const inCampoActuacion = document.querySelector('input[name="campo-actuacion"]')
		const inTipoSolicitud = document.querySelector('input[name="tipo-solicitud"')
		const inSubcampoActuacion = document.querySelector('input[name="subcampo-actuacion"]')
		// console.log('Inputs')
		// console.log([inCampoActuacion, inSubcampoActuacion, inTipoSolicitud])

		const dataCampoActuacion = DatosInstalaciones.find( el => el.short_name == campoActuacion);
		const dataSubcampoActuacion = dataCampoActuacion.subcats.find( el => el.short_name == subcampoActuacion )
		const dataTipoSolicitud = dataSubcampoActuacion.subcats.find( el => el.short_name == tipo )
		// console.log('Datas')
		// console.log([dataCampoActuacion, dataSubcampoActuacion, dataTipoSolicitud])

		inCampoActuacion.value = dataCampoActuacion.name ;
		inCampoActuacion.dispatchEvent(new Event('change'))
		inSubcampoActuacion.value = dataSubcampoActuacion.name
		inTipoSolicitud.value = dataTipoSolicitud.name
		inTipoSolicitud.dispatchEvent(new Event('change'))

		// console.log([inCampoActuacion, inSubcampoActuacion, inTipoSolicitud])
		// console.log([inCampoActuacion.value, inSubcampoActuacion.value, inTipoSolicitud.value])
	}
	addToWindowOnload( changeValuesFromURLParams )


/* NOTIFICATIONS */
	function addNotification( title, message, type ){
		let notificationWrapper = document.querySelector('#notification-popup-wrapper')
		let notification = document.createElement('div')
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
				notificationDescription.appendChild(document.createTextNode( message ))
			notification.appendChild( notificationDescription )
		notificationWrapper.appendChild(notification)
	}

	function removeChildFromParent( child ){
		child.parentElement.removeChild( child )
	}
/* FIN NOTIFICATIONS */
