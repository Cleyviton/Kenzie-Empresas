import { getAllRequest, getUser, renderUser } from "../../scripts/index.js"

const empresas = await getAllRequest()

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

    login.addEventListener('click', () => {
        window.location.replace('/src/pages/login/login.html')
    })

    register.addEventListener('click', () => {
        window.location.replace('/src/pages/register/register.html')
    })
}

function renderEmpresas(array) {
    const data = JSON.parse(localStorage.getItem("@empresas")) || []
    const ul = document.querySelector(".main__conteiner--listaDeEmpresas")
    ul.innerHTML = ''

    if (data.length > 0) {
        data.forEach(empresa => {
            const { name, opening_hours, sectors } = empresa

            ul.insertAdjacentHTML("beforeend",
                `<li class="main__conteiner--listaDeEmpresas-empresa">
          <h3>${name}</h3>
          <div>
            <p> ${opening_hours} Horas </p>
            <span> ${sectors.description} </span>
          </div>
         </li>`
            )
        });
    } else {
        array.forEach(empresa => {
            const { name, opening_hours, sectors } = empresa

            ul.insertAdjacentHTML("beforeend",
                `<li class="main__conteiner--listaDeEmpresas-empresa">
          <h3>${name}</h3>
          <div>
            <p> ${opening_hours} Horas </p>
            <span> ${sectors.description} </span>
          </div>
         </li>`
            )
        });
    }

    return ul
}

function ativarEdesativarSelect() {
    const botao = document.querySelector(".main__empresas>div>i")
    const menuOpcoes = document.querySelector(".main__empresas--select-setores")

    botao.addEventListener("click", () => {
        botao.classList.toggle("fa-arrow-down")
        botao.classList.toggle("fa-arrow-up")
        menuOpcoes.classList.toggle("hidden")
    })
}

function renderPeloSelect(array) {
    const botao = document.querySelector(".main__empresas>div>i")
    const menuOpcoes = document.querySelector(".main__empresas--select-setores")
    const opcoes = document.querySelectorAll(".main__empresas--select-setores>option")

    opcoes.forEach((opcao) => {
        opcao.addEventListener("click", () => {
            if (opcao.value == "Todos") {
                localStorage.clear()
                renderEmpresas(empresas)

                botao.classList.remove("fa-arrow-up")
                botao.classList.add("fa-arrow-down")
                menuOpcoes.classList.add("hidden")
            } else {
                localStorage.setItem("@empresas", JSON.stringify(filtrarPeloSelect(opcao.value)))
                renderEmpresas(filtrarPeloSelect(opcao.value))

                botao.classList.remove("fa-arrow-up")
                botao.classList.add("fa-arrow-down")
                menuOpcoes.classList.add("hidden")
            }
        })
    })

}

function filtrarPeloSelect(value) {
    const filtrados = empresas.filter((empresa) => {
        return empresa.sectors.description == value
    })
    return filtrados
}

renderUser()
ativarDropdown()
menuRedirecionar()
ativarEdesativarSelect()
renderEmpresas(empresas)
renderPeloSelect(empresas)