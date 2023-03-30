import { renderUser, login } from "../../scripts/index.js"
import { toast } from "../../scripts/toast.js"
const red = '#08C203'
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
    const register = document.querySelector("#cadastrar")
    const cadastar = document.querySelector("#btnCadastrar")

    login.addEventListener('click', () => {
        window.location.replace('/')
    })

    register.addEventListener('click', () => {
        window.location.replace('/src/pages/register/register.html')
    })

    cadastar.addEventListener("click", (event) => {
        event.preventDefault()
        window.location.replace('/src/pages/register/register.html')
    })
}

function loginForm() {
    const inputs = document.querySelectorAll(".formulario__container > input")
    const btnlogin = document.querySelector("#btnLogin")
    const loginUser = {}

    btnlogin.addEventListener("click", async (event) => {
        event.preventDefault()

        inputs.forEach(input => {
            loginUser[input.name] = input.value
        })
        const request = await login(loginUser)
    })
}

renderUser()
ativarDropdown()
menuRedirecionar()
loginForm()