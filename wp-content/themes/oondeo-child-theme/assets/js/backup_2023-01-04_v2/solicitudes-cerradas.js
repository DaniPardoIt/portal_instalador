jQuery("document").ready(() => {
  let fields_to_search = [
    "title",
    "codigo_interno",
    "numero_documento_titular",
  ];

  console.log("SOLICITUDES CERRADAS ready");

	document.querySelector('#search_button').addEventListener('click', event => {
		console.log('click button search')

		do_solicitudes_abiertas_search();
	})

  document.querySelector("#search_button").click();
});

function do_solicitudes_abiertas_search(){
  let default_estado_solicitud = "finalizada"
  let inputs = Array.from(
    document.querySelectorAll(
      ".filter-wrapper .filter-group input, .filter-wrapper .filter-group select"
    )
  );
  console.log('inputs')
  console.log(inputs);

  let fields = {
    'estado_solicitud': default_estado_solicitud
  };

  inputs.forEach((i) => {
    if (i.value) {
      fields[i.name] = i.value;
    }
  });

  console.log(fields);

  console.log("Call to solicitud_search");
  solicitud_search(fields);
}

function solicitud_search( fields, estados="todas") {
  console.log("solicitud_search()");
  if (!Array.isArray(fields)) {
    fields = [fields];
  }

  console.log("fields");
  console.log(fields);

  let json = JSON.stringify(fields) 
  console.log('json')
  console.log(json)
  console.log(typeof json)

  fetch(`/wp-json/oondeo/v1/search_solicitudes?fields=${json}`, {
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
          if (configuracionFormularioSolicitud.log_level >= 1) {
            console.log("MY JSON");
            console.log(data);
          }

          reset_solicitudes_abiertas( data )
        },
        (jsonError) => {
          console.log("JSON ERROR");
          console.error(jsonError);
        }
      );
    },
    (error) => {
      console.error(error);
    }
  );
}

function reset_solicitudes_abiertas( posts ){
  
  jQuery(".solicitud-body").remove();

  let html = ''
  posts.forEach( p => {
    html += `
      <div id="solicitud-${p.ID}" class="solicitud-item solicitud-body">
        <div class="solicitud-item-group fecha_creacion">
          ${p.post_date}
        </div>
        <div class="solicitud-item-group codigo_interno">
          ${p.codigo_interno}
        </div>
        <div class="solicitud-item-group estado_solicitud">
          ${p.estado_solicitud}
        </div>
        <div class="solicitud-item-group campo-actuacion">
          ${p.campo_actuacion}
        </div>
        <div class="solicitud-item-group tipo_instalacion">
          ${p.tipo_instalacion}
        </div>
        <div class="solicitud-item-group subtipo_instalacion">
          ${p.subtipo_instalacion}
        </div>
        <div class="solicitud-item-group botones-accion">
          <button class="btn editar-btn" onclick="clickEditarBtn(this)"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn copiar-btn" onclick="clickCopiarBtn(this)"><i class="fa-regular fa-copy"></i></button>
        </div>
      </div>`;
  } )

  jQuery(".lista-solicitudes-wrapper").append(html)
}

function clickEditarBtn(btn) {
  let parent = btn;
  while (!parent.classList.contains("solicitud-item")) {
    parent = parent.parentElement;
  }
  let post_ID = parent.id.replace("solicitud-", "");
  if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log('clickEditarBtn')
    console.log(btn);
    console.log(parent);
    console.log(post_ID);
  }

  window.location.href = `/solicitud-formulario?post_ID=${post_ID}`;
}

function clickCopiarBtn(btn) {
  
  let parent = btn;
  while (!parent.classList.contains("solicitud-item")) {
    parent = parent.parentElement;
  }
  let post_ID = parent.id.replace("solicitud-", "");
  
  if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log('clickCopiarBtn')
    console.log(btn);
    console.log(parent);
    console.log(post_ID);
  }

  let html_modal = `
    <strong>¿Seguro que deseas copiar la solicitud?</strong>
    <p>Si haces click en sí, se copiará la solicitud, creando así una nueva</p>
    <div class="buttons-container"><button onclick="
      do_copy_solicitud(${post_ID});
      removeModal();
    ">Sí</button><button onclick="removeModal()">No</button></div>
  `;
  buildModal(html_modal, "xs");
}


async function do_copy_solicitud(post_ID) {
  console.log(`Before Await. ${Date.now()}`);
  await copySolicitud(post_ID);
  console.log(`After Await. ${Date.now()}`);
  do_solicitudes_abiertas_search();
}