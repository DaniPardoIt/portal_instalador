
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";

get_header();
	?>
	<main>
		<h1>
			<?php the_title(); ?>
		</h1>
		<?php
		get_the_content();
		?>

		<?php 
		if ( have_posts() ) : while ( have_posts() ) : the_post();
		the_content();
		endwhile; else : ?>
			<p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
		<?php endif; ?>

		<?php
		$array_categorias = get_all_term_hierarchy_data_formatted( array(
			'taxonomy' => 'categoria',
			'hide_empty' => false,
			'orderby' =>	'term_id',
			'parent'	=> 0
		) );
		?>
		<script>
		
		let DatosInstalaciones = <?=json_encode($array_categorias) ?>;
		
		window.addEventListener("load", () => {
			function resetCategories(categories){
				categories.forEach( cat => {
					cat.classList.remove('active');
					cat.classList.add('disabled')
				} )
			}
			function buildSubcategorieSection( data ){
				// data = categoría completa
				const subcatSection = document.querySelector('#subcategorias-container')
				const subcatWrapper = document.querySelector('#subcategorias');
				removeChilds(subcatWrapper)
				const subcats = data.subcats;
				// console.log(data)
				// console.log(subcats)
				// console.log(`subcats.length == ${subcats.length}`)
				if( !subcats || subcats.length < 1 ){
					subcatSection.classList.add('closed')
					return false
				}else{
					subcatSection.classList.remove('closed')
				}

				let gridItem, gridItemIcon, gridItemTitle, subcatData;
				subcats.forEach( subcat => {
					gridItem = document.createElement('div')
					gridItem.id = subcat.slug
					gridItem.classList.add('grid-item')
					gridItem.addEventListener('click', e=>{
						subcatData = findCategory(subcat.slug, DatosInstalaciones);
						let el = e.target
						//console.log(el)
						while( ! el.classList.contains('grid-item') ){
							el = el.parentNode;
							//console.log(el)
						}
						// console.log('subcat.id: '+subcat.id)
						// console.log(DatosInstalaciones)
						// console.log(subcatData)
						resetCategories( Array.from( subcatWrapper.children ) )
						el.classList.add('active')
						el.classList.remove('disabled')
						catSeleccionada.subcategoria = subcatData;
						buildTiposSolicitudModal( subcatData )
					})
						gridItemIcon = document.createElement('img')
						gridItemIcon.src = subcat.icon
						gridItemIcon.alt = subcat.icon_alt
						gridItemIcon.classList.add('grid-item-icon')
						gridItem.appendChild(gridItemIcon)

						gridItemTitle = document.createElement('h3')
						gridItemTitle.appendChild(document.createTextNode(subcat.name))
						gridItemTitle.classList.add('grid-item-title')
						gridItem.appendChild(gridItemTitle)
					subcatWrapper.appendChild( gridItem )
				} )
			}

			function buildTiposSolicitudModal( subcat ){
				let modal = buildModal();
				let tiposSolicitud = subcat.subcats;
				console.log( subcat )
				console.log( tiposSolicitud )
					let grid = document.createElement('div')
					grid.id = 'grid-tipos-solicitud'
					grid.classList.add('grid-4-col', 'grid-tipos-solicitud')
						let gridItem, h3, img
						tiposSolicitud.forEach( ts => {
							gridItem = document.createElement('div')
							gridItem.id = ts.slug
							gridItem.setAttribute('data-short_name', ts.short_name)
							gridItem.classList.add('grid-2-col', 'grid-item')
							gridItem.addEventListener( 'click', e=>{
								let el = e.target;
								while( !el.classList.contains('grid-item') ){
									el = el.parentNode
								}
								catSeleccionada.tipoSolicitud = el.getAttribute('data-short_name');
								console.log(catSeleccionada)

								window.location.href = `solicitud-formulario/?campo_actuacion=${catSeleccionada.categoria.short_name}&subcampo_actuacion=${catSeleccionada.subcategoria.short_name}&tipo_solicitud=${catSeleccionada.tipoSolicitud}&debug=true`
							} )
								img = document.createElement( 'img' )
								img.classList.add( 'icon' )
								img.src = ts.icon
								img.alt = ts.icon_alt
								gridItem.appendChild( img )

								h3 = document.createElement('h3')
								h3.appendChild(document.createTextNode(ts.name))
								gridItem.appendChild( h3 )
							grid.appendChild(gridItem)
						})
				modal.appendChild( grid )
			}

			function findCategory(slug, catData){
				// console.log(`findCategory(${slug}, catData)`)
				// console.log( catData )
				let mainCat = catData.find( c => c.slug == slug );
				if(mainCat == undefined){
					let subcat
					catData.every( c => {
						subcat = findSubcategory(slug, c.subcats)
						if( subcat != undefined ){
							return false;
						}
						return true;
					})
					
					if( subcat == undefined ){
						return false
					}else{
						return subcat;
					} 
				}else{
					return mainCat;
				}
			}

			function findSubcategory( slug, subcatData ){
				// console.log("findSubcatData()")
				// console.log( slug )
				// console.log( subcatData )
				let subcat = subcatData.find( s => s.slug == slug )
				return subcat;
			}

			let categorias = document.querySelector('#categorias')
			let gridItem, img, h2
			DatosInstalaciones.forEach( data => {
				gridItem = document.createElement('div')
				gridItem.id = data.slug
				gridItem.classList.add('grid-item')
					img = document.createElement('img')
					img.classList.add('grid-item-icon')
					img.src = data.icon
					gridItem.appendChild(img)

					h2 = document.createElement('h2')
					h2.classList.add('grid-item-title')
						h2.appendChild(document.createTextNode(data.name))
					gridItem.appendChild(h2)
				categorias.appendChild(gridItem)
			} )

			let categories = Array.from(document.querySelector('#categorias').children)
			console.log(categories.length)
			console.log(categories)
			categories.forEach( cat => {
				cat.addEventListener('click', ()=>{
					console.log( cat.id )
					resetCategories(categories)
					cat.classList.remove('disabled')
					cat.classList.add('active')
					let catData = findCategory( cat.id, DatosInstalaciones )
					console.log(catData)
					catSeleccionada.categoria = catData;
					buildSubcategorieSection(catData)
				})
			} )
		})
		</script>
	</main>
<?php get_footer(); ?>
