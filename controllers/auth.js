const { response } = require("express");
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if ( !usuario ){
            return res.status(400).json({
                msg:`No existe un usuario con el correo ${correo}`
            });
        }


        //Verificar si el usuario está activo en la base de datos
        if( !usuario.estado){
            return res.status(400).json({
                msg:`El usuario con correo ${correo} no está activo`
            });
        }



        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg:`Contraseña erronea`
            });
        }


        //Generar el JWT

        const token = await generarJWT( usuario.id )


        res.json({
            usuario,
            token
        });
    

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}


    


module.exports = {
    login
}