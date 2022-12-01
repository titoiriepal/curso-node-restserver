
const { Categoria,Role, Usuario,Producto } = require('../models');


//ROLE


const esRolValido = async(rol = '') =>{

    const existeRol = await Role.findOne( {rol});
    if ( !existeRol ){
      throw new Error(`El rol ${ rol } no está registrado en la base de Datos`)
    }

  }

//USUARIOS

const emailExiste = async(correo = '') =>{

    const existeEmail = await Usuario.findOne({correo})
        if ( existeEmail ){
            throw new Error(`El email ${ correo } ya está registrado en la base de Datos`)
        }
    
}

const existeUsuarioId = async(id = '') =>{

    const existeUsuario = await Usuario.findById(id)
        if ( !existeUsuario ){
            throw new Error(`El Usuario con el id ${id} no existe`)
        }
    
}

//CATEGORIAS//

const existeCategoria = async(id = '') =>{
    
    const existeCat = await Categoria.findById(id)
        if ( !existeCat ){
            throw new Error(`La categoria con el id ${id} no existe`)
        }
    
}


//PRODUCTOS//

const existeProducto = async(id = '') =>{

  
    
  const existePro = await Producto.findById(id)
      if ( !existePro ){
          throw new Error(`La categoria con el id ${id} no existe`)
      }
  
}



  module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId,
    existeCategoria,
    existeProducto,
  }