const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()


//body parser 
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static("public"));





// Configurando o mongoose
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Conectado...")
})
.catch((err) => {
    console.log("Houve um erro ao se conectar ao mongoDB: " + err)
})
// Model - Usuários 

const UsuarioSchema = mongoose.Schema({
    
    nome: {
        type: String,
        required: true,
        match: [/^[A-Za-zÀ-ÿ\s]+$/, "Nome não pode conter números"] 
    },
    sobrenome: {
        type: String,
        required: true,
        match: [/^[A-Za-zÀ-ÿ\s]+$/, "Sobrenome não pode conter números"]
    },
    cpf: {
        type: String,
        required: true,
        unique: true 
    },
   senha: {
    type: String,
    required: true,
    minlength: [8, "A senha deve ter no mínimo 8 caracteres"]
    }
})

// Collection 
const Usuario = mongoose.model('Usuarios', UsuarioSchema)

// Model Multa 
const MultaSchema = mongoose.Schema({

    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
        required: true
    },

    placa: {
        type: String,
        required: true
    },

    renavam: {
        type: String,
        required: true
    },

    motivo: {
        type: String,
        required: true
    },

    data: {
        type: Date,
        default: Date.now
    },

    guincho: {
        type: Number,
        required: true
    },

    diarias: {
        type: Number,
        required: true
    },

    modelo: {
        type: String,
        required: true
    },

    cor: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "pendente"
    }



})

const Multa = mongoose.model("Multas", MultaSchema)

app.post("/criar-multa", async (req, res) => {

    try {

    

        const usuario = await Usuario.findOne({ cpf: req.body.cpf })

        if (!usuario) {
            return res.json({ erro: "Usuário não encontrado" })
        }

        const novaMulta = new Multa({

            usuarioId: usuario._id,
            placa: req.body.placa,
            renavam: req.body.renavam,
            motivo: req.body.motivo,
            guincho: req.body.guincho,
            diarias: req.body.diarias,
            modelo: req.body.modelo,
            cor: req.body.cor

        })

        await novaMulta.save()

        res.json({ sucesso: true })

    } catch (err) {

        res.json({ erro: err.message })

    }

})

// rota registro
app.post("/registro", async (req, res) => {

    try {

        const existe = await Usuario.findOne({ cpf: req.body.cpf })

        if (existe) {
            return res.json({
                sucesso: false,
                mensagem: "CPF já registrado"
            })
        }

        const novoUsuario = new Usuario({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            cpf: req.body.cpf,
            senha: req.body.senha
        })

        await novoUsuario.save()

        res.json({
            sucesso: true,
            mensagem: "Usuário registrado com sucesso"
        })

    } catch (err) {

    if (err.name === "ValidationError") {

        // pega só o erro da senha
        const erros = Object.values(err.errors).map(e => e.message)

        return res.json({
            sucesso: false,
            mensagem: erros.join(" | ")
        })
    }

    return res.json({
        sucesso: false,
        mensagem: "Erro no servidor"
    })  
    }

})



// rota login
app.post("/login", async (req, res) => {

    try {

        

        const usuario = await Usuario.findOne({
        cpf: req.body.cpf,
        senha: req.body.senha
    })

        if (!usuario) {

            return res.json({
                sucesso: false,
                mensagem: "Usuário ou senha incorretos"
            })

        }

        // buscar multas do usuário pelo _id
        const multas = await Multa.find({
            usuarioId: usuario._id
        })

        res.json({

            sucesso: true,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            multas: multas

        })

    } catch (err) {

        res.send("Erro no login: " + err)

    }

})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});


