function goTo(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
}


async function fazerLogin() {

    const cpf = document.getElementById("cpf").value
    const senha = document.getElementById("senha").value

    try {

        const resposta = await fetch("http://localhost:8081/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpf: cpf,
                senha: senha
            })
        })

        const dados = await resposta.json()

        if (dados.sucesso) {

            alert("Login realizado com sucesso!")

            console.log("Multas:", dados.multas)

            // Aqui você pode atualizar a tela com os dados reais
            goTo("dashboard")

        } else {

            alert(dados.mensagem)

        }

    } catch (erro) {

        alert("Erro ao conectar com o servidor")
        console.error(erro)

    }
}

async function fazerRegistro() {

    const nome = document.getElementById("nome").value
    const sobrenome = document.getElementById("sobrenome").value
    const cpf = document.getElementById("cpfRegistro").value
    const senha = document.getElementById("senhaRegistro").value

    try {

        const resposta = await fetch("http://localhost:8081/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                sobrenome: sobrenome,
                cpf: cpf,
                senha: senha
            })
        })

        const texto = await resposta.text()

        alert(texto)

        if (texto.includes("sucesso")) {
            goTo("login")
        }

    } catch (erro) {
        alert("Erro ao registrar")
        console.error(erro)
    }
}