const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, productoDelete } = require('../controllers/productos');




const { existeCategoria, esRolValido, existeProducto } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');


//const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, categoriaDelete } = require('../controllers/categorias');


const router = Router();

//Obtener todas los productos - publico
router.get('/' , obtenerProductos);


//Obtener productos en particular por id - publico
router.get('/:id' ,[
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],obtenerProducto);



//Crear nuevo producto. Solo permitido para ventas y admin Role
router.post('/' ,[
    validarJWT,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id de categoria no es valido ').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);


//Actualizar Productos. Solo para ventas y admin Role
router.put('/:id' , [
    validarJWT,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProducto),
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,actualizarProducto );



//borrar un producto - Admin
router.delete('/:id' ,[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
  ], productoDelete)


module.exports = router;