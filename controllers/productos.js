const { response, json } = require("express");

const{ Producto,Categoria, Usuario } = require('../models')


const obtenerProductos =async (req, res = response) =>{

    let query = {estado:true}
    
    const {limite = 5, desde = 0, categoria = null } = req.query;

    if(isNaN(limite) || isNaN(desde)){
        res.status(400).json({
            msg:'Error en los parametros introducidos'
        })
        return;
    }
    if(categoria){
        const categoriaDB = await Categoria.findById(categoria);

        if (!categoriaDB){
            res.status(400).json({
                msg: `No existe la categoria con el ID: ${categoria}`
            });
            return;
        }else{
             query =  {estado : true, categoria : categoria};
        }
        
    }
    
    
    
    

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria','nombre')
    ])

    res.json({
        total,
        productos
        
    })

}


const obtenerProducto = async (req, res = response) =>{

    const {id} = req.params;

    const producto = await Producto.
        findById(id).
        populate('usuario', 'nombre').
        populate('categoria', 'nombre')


    if (!producto.estado){
        return res.status(400).json({
            msg:`No existe una producto con el id ${id} activa`
        })
    }
    

    res.json({
        producto
    })

}


const crearProducto = async (req, res = response) => {

    let {nombre,categoria,precio,descripcion,disponible} = req.body
    
    nombre = nombre.toUpperCase();
    //Combrobar si no existe un producto con ese nombre en esa categoria
    const productoDB = await Producto.findOne({nombre,categoria});

    if (productoDB) {
        return res.status(400).json({
            msg: `Ya existe una producto con ese nombre ${productoDB.nombre} en esa categoria`
        })
    }
    

    if(precio){
        if(isNaN(precio)){
            return res.status(400).json({
                msg: `El precio introducido no es valido`
            })
        }
    }

    
    //Generar la data a guardar
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id,
        categoria,
        precio,
        descripcion,
        disponible
    }

    const producto = new Producto( data );


    //Guardar DB

    await producto.save();

    res.status(201).json(producto);

}


    //Actualizar Producto
const actualizarProducto = async (req, res = response) => {
    
        const {id} = req.params;
        const {estado, usuario, categoria, ...data} = req.body;

        if(data.nombre){
            data.nombre = data.nombre.toUpperCase();
        }

        if (categoria){
            const categoriaDB = await Categoria.findById(categoria)
            if(!categoriaDB){
                return res.status(400).json({
                    msg: `No existe una categoria con el id ${categoria}`
                    
                })
                
            }
            data.categoria = categoria;
        }
    
        data.usuario = req.usuario._id;
    
        const producto = await Producto.findByIdAndUpdate (id , data, {new: true});
    
        res.status(202).json({
            msg: 'Producto actualizado correctamente',
            producto
        })

}



// Borrar Producto

const productoDelete = async( req, res = response) => {

    const {id} = req.params;


    const producto = await Producto.findByIdAndUpdate( id, {estado: false}, {new: true});

    res.status(202).json({
        msg : `Producto borrado correctamente`,
        producto
    })
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    productoDelete
}