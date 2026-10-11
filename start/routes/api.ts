// start/routes/api.ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const AdminController = () => import('#controllers/admin_controller')
const EditorController = () => import('#controllers/editor_controller')
const AuthorController = () => import('#controllers/author_controller')
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

    // Shared upload for every content role
    router
      .post('/upload', [UtilsController, 'uploadFile'])
      .use([middleware.auth(), middleware.role(['admin', 'editor', 'author'])])

    // Admin routes
    router
      .group(() => {
        router.post('/invite_user', [AdminController, 'inviteUser'])
        // deprecated: use /api/v1/upload
        router.post('/upload', [UtilsController, 'uploadFile'])

        router
          .group(() => {
            router.post('/', [AdminController, 'createEthnicGroup'])
            router.put('/:id', [AdminController, 'updateEthnicGroup'])
            router.delete('/:id', [AdminController, 'deleteEthnicGroup'])
          })
          .prefix('ethnic-groups')

        router
          .group(() => {
            router.post('/', [AdminController, 'createCulture'])
            router.put('/:id', [AdminController, 'updateCulture'])
            router.delete('/:id', [AdminController, 'deleteCulture'])
          })
          .prefix('cultures')

        router
          .group(() => {
            router.post('/', [AdminController, 'createMyth'])
            router.put('/:id', [AdminController, 'updateMyth'])
          })
          .prefix('myths')

        router
          .group(() => {
            router.post('/:ethnicGroupId', [AdminController, 'createSubEthnicGroup'])
            router.put('/:id', [AdminController, 'updateSubEthnicGroup'])
            router.delete('/:id', [AdminController, 'deleteSubEthnicGroup'])
          })
          .prefix('sub-ethnic-groups')

        router
          .group(() => {
            router.put('/:id/review', [AdminController, 'reviewWriting'])
            router.delete('/:id', [AdminController, 'deleteWriting'])
          })
          .prefix('writings')
      })
      .prefix('admin')
      .use([middleware.auth(), middleware.role(['admin'])])

    // Editor routes (no DELETE routes: editors cannot delete)
    router
      .group(() => {
        router
          .group(() => {
            router.post('/', [EditorController, 'createEthnicGroup'])
            router.put('/:id', [EditorController, 'updateEthnicGroup'])
          })
          .prefix('ethnic-groups')

        router
          .group(() => {
            router.post('/', [EditorController, 'createCulture'])
            router.put('/:id', [EditorController, 'updateCulture'])
          })
          .prefix('cultures')

        router
          .group(() => {
            router.post('/', [EditorController, 'createMyth'])
            router.put('/:id', [EditorController, 'updateMyth'])
          })
          .prefix('myths')

        router
          .group(() => {
            router.post('/:ethnicGroupId', [EditorController, 'createSubEthnicGroup'])
            router.put('/:id', [EditorController, 'updateSubEthnicGroup'])
          })
          .prefix('sub-ethnic-groups')
      })
      .prefix('editor')
      .use([middleware.auth(), middleware.role(['editor', 'admin'])])

    // Author routes
    router
      .group(() => {
        router
          .group(() => {
            router.post('/', [AuthorController, 'createWriting'])
            router.put('/:id', [AuthorController, 'updateWriting'])
            router.post('/:id/submit', [AuthorController, 'submitWriting'])
            router.post('/:id/withdraw', [AuthorController, 'withdrawWriting'])
            router.delete('/:id', [AuthorController, 'deleteWriting'])
          })
          .prefix('writings')
      })
      .prefix('author')
      .use([middleware.auth(), middleware.role(['author', 'admin'])])

    // Utils
    router
      .group(() => {
        router.get('/', [UtilsController, 'searchLanguages'])
        router.get('/:id', [UtilsController, 'getLanguageById'])
      })
      .prefix('language')

    router
      .group(() => {
        router.get('/', [UtilsController, 'searchCountry'])
        router.get('/:id', [UtilsController, 'getCountryById'])
      })
      .prefix('country')

    router
      .group(() => {
        router.get('/', [UtilsController, 'searchEthnicGroups'])
      })
      .prefix('ethnic-group')

    router
      .group(() => {
        router.get('/', [UtilsController, 'searchSubEthnicGroups'])
      })
      .prefix('sub-ethnic-group')

    router
      .group(() => {
        router.get('/', [UtilsController, 'searchCultures'])
      })
      .prefix('culture')
  })
  .prefix('api/v1')
