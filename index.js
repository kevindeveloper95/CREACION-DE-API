const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const { response } = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session'); 


app.use(express.json())
app.use(cors({
origin: ["http://localhost:3000"],
methods: ["GET", "POST"],
credentials: true

}))

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
key: "usuarioId",
secret: "suscribe",
resave: false,
saveUninitialized: false,
cookie: {
    expires: 60 * 60 * 24,
}

}))
 

/* CONEXION A BASE DE DATOS MYSQL */

const db = mysql.createConnection({

    user: 'root',
    host: 'localhost',
    password: 'socrates95',
    database: 'formulario'
   
});


app.post('/register', (req,res) =>{
const nombre = req.body.nombre
const password = req.body.password

bcrypt.hash(password,10, (err,hash) =>{

    if (err) {
        console.log(err)
    }
    
/* CONSULTA A LA BASE DE DATOS (GUARDAR REGISTROS) */
db.query("INSERT INTO formulario (nombre, password) VALUES (?,?)",[nombre, hash], (err, result) => {
   
    console.log(err);
     
})
})
})

app.get('/login',(req,res) =>{
  if (req.session.user) {
      res.send({loggedIn: true, user: req.session.user})
  } else{
      res.send({loggedIn: false})
  } 
}); 

app.post('/login',(req, res) =>{
    const nombre = req.body.nombre
    const password = req.body.password
    
    /* CONSULTA A LA BASE DE DATOS (LOGEARSE EN EL FORMULARIO) */
    db.query("SELECT * FROM formulario WHERE nombre = ? ",nombre, (err, result) => {
        if (err) {
           res.send({err: err})
        }

        if (result.length > 0) {
            bcrypt.compare(password,result[0].password,(error,response) =>{
                if (response) {
                    req.session.user = result
                    res.send(result)
                }else{
                    res.send({message: 'Wrong username/password combination'});
                }
            })
        }else{
            res.send({message: 'user dont exist'})
        }
    
    }
    )
    }) 

 /* CREACION DE SERVIDOR */
app.listen(3001, () => {
    console.log('todo salio bien')
    
 })

 






