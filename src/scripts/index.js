
import { toast } from "./toast.js"
export const red = '#C20803'
export const green = '#08C203'

export function getUser() {
    const user = JSON.parse(localStorage.getItem("@KenzieEmpresas:UsuarioLogado"))

    return user
}

export async function getAllRequest() {
    const requisicao = await fetch("http://localhost:6278/companies", {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(res => res.json())

    return requisicao
}

export async function criarUser(corpo) {
    const newUser = await fetch("http://localhost:6278/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(corpo)
    })
    const newUserJson = await newUser.json()

    if (!newUser.ok) {
        toast("Ops... algo deu errado, Preencha todos os campos ou tente se cadastrar com um Email diferente!", red)
    } else {
        toast('Usuário Cadastrado com sucesso!!', green)
        setTimeout(() => window.location.replace('/src/pages/login/login.html'), 1000)
    }

    return newUserJson
}

export async function login(corpo) {
    const loginCorpo = await fetch('http://localhost:6278/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(corpo)
    })
    const loginCorpoJson = await loginCorpo.json()

    if (!loginCorpo.ok) {
        toast('Email ou senha incorreto!', red)
    } else {
        toast('Usuário logado com sucesso!', green)
        setTimeout(() => window.location.replace("/src/pages/dashboard/dashboard.html"), 1000)
        localStorage.setItem("@KenzieEmpresas:UsuarioLogado", JSON.stringify(loginCorpoJson))
    }

    return loginCorpoJson

}

export function renderUser() {
    const user = getUser()

    if (user) {
        window.location.replace("/src/pages/dashboard/dashboard.html")
    }
}

export async function getAllDepartaments(user) {
    const users = await fetch(`http://localhost:6278/departments`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

        .then(res => res.json())

    return users
}

export async function getUserAll(user) {
    const users = await fetch("http://localhost:6278/users", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

        .then(res => res.json())

    return users
}

export async function deleteUserRequest(uuid, user) {
    const usuario = await fetch(`http://localhost:6278/admin/delete_user/${uuid}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

        .then(res => res.json())

    return usuario
}

export async function RequestEditarDepartamento(uuid, data, user) {
    const requisicao = await fetch(`http://localhost:6278/departments/${uuid}`, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    })

        .then(res => res.json())

    return requisicao
}

export async function deleteDepartRequest(uuid, user) {
    const departamento = await fetch(`http://localhost:6278/departments/${uuid}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })

    return departamento
}

export async function RequestCriarDepartamento(data, token) {
    const novoDepartamento = await fetch(`http://localhost:6278/departments`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.token}`
        },
        body: JSON.stringify(data)
    })

        .then(res => res.json())

    return novoDepartamento
}

export async function RequestUserSemDepartamento(user) {
    const requisicao = await fetch(`http://localhost:6278/admin/out_of_work`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        }
    })

        .then(res => res.json())

    return requisicao
}

export async function editarUser(uuid, user, data) {
    const requisicao = await fetch(`http://localhost:6278/admin/update_user/${uuid}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    })
    console.log(requisicao)
        .then(res => res.json())
    return requisicao
}

export async function DeleteUser(uuid, user) {
    const requisicao = await fetch(`http://localhost:6278/admin/delete_user/${uuid}`, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${user.token}`
        }
    })
}

export async function UsuarioLogado(login) {
    const requisicao = await fetch("http://localhost:6278/users/profile", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${login.token}`
        }
    })

        .then(res => res.json())

    return requisicao
}

export async function editarUserLogado(user, data) {
    const requisicao = await fetch(`http://localhost:6278/users`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    })

        .then(res => res.json())
    return requisicao
}

export async function funcionariosMSMdepart(user) {
    const requisicao = await fetch("http://localhost:6278/users/departments/coworkers", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        },
    })

        .then(res => res.json())

    return requisicao
}

export async function contratarFuncionario(user, data) {
    const requisicao = await fetch("http://localhost:6278/departments/hire/", {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    })

        .then(res => res.json())

    return requisicao
}

export async function demitirFuncionario(uuid, user) {
    const requisicao = await fetch(`http://localhost:6278/departments/dismiss/${uuid}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
        },
    })

        .then(res => res.json())

    return requisicao
}