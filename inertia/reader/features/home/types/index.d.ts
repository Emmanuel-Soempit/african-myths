// inertia/personas/user/features/home/types/index.d.ts

export type AfricanRegion =
    | 'West Africa'
    | 'East Africa'
    | 'North Africa'
    | 'Central Africa'
    | 'Southern Africa';


export interface SubEthnicGroup {
    id: string;
    /** Name of the sub‑ethnic group / culture, e.g. "Oyo", "Ijebu" */
    name: string;

    image: string;

    /** Optional dialect block, e.g. "Central Yoruba", "Northeast Yoruba" */
    dialect_block?: string;

    /** Optional list of states / countries where this sub‑group is concentrated */
    region_states?: string[];

    /** Optional main town(s) or traditional capital(s) */
    kingdom_or_center?: string | string[];
}

export interface Culture {
    id: string,
    /** Ethnic group name, e.g. "Yoruba" */
    name: string;

    image: string;

    country: string[];

    region: AfricanRegion;

    /** Sub‑ethnic groups / cultures under this culture */
    subgroups: SubEthnicGroup[];
}

export interface Myth {
    id: string,
    title: string,
    image: string,
    culture?: Culture
    description?: string
}

export interface Collection {
    id: string,
    name: string,
    image: string,
    description: string,
    myths: Myth[]
}