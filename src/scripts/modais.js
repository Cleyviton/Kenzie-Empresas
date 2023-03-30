import { criarDepartamento } from "../pages/dashboard/dashboard.js"


export function showModalCriar() {
    const createDepartamento = document.querySelector("#criar")
    const modalConteiner = document.querySelector(".criar__departamento")

    createDepartamento.addEventListener("click", () => {
        modalConteiner.showModal()
        closeModalCriar()
        criarDepartamento()
    })
}

function closeModalCriar() {
    const btnClose = document.querySelector(".fa-xmark")
    const modalConteiner = document.querySelector(".criar__departamento")

    btnClose.addEventListener("click", () => {
        modalConteiner.close()
    })
}

export function closeModalinfos() {
    const btnClose = document.querySelector(".infos__departamento>div>i")
    const modalConteiner = document.querySelector(".infos__departamento")

    btnClose.addEventListener("click", () => {
        modalConteiner.close()
    })
}