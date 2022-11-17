const { response } = require('express')


const usuariosGet = (req, res = response) => {

    const {nombre, apellidos, edad = '0'} = req.query;
    res.json({
        msg: 'get API - controlador',
        nombre,
        apellidos,
        edad
    })
}

const usuariosPost = (req, res = response) => {

    const  {nombre, edad}= req.body;

    res.json({
        msg: 'Post API - controlador',
        nombre, 
        edad
    })
}

const usuariosPut = (req, res = response) => {

    const id = req.params.id;
    if (!id){
        res.status(404).json({
            msg:"Faltan parámetros para la operación"
        })
    }else{
        res.status(200).json({
            msg: 'Put API - controlador',
            id
        })
    }
  }
const usuariosPatch = (req, res = response) => {
    res.status(200).json({
        msg: 'Patch API - controlador'
    })
  }
const usuariosDelete = (req, res = response) => {
    res.status(200).json({
        msg: 'Delete API - controlador'
    })
  }


module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}