// Requête fetch pour aller chercher les datas dans le works//
async function getWorksDatas() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");
      data.forEach((item) => {
        displayWork(item, gallery);
      });
    });
}
getWorksDatas();

// Creation des filtres en faisant appel à l'API //
const filters = [];
async function generateFilters() {
  const filterSection = document.querySelector(".filters");
  const filterTous = document.createElement("div");
  filterTous.classList.add("filter");
  filterTous.setAttribute("id", "selected");
  filterTous.innerText = "Tous";
  filterSection.appendChild(filterTous);
  filters.push(filterTous);
  const gallery = document.querySelector(".gallery");
  let currentIndex = 0;
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const categoriesSet = new Set();
      data.forEach((item) => {
        const { name } = item.category;
        categoriesSet.add(name);
      });

      // Création Catégorie "Tous" //
      filterTous.addEventListener("click", function () {
        gallery.innerHTML = "";
        getWorksDatas();
      });
      const categories = Array.from(categoriesSet);

      // Création des filtres //
      categories.forEach((category) => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.innerText = category;
        filterSection.appendChild(filter);
        filters.push(filter);

      // Trier les filtres au click //
      filter.addEventListener("click", function (event) {
        const selectedFilter = event.target;
        const selectedCategory = selectedFilter.innerText;
        gallery.innerHTML = "";
        let worksToDisplay = [];
        worksToDisplay = data.filter(
          (item) => item.category.name === selectedCategory
        );
        worksToDisplay.forEach((item) => {
          displayWork(item, gallery)
        });
      });
    });
  });

  // Appliquer la couleur sur le bouton sélectionné //
  function color(index) {
    for (let i = 0; i < filters.length; i++) {
      if (i === index) {
        filters[i].setAttribute("id", "selected");
      } else {
        filters[i].removeAttribute("id");
      }
    }
  }
  filterSection.addEventListener("click", function (event) {
    const selectedFilter = event.target;
    const index = filters.indexOf(selectedFilter);
    if (index !== -1) {
      color(index, currentIndex);
    }
  });
}
function displayWork (item, gallery) {
  const workElement = document.createElement("figure");
    workElement.classList.add("workElement");
    const dynamicId = item.id;
    const concatenedId = "figureForMainPage" + dynamicId;
    workElement.id = concatenedId;
    const imgWorkElement = document.createElement("img");
    imgWorkElement.src = item.imageUrl;
    const captionWorkElement = document.createElement("figcaption");
    captionWorkElement.innerText = item.title;
    gallery.appendChild(workElement);
    workElement.appendChild(imgWorkElement);
    workElement.appendChild(captionWorkElement);
}
// Création du Mode editeur //
const closeButton = document.querySelector(".closeBtn");
const token = localStorage.getItem("token");
let modal;
function editorMode() {
  const header = document.getElementById("HeaderTop");
  const body = document.body;
  const editorBar = document.createElement("div");
  editorBar.classList.add("editorBar");
  body.appendChild(editorBar);
  body.insertBefore(editorBar, header);
  const edittorTitle = document.createElement("div");
  edittorTitle.classList.add("edittorTitle");
  editorBar.appendChild(edittorTitle);
  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");
  edittorTitle.appendChild(editorIcon);
  const editorTitleText = document.createElement("h4");
  editorTitleText.innerText = "Mode édition";
  editorTitleText.classList.add("editorTitleText");
  edittorTitle.appendChild(editorTitleText);
  const publishButton = document.createElement("div");
  publishButton.classList.add("publishButton");
  editorBar.appendChild(publishButton);
  const publishText = document.createElement("p");
  publishText.innerText = "publier les changement";
  publishText.classList.add("publishText");
  publishButton.appendChild(publishText);

  // Permet de remplacer login par logout //
  const loginButton = document.querySelector(".LoginLocation");
  loginButton.textContent = "Logout";
  loginButton.addEventListener("click", logout);

  // Création des boutons modifier les permettant d'ouvrir la modal //
  const introSection = document.querySelector(".sectionPhotoIntro");
  insertButtonModifier(introSection);
  const myprojects = document.querySelector(".MyProjects");
  insertButtonModifier(myprojects);
  const buttonModifierGalerie = document.getElementById("buttonModifier-1");
  buttonModifierGalerie.addEventListener("click", generateAndOpenModal);
}

// Boutons modifier //
let buttonModifierCounter = 0;
function insertButtonModifier(targetSection) {
  const buttonModifier = document.createElement("div");
  buttonModifier.classList.add("buttonModifier");
  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");
  buttonModifier.appendChild(editorIcon);
  const buttonModifierText = document.createElement("p");
  buttonModifierText.innerText = "modifier";
  buttonModifier.appendChild(buttonModifierText);
  const uniqueId = "buttonModifier-" + buttonModifierCounter;
  buttonModifier.id = uniqueId;
  buttonModifierCounter++;
  targetSection.appendChild(buttonModifier);
}

// Fonction de logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Permet d'ouvrir la modal //
if (token) {
  editorMode();
} else {
  generateFilters();
}
function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}
function escapeClose(e) {
  if (e.keyCode === 27) {
    closeModal();
    closeAddPhotoModal();
  }
}
function openAddPhotoModal() {
  addPhotoModal.style.display = "block";
}
function closeAddPhotoModal() {
  addPhotoModal.style.display = "none";
}
function generateAndOpenModal() {
  if (modal) {
    document.body.removeChild(modal);
  }
  modal = generateModal();
  document.body.appendChild(modal);
  openModal();
  getWorksDatasForModal();
}
function generateAndOpenAddPhotoModal() {
  if (addPhotoModal) {
    document.body.removeChild(addPhotoModal);
  }
  addPhotoModal = generateAddPhotoModal();
  document.body.appendChild(addPhotoModal);
  openAddPhotoModal();
}

// Creation de la premiere modal (suppression et modifications des elements) //
function generateModal() {
  modal = document.createElement("div");
  modal.classList.add("modal");
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.addEventListener("click", closeModal);
  modal.appendChild(modalBackground);
  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");
  modal.appendChild(modalWindow);
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", closeModal);
  modalWindow.appendChild(closeBtn);
  const modalTitle = document.createElement("h3");
  modalTitle.innerText = "Galerie photo";
  modalWindow.appendChild(modalTitle);
  const modalGallery = document.createElement("div");
  modalGallery.classList.add("modal-gallery");
  modalWindow.appendChild(modalGallery);
  const hr = document.createElement("hr");
  modalWindow.appendChild(hr);
  const addPhotoButton = document.createElement("div");
  addPhotoButton.classList.add("addPhotoButton");
  addPhotoButton.addEventListener("click", function () {
    closeModal();
    generateAndOpenAddPhotoModal();
  });
  modalWindow.appendChild(addPhotoButton);
  const addPhotoText = document.createElement("p");
  addPhotoText.innerText = "Ajouter une photo";
  addPhotoButton.appendChild(addPhotoText);
  const deleteAll = document.createElement("p");
  deleteAll.classList.add("deleteAll");
  deleteAll.innerText = "Supprimer la galerie";
  modalWindow.appendChild(deleteAll);
  return modal;
}

// Permet l'envoie sur l'api des images depuis la premiere modal //
async function getWorksDatasForModal() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const modalGallery = document.querySelector(".modal-gallery");
      modalGallery.innerHTML = "";
      data.forEach((item, index) => {
        const workElement = document.createElement("figure");
        workElement.classList.add("figureForModal");
        const dynamicId = item.id;
        const concatenedId = "figureForModal" + dynamicId;
        workElement.id = concatenedId;
        modalGallery.appendChild(workElement);
        const imgWorkElement = document.createElement("img");
        imgWorkElement.src = item.imageUrl;
        imgWorkElement.classList.add("imgForModal");
        workElement.appendChild(imgWorkElement);
        const trashContainer = document.createElement("div");
        trashContainer.classList.add("figureContainer", "trashContainer");
        workElement.appendChild(trashContainer);
        const trashElement = document.createElement("i");
        trashElement.classList.add("fa-solid", "fa-trash-can");
        trashContainer.appendChild(trashElement);

// Permet la suppression d'une photo depuis l'icone de corbeille //
        trashContainer.addEventListener("click", function (event) {
          deleteElementById(item.id);
          generateModal(modal);
        });
        const captionWorkElement = document.createElement("figcaption");
        captionWorkElement.innerText = "editer";
        captionWorkElement.classList.add("figcaptionForModal");
        workElement.appendChild(captionWorkElement);
        
// Creation de l'icone des fleches sur la première photo //
        if (index === 0) {
          const arrowsContainer = document.createElement("div");
          arrowsContainer.classList.add("figureContainer", "arrowsContainer");
          workElement.appendChild(arrowsContainer);
          const arrowsElement = document.createElement("i");
          arrowsElement.classList.add(
            "fa-solid",
            "fa-arrows-up-down-left-right"
          );
          arrowsContainer.appendChild(arrowsElement);
        }
      });
    });
}

// Fonction de suprression des photos de la base de données //
async function deleteElementById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const elementToRemove = document.getElementById("figureForMainPage" + id);
    const elementToRemoveFromModal = document.getElementById("figureForModal" + id);
    if (elementToRemove && elementToRemoveFromModal) {
      elementToRemove.parentNode.removeChild(elementToRemove);
      elementToRemoveFromModal.parentNode.removeChild(elementToRemoveFromModal);
    }
  }
}

// Creation de la seconde modal (ajout de photos) //
let addPhotoModal;
function generateAddPhotoModal() {
  addPhotoModal = document.createElement("div");
  addPhotoModal.classList.add("modal", "photoModal");
  document.body.appendChild(addPhotoModal);
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.addEventListener("click", closeAddPhotoModal);
  addPhotoModal.appendChild(modalBackground);
  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");
  addPhotoModal.appendChild(modalWindow);
  const iconBar = document.createElement("div");
  iconBar.classList.add("iconBar");
  modalWindow.appendChild(iconBar);
  const backButton = document.createElement("i");
  backButton.classList.add("fa-solid", "fa-arrow-left");
  backButton.addEventListener("click", function () {
    closeAddPhotoModal();
    generateAndOpenModal();
  });
  iconBar.appendChild(backButton);
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", closeAddPhotoModal);
  iconBar.appendChild(closeBtn);
  const addPhotoForm = document.createElement("form");
  addPhotoForm.classList.add("addPhotoForm");
  const formTitleContainer = document.createElement("div");
  formTitleContainer.classList.add("formTitleContainer");
  addPhotoForm.appendChild(formTitleContainer);
  const modalTitle = document.createElement("h3");
  modalTitle.classList.add("addPhotomodalTitle");
  modalTitle.innerText = "Ajout photo";
  modalWindow.appendChild(modalTitle);

  // Carré ou on peut sélectionner une photo depuis son ordinateur //
  const uploadPhotoContainer = document.createElement("div");
  uploadPhotoContainer.classList.add("uploadPhotoContainer");
  addPhotoForm.appendChild(uploadPhotoContainer);
  const uploadPhotoIcon = document.createElement("i");
  uploadPhotoIcon.classList.add("fa-solid", "fa-image");
  uploadPhotoContainer.appendChild(uploadPhotoIcon);
  const uploadPhotoButtonContainer = document.createElement("div");
  uploadPhotoButtonContainer.classList.add("uploadPhotoButtoncontainer");
  uploadPhotoContainer.appendChild(uploadPhotoButtonContainer);
  const uploadPhotoButton = document.createElement("input");
  uploadPhotoButton.classList.add("uploadPhotoButton");
  uploadPhotoButton.type = "file";
  uploadPhotoButton.id = "photo";
  uploadPhotoButton.accept = ".jpg, .png";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButton);
  const uploadPhotoButtonText = document.createElement("label");
  uploadPhotoButtonText.classList.add("uploadPhotoButtonText");
  uploadPhotoButtonText.setAttribute("for", "photo");
  uploadPhotoButtonText.textContent = "+ Ajouter photo";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButtonText);

  // Visuel de la photo avant d'upload //
  let img;
  uploadPhotoButton.addEventListener("input", () => {
    const photoPreview = new FileReader();
    photoPreview.readAsDataURL(uploadPhotoButton.files[0]);
    photoPreview.addEventListener("load", () => {
      const invalidFile = document.querySelector(".invalidFile");
      var fileInput = document.getElementById("photo");
      var file = fileInput.files[0];
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        invalidFile.innerText = "Veuillez sélectionner un fichier JPG ou PNG.";
      } else if (file.size > 4 * 1024 * 1024) {
        invalidFile.innerText = "Veuillez sélectionner un fichier de moins de 4 Mo.";
      } else {
        invalidFile.innerText = "";
        const url = photoPreview.result;
        img = new Image();
        img.classList.add("photoPreviewImg");
        img.src = url;
        uploadPhotoContainer.appendChild(img);
        return img;
      }
    });
  });
  const uploadPhotodescription = document.createElement("p");
  uploadPhotodescription.classList.add("uploadPhotodescription");
  uploadPhotodescription.innerText = "jpg, png : 4mo max";
  uploadPhotoContainer.appendChild(uploadPhotodescription);
  const invalidFile = document.createElement("p");
  invalidFile.innerText = "";
  invalidFile.classList.add("invalidFile");
  addPhotoForm.appendChild(invalidFile);

  // Zone de text permettant d'ajouter le titre //
  const titleLabel = document.createElement("label");
  titleLabel.classList.add("titleLabel");
  titleLabel.textContent = "Titre";
  addPhotoForm.appendChild(titleLabel);
  const nameInput = document.createElement("input");
  nameInput.classList.add("nameInput");
  nameInput.type = "text";
  nameInput.name = "titre";
  addPhotoForm.appendChild(nameInput);

  // Menu deroulant pour choisir la categorie de la photo //
  const categoryLabel = document.createElement("Label");
  categoryLabel.classList.add("categoryLabel");
  categoryLabel.innerText = "Catégorie";
  addPhotoForm.appendChild(categoryLabel);
  const categorySelect = document.createElement("select");
  categorySelect.name = "Categorie";
  categorySelect.classList.add("categorySelect");
  addPhotoForm.appendChild(categorySelect);
  let categoryName;
  let categoryId;
  const initialOption = document.createElement("option");
  initialOption.value = "";
  initialOption.text = "Sélectionnez une catégorie";
  categorySelect.appendChild(initialOption);

  // Permet de récupérer les catégories dans l'api pour les afficher dans le menu déroulant //
  categorySelect.addEventListener("click", async () => {
    if (categorySelect.options.length === 1) {
      const response = await fetch("http://localhost:5678/api/categories");
      const data = await response.json();
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      const selectedOption = categorySelect.options[categorySelect.selectedIndex];
      categoryName = selectedOption.text;
      categoryId = selectedOption.value;
    }
  });
  const hr = document.createElement("hr");
  addPhotoForm.appendChild(hr);

  // Permet de changer la couleur du bouton en vert pour valider //
  function updateSendButtonId() {
    const uploadPhotoFiles = uploadPhotoButton.files;
    const isNameInputFilled = nameInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";
    if (
      uploadPhotoFiles.length > 0 &&
      isNameInputFilled &&
      isCategorySelected
    ) {
      sendButton.id = "buttonReadyToWork";
    } else {
      sendButton.id = "";
    }
  }
  uploadPhotoButton.addEventListener("change", updateSendButtonId);
  nameInput.addEventListener("input", updateSendButtonId);
  categorySelect.addEventListener("click", updateSendButtonId);
  const sendButton = document.createElement("button");
  const gallery = document.querySelector(".gallery");
  sendButton.type = "submit";
  sendButton.classList.add("sendButton");
  addPhotoForm.appendChild(sendButton);

  // Traitement du click sur le bouton valider //
  addPhotoForm.addEventListener("submit", async (event) => {
   
    if (sendButton.id === "buttonReadyToWork") {
      try {
        await postDatas();
        img.remove();
        nameInput.value = "";
        categorySelect.selectedIndex = 0;
        sendButton.removeAttribute("id");
        gallery.innerHTML = "";
        await getWorksDatas();
      } catch (error) {
        console.log("Erreur d'upload: ", error);
      }
    }
  });

  // Utilisation de "POST" pour envoyer dans la base de données //
  async function postDatas() {
    return new Promise((send) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", uploadPhotoButton.files[0]);
      formData.append("title", nameInput.value);
      formData.append("category", categoryId);
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((response) => {
        if (response.status === 201) {
          send();
        }
      });
    });
  }
  const sendButtonText = document.createElement("p");
  sendButtonText.classList.add("sendButtonText");
  sendButtonText.innerText = "Valider";
  sendButton.appendChild(sendButtonText);
  window.addEventListener("keyup", escapeClose);
  modalWindow.appendChild(addPhotoForm);
  return addPhotoModal;
}