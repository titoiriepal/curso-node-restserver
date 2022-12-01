const { Router } = require('express');
const { check } = require('express-validator');




const { existeCategoria, esRolValido } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');


const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, categoriaDelete } = require('../controllers/categorias');


const router = Router();



/**
 * {{url}}/api/categorias
 */


//Obtener todas las categorias - publico
router.get('/' , obtenerCategorias);

//Obtener una categoría en particular por id - publico
router.get('/:id' ,[
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],obtenerCategoria);

//crear categoria - privado - cualquier persona con token valido
router.post('/' ,[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria
);

//actualizar categoría - privado - cualquier persona con token valido

    router.put('/:id' , [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'No es un ID Válido').isMongoId(),
        check('id').custom(existeCategoria),
        
        validarCampos
    ] ,actualizarCategoria );

router.put('/:id' , [
    validarJWT,
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoria),
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,actualizarCategoria );

//borrar una categoría - Admin
router.delete('/:id' ,[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
  ], categoriaDelete)


module.exports = router;