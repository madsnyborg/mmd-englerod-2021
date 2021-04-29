const apiUrl = "http://charlottegracia.dk/wp-json/wp/v2/";
const apiUserCredentials = {
  username: "api.user",
  password: "API-key-1234#!",
};

const CategoryId = 10; // Opskriftindex


//Error message
function errorMessage(msg) {
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
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) { // this is ok
      try {
        CategoryPosts = JSON.parse(this.response); //converts data to json and puts it in CategoryPosts variable
        console.log(CategoryPosts);
        let categoryList = '';
        for (let i = 0; i < CategoryPosts.length; i++){ // for loop that draws the categories with title and picture
            const item = CategoryPosts[i];
            categoryList += `
                <a href="opskriftsindex.html?pageId=${CategoryPosts[i].id}" id="gridItem" class="gridItem${i}" style="background-image: url(${CategoryPosts[i].acf.billede_til_kategori.url})">
                    <div class="imgTxt">
                        <p>${CategoryPosts[i].acf.titel_pa_kategori}</p>
                    </div>
                </a>
              `;
        }
        document.querySelector('.mainGrid').innerHTML = categoryList; //sends categoryList-string to mainGrid in html
      } catch (error) {
        errorMessage(`Parsing error:${error}`);
      }
    }
    if (this.readyState === 4 && this.status >= 400) { // error
      errorMessage("An error has occured, please try again later.");
    }
  };

  // where to send the request and how?
  xhttp.open("GET", `${apiUrl}posts?status=private&categories=${CategoryId}&per_page=50`, true);

  // specify any necassary request headers
  xhttp.setRequestHeader(
    "Authorization",
    `Bearer ${window.localStorage.getItem("authToken")}`
  );

  // send request
  xhttp.send();
}

/*pageId = findPageId();

function findPageId() {

} */