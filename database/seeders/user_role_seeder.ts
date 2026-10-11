import UserRole from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await UserRole.createMany([
      { name: 'admin', description: 'Admin role', icon: 'auto_stories' },
      { name: 'editor', description: 'Editor role', icon: 'verified' },
      { name: 'author', description: 'Author role', icon: 'person' },
      { name: 'reader', description: 'Reader role', icon: 'edit' },
    ])
  }
}
