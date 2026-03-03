let multasSalvas = []
let multaSelecionada = null

function goTo(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active')
    })
    document.getElementById(id).classList.add('active')
}

const API_URL = "https://tcc-senai-iub1.onrender.com"

/* ================= LOGIN ================= */

async function fazerLogin() {

    let cpf = document.getElementById("cpf").value
    const senha = document.getElementById("senha").value

    cpf = cpf.replace(/\D/g, "")

    if (cpf.length !== 11) {
        alert("CPF inválido.")
        return
    }

    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, senha })
        })

        const dados = await resposta.json()

        if (dados.sucesso) {
            mostrarMultas(dados.multas)
            goTo("dashboard")
        } else {
            alert(dados.mensagem)
        }

    } catch (erro) {
        alert("Erro ao conectar com o servidor")
    }
}

/* ================= MOSTRAR MULTAS ================= */

function mostrarMultas(multas) {

    const lista = document.getElementById("listaMultas")
    lista.innerHTML = ""

    multasSalvas = multas

    multas.forEach((multa, index) => {

        const container = document.createElement("div")

        container.innerHTML = `
            <div class="card">
                <h3>${multa.placa}</h3>
                <p><strong>Renavam:</strong> ${multa.renavam}</p>
                <p><strong>Motivo:</strong> ${multa.motivo}</p>
                <p><strong>Data:</strong> ${new Date(multa.data).toLocaleDateString("pt-BR")}</p>

                <button class="btn-detalhes" onclick="abrirDetalhes(${index})">
                    Ver detalhes >
                </button>
            </div>

            <div class="card">
                <h3>Custos:</h3>
                <p>Guincho: <strong>R$ ${multa.guincho.toFixed(2)}</strong></p>
                <p>Diárias: <strong>R$ ${multa.diarias.toFixed(2)}</strong></p>
                <p>Total: <strong>R$ ${(multa.guincho + multa.diarias).toFixed(2)}</strong></p>

                <button class="btn-regularizar"
                    onclick="abrirRegularizacao(${index})">
                    Regularizar
                </button>
            </div>
        `

        lista.appendChild(container)
    })
}

/* ================= DETALHES ================= */

function abrirDetalhes(index) {

    const multa = multasSalvas[index]

    document.getElementById("detalhePlaca").innerText = multa.placa
    document.getElementById("detalheRenavam").innerText = multa.renavam
    document.getElementById("detalheModelo").innerText = multa.modelo || "Não informado"
    document.getElementById("detalheCor").innerText = multa.cor || "Não informada"
    document.getElementById("detalheStatus").innerText = multa.motivo
    document.getElementById("detalheMotivo").innerText = multa.motivo

    goTo("detalhes")
}

/* ================= REGULARIZAÇÃO ================= */

function abrirRegularizacao(index) {

    multaSelecionada = multasSalvas[index]

    const total = multaSelecionada.guincho + multaSelecionada.diarias

    document.querySelector("#regularizacao .linha-info strong:nth-child(2)").innerText =
        `R$ ${multaSelecionada.guincho.toFixed(2)}`

    document.querySelectorAll("#regularizacao .linha-info strong")[1].innerText =
        `R$ ${multaSelecionada.diarias.toFixed(2)}`

    document.querySelectorAll("#regularizacao .linha-info strong")[2].innerText =
        `R$ ${total.toFixed(2)}`

    goTo("regularizacao")
}

/* ================= PAGAMENTO ================= */

function selecionarPagamento() {

    const tipo = document.querySelector('input[name="pagamento"]:checked').value

    document.getElementById("areaCartao").style.display =
        tipo === "cartao" ? "block" : "none"

    document.getElementById("areaPix").style.display =
        tipo === "pix" ? "block" : "none"
}

function confirmarPagamento() {
    alert("Pagamento realizado com sucesso!")
    goTo("sucesso")
}

/* ================= CPF ================= */

function formatarCPF(input) {

    let valor = input.value.replace(/\D/g, "")

    if (valor.length > 11) {
        valor = valor.slice(0, 11)
    }

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    input.value = valor
}