import { criarUser, renderUser } from "../../scripts/index.js"
import { toast } from "../../scripts/toast.js"
const red = '#C20803'
const green = '#08C203'


function ativarDropdown() {
    const tagi = document.querySelector(".container__cabecalho>i")
    const botoes = document.querySelector(".container__cabecalho--buttons")

    tagi.addEventListener("click", () => {
        if (tagi.classList.contains("fa-bars")) {

            tagi.classList.remove("fa-bars")
            tagi.classList.add('fa-xmark')
            botoes.classList.remove("hidden")

        } else {
            tagi.classList.remove('fa-xmark')
            tagi.classList.add("fa-bars")
            botoes.classList.add("hidden")
        }
    })
}

function menuRedirecionar() {
    const login = document.querySelector("#login")
    const home = document.querySelector("#home")
    const retornar = document.querySelector("#btnRetornar")

    login.addEventListener('click', () => {
        window.location.replace('/src/pages/login/login.html')
    })

    home.addEventListener('click', () => {
        window.location.replace('/')
    })

    retornar.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace('/src/pages/login/login.html')
    })
}

function cadastrarUsusario() {
    const inputs = document.querySelectorAll(".formulario__container #inputs")
    const btnCadastrar = document.querySelector("#btnCadastrar-se")
    const novoUsuario = {}

    btnCadastrar.addEventListener("click", async (event) => {
        event.preventDefault()
        inputs.forEach(input => {
            novoUsuario[input.name] = input.value
        })
        const requisicao = await criarUser(novoUsuario)
    })

    return novoUsuario
}

renderUser()
ativarDropdown()
menuRedirecionar()
cadastrarUsusario()