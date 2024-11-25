const baseURL = 'http://localhost:3000'; // ou a URL da sua API

class API {
    static async get(endpoint, params) {
        const response = await fetch(baseURL + endpoint + (new URLSearchParams(params)), {credentials: 'include'});

        return this.treatResponse(response)
    }

    static async post(endpoint, params) {
        const response = await fetch(
            baseURL + endpoint, 
            {
                method: 'POST', 
                body: JSON.stringify(Object.fromEntries(params)),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            }
        );

        return this.treatResponse(response)
    }

    static async put(endpoint, params) {
        const response = await  fetch(
            baseURL + endpoint, 
            {
                method: 'PUT', 
                body: JSON.stringify(Object.fromEntries(params)),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            }
        );

        return this.treatResponse(response)
    }

    static async delete(endpoint, params) {
        const response = await fetch(
            baseURL + endpoint, 
            {
                method: 'DELETE', 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            }
        );

        return this.treatResponse(response)
    }

    static treatResponse(response) {
        if(response.ok) {
            return response;
        }

        if(response.status == 401) {
            return window.location.replace("./frontend/");
        }

        if(response.status == 422) {
            throw Error("Invalid fields", {cause: response});
        }

        throw Error("Unexpected Error", {cause: response});
    }
}