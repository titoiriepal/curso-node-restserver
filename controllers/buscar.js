const { response } = require("express");
const {ObjectId} = require('mongoose').Types;

const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response) =>{

    const esMongoId = ObjectId.isValid( termino );
    
    if (esMongoId){

        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });

    }

    const regex = new RegExp( termino, 'i')

    const usuarios = await Usuario.find({ 
        $or: [{nombre : regex}, {correo : regex}],
        $and : [{estado : true}]
    });
    const numUsuarios = await Usuario.count({ 
        $or: [{nombre : regex}, {correo : regex}],
        $and : [{estado : true}]
    });

    return res.json({
        total: numUsuarios,
        results: usuarios
    });
}


const buscarCategorias = async( termino = '', res = response) =>{

    const esMongoId = ObjectId.isValid( termino );
    
    if (esMongoId){

        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });

    }

    const regex = new RegExp( termino, 'i')

    const categorias = await Categoria.find({ nombre : regex, estado:true });
    const numCategorias = await Categoria.count({ nombre : regex, estado:true });

    return res.json({
        total: numCategorias,
        results: categorias
    });
}

const buscarProductos = async( termino = '', res = response) =>{

    const esMongoId = ObjectId.isValid( termino );
    
    if (esMongoId){

        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });

    }

    const regex = new RegExp( termino, 'i')

    const producto = await Producto.find({ nombre : regex, estado:true }).populate('categoria','nombre');
    const numProducto = await Producto.count({ nombre : regex, estado:true });

    return res.json({
        total: numProducto,
        results: producto
    });
}



const buscar = (req, res = response) =>{

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `No exite la coleccion ${coleccion} en la base de Datos. Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);

        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        default:
            res.status(500).json({
                msg : `No se puede realizar esta busqueda`
            })

        break;
    }

}



module.exports = {
    buscar
}