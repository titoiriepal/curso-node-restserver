


const { Router } = require('express');
const { check } = require('express-validator');


// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {
    validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRole
} = require('../middlewares')


const { esRolValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');


const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch 
      } = require('../controllers/usuarios');





const router = Router();



router.get('/', usuariosGet )


router.put('/:id', [
      check('id', 'No es un ID Válido').isMongoId(),
      check('id').custom(existeUsuarioId),
      check('rol').custom( esRolValido ),
      validarCampos
],usuariosPut )

router.post('/',[
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom( emailExiste),
  check('password', 'El password es obligatorio y debe contener más de 6 caracteres').isLength({ min:6}),
  //check('rol', 'El rol no es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check('rol').custom( esRolValido ),
  validarCampos
] ,usuariosPost)

router.delete('/:id', [
  validarJWT,
  //esAdminRole,
  tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
  check('id', 'No es un ID Válido').isMongoId(),
  check('id').custom(existeUsuarioId),
  validarCampos
], usuariosDelete)


router.patch('/',  usuariosPatch)




module.exports = router;