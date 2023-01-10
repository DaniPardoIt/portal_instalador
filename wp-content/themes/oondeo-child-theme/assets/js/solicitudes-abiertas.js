/* CONFIGURACIÓN GLOBAL */
window.solicitudes = {
  per_page: 5,
  current_page: 1,
};

/* FIN CONFIGURACIÓN GLOBAL */

jQuery("document").ready(() => {
  let fields_to_search = [
    "title",
    "codigo_interno",
    "numero_documento_titular",
  ];

  console.log("ready");

  document
    .querySelector("#search_button")
    .addEventListener("click", (event) => {
      console.log("click button search");

      do_solicitudes_abiertas_search();
    });

  document.querySelector("#search_button").click();
});

function do_solicitudes_abiertas_search() {
  let inputs = Array.from(
    document.querySelectorAll(
      ".filter-wrapper .filter-group input, .filter-wrapper .filter-group select"
    )
  );
  console.log("inputs");
  console.log(inputs);

  let fields = {};

  inputs.forEach((i) => {
    if (i.value) {
      fields[i.name] = i.value;
    }
  });

  console.log(fields);

  if (
    !fields.estado_solicitud ||
    fields.estado_solicitud == "" ||
    typeof fields.estado_solicitud == "undefined"
  ) {
    fields.estado_solicitud = [
      "creacion",
      "revision_oca",
      "error_oca",
      "enviada",
      "error_exim",
    ];
  }

  console.log("Call to solicitud_search");
  solicitud_search(fields);
}

function solicitud_search(fields, estados = "todos") {
  console.log("solicitud_search()");
  if (!Array.isArray(fields)) {
    fields = [fields];
  }
  console.log("fields");
  console.log(fields);

  let json = JSON.stringify(fields);
  console.log("json");
  console.log(json);
  console.log(typeof json);

  showLoader();

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
          window.solicitudes.todas = data;
          reset_solicitudes_abiertas(data);
          update_solicitud_list(1)
          removeLoader();
        },
        (jsonError) => {
          console.log("JSON ERROR");
          console.error(jsonError);
          removeLoader();
        }
      );
    },
    (error) => {
      console.error(error);
    }
  );
}

function reset_solicitudes_abiertas(solicitudes) {
  console.log(solicitudes);

	const pages = Math.ceil(
    solicitudes.length / window.solicitudes.per_page
  );
  console.log(`pages: ${pages}`);

  let navWrapper = jQuery(".list-navigation-wrapper");
  navWrapper.html("");

  if (pages > 1) {
    for (let i = 1; i <= pages; i++) {
      navWrapper.append(`
		<button id="button-navigation-${i}" class="btn" onclick="update_solicitud_list(${i})">${i}</button>
		`);
    }
  }
}

function update_solicitud_list( page ){
  
	jQuery(`[id^="button-navigation-"]`).removeClass("active");
  jQuery(`#button-navigation-${page}`).addClass("active");

  window.solicitudes.current_page = page;

  const solicitudes_per_page = window.solicitudes.per_page;

  let firstIndex = page * solicitudes_per_page - solicitudes_per_page;
  let lastIndex = firstIndex + solicitudes_per_page;
  if (lastIndex > window.solicitudes.todas.length) {
    lastIndex = window.solicitudes.todas.length;
  }

  console.log({
  	'page': page,
  	'solicitudes_per_page': solicitudes_per_page,
  	'firstIndex': firstIndex,
  	'lastIndex': lastIndex
  })

  const showed_solicitudes = window.solicitudes.todas.slice(
    firstIndex,
    lastIndex
  );
  window.solicitudes.showed = showed_solicitudes;

  jQuery(".solicitud-body").remove();

  // let html, campo_actuacion , tipo_instalacion, subtipo_instalacion;
  // html = campo_actuacion = tipo_instalacion = subtipo_instalacion = ''

  let html = '';
  console.log( window.datosInstalaciones )

  showed_solicitudes.forEach((p) => {
    // // console.log( p )
    // let campo = window.datosInstalaciones.find( dato => dato.short_name === p.campo_actuacion )
    // campo_actuacion = campo.name
    // // console.log( { 'campo': campo } )

    // if( campo.subcats && campo.subcats.length > 0 ){
    //   let tipo = campo.subcats.find( t => t.short_name === p.tipo_instalacion )
    //   tipo_instalacion = tipo.name
    //   // console.log( { 'tipo': tipo } )

    //   if( tipo.subcats && tipo.subcats.length > 0){
    //     let subtipo = tipo.subcats.find( s => s.short_name === p.subtipo_instalacion );
    //     subtipo_instalacion = subtipo.name;
    //     // console.log( { 'subtipo': subtipo } )
    //   }

    //   if( tipo.tipos_solicitud && tipo.tipos_solicitud.length > 0 ){
    //     let tipo_s = tipo.tipos_solicitud.find( ts => ts.short_name === p.tipo_solicitud )
    //     tipo_solicitud = tipo_s = tipo_s.name
    //     // console.log( { 'tipo_s': tipo_s } )
    //   }
    // }

    // // console.log( campo )
    // console.log({
    //   'campo_actuacion': campo_actuacion,
    //   'tipo_instalacion': tipo_instalacion,
    //   'subtipo_instalacion': subtipo_instalacion,
    //   'tipo_solicitud': tipo_solicitud
    // })

    let { campo_actuacion, tipo_instalacion, subtipo_instalacion, tipo_solicitud } = get_abbreviations( p )

    html += `
      <div id="solicitud-${p.ID}" class="solicitud-item solicitud-body">
        <div class="solicitud-item-group fecha_creacion">
          ${p.post_date}
        </div>
        <div class="solicitud-item-group codigo_interno">
          <b>${p.codigo_interno}</b>
        </div>
        <div class="solicitud-item-group estado_solicitud">
          ${p.estado_solicitud}
        </div>
        <div class="solicitud-item-group campo-actuacion">
          ${campo_actuacion}
        </div>
        <div class="solicitud-item-group tipo_instalacion">
          ${tipo_instalacion}
        </div>
        <div class="solicitud-item-group subtipo_instalacion">
          ${subtipo_instalacion}
        </div>
        <div class="solicitud-item-group botones-accion">
          ${
            ["creacion", "error_oca", "revision_oca", "error_oca"].includes(
              p.estado_solicitud
            )
              ? `<button class="btn-outline editar-btn btn-azul" onclick="clickEditarBtn(this)"><i class="fa-solid fa-pencil"></i></button>`
              : ""
          }
          ${
            [
              "creacion",
              "error_oca",
              "revision_oca",
              "error_oca",
              "finalizada",
            ].includes(p.estado_solicitud)
              ? `<button class="btn-outline copiar-btn btn-naranja" onclick="clickCopiarBtn(this)"><i class="fa-regular fa-copy"></i></button>`
              : ""
          }
          ${
            [
              "creacion",
              "error_oca",
              "revision_oca",
              "error_oca",
              "finalizada",
            ].includes(p.estado_solicitud)
              ? `<button class="btn-outline borrar-btn btn-rojo" onclick="clickBorrarBtn(this)"><i class="fa-regular fa-trash-can"></i></button>`
              : ""
          }
          
        </div>
      </div>`;
  });

  /*
  En el codigo de arriba estos son los permisos para el botón de borrar
  ${
    ["creacion"].includes(p.estado_solicitud)
      ? `<button class="btn borrar-btn" onclick="clickBorrarBtn(this)"><i class="fa-regular fa-trash-can"></i></button>`
      : ""
  }*/

  jQuery(".lista-solicitudes-wrapper").append(html);
}

async function clickEditarBtn(btn) {
  let parent = btn;
  while (!parent.classList.contains("solicitud-item")) {
    parent = parent.parentElement;
  }
  let post_ID = parent.id.replace("solicitud-", "");
  if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log("clickEditarBtn");
    console.log(btn);
    console.log(parent);
    console.log(post_ID);
  }

  fetch(`/wp-json/oondeo/v1/check_permission?action=edit&post_id=${post_ID}`, {
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
          }
          data = data === "true";
          console.log("EDIT PERMISSION?");
          console.log(data);

          if (data) {
            window.location.href = `/solicitud-formulario?post_ID=${post_ID}`;
          }
          removeLoader();
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

async function clickBorrarBtn(btn) {
  let parent = btn;
  while (!parent.classList.contains("solicitud-item")) {
    parent = parent.parentElement;
  }
  let post_ID = parent.id.replace("solicitud-", "");
  if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log("clickBorrarBtn");
    console.log(btn);
    console.log(parent);
    console.log(post_ID);
  }

  let html_modal = `
    <strong>¿Seguro que deseas borrar la solicitud?</strong>
    <p>Si haces click en sí, se borrará la solicitud</p>
    <div class="buttons-container"><button onclick="
      do_borrar_solicitud(${post_ID});
      removeModal();
    ">Sí</button><button onclick="removeModal()">No</button></div>
  `;
  buildModal(html_modal, "xs");
}

async function do_borrar_solicitud(post_ID) {
  console.log(`Before Await. ${Date.now()}`);
  await removeSolicitud(post_ID);
  console.log(`After Await. ${Date.now()}`);
  do_solicitudes_abiertas_search();
}

function clickCopiarBtn(btn) {
  let parent = btn;
  while (!parent.classList.contains("solicitud-item")) {
    parent = parent.parentElement;
  }
  let post_ID = parent.id.replace("solicitud-", "");

  if (configuracionFormularioSolicitud.log_level >= 1) {
    console.log("clickCopiarBtn");
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
