import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'fs'
import csv from 'csv-parser'
import Language from '#models/language';

export default class extends BaseSeeder {

  private async loadLanguagesFromCSV(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream('languoid.csv')
        .pipe(csv())
        .on('data', (data) => {
          results.push({
            name: data['name'],
            family_id: data['family_id'],
            parent_id: data['parent_id'],
            level: data['level'],
          });
        })
        .on('end', () => {
          console.log(`Loaded ${results.length} languages from CSV`);
          resolve(results);  // Resolve with the results when done
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  }

  async run() {
    try {
      const languages = await this.loadLanguagesFromCSV();
      console.log('Languages to insert:', languages.length);
      if (languages.length > 0) {
        await Language.createMany(languages);
        console.log('Successfully inserted languages');
      }
    } catch (error) {
      console.error('Error in language seeder:', error);
    }
  }
}