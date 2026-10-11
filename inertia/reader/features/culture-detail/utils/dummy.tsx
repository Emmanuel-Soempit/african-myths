// utils/dummy.tsx
import { CultrueDetail, SectionItem } from "../types";

export const sections_dummy: SectionItem[] = [
    {
        id: "history",
        title: "History & Origins",
        slug: "history",
        content: `
            <p>The Yoruba people are one of the largest ethnic groups in Africa. Their history is long and rich, with its origins often traced back to the city of Ile-Ife in present-day Nigeria, which is considered the cradle of Yoruba civilization. According to Yoruba mythology, Ile-Ife was founded by the deity Oduduwa, from whom all Yoruba people are said to descend.</p>
            <p>By the 11th century, the Yoruba had established a powerful and complex society organized into city-states. The most notable of these was the Oyo Empire, which rose to prominence in the 17th century and became one of the largest West African states. The Oyo Empire was known for its sophisticated political structure, powerful cavalry, and extensive trade networks that reached across the Sahara.</p>
            <p>Yoruba art, particularly its naturalistic bronze and terracotta sculptures from Ife and Benin, is celebrated worldwide for its technical skill and aesthetic beauty. These artistic traditions, along with their complex religious and philosophical systems, have profoundly influenced African and diaspora cultures, particularly in the Americas through the transatlantic slave trade.</p>
        `
    },
    {
        id: "language",
        title: "Language",
        slug: "language",
        content: `
            <p>The Yorùbá language is a Niger-Congo language spoken in West Africa, primarily in Southwestern and Central Nigeria. It is spoken by the ethnic Yoruba people. The number of speakers of Yoruba is estimated at over 40 million. It is a tonal language with three tones: high, mid, and low. The standard variety of the language, often called "Yoruba Koiné," is based on the dialect of the Oyo Empire.</p>
            <p>Yoruba has a rich oral tradition and is written in a Latin alphabet modified by the use of the digraph 'gb' and certain diacritics, including the vertical line set (|) to indicate the middle tone, and acute (´) and grave accents to mark the language's high and low tones respectively.</p> `
    }
]

export const culture_dummy: CultrueDetail = {
    id: "yoruba",
    title: "Yoruba Culture",
    summary: "An ancient and vibrant culture from West Africa, rich in history, art, and spiritual traditions that have influenced the world.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXwx2Kl-4GMeiftYQqH3NxK3KzOQQsygkc1w02vIzeBlZRLahexJ9455FAhBCZDeXyIDCf3GR83USdCWI9if35jIwREoAwV4K9cBZQB_6nVasB9_fAmezZd90kzd1zUCm8AE1IyC57501IUVySw251o9QnnsZm5grArgr-kJIiFivj6GOdqsUGxuZqt17LDP0cZroVTpJJQxTI7DcmcH_2ycgUrqxTdF_lqGPHzmxcQDDAr7Qxy9UD_Wsyv5ygVfF-fE0XYI3MH-g",
    sections: sections_dummy,
    language: "Yorùbá",
    region: "West Africa",
    population: "40 Million+",
    myths: [
        {
            id: "m1",
            title: "The Creation of the World",
            description: "How Obatala descended from the heavens on a golden chain to create the land upon the waters.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSAn2JwXxWWqAIBUOpmsb3DEJJmrFz-JKKrGpttlZWzVLEUrzvPosM3k_N8nMkfjLzM_czKqshRY9C1GEz0YW9njcS5BJj7M7YHwRBEWRxamYhq-18Jw5t6IwQgNF_dzBMaoS8px4NCya_r-9tmcMB6TYnlqvK-SMZOrRBXXNHWLTiqyw71vDwJWyAT6CYYLO9sJ_LiejEf3fSLOvct_HLNluX7xYaYE6PpmBYxXK5_gbAHtSFO6do2ocjUemKX0DCaDIfl005GIQ"
        },
        {
            id: "m2",
            title: "Sango, the God of Thunder",
            description: "The tale of the powerful fourth king of the Oyo Empire who became the Orisha of lightning and fire.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7OZqmeVMWHyLrSdd9AEo_HszSKTDrsKjS84Pl_h3euIMmSHhbrB1OMm0AHLVJdxOIXuJYQA6pPz1AW2u7vrM2t5OiIEt3iA32XSivT_-zLVm2AUDw53sqmu1L7sbBUjWhcYKrctdpNsGNASRpNt0s-PjxJqHKfmMkoGGLgko02KFyW3I07_tCqs8-KkwnY48y4hGWzdHCh_r9aXjww3r1DfuksdrGAy5kti3ew1RQ1Yl3qMSpdmZvVUS47Q2BIJwwdDRnZmF0VGY"
        },
        {
            id: "m3",
            title: "The Story of Ogun",
            description: "Discover the story of the mighty warrior, hunter, and blacksmith who clears the path for other gods.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC38scdNMpKF2gvc9Zq6TqEerluKmFqt8RMApTtvdZuIygLMbbtxmBsWobk5bkX92piWKWoPYAsITSZCEiuCDR57AGsiLpJvY2ZqQmanX9mFyLbBxZzrKQ6S5DYaeUCYn4SevPZDzTL7BjtfWMAA7LDjzOpglx6Uikf1j950v4VsesKhh-N8lSb-yHnWfzpa3c8-nQ6dRfeZxj5jFzugDCa64hEeYpCYMtsASRU00mWST4vr1_PWTCmzerf1PUC0JItzyutHfV6pA"
        }
    ],
    resources: [
        {
            id: "r1",
            title: "The History of the Yorubas",
            author: "Samuel Johnson",
            size: "5.2 MB",
            format: "PDF",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-SxwFp_rhTpvKE1my6iTM-5VUa4G2aXVSxT5FJElYHth8Pyynogx2kT0Y0F4qyL_Zu21kHY7PppOjhmDEGkrx_ZoE2Dj9zZK6tQ0atgl7rHcCYbWQ0U717sYQEzmvgQEp2Shu5DoSlofnfz2-sv9kuGxUJfEpTrsXHxAmp6oQjnDs8ZkRDJU91KooYTZWVkNNjSlouu23MxEhDTOxoONVvz_dece4AcGTprHqFdWQHhTvph0lfc2XpY9rV1W4yzIPPVSP46GZHBo"
        },
        {
            id: "r2",
            title: "Yoruba Myths",
            author: "Ulli Beier",
            size: "3.1 MB",
            format: "EPUB",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Rq_Nj8r9McZT3PbXh8Zitr9kQGbDfREbPXTd7rCfJR7gD72mguRYQYZjkncmwuC7BNFmfNuvB88hOGrXRCrcezukFFnYaKh5m4fbWGWssM5y-M1cRpvX_r4vL_cq-11hNsFkmovUuUiBxJF9KII3MuHBdGB_pKlIx55spx3Y8TukGvOKWtICnwskprQaT-Wf5wNx78qxVCvexOskizPhg2WOKX-QQwgLfRbFHFfpMo1KNMAjn6PtSTlzocBMVh7kyEBQVrhtVVY"
        }
    ]
};