/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const Home = {
	name: "Home",
	template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
	data() {
		return {};
	},
};

const NotFound = {
	name: "NotFound",
	template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
	data() {
		return {};
	},
};

const UploadForm = {
	name: "UploadForm",
	template: `
    <div>
        <h1>Upload Form</h1>
        <div class="flashes">
            <div v-for="flash in flashes" v-bind:class=flash.className>
                {{ flash.message }}
            </div>
        </div>
        <form id="uploadForm" action="/api/uploads/" method="POST" enctype="multipart/form-data" @submit.prevent="uploadPhoto">
            <label for="desc">Description</label>
            <textarea id="desc" class="form-control" name="description"></textarea>
            <label for="photo">Photo</label>
            <input type="file" class="form-control" id="photo" name="photo"/>
            <button class="btn btn-primary" type="submit">Upload</button>
        </form>
    </div>
    `,
	methods: {
		uploadPhoto() {
			let uploadForm = document.getElementById("uploadForm");
			let form_data = new FormData(uploadForm);
			let self = this;

			fetch("/api/upload", {
				method: "POST",
				body: form_data,
				headers: {
					"X-CSRFToken": token,
				},
				credentials: "same-origin",
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (jsonResponse) {
					// display a success message
					console.log(jsonResponse);
                    self.flashes=[];
					if (Object.keys(jsonResponse).includes("errors")) {
						jsonResponse.errors.forEach((err) => {
							self.flashes.push({
								message: err,
								className: "alert alert-danger",
							});
						});
					} else {
						self.flashes.push({
							message: "File Upload Successful",
							className: "alert alert-success",
						});
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
	},
	data() {
		return {
			flashes: [],
		};
	},
};

const app = Vue.createApp({
	data() {
		return {};
	},
	components: {
		"upload-form": UploadForm,
		home: Home,
		"not-found": NotFound,
	},
});

app.component("app-header", {
	name: "AppHeader",
	template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload Photo <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,
});

app.component("app-footer", {
	name: "AppFooter",
	template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
	data() {
		return {
			year: new Date().getFullYear(),
		};
	},
});

// Define Routes
const routes = [
	{ path: "/", component: Home },
	// Put other routes here
	{ path: "/upload", component: UploadForm },
	// This is a catch all route in case none of the above matches
	{ path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHistory(),
	routes, // short for `routes: routes`
});

app.use(router);

app.mount("#app");
