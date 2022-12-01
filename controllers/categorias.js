const { response, json } = require("express");

const{ Categoria, Usuario } = require('../models')



//obtenerCategorias -paginado- total - populate(obtener la información del usuario con su id)
const obtenerCategorias =async (req, res = response) =>{

    const {limite = 5, desde = 0} = req.query;

    if(isNaN(limite) || isNaN(desde)){
        res.status(400).json({
            msg:'Error en los parametros introducidos'
        })
        return;
    }
    const query = {estado : true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
        
    })

}


//obtenerCategoria -populate {Regresar el objeto de la categoria}
const obtenerCategoria = async (req, res = response) =>{

    const {id} = req.params;

    const categoria = await Categoria.
        findById(id).
        populate('usuario', 'nombre')


    if (!categoria.estado){
        return res.status(400).json({
            msg:`No existe una categoria con el id ${id} activa`
        })
    }
    

    res.json({
        categoria
    })

}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();


    //Combrobar si no existe una categoría con ese nombre
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `Ya existe una categoria con ese nombre ${categoriaDB.nombre}`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria( data );


    //Guardar DB

    await categoria.save();

    res.status(201).json(categoria);



}

// actualizarCategoria -recibir el nombre-
const actualizarCategoria = async (req, res = response) => {
    
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate (id , data, {new: true});

    res.status(202).json({
        msg: 'Categoria actualizada correctamente',
        categoria
    })



}


// borrarCategoria - Cambiar el estado a false, solo ADMIN_ROLE

const categoriaDelete = async( req, res = response) => {

    const {id} = req.params;


    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false}, {new: true});

    res.status(202).json({
        msg : `Categoría borrada correctamente`,
        categoria
    })
}



module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    categoriaDelete
}