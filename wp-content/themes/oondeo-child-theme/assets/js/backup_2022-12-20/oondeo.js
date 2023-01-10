window.configuracionFormularioSolicitud = {
  log_level: 0,
  error_log_level: 1,
  debug: false,
  verbose: false,
  selectores: {
    existen: true,
    navegacion: "libre", // flechas || libre
  },
};

function documentReady(funct) {
  document.addEventListener("DOMContentLoaded", (e) => {
    funct;
  });
}

function removeChilds(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.firstChild);
  }
}

function removeClass(element, classToRemove) {
  // console.log('element');
  // console.log(element)
  // console.log('classToRemove')
  // console.log(classToRemove)
  if (Array.isArray(element)) {
    element.forEach((el) => {
      removeClass(el, classToRemove);
    });
    return true;
  }
  if (Array.isArray(classToRemove)) {
    classToRemove.forEach((c) => {
      removeClass(element, c);
    });
    return true;
  }
  element.classList.remove(classToRemove);
  //console.log( `removeClass( Element: ${element}; ClassToRemove: ${classToRemove} )` );
  return true;
}

function urlDecode(url) {
  return decodeURIComponent(url.replace(/\+/g, " "));
}

/* FIND IF KEY EXISTS IN OBJECT */
function keyExists(obj, key) {
  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
    return false;
  } else if (obj.hasOwnProperty(key)) {
    return true;
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = keyExists(obj[i], key);
      if (result) {
        return result;
      }
    }
  } else {
    for (const k in obj) {
      const result = keyExists(obj[k], key);
      if (result) {
        return result;
      }
    }
  }

  return false;
}
/* FIN FIND IF KEY EXISTS IN OBJECT */

/* DATES */
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

/**
 * Function that format a date with yyyymmdd format joining the date string with the char you choose.
 *@param	{Date}		[date=new Date()]				The date to format. Default: new Date()
 *@param {String}	[join_char="/"]		The char with date is being to be formatted. Default: "/"
 *
 *@return {String}	Date Formatted
 */
function ddmmyyyy(date = new Date(), join_char = "/") {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(join_char);
}
function yyyymmdd(date = new Date(), join_char = "/") {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate())
  ].join(join_char);
}

function ddmmyyyyDate(date) {
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0");
  let yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function hhmmssDate( date, join_char = ":" ){
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join(join_char); 
}

function yyyymmdd_hhmmss( date, html="false" ){
  if( html ){
    return `<div class="yyyymmdd_hhmmss_datetime"><span>${yyyymmdd(date)}</span><span>${hhmmssDate(date)}</span></div> `
  }else{
    return `${yyyymmdd(date)} ${hhmmssDate(date)}`
  }
}
/* DATES */

/* MODAL */
function buildModal( html_content, size ) {
  let body = document.getElementsByTagName("body")[0];
  let modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  modalContainer.className = "fade-in";
  let modal = document.createElement("div");
  modal.id = "modal";
  switch(size){
    case 'xs':
      modalContainer.classList.add('modal-xs')
    default:
      modalContainer.classList.add('modal-xl')
  }
  let closeButton = document.createElement("i");
  closeButton.className = "fa-solid fa-xmark";
  closeButton.id = "modal-close-button";
  closeButton.addEventListener("click", () => {
    removeModal();
  });
  modal.appendChild(closeButton);

  let content = document.createElement("div");
  content.id = "modal-content";

  content.innerHTML = html_content

  modal.appendChild(content);
  modalContainer.appendChild(modal);
  body.appendChild(modalContainer);

  setTimeout(() => {
    modalContainer.classList.remove("fade-in");
  }, 300);

  return content;
}

function removeModal() {
  let body = document.getElementsByTagName("body")[0];
  let modalContainer = document.getElementById("modal-container");
  modalContainer.classList.add("opacity-0");

  setTimeout(() => {
    body.removeChild(modalContainer);
  }, 300); /* Debe ser el Timeout igual que el tiempo de animacion de .fade-out */
}

function showModal() {
  let modalContainer = document.getElementById("modal-container");
  if (modalContainer != null) {
    modalContainer.classList.remove("d-none");
    modalContainer.classList.add("fade-in");
    setTimeout(() => {
      modalContainer.classList.remove("fade-in");
    }, 300);
  } else {
    console.log("modalContainer no existe");
  }
}

function hideModal() {
  let modalContainer = document.getElementById("modal-container");
  if (modalContainer != null) {
    modalContainer.classList.add("fade-out");
    setTimeout(() => {
      modalContainer.classList.remove("fade-out");
      modalContainer.classList.add("d-none");
    }, 20000);
  } else {
    console.log("modalContainer no existe");
  }
}
/*! FIN MODAL  */

/* LOADER */

function showLoader() {
  let html = `
	<div id="loader">
  <div id="top"></div>
  <div id="bottom"></div>
  <div id="line"></div>
</div>
`;
  let body = document.getElementsByTagName("body")[0];
  let modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  modalContainer.className = "fade-in";
  modalContainer.innerHTML = html;
  body.appendChild(modalContainer);

  setTimeout(() => {
    modalContainer.classList.remove("fade-in");
  }, 300);

}

function removeLoader() {
  let modalContainer = document.getElementById("modal-container");
  modalContainer.classList.add("opacity-0");

  setTimeout(() => {
    modalContainer.parentElement.removeChild(modalContainer);
  }, 300); /* Debe ser el Timeout igual que el tiempo de animacion de .fade-out */
}
/* FIN LOADER */


/* NOTIFICATIONS */
/**
 *
 * Create notification popup
 *
 * @param {String} 	title 		Notification Title
 * @param {String} 	message		Description
 * @param {String}	type			Types: error | success | warning | tip
 * **/
function addNotification(title, message, type) {
  let notificationWrapper = document.querySelector(
    "#notification-popup-wrapper"
  );
  let notification = document.createElement("div");
  setTimeout(() => {
    notification.parentElement.removeChild(notification);
  }, 10000);
  notification.className = "notification";
  console.log(type);

  switch (type) {
    case "error":
      notification.classList.add("error");
      break;

    case "success":
      notification.classList.add("success");
      break;
      console.log("success????");

    case "warning":
      notification.classList.add("warning");
      break;

    case "tip":
      notification.classList.add("tip");
      break;
  }
  let btn = document.createElement("button");
  btn.className = "close-button";
  btn.addEventListener("click", (e) => {
    let notif = e.target;
    while (!notif.classList.contains("notification")) {
      notif = notif.parentElement;
    }
    removeChildFromParent(notif);
  });
  let i = document.createElement("i");
  i.classList.add("fa-solid", "fa-xmark");
  btn.appendChild(i);
  notification.appendChild(btn);

  let notificationTitle = document.createElement("div");
  notificationTitle.className = "notification-title";
  notificationTitle.appendChild(document.createTextNode(title));
  notification.appendChild(notificationTitle);

  let notificationDescription = document.createElement("div");
  notificationDescription.className = "notification-description";
  if (Array.isArray(message)) {
    let cont = 1;
    message.forEach((m) => {
      if (cont == 1) {
        notificationDescription.appendChild(document.createTextNode(m));
        cont--;
      } else {
        notificationDescription.appendChild(document.createElement("br"));
        notificationDescription.appendChild(document.createTextNode(m));
      }
    });
  } else {
    notificationDescription.appendChild(document.createTextNode(message));
  }
  notification.appendChild(notificationDescription);
  notificationWrapper.appendChild(notification);
}

function removeChildFromParent(child) {
  child.parentElement.removeChild(child);
}

/**
 * @param args Array Array of Arguments
 * 
 * args.by = class | id
 * 
 * args.maxDepth Máximo de veces que el Loop se ejecutará, para prevenir un loop infinito
 * 
 * args.element Elemento del cual se debe buscar el padre
 * 
 * args.find Lo que se debe encontrar (id o clase, según se haya especificado)
 * 
 **/
function findParent( args={} ){
  if( !args.by ){ args.by = 'class' }
  if( !args.maxDepth ){ args.maxDepth = 5 }
  if( !args.find || !args.element ){ return false }
  if (configuracionFormularioSolicitud.log_level >= 2) {
    console.log( args )
  }

  let parent = args.element.parentElement
  if( args.by == 'class'){
    while( !parent.classList.contains(args.find) && args.maxDepth >= 0 ){
      
      if (configuracionFormularioSolicitud.log_level >= 2) {
        console.log( 'by: class' )
        console.log(parent)
        console.log(`args.maxDepth: ${args.maxDepth}`);
        console.log(`args.find: ${args.find}`);
        console.log(
          `!parent.classList.contains(args.find) //${!parent.classList.contains(
            args.find
          )} || args.maxDepth >= 0 //${args.maxDepth >= 0}`
        );
      }
      parent = parent.parentElement
      args.maxDepth--
    }
  }else{
    while ( parent.id != args.find || args.maxDepth >= 0) {
      parent = parent.parentElement;
      args.maxDepth--;
    }
  }

  if (configuracionFormularioSolicitud.log_level >= 2) {
    console.log(args)
    console.log( parent )
  }

  if( args.maxDepth < 0 ){
    return false
  }else{
    return parent
  }
}
/* FIN NOTIFICATIONS */





/* FUNCIONES PORTAL INSTALADOR REVISA */
async function removeSolicitud( post_id ){
  const response = await fetch(`/wp-json/oondeo/v1/remove_solicitud?post_id=${post_id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
  const data = await response.json();

  console.log('removeSolicitud')
  console.log( data )

  return data;
}

async function copySolicitud( post_id ){
  const response = await fetch(`/wp-json/oondeo/v1/copy_solicitud?post_id=${post_id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
  const data = await response.json();

  console.log('copySolicitud')
  console.log( data )

  return data;
}
/* FIN FUNCIONES PORTAL INSTALADOR REVISA */
