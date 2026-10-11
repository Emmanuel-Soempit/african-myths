import Country from '#models/country'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'fs'
import csv from 'csv-parser'

export default class extends BaseSeeder {

  private async loadCountriesFromCSV(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream('country-codes.csv')
        .pipe(csv())
        .on('data', (data) => {
          if (data['Continent'] === 'AF') {  // Only include African countries
            results.push({
              name: data['official_name_en'],
              formal_name: data['UNTERM English Formal'],
              flag: `https://flagsapi.com/${data['ISO3166-1-Alpha-2']}/flat/64.png`,
              iso_alpha_2: data['ISO3166-1-Alpha-2'],
              iso_alpha_3: data['ISO3166-1-Alpha-3'],
              wiki_data_id: data['wikidata_id'],
              capital: data['Capital'],
              currency_name: data['ISO4217-currency_name'],
              languages: data['Languages'],
              dial: data['Dial'],
              sub_region_name: data['Sub-region Name'],
              currency_code: data['ISO4217-currency_numeric_code'],
            });
          }
        })
        .on('end', () => {
          console.log(`Loaded ${results.length} countries from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error('Error reading countries CSV:', error);
          reject(error);
        });
    });
  }

  async run() {
    try {
      const countries = await this.loadCountriesFromCSV();
      console.log('Countries to insert:', countries.length);
      if (countries.length > 0) {
        await Country.createMany(countries);
        console.log('Successfully inserted countries');
      }
    } catch (error) {
      console.error('Error in country seeder:', error);
    }
  }

}

// results.push({
//         name: data['official_name_en'],
//         formal_name: data['UNTERM English Formal'],
//         flag: https://flagsapi.com/${data['ISO3166-1-Alpha-2']}/flat/64.png,
//         iso_alpha_2: data['ISO3166-1-Alpha-2'],
//         iso_alpha_3: data['ISO3166-1-Alpha-3'],
//         wiki_data_id: data['wikidata_id'],


//         capital: data['Capital'],


//         currency_name: data['ISO4217-currency_name'],
//         languages: data['Languages'],
//         dial: data['Dial'],
//         sub_region_name: data['Sub-region Name'],
//         currency_code: data['ISO4217-currency_numeric_code'],
//       })