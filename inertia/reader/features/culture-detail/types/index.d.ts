import { Myth } from "../../home/types"

export interface SectionItem {
    id: string,
    title: string,
    content: string,
    slug: string
}

export interface Resource {
    id: string,
    image: string,
    title: string,
    author: string,
    size: string
    format: string
}


export interface CultrueDetail {
    id: string,
    title: string,
    summary: string,
    thumbnail: string
    sections: SectionItem[]
    language: string,
    region: string,
    population: string,
    myths: Myth[]
    resources: Resource[]
}