const { response } = require("express");




const esAdminRole = (req, res = response, next) => {

    if ( !req.usuario){

        return res.status(500).json({
            msg : 'Necesita verificar el token antes que el rol'
        });
    }

    const {rol, nombre} = req.usuario;

    if( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg : `El usuario ${nombre} no está autorizado para esta acción`
        });
    }


    next();

}


const tieneRole = ( ...roles ) =>{

    

    return (req, res = response, next) =>{

        console.log(req.usuario.rol);

        if ( !req.usuario){

            return res.status(500).json({
                msg : 'Necesita verificar el token antes que el rol'
            });
        }

        if ( !roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg : `El usuario ${req.usuario.nombre} no está autorizado para esta acción`
            });
        }

        next();
    }
    
}


module.exports={
    esAdminRole,
    tieneRole
}