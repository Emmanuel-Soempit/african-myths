import AdminController from '#controllers/admin_controller'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ReaderController = () => import('#controllers/reader_controller')
const EditorController = () => import('#controllers/editor_controller')
router.get('/', [ReaderController, 'renderHome'])

router.get('/cultures/:id', [ReaderController, 'renderCultureDetail'])
router.get('/myths/:id', [ReaderController, 'renderMythDetail'])

router
  .group(() => {
    router.on('/sign-up').renderInertia('auth/sign-up')
    router.on('/sign-in').renderInertia('auth/sign-in')
    router.get('/roles', [AuthController, 'renderRolesSelection']).use([middleware.auth()])
  })
  .prefix('auth')



router
  .group(() => {
    router.get('/dashboard', [AdminController, 'renderDashboard'])
    router
      .group(() => {
        router.get('/', [AdminController, 'renderCultures'])
        router.get('/:id', [AdminController, 'renderCultureOverview'])
        router.get('/:id/edit', [AdminController, 'renderCultureEdit'])
      })
      .prefix('cultures')

    router
      .group(() => {
        router.get('/', [AdminController, 'renderEthnicGroups'])
        router.get('/:id', [AdminController, 'renderEthnicGroupDetail'])
      })
      .prefix('ethnic-groups')

    router
      .group(() => {
        router.get('/', [AdminController, 'renderMyths'])
        router.get('/create', [AdminController, 'renderMythCreate'])
        router.get('/:id/edit', [AdminController, 'renderMythEdit'])
      })
      .prefix('cultures/:cultureId/myths')

    router
      .group(() => {
        router.on('/').renderInertia('admin/stories')
        router.on('/:id/edit').renderInertia('stories/edit')
      })
      .prefix('stories')

    router.get('/users', [AdminController, 'renderUsers'])
    router.on('/users/:id').renderInertia('admin/user_detail')
    router.on('/settings').renderInertia('admin/settings')
  })
  .prefix('admin')
  .use([middleware.auth(), middleware.role(['admin'])])



router
  .group(() => {
    router.get('/dashboard', [EditorController, 'renderDashboard'])
  })
  .prefix('editor')
// .use([middleware.auth(), middleware.role(['editor', 'admin'])])