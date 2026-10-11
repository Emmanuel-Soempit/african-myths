import { Culture, Myth } from "../../home/types";

export interface MythDetail extends Myth{
    culture: Culture,
    tags: string[],
    content:string,
    myths: Myth[],
    time: string,
    source: string
}