import {
    getAllDepartaments,
    getUser,
    getUserAll,
    deleteDepartRequest,
    deleteUserRequest,
    green, getAllRequest,
    RequestCriarDepartamento,
    RequestEditarDepartamento,
    DeleteUser, editarUser,
    RequestUserSemDepartamento,
    contratarFuncionario,
    red,
    demitirFuncionario,
} from "../../scripts/index.js";

import { showModalCriar, closeModalinfos } from "../../scripts/modais.js";
import { toast } from "../../scripts/toast.js";

async function renderDash() {
    const user = getUser()

    if (!user) {
        window.location.replace("/src/pages/login/login.html")
    }

    const dadosUsuario = await verificarUser(getUser())

    if (!dadosUsuario.is_admin) {
        window.location.replace("/src/pages/dashboard/user.html")
    }

    return user
}
renderDash()

function logout() {

    const btnLogout = document.querySelector("#logout")
    btnLogout.addEventListener("click", () => {
        localStorage.clear()
        window.location.replace("/src/pages/login/login.html")
    })
}
logout()

export async function verificarUser(user) {
    const token = user.token

    const dadosUsuario = await fetch("http://localhost:6278/auth/validate_user", {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())

    return dadosUsuario
}

async function renderEmpresasSelect () {
    const array = await getAllRequest()
    const select = document.querySelector(".main__principal--departamentos > div > select")

    select.innerHTML = ""
    select.insertAdjacentHTML("beforeend", `<option value="">Selecionar empresa</option>`)

    array.forEach(elemento => {
        select.insertAdjacentHTML("beforeend", `<option value="${elemento.name}">${elemento.name}</option>`)
    })
}
renderEmpresasSelect ()

async function renderDepartamentos() {
    const ul = document.querySelector(".main__principal--departamentos-lista")
    const departamentos = await getAllDepartaments(getUser())
    ul.innerHTML = ""

    departamentos.map(departamento => {
        const { uuid, name, description, companies } = departamento
        ul.insertAdjacentHTML("beforeend", `
        <li>
            <h3>${name}</h3>
            <p>${description}</p>
            <span>${companies.name}</span>
            <div>
                <i data-id="${uuid}" id="vizualizar" class="fa-regular fa-eye"></i>
                <i data-id="${uuid}" id="editar" class="fa-solid fa-pen"></i>
                <i data-id="${uuid}" id="excluir" class="fa-solid fa-trash-can"></i>
            </div>
        </li>
        `)
    });
    vizualizarDepart()
    deletarDepartamento()
    editarDepartamento()
    return ul
}

async function filtrarDepartamentos() {
    const select = document.querySelector(".main__principal--departamentos > div > select")
    const usuario = getUser()
    const departaments = await getAllDepartaments(usuario)

    select.addEventListener("change", () => {
        let filtrados = departaments.filter(departamento => {
            if (select.value != "") {
                return departamento.companies.name == select.value
            } else {
                renderDepartamentos()
            }
        })
        if (filtrados.length >= 0) {
            const ul = document.querySelector(".main__principal--departamentos-lista")
            const departamentos = filtrados
            ul.innerHTML = ""

            departamentos.map(departamento => {
                const { uuid, name, description, companies } = departamento
                ul.insertAdjacentHTML("beforeend", `
        <li>
            <h3>${name}</h3>
            <p>${description}</p>
            <span>${companies.name}</span>
            <div>
                <i data-id="${uuid}" id="vizualizar" class="fa-regular fa-eye"></i>
                <i data-id="${uuid}" id="editar" class="fa-solid fa-pen"></i>
                <i data-id="${uuid}" id="excluir" class="fa-solid fa-trash-can"></i>
            </div>
        </li>
        `)
            })
        }
        vizualizarDepart()
        deletarDepartamento()
        editarDepartamento()
    })

}

async function usuariosContratados(uuid) {
    const usuario = getUser()
    const departamento = await getUserAll(usuario)

    const filtrados = departamento.filter(elemento => elemento.department_uuid == uuid)

    return filtrados
}

async function renderUsuariosContratados(id) {
    const filtrados = await usuariosContratados(id)

    const ul = document.querySelector(".infos__departamento--lista")
    ul.innerHTML = ""
    filtrados.forEach(elemento => {
        if (elemento.kind_of_work) {
            ul.insertAdjacentHTML("beforeend", `
            <li class="infos__departamento--lista-usuario">
                <h3>${elemento.username}</h3>
                <p>${elemento.professional_level}</p>
                <span>${elemento.kind_of_work}</span>
                <button data-id="${elemento.uuid}">Desligar</button>
            </li>
            `)
        } else {
            ul.insertAdjacentHTML("beforeend", `
            <li class="infos__departamento--lista-usuario">
                <h3>${elemento.username}</h3>
                <p>${elemento.professional_level}</p>
                <button data-id="${elemento.uuid}" >Desligar </button>
            </li>
            `)
        }
    })

    demitirUsuario(id)
}

async function demitirUsuario(uuid) {
    const buttons = document.querySelectorAll(".infos__departamento--lista-usuario > button")
    const usuario = getUser()

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            await demitirFuncionario(button.dataset.id, usuario)
            toast("Usuario demitido", green)
            renderUsuariosContratados(uuid)
            userSemDepartamneto()
        })
    })
}

async function vizualizarDepart() {
    const olhos = document.querySelectorAll("#vizualizar")
    const modal = document.querySelector(".infos__departamento")
    const departamentos = await getAllDepartaments(getUser())
    const corpo = {}

    olhos.forEach(botao => {
        botao.addEventListener("click", async () => {
            departamentos.forEach(departamento => {
                if (departamento.uuid == botao.dataset.id) {
                    modal.innerHTML = ""
                    modal.insertAdjacentHTML("beforeend", `
            <div>
                <i class="fa-solid fa-xmark"></i>
                <h2>${departamento.name}</h2>
                <div>
                    <div>
                        <h3>${departamento.description}</h3>
                        <p>${departamento.companies.name}</p>
                    </div>
                    <div class="div__select">
                        <select>
                        </select>
                        <button>Contratar</button>
                    </div>
                </div>
                <ul class="infos__departamento--lista">
                    
                </ul>
            </div>
            `)
                }
            })

            const botaoContratar = document.querySelector(".div__select > button")
            const select = document.querySelector(".div__select > select")
            const usuario = getUser()

            botaoContratar.addEventListener("click", async () => {
                if (select.value != "Selecionar usuário") {
                    corpo["user_uuid"] = select.dataset.id
                    corpo["department_uuid"] = botao.dataset.id

                    await contratarFuncionario(usuario, corpo)
                    toast("Usuário contratado", green)
                    renderUsuariosContratados(botao.dataset.id)
                    userSemDepartamneto()
                } else {
                    toast("Selecione um usuário", red)
                }
            })


            modal.showModal()

            const btnClose = document.querySelector(".infos__departamento > div > i")

            btnClose.addEventListener("click", () => {
                modal.close()
            })

            userSemDepartamneto()
            renderUsuariosContratados(botao.dataset.id)
        })
    })
}

async function userSemDepartamneto() {
    const select = document.querySelector(".div__select > select")
    const usuario = getUser()
    const array = await RequestUserSemDepartamento(usuario)

    select.innerHTML = ""
    let plachehoader = document.createElement("option")
    plachehoader.innerText = "Selecionar usuário"
    select.appendChild(plachehoader)

    array.forEach(user => {
        let option = document.createElement("option")
        option.dataset.id = user.uuid
        option.value = user.username
        option.innerText = user.username
        select.appendChild(option)
    })

    select.addEventListener("change", () => {
        array.forEach(user => {
            if (user.username == select.value) {
                select.dataset.id = user.uuid
            }
        })
    })
}

async function criarOptios() {
    const array = await getAllRequest()
    const select = document.querySelector(".selectCriarDepartamento")

    select.innerHTML = ""
    select.insertAdjacentHTML("beforeend", `<option value="">Selecionar empresa</option>`)

    array.forEach(elemento => {
        select.insertAdjacentHTML("beforeend", `<option value="${elemento.name}">${elemento.name}</option>`)
    })
}
criarOptios()

async function editarDepartamento() {
    const modal = document.querySelector(".editar__departamento")
    const btns = document.querySelectorAll("#editar")
    const btnConfirmar = document.querySelector(".editar__departamento > form > button")
    const btnClose = document.querySelector(".editar__departamento > form > i")
    const input = document.querySelector(".editar__departamento > form > input")
    const usuario = getUser()
    const corpo = {}

    btns.forEach(btn => {
        btn.addEventListener("click", async (event) => {
            event.preventDefault()

            const departamentos = await getAllDepartaments(getUser())
            const filtrada = departamentos.filter(depart => depart.uuid == btn.dataset.id)
            
            input.value = filtrada[0].description

            modal.showModal()

            btnConfirmar.addEventListener("click", async () => {
                if (input.value != "") {
                    corpo[input.name] = input.value
                    await RequestEditarDepartamento(btn.dataset.id, corpo, usuario)
                }
                modal.close()
            })

            btnClose.addEventListener("click", () => {
                modal.close()
            })
        })
    })
}

async function deletarDepartamento() {
    const btnsDelete = document.querySelectorAll("#excluir")
    const modal = document.querySelector(".apagar__departamento")
    const departamentos = await getAllDepartaments(getUser())
    const usuario = getUser()

    btnsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            departamentos.forEach(departamento => {
                if (departamento.uuid == btn.dataset.id) {
                    modal.innerHTML = ""
                    modal.insertAdjacentHTML("beforeend", `
                    <div>
                    <p>Realmente deseja deletar o Departamento ${departamento.name} e demitir seus funcionários?</p>
                    <button data-id="${departamento.uuid}" id="confirmDelete"> Confirmar </button>
                        <i id="fecharModalDelete" class="fa-solid fa-xmark"></i>
                        </div>
                        `)
                    modal.showModal()

                    const modalClose = document.querySelector("#fecharModalDelete")
                    modalClose.addEventListener("click", () => modal.close())

                    const deletebtn = document.querySelector("#confirmDelete")
                    deletebtn.addEventListener("click", async () => {
                        await deleteDepartRequest(deletebtn.dataset.id, usuario)
                        modal.close()
                        renderDepartamentos()
                        toast("Departamento Deletado", green)
                    })

                }
            })
        })
    })
}

export async function criarDepartamento() {
    const inputs = document.querySelectorAll("#inputsCriarDepartamento")
    const modal = document.querySelector(".criar__departamento")
    const btn = document.querySelector("#criarDepart")
    const empresas = await getAllRequest()
    const usuario = getUser()

    btn.addEventListener("click", async (event) => {
        event.preventDefault()

        let elemento = {}

        inputs.forEach(input => {

            if (input.name == "company_uuid") {

                empresas.forEach(empresa => {

                    if (empresa.name == input.value) {
                        elemento[input.name] = empresa.uuid
                    }

                })
            }
            else {
                elemento[input.name] = input.value
            }

        })

        RequestCriarDepartamento(elemento, usuario)
        modal.close()
        toast("elemento criado com sucesso!", green)
        setTimeout(() => {
            window.location.replace("/src/pages/dashboard/dashboard.html")
        }, 500)
    })
}

async function renderAllUsers() {
    const ul = document.querySelector(".main__principal--usuarios-lista")
    const users = await getUserAll(getUser())
    ul.innerHTML = ""

    users.map(user => {
        if (!user.is_admin) {
            const li = document.createElement("li")
            if (user.professional_level == null) {
                user.professional_level = "Sem informação"
            }
            if (user.kind_of_work == null) {
                user.kind_of_work = "Sem informação"
            }

            li.insertAdjacentHTML("beforeend", `
        <h3> ${user.username} </h3>
        <p> ${user.professional_level} </p>
        <span> ${user.kind_of_work} </span>
        <div>
        <i data-id="${user.uuid}" class="fa-solid fa-pen lapis"></i>
        <i data-id="${user.uuid}" class="fa-solid fa-trash-can lixeira"></i>
        </div>
        `)
            ul.appendChild(li)
        }
    });

    editarUsuario()
    apagarUsuario()

    return ul
}

async function editarUsuario() {
    const botoes = document.querySelectorAll(".lapis")
    const inputs = document.querySelectorAll(".editar__usuario > div > select")
    const modal = document.querySelector(".editar__usuario")
    const usuario = getUser()
    const alteracoes = {}

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            modal.showModal()

            const btnEditar = document.querySelector(".editar__usuario > div > button")
            btnEditar.addEventListener("click", () => {
                inputs.forEach(input => {
                    alteracoes[input.name] = input.value
                })
                editarUser(botao.dataset.id, usuario, alteracoes)
                modal.close()
                toast("Usuário editado com sucesso!", green)
                setTimeout(() => {
                    window.location.replace("/src/pages/dashboard/dashboard.html")
                }, 400)
            })


            const btnClose = document.querySelector(".editar__usuario > i")
            btnClose.addEventListener("click", () => modal.close())

        })
    })
}

async function apagarUsuario() {
    const buttons = document.querySelectorAll(".lixeira")
    const modal = document.querySelector(".apagar__departamento")
    const usuario = getUser()
    const users = await getUserAll(getUser())

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            users.forEach(user => {

                if (user.uuid == button.dataset.id) {

                    modal.innerHTML = ""
                    modal.insertAdjacentHTML("beforeend", `

                    <div>
                        <p>Realmente deseja remover o usuário ${user.username}?</p>
                        <button> Confirmar </button>
                        <i class="fa-solid fa-xmark"></i>
                    </div>

                    `)
                    modal.showModal()

                    const btnConfirmar = document.querySelector(".apagar__departamento > div > button")
                    btnConfirmar.addEventListener("click", () => {
                        DeleteUser(user.uuid, usuario)
                        modal.close()
                        toast("Usário Removido com sucesso!", green)
                        renderAllUsers()
                    })

                    const btnModalClose = document.querySelector(".apagar__departamento > div > i")
                    btnModalClose.addEventListener("click", () => modal.close())

                }
            })
        })
    })
}

renderDepartamentos()
renderAllUsers()
showModalCriar()
filtrarDepartamentos()