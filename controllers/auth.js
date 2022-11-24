const { response, json } = require("express");
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        
        const usuario = await Usuario.findOne({correo});

        //Verificar si el email existe
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

const googleSingIn = async (req, res = response) =>{

    const { id_token } = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo})
        
        if (!usuario){
            //Crear usuario
            const data = {
                nombre,
                correo,
                password: 'abc',
                img,
                google: true
            }

            usuario = new Usuario (data);
            console.log(usuario);
            await usuario.save();
        }

        // Si el usuario exsite en DB y tiene el estado en false

        if (!usuario.estado){
            return res.status(401).json({
                msg: 'El usuario está bloqueado'
            }
                
            )
        }

        // Generar el JWT
        
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'No se pudo verificar la identidad del usuario'
        })
    }

}


    


module.exports = {
    login,
    googleSingIn
}