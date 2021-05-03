const apiUrl = "https://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
  username: "api.user",
  password: "API-key-1234#!",
};

const opskriftindexId = 10; // Opskriftindex
const opskriftId = 7; // alle opskrifterne
const morgenmadId = 6, mindreRetterId = 12, storeMaaltiderId = 13, 
soedeSagerId = 11, tilbehoerId = 14, salaterId = 15, supperId = 16, 
drikkeId = 17, groenJulId = 18, glutenfriId = 19, bagvaerkId = 20;
const morgenmadKatId = 137, mindreRetterKatId = 148, storeMaaltiderKatId = 153, 
soedeSagerKatId = 158, tilbehoerKatId = 163, salaterKatId = 167, supperKatId = 171, 
drikkeKatId = 175, groenJulKatId = 179, glutenfriKatId = 183, bagvaerkKatId = 188;


function errorMessage(msg) { //Error message
  console.log(msg);
}

getDataFromWP();

function getDataFromWP() { //function that gets data from wordpress
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () { // specify what happens when done
    if (this.readyState === 4 && this.status === 200) { // Det er OK
      try {
        let data = JSON.parse(this.response); // converts data to json
        window.localStorage.setItem("authToken", data.token); // gets token
        createPage();
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState == 4 && this.status >= 400) { // Der er en fejl
      errorMessage("An error has occured, please try again later.");
    }
  };
  
  xhttp.open( // 'open' the connection to the API endpoint
    "POST",
    "https://charlottegracia.dk/wp-json/jwt-auth/v1/token",
    true
  );
  
  xhttp.setRequestHeader("Content-Type", "application/JSON"); // specify any request headers needed
  
  xhttp.send(JSON.stringify(apiUserCredentials)); // send the request
}

function createPage() {
  console.log(
    `YAY we have a token: ${window.localStorage.getItem("authToken")}`
  );
  getCategoriesFromWP();
}

function getCategoriesFromWP() { //gets categories from wordpress
  const xhttp = new XMLHttpRequest();
  const url = window.location.href;
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) { // this is ok
      try {
        CategoryPosts = JSON.parse(this.response); //converts data to json and puts it in CategoryPosts variable
        if (url.indexOf('pageId') == -1) {
          drawCategories(CategoryPosts);
        } else if (url.indexOf('opskriftsindex.html') > -1) {
          findPageId(url);
          drawSpecificCategory(pageId, CategoryPosts);
        } else if (url.indexOf('recipes.html') > -1) {
          findPageId(url);
          drawRecipe(pageId);
        } 
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState === 4 && this.status >= 400) { // error
      errorMessage("An error has occured, please try again later.");
    }
  };
  // where to send the request and how?
  xhttp.open("GET", `${apiUrl}posts?status=private&categories=${opskriftindexId}&per_page=50`, true);

  // specify any necassary request headers
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("authToken")}`
  );

  // send request
  xhttp.send();
}

function findPageId(url) {
  const urlSplit = url.split('?');
  
  if (urlSplit[1].indexOf('&') == -1){
      const parameterSplit = urlSplit[1].split('=');
      pageId = parameterSplit[1];
  } 
  return pageId;
}

function drawCategories(CategoryPosts) {
  let categoryList = '';
  drawInspiration();
        for (let i = 0; i < CategoryPosts.length; i++){ // for loop that draws the categories with title and picture
            categoryList += `
                <a href="opskriftsindex.html?pageId=${CategoryPosts[i].id}" id="gridItem" class="gridItem${i}" style="background-image: url(${CategoryPosts[i].acf.billede_til_kategori.url})">
                    <div class="imgTxt">
                        <p>${CategoryPosts[i].acf.titel_pa_kategori}</p>
                    </div>
                </a>
              `;
        }
        document.querySelector('.mainGrid').innerHTML += categoryList; //sends categoryList-string to mainGrid in html
}

function drawSpecificCategory(pageId, CategoryPosts) {
  let text = "";
  CategoryPosts.forEach(category => {
    if (category.id == pageId){
      text += `<h1>${category.acf.titel_pa_kategori}</h1>`
      document.querySelector('main').innerHTML = text;
    }
  });
  

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) { // this is ok
      try {
        opskrifter = JSON.parse(this.response); //converts data to json and puts it in CategoryPosts variable
        drawRecipesOnCategoryPage(opskrifter, text);
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState === 4 && this.status >= 400) { // error
      errorMessage("An error has occured, please try again later.");
    }
  };
  // where to send the request and how?
  xhttp.open("GET", GETurl(pageId), true);
  // specify any necassary request headers
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("authToken")}`
  );

  // send request
  xhttp.send();
  }

  function GETurl(pageId) {
    let id;
    if (pageId == morgenmadKatId) {
      id = morgenmadId;
    } else if (pageId == mindreRetterKatId) {
      id = mindreRetterId;
    } else if (pageId == storeMaaltiderKatId) {
      id = storeMaaltiderId;
    } else if (pageId == soedeSagerKatId) {
      id = soedeSagerId;
    } else if (pageId == tilbehoerKatId) {
      id = tilbehoerId;
    } else if (pageId == salaterKatId) {
      id = salaterId;
    } else if (pageId == supperKatId) {
      id = supperId;
    } else if (pageId == drikkeKatId) {
      id = drikkeId;
    } else if (pageId == groenJulKatId) {
      id = groenJulId;
    } else if (pageId == glutenfriKatId) {
      id = glutenfriId;
    } else if (pageId == bagvaerkKatId) {
      id = bagvaerkId;
    } else {
      id = opskriftId;
    }
    
    return `${apiUrl}posts?status=private&categories=${id}&per_page=50`
  }

function drawRecipesOnCategoryPage(opskrifter, text){
  console.log(opskrifter);
  text += `<div class="opskriftGrid">`;
  document.querySelector('main').innerHTML += text;
    opskrifter.forEach(opskrift => {
      text += `
        <a href="recipes.html?pageId=${opskrift.id}" class="opskriftGridItem">
          <div class="opskriftImg" style="background-image: url(${opskrift.acf.Billede1.url})">
          </div>
          <div>
            <p>${opskrift.date}</p>
            <hr>
            <h2>${opskrift.acf.opskrift_navn}</h2>
            <p class="historie">${opskrift.acf.billede_og_tekst_under_den_faktiske_opskrift.opskrift_historie}</p>
          </div>
        </a>
      `;
  });
  text += `<div>`;
  document.querySelector('main').innerHTML = text;
}

function drawRecipe(pageId) {
  let opskriftText = "";
  console.log(pageId);
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) { // this is ok
      try {
        opskrifter = JSON.parse(this.response); //converts data to json and puts it in CategoryPosts variable
        console.log(opskrifter);
        opskrifter.forEach(opskrift => {
          if (pageId == opskrift.id) {
            opskriftText += `
            <section class="opskriftMain">
                <h1>${opskrift.acf.opskrift_navn}</h1>
                <img src="${opskrift.acf.Billede1.url}" alt="${opskrift.acf.opskrift_navn}">
            </section>
            <section class="opskrift">
                <button>Udskriv <i class="fas fa-print"></i></button>
                <div>
                    <h2>${opskrift.acf.faktisk_opskrift.faktisk_opskrift_navn}</h2>
                    <p>af Johanne Mosgaard</p>
                    <div class="opskriftTxt">
                        <p>${opskrift.acf.faktisk_opskrift.opskrift_introduktion}
                        </p>
                    </div>
                </div>
                <div class="opskriftBeskrivelse">
                    <p>Ret: ${opskrift.acf.faktisk_opskrift.opskrift_info.ret}</p>
                    <p>Antal: ${opskrift.acf.faktisk_opskrift.opskrift_info.antal_personer}</p>
                    <p>Forb. tid: ${opskrift.acf.faktisk_opskrift.opskrift_info.forberedelses_tid} minutter</p>
                    <p>Tilb. tid: ${opskrift.acf.faktisk_opskrift.opskrift_info.tilberedelses_tid} minutter</p>
                </div>
            `;
            opskriftText += `
            <div class="opskriftFremgangsmåde">
                    <div class="opskriftFremgangsmådeBox">
                        <h3>Ingredienser</h3>
                        <ul>
            `;
            const ingrediensArray = opskrift.acf.faktisk_opskrift.ingredienser.ingredienser.split('&');
            ingrediensArray.forEach(ingrediens => {
              ingrediens.trim();
              opskriftText += `
                  <li>${ingrediens}</li>
              `;
            });
            opskriftText += `
                        </ul>
                    </div>
                    <div class="opskriftFremgangsmådeBox">
                            <h3>Sådan gør du</h3>
                            <ol>
            `;
            const saadanGoerDuArray = opskrift.acf.faktisk_opskrift.sadan_gor_du.split('&');
            saadanGoerDuArray.forEach(trin => {
              trin.trim();
              opskriftText += `
                  <li>${trin}</li>
              `;
            });
            opskriftText += `</ol>`;
            if (opskrift.acf.faktisk_opskrift.noter != ''){
              opskriftText += `
                  <h3>Noter</h3>
                  <p>${opskrift.acf.faktisk_opskrift.noter}</p>
            `;
            }
            opskriftText += `
            </div>
                    </div>
                </div>
            </section>
            <div class="opskriftKommentar">
                <img src="${opskrift.acf.billede_og_tekst_under_den_faktiske_opskrift.billede2.url}" alt="${opskrift.acf.opskrift_navn}">
                <p>
                ${opskrift.acf.billede_og_tekst_under_den_faktiske_opskrift.opskrift_historie}
                </p>
            </div>
            <section class="opskriftTags">
            <h2>Tags i denne opskrift</h2>
            <div class="tagsBox">
            `;
            const tagsArray = opskrift.acf.tags.split('&');
            tagsArray.forEach(tag => {
              tag.trim();
              opskriftText += `
                <div class="tag">${tag}</div>
              `;
            });
            opskriftText += `
            </div>
          </section>
          <hr>
          <section class="opskriftBøger">
            <a href="https://www.saxo.com/dk/vegansk-grundkoekken_johanne-mosgaard_indbundet_9788740058420" target="_blank" class="opskriftBog">
                <div class="opskriftBogBox">
                    <img src="assets/images/veganskkøkkenbog.jpg" alt="Vegansk Grundkøkken">
                </div>
                
                <div class="opskriftBogBox">
                    <p>Vegansk grundkøkken
                        <br>
                        Johanne Mosgaard
                        <br>
                        Bog, indbundet
                        <br>
                        Sprog: Dansk
                    </p>
                    <button>Køb bogen</button>
                </div>
            </a>
            <a href="https://www.saxo.com/dk/vegansk_johanne-mosgaard_indbundet_9788740036176" target="_blank" class="opskriftBog">
                <div class="opskriftBogBox">
                    <img src="assets/images/veganskbog.jpg" alt="Vegansk Bog">
                </div>
                <div class="opskriftBogBox">
                    <p>Vegansk 
                        <br>
                        Johanne Mosgaard
                        <br>
                        Bog, indbundet
                        <br>
                        Sprog: Dansk
                    </p>
                    <button>Køb bogen</button>
                </div>
            </a>
        </section>

        <hr>

        <section class="omForfatter">
        <div class="omForfatterBox">
            <img src="assets/images/portræt.jpg" alt="Johanne Mosgaard">
        </div>  
        <div class="omForfatterBox">
            <h2>Hvem er jeg?</h2>
            <p>Mit navn er Johanne, jeg er 28 år gammel og bor tæt på Rold Skov
                i Nordjylland med min mand med vores datter og to hunde.
                <br>
                <br>
                På min blog Englerod deler jeg min passion for velsmagende og farverig grøntsagsmad.
                Jeg dyrker selv en stor del af mine grøntsager og elsker processen fra jord til bord.
                <br>
                <a href="#">Læs mere</a>
            </p>
            <iframe src="https://www.youtube.com/embed/lR-iZ0G3JWQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </section>
            `;
          }
        });
        document.querySelector('main').innerHTML = opskriftText;
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState === 4 && this.status >= 400) { // error
      errorMessage("An error has occured, please try again later.");
    }
  };
  // where to send the request and how?
  xhttp.open("GET", `${apiUrl}posts?status=private&categories=${opskriftId}&per_page=50`, true);
  // specify any necassary request headers
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("authToken")}`
  );

  // send request
  xhttp.send();
}

function drawInspiration() {
  let inspiration = [];
  inspirationsOpskrifter = '';
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) { // this is ok
      try {
        opskrifter = JSON.parse(this.response); //converts data to json and puts it in variable
        while(inspiration.length < 3){
          let opskrift = opskrifter[Math.floor(Math.random() * opskrifter.length )];
                inspiration.push(opskrift);
         }
        inspirationsOpskrifter += `
        <h1>Få inspiration</h1>
            <div class="mainImgWrap">
                <a href="recipes.html?pageId=${inspiration[0].id}" class="mainImg" style="background-image: url(${inspiration[0].acf.Billede1.url})">
                    <div class="imgTxt">
                        <p>${inspiration[0].acf.opskrift_navn}</p>
                    </div>
                </a>
                <a href="recipes.html?pageId=${inspiration[1].id}" class="mainImg" style="background-image: url(${inspiration[1].acf.Billede1.url})">
                    <div class="imgTxt">
                        <p>${inspiration[1].acf.opskrift_navn}</p>
                    </div>
                </a>
                <a href="recipes.html?pageId=${inspiration[2].id}" class="mainImg" style="background-image: url(${inspiration[2].acf.Billede1.url})">
                    <div class="imgTxt">
                        <p>${inspiration[2].acf.opskrift_navn}</p>
                    </div>
                </a>
            </div>
            <hr>
            `;
        document.querySelector('.mainIndex').innerHTML = inspirationsOpskrifter;
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState === 4 && this.status >= 400) { // error
      errorMessage("An error has occured, please try again later.");
    }
  };
  // where to send the request and how?
  xhttp.open("GET", `${apiUrl}posts?status=private&categories=${opskriftId}&per_page=50`, true);
  // specify any necassary request headers
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("authToken")}`
  );

  // send request
  xhttp.send();
}