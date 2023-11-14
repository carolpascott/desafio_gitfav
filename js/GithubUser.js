//api do github
export class GithubUser {
    static search(username) {
        //dados fornecidos pela api
        const endpoint = `https://api.github.com/users/${username}`

        //fetch: promise - requisições http
        return fetch(endpoint)
            .then(data => data.json())
            .then(({login, name, public_repos, followers}) => ({
                login, name, public_repos, followers
            }))
    }
}