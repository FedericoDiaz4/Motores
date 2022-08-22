import express from 'express';
import { engine } from 'express-handlebars'
import Contenedor from './contenedor.js';

const app = express();
const router = express.Router();
const archivo = new Contenedor('./productos.txt');

app.use(express.static('public'));
app.use('/api/productos', router);
app.engine('handlebars', engine({extname: ".handlebars", defaultLayout: 'main.handlebars',}));
app.set('view engine', 'handlebars');
app.set('views', './views');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req,res) => {
    try {
        const productos = await archivo.getAll();
        return res.status(200).render('productos',{conProductos: productos.length > 0, productos: productos});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"No se encuentran productos"});
    }
});

router.post('/', async (req, res) => {
    const {title, price, thumbnail} = req.body;
    try {
        const prod = await archivo.save({title:title, price:price, thumbnail: thumbnail})
        return res.status(200).redirect("/");
    } catch (error) {
        return res.status(500).json({error:"No se pudo agregar el productos"});
    }
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor levantado en puerto ${PORT}`)
})

server.on('error', error => {
    console.log(error);
})