import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AdminController = () => import('#controllers/admin_controller')
const AuthController = () => import('#controllers/auth_controller')
const ReaderController = () => import('#controllers/reader_controller')
const EditorController = () => import('#controllers/editor_controller')
const AuthorController = () => import('#controllers/author_controller')
router.get('/', [ReaderController, 'renderHome'])

router.get('/cultures/:id', [ReaderController, 'renderCultureDetail'])
router.get('/myths/:id', [ReaderController, 'renderMythDetail'])
router.get('/writings/:id', [ReaderController, 'renderWritingDetail'])

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
        router.get('/', [AdminController, 'renderWritings'])
        router.get('/:id', [AdminController, 'renderWritingReview'])
      })
      .prefix('writings')

    router.get('/stories', ({ response }) => response.redirect('/admin/writings'))

    router.get('/users', [AdminController, 'renderUsers'])
    router.on('/users/:id').renderInertia('admin/user_detail')
    router.on('/settings').renderInertia('admin/settings')
  })
  .prefix('admin')
  .use([middleware.auth(), middleware.role(['admin'])])

router
  .group(() => {
    router.get('/dashboard', [EditorController, 'renderDashboard'])

    router
      .group(() => {
        router.get('/', [EditorController, 'renderCultures'])
        router.get('/:id', [EditorController, 'renderCultureOverview'])
        router.get('/:id/edit', [EditorController, 'renderCultureEdit'])
      })
      .prefix('cultures')

    router
      .group(() => {
        router.get('/', [EditorController, 'renderEthnicGroups'])
        router.get('/:id', [EditorController, 'renderEthnicGroupDetail'])
      })
      .prefix('ethnic-groups')

    router
      .group(() => {
        router.get('/', [EditorController, 'renderMyths'])
        router.get('/create', [EditorController, 'renderMythCreate'])
        router.get('/:id/edit', [EditorController, 'renderMythEdit'])
      })
      .prefix('cultures/:cultureId/myths')
  })
  .prefix('editor')
  .use([middleware.auth(), middleware.role(['editor', 'admin'])])

router
  .group(() => {
    router.get('/dashboard', [AuthorController, 'renderDashboard'])
    router.get('/writings', [AuthorController, 'renderWritings'])
    router.get('/writings/create', [AuthorController, 'renderWritingCreate'])
    router.get('/writings/:id/edit', [AuthorController, 'renderWritingEdit'])
  })
  .prefix('author')
  .use([middleware.auth(), middleware.role(['author', 'admin'])])
