const { response, request } = require('express');
const { encriptarPassword } = require('../helpers/functions');



const Usuario = require('../models/usuario');



const usuariosGet = async(req, res = response) => {

    // const {nombre, apellidos, edad = '0'} = req.query;
    const {limite = 5, desde = 0} = req.query;

    if(isNaN(limite) || isNaN(desde)){
        res.status(400).json({
            msg:'Error en los parametros introducidos'
        })
        return;
    }
    const query = {estado : true}; 
    

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
        
    })
}

const usuariosPost = async (req, res = response) => {

    

    const  { nombre, correo, password, rol }= req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    //Encriptar la contraseña
    usuario.password = encriptarPassword(password)
   

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    

        //TO DO Validar contra base de datos
        if ( password ){
            resto.password = encriptarPassword(password);
        }

        let usuario = await Usuario.findByIdAndUpdate( id, resto);
        usuario = await Usuario.findByIdAndUpdate( id );
        res.status(200).json({
            usuario
        })
    
  }
const usuariosPatch = (req, res = response) => {
    res.status(200).json({
        msg: 'Patch API - controlador'
    })
  }
const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    

    //Borrado físico
        //const usuario = await Usuario.findByIdAndDelete(id);

    //Cambiar estado activo

    
    let usuario = await Usuario.findByIdAndUpdate( id, {estado : false});
     usuario = await Usuario.findById( id )
    res.status(200).json({
        msg : `Usuario ${id} borrado correctamente`,
        usuario
    })
  }


module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}