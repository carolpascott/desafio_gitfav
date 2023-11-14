import { GithubUser } from "./GithubUser.js"

//estrutura dos dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    }

    // load() {
    //     this.entries = [
    //         {
    //             login:'maykbrito',
    //             name: "Mayk Brito",
    //             public_repos: '76',
    //             followers: '120000'
    //         },
  
    load() {
        //JSON parse: converte string p/ objeto
        //local storage (do navegador)
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || []
    }

    save() {
        // converte objeto js em string em formato json
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado.')
            }
            const user = await GithubUser.search(username)
        
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            // p/ ter imutabilidade, cria um novo array
            // inclui o novo usuário e copia existente
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }        
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        

        this.entries = filteredEntries
        this.update()
        this.save()
    }    
}

//visualização e eventos do html
export class FavoritesView extends Favorites {
    //root = #app [main.js]
    constructor(root) {
        //super = Favorites
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.addFavorites()
    }

    addFavorites() {
        const favoritesButton = this.root.querySelector('.search button')
        favoritesButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <tr>
                <td class="user">
                    <img src=" " alt=" ">
                    <a href=" " target="_blank">
                        <p> </p>
                        <span> </span>
                    </a>
                </td>
                <td class="repositories"> </td>
                <td class="followers"> </td>
                <td class="action"><button>Remover</button></td>
            </tr>
        `
        return tr
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `
                https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `
                Imagem de ${user.name}`
            row.querySelector('.user a').href = `
                https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.action').onclick = () => {
                const remove = confirm('Remover usuário da tabela?')

                if(remove) {
                    this.delete(user)
                }
            }
            
            this.tbody.append(row)
        })
    }
    
    removeAllTr() {  
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })       

    }
}


