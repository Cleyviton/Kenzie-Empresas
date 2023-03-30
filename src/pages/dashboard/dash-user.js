import { editarUserLogado, funcionariosMSMdepart, getAllRequest, getUser, green, UsuarioLogado } from "../../scripts/index.js"
import { toast } from "../../scripts/toast.js"

function renderDash() {
    const user = getUser()

    if (!user) {
        window.location.replace("/src/pages/login/login.html")
        console.log("nao tem")
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

async function logarUsuario() {
    const usuario = await UsuarioLogado(getUser())
    const container = document.querySelector(".main__container--infos")
    container.innerHTML = ""
    if (usuario.kind_of_work == null) {
        container.insertAdjacentHTML("beforeend", `
        <h2>${usuario.username}</h2>
        <div>
            <span>Email: ${usuario.email}</span>
            <span>${usuario.professional_level}</span>
        </div>
        <i class="fa-solid fa-pen"></i>
    `)
    } else {
        container.insertAdjacentHTML("beforeend", `
        <h2>${usuario.username}</h2>
        <div>
            <span>Email: ${usuario.email}</span>
            <span>${usuario.professional_level}</span>
            <span>${usuario.kind_of_work}</span>
        </div>
        <i class="fa-solid fa-pen"></i>
    `)
    }

    editarInfosUser()
}

logarUsuario()


async function editarInfosUser() {
    const btn = document.querySelector(".main__container--infos > i")
    const modal = document.querySelector(".editar__usuario")
    const usuario = getUser()
    const infos = {}

    btn.addEventListener("click", () => {
        modal.showModal()
    })

    const botaoConfirm = document.querySelector(".editar__usuario > div > button")
    const inputs = document.querySelectorAll(".editar__usuario > div > input")
    botaoConfirm.addEventListener("click", async () => {
        inputs.forEach(input => {
            infos[input.name] = input.value
        })
        await editarUserLogado(usuario, infos)
        modal.close()
        toast("Usuario atualizado com sucesso!", green)
        setTimeout(() => { window.location.replace("/src/pages/dashboard/user.html") }, 400)
    })

    const btnClose = document.querySelector(".editar__usuario > i")
    btnClose.addEventListener("click", () => modal.close())
}

async function listarTodosDoDepartamento() {
    const ul = document.querySelector(".main__container--lista")
    const infos = document.querySelector(".main__container--ul > div")
    const funcionarios = await funcionariosMSMdepart(getUser())
    const empresas = await getAllRequest()

    if (funcionarios.length > 0) {
        const filtrada = empresas.filter(empresa => empresa.uuid == funcionarios[0].company_uuid)

        infos.removeAttribute('id')
        infos.innerHTML = ""
        infos.insertAdjacentHTML("beforeend", `<h2>${filtrada[0].name} - ${funcionarios[0].name}</h2>`)

        const { users } = funcionarios[0]

        ul.innerHTML = ""
        users.forEach(user => {
            ul.insertAdjacentHTML("beforeend", `
            <li>
                <p>${user.username}</p>
                <span>${user.professional_level}</span>
            </li>
            `)
        })
    } else {
        ul.innerHTML = ""
        infos.id = "hidden"
        ul.insertAdjacentHTML("beforeend", `<p>Você ainda não foi contratado</p>`)
    }
}

listarTodosDoDepartamento()