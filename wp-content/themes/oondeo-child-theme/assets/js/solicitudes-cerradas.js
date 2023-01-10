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

  console.log("SOLICITUDES CERRADAS ready");

  document
    .querySelector("#search_button")
    .addEventListener("click", (event) => {
      console.log("click button search");

      do_solicitudes_abiertas_search();
    });

  document.querySelector("#search_button").click();
});

function do_solicitudes_abiertas_search() {
  let default_estado_solicitud = "finalizada";
  let inputs = Array.from(
    document.querySelectorAll(
      ".filter-wrapper .filter-group input, .filter-wrapper .filter-group select"
    )
  );
  console.log("inputs");
  console.log(inputs);

  let fields = {
    estado_solicitud: default_estado_solicitud,
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

function solicitud_search(fields, estados = "finalizada") {
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
          reset_solicitudes( data )
          update_solicitud_list( 1 );
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
      removeLoader();
    }
  );
}

function reset_solicitudes( solicitudes ){
  console.log(solicitudes);

  const pages = Math.ceil(solicitudes.length / window.solicitudes.per_page);
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

function update_solicitud_list( page ) {
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
    page: page,
    solicitudes_per_page: solicitudes_per_page,
    firstIndex: firstIndex,
    lastIndex: lastIndex,
  });

  const showed_solicitudes = window.solicitudes.todas.slice(
    firstIndex,
    lastIndex
  );
  window.solicitudes.showed = showed_solicitudes;

  jQuery(".solicitud-body").remove();

  let html = "";
  showed_solicitudes.forEach((p) => {
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
          <button class="btn-outline editar-btn btn-azul" onclick="clickEditarBtn(this)"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn-outline copiar-btn btn-naranja" onclick="clickCopiarBtn(this)"><i class="fa-regular fa-copy"></i></button>
        </div>
      </div>`;
  });

  jQuery(".lista-solicitudes-wrapper").append(html);
}

function clickEditarBtn(btn) {
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

  window.location.href = `/solicitud-formulario?post_ID=${post_ID}`;
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
