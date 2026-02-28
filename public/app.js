let multasSalvas = []

function goTo(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
}

const API_URL = "https://tcc-senai-iub1.onrender.com"


async function fazerLogin() {

    let cpf = document.getElementById("cpf").value
    const senha = document.getElementById("senha").value

    try {

        cpf = cpf.replace(/\D/g, "")

        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        
        const resposta = await fetch(`${API_URL}/login`, {
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

            mostrarMultas(dados.multas)

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
    let cpf = document.getElementById("cpfRegistro").value
    const senha = document.getElementById("senhaRegistro").value

    cpf = cpf.replace(/\D/g, "")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    if (senha.length < 8) {
    alert("A senha deve ter no mínimo 8 caracteres")
    return
}

    try {

        const resposta = await fetch(`${API_URL}/registro`, {
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

        const dados = await resposta.json()

        alert(dados.mensagem)

        if (dados.sucesso) {
        goTo("login")
    }

    } catch (erro) {
        alert("Erro ao registrar")
        console.error(erro)
    }
}

function mostrarMultas(multas) {

    const lista = document.getElementById("listaMultas")
    lista.innerHTML = ""

    if (!multas || multas.length === 0) {
    lista.innerHTML = `
        <div class="sem-multa">
            Nenhuma multa encontrada
        </div>
    `
    return
}

    multasSalvas = multas

    multas.forEach((multa, index) => {

        const container = document.createElement("div")

container.innerHTML = `
    <!-- CARD VEÍCULO -->
    <div class="card">
        <h3>${multa.placa}</h3>

        <p><strong>Renavam:</strong> ${multa.renavam}</p>
        <p><strong>Motivo:</strong> ${multa.motivo}</p>
        <p><strong>Data:</strong> ${new Date(multa.data).toLocaleDateString("pt-BR")}</p>

        <button class="btn-detalhes" onclick="abrirDetalhes(${index})">
            Ver detalhes >
        </button>
    </div>

    <!-- CARD CUSTOS -->
    <div class="card">
    <h3>Custos:</h3>

    <p>Guincho: <strong>R$ ${multa.guincho.toFixed(2)}</strong></p>
    <p>Diárias: <strong>R$ ${multa.diarias.toFixed(2)}</strong></p>
    <p>Total: <strong>R$ ${(multa.guincho + multa.diarias).toFixed(2)}</strong></p>

    <button class="btn-regularizar">
        Regularizar
    </button>
</div>
`

lista.appendChild(container)
    })
}

function abrirDetalhes(index) {

    const multa = multasSalvas[index]

    document.getElementById("detalhePlaca").innerText = multa.placa
    document.getElementById("detalheRenavam").innerText = multa.renavam
    document.getElementById("detalheModelo").innerText = multa.modelo || "Não informado"
    document.getElementById("detalheCor").innerText = multa.cor || "Não informada"
    document.getElementById("detalheStatus").innerText = multa.motivo
    document.getElementById("detalheMotivo").innerText = multa.motivo

    const dataFormatada =
        new Date(multa.data).toLocaleDateString("pt-BR") +
        " às " +
        new Date(multa.data).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })

    document.getElementById("detalheData").innerText = "Data: " + dataFormatada

    goTo("detalhes")
}

function formatarCPF(input) {

    let valor = input.value.replace(/\D/g, "") // remove tudo que não for número

    if (valor.length > 11) {
        valor = valor.slice(0, 11)
    }

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    input.value = valor
}