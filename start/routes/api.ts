// start/routes/api.ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const AdminController = () => import('#controllers/admin_controller')
const UtilsController = () => import('#controllers/utils_controller')

router
  .group(() => {
    // Sign Ups
    router.post('/register', [AuthController, 'emailRegistration'])
    router.get('/google-sign-in', [AuthController, 'googleSignIn'])
    router.get('/google-callback', [AuthController, 'googleCallback'])

    router.post('/login', [AuthController, 'emailSignIn'])
    router.post('/assign-role', [AuthController, 'assignRole']).use(middleware.auth())

    router.get('/sign-out', [AuthController, 'signOut']).use(middleware.auth())

    // Admin routes
    router
      .group(() => {
        router.post('/invite_user', [AdminController, 'inviteUser'])
        router.post('/upload', [UtilsController, 'uploadFile'])

        router.group(() => {
            router.post('/', [AdminController, 'createEthnicGroup'])
            router.put('/:id', [AdminController, 'updateEthnicGroup'])
            router.delete('/:id', [AdminController, 'deleteEthnicGroup'])
        }).prefix('ethnic-groups')

        router.group(() => {
            router.post('/', [AdminController, 'createCulture'])
            router.put('/:id', [AdminController, 'updateCulture'])
            router.delete('/:id', [AdminController, 'deleteCulture'])
        }).prefix('cultures')

        router.group(() => {
            router.post('/', [AdminController, 'createMyth'])
            router.put('/:id', [AdminController, 'updateMyth'])
        }).prefix('myths')

        router.group(() => {
            router.post('/:ethnicGroupId', [AdminController, 'createSubEthnicGroup'])
            router.put('/:id', [AdminController, 'updateSubEthnicGroup'])
            router.delete('/:id', [AdminController, 'deleteSubEthnicGroup'])
        }).prefix('sub-ethnic-groups')
      })
      .prefix('admin')
      .use([middleware.auth(), middleware.role(['admin'])])

    // Utils
    router.group(() => {
      router.get('/', [UtilsController, 'searchLanguages'])
      router.get('/:id', [UtilsController, 'getLanguageById'])
    }).prefix('language')


    router.group(() => {
      router.get('/', [UtilsController, 'searchCountry'])
      router.get('/:id', [UtilsController, 'getCountryById'])
    }).prefix('country')

    router.group(() => {
      router.get('/', [UtilsController, 'searchEthnicGroups'])
    }).prefix('ethnic-group')
  })
  .prefix('api/v1')
