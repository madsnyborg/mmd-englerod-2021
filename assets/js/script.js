const apiUrl = "http://charlottegracia.dk/wp-json/wp/v2/";
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
  // specify what happens when done
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Det er OK
      try {
        let data = JSON.parse(this.response); // converts data to json
        window.localStorage.setItem("authToken", data.token); // gets token
        createPage();
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState == 4 && this.status >= 400) {
      // Der er en fejl
      errorMessage("An error has occured, please try again later.");
    }
  };

  // 'open' the connection to the API endpoint
  xhttp.open(
    "POST",
    "http://charlottegracia.dk/wp-json/jwt-auth/v1/token",
    true
  );

  // specify any request headers needed
  xhttp.setRequestHeader("Content-Type", "application/JSON");
  // send the request
  xhttp.send(JSON.stringify(apiUserCredentials));
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
        console.log(CategoryPosts);
        if (url.indexOf('pageId') == -1) {
          drawCategories(CategoryPosts);
        } else {
          findPageId(url);
          drawSpecificCategory(pageId, CategoryPosts);
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
  } /* else {
      const urlParameters = urlSplit[1].split('&');
      for (let i = 0; i < urlParameters.length; i++) {
          if (urlParameters[i].substring(0,6) == 'pageId'){
              const pageIdSplit = urlParameters[i].split('=');
              pageId = pageIdSplit[1];
              break;
          }
      }
  }*/
  return pageId;
}

function drawCategories(CategoryPosts) {
  let categoryList = '';
        for (let i = 0; i < CategoryPosts.length; i++){ // for loop that draws the categories with title and picture
            categoryList += `
                <a href="opskriftsindex.html?pageId=${CategoryPosts[i].id}" id="gridItem" class="gridItem${i}" style="background-image: url(${CategoryPosts[i].acf.billede_til_kategori.url})">
                    <div class="imgTxt">
                        <p>${CategoryPosts[i].acf.titel_pa_kategori}</p>
                    </div>
                </a>
              `;
        }
        document.querySelector('.mainGrid').innerHTML = categoryList; //sends categoryList-string to mainGrid in html
}

function drawSpecificCategory(pageId, CategoryPosts) {
  console.log(pageId);
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
        console.log(opskrifter);
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
    }
    
    return `${apiUrl}posts?status=private&categories=${id}&per_page=50`
  }

function drawRecipesOnCategoryPage(opskrifter, text){
  console.log(opskrifter);
  text += `<div class="opskriftGrid">`;
  document.querySelector('main').innerHTML += text;
    opskrifter.forEach(opskrift => {
      text += `
        <div class="opskriftGridItem">
          <div class="opskriftImg" style="background-image: url(${opskrift.acf.Billede1.url})">
          </div>
          <div>
            <p>${opskrift.date}</p>
            <hr>
            <h2>${opskrift.acf.opskrift_navn}</h2>
            <p class="historie">${opskrift.acf.billede_og_tekst_under_den_faktiske_opskrift.opskrift_historie}</p>
          </div>
        </div>
      `;
  });
  text += `<div>`;
  document.querySelector('main').innerHTML = text;
}