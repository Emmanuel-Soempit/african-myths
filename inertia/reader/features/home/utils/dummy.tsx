// inertia/personas/user/features/home/utils/dummy.tsx
import { Collection, Culture, Myth } from "../types";

// Helper function to find culture by name

export const cultures_dummy: Culture[] = [
    {
        id: "1",
        name: "Yoruba",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACORViDaqEe17QWQbWGV8MBFsV8RrRZx6OwHJwQUnAy6FofpwIr-8GFBGR6Ea4M4O8ggKxUt9itf6a3-tnOhGpI1hWBhcpIM6szxE4Zqd5sBEVASqbKSFbJgqiiTkYfX8pRGHVbfjWeLE8gazaomC8StRF8K6Nnk_NuuqAUuQV88ZbJQntsm5sNxlD54zCpU4PmPiFlOkwM11LkcwVvDi6OkykXEHebLn3DwqXKOOTfvPMT6Fsy2j9g47FRzrKTUEjL1Z-36KzPsA",
        country: ["Nigeria", "Benin", "Togo"],
        region: "West Africa",
        subgroups: [
            {
                id: "1-1",
                name: "Oyo",
                image: "",
                dialect_block: "Central Yoruba",
                region_states: ["Oyo", "Osun", "Ogun"],
                kingdom_or_center: "Ijebu",
            },
        ],
    },
    {
        id: "2",
        name: "Maasai",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjYgPbyphKgB4LYKLzR-L7H8FXVPOd7RkX7TOjrFV38DVorsvYRptNDbUdfVI0Dv9EgLpOxcSIo8nPwvYyokd_UQbIt2kJat-Mw7BOQizJTlSi77pttL6Zf-ZuspSkAyXip17p0624vp1jJc-za7Xei3gMjCleutErH968J-iLfIELNra8sQ8NJBgPGwOk5PRBaXcF0nf79EnGrt_hNGCpJkd02WJ6u3aUdmx40IEdPpMWr-8aCwK4ufU6gj6oxCxUDTNNlwdxVzs",
        country: ["Kenya", "Tanzania"],
        region: "East Africa",
        subgroups: [
            {
                id: "2-1",
                name: "Kenyan Maasai",
                image: "",
                region_states: ["Kajiado", "Narok"],
                kingdom_or_center: ["Kajiado", "Narok"],
            },
            {
                id: "2-2",
                name: "Tanzanian Maasai",
                image: "",
                region_states: ["Arusha", "Manyara"],
                kingdom_or_center: ["Arusha", "Manyara"],
            },
        ],
    },
    {
        id: "3",
        name: "Zulu",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZoWa9KIbMGjXCfxIX-jcjB5uBqkmvnsGIcxEkcaFKg0-ol5wnqPA1HNfA-wdQUQnPnWGp5vTiljFPFty53lPbGLZJiVJBUpsiJCp4tYDWG_HjJmAfWpFC6K19xTmS7byTff0wqMpqa-CuaAgjnJ07sU3PvPQIz5-A-v_lRyg5iAPKCL9Oz4we5y_Q-0sX74DyeyoBeXrq1uS7T0u1dWbt3KiD0_tbiycevRHHY6VFo40DbCJFcs-SPne1ZWTnncDuny1xOsjfKs",
        country: ["South Africa"],
        region: "Southern Africa",
        subgroups: [
            {
                id: "3-1",
                name: "KwaZulu",
                image: "",
                region_states: ["KwaZulu-Natal"],
                kingdom_or_center: "Ulundi",
            },
        ],
    },
    {
        id: "4",
        name: "Ancient Egypt",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeKgcKkLU7ZwsagKLkdsfXq-gIV_8XoC-R7qCJpSmVBXhvAPeC7B6h61sG-w49nKJs6GqOvNL29UiZNWYI6tIyWbSyZjKull3IK4sngjbawMQ4G8MP6Cq_zFhe4kNo1beua69MJQyIkM9aE1qdPyIV8G9vd-B9NoxfStaZzI2T3aSciF-0TgftXh9DPgKkhLmBr2ZkXE-gHc6zJnaPRkSF7_zxfoY3MUlFlaUGomFgOKfbZ5EbksK_jcDL9246z-hnOV0a9s8LWeI",
        country: ["Egypt"],
        region: "North Africa",
        subgroups: [
            {
                id: "4-1",
                name: "Upper Egypt",
                image: "",
                region_states: ["Southern Egypt"],
                kingdom_or_center: ["Thebes", "Luxor"],
            },
            {
                id: "4-2",
                name: "Lower Egypt",
                image: "",
                region_states: ["Northern Egypt"],
                kingdom_or_center: ["Memphis", "Cairo"],
            },
        ],
    },
    // Add this to the cultures_dummy array
    {
        id: "5",
        name: "Igbo",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZoWa9KIbMGjXCfxIX-jcjB5uBqkmvnsGIcxEkcaFKg0-ol5wnqPA1HNfA-wdQUQnPnWGp5vTiljFPFty53lPbGLZJiVJBUpsiJCp4tYDWG_HjJmAfWpFC6K19xTmS7byTff0wqMpqa-CuaAgjnJ07sU3PvPQIz5-A-v_lRyg5iAPKCL9Oz4we5y_Q-0sX74DyeyoBeXrq1uS7T0u1dWbt3KiD0_tbiycevRHHY6VFo40DbCJFcs-SPne1ZWTnncDuny1xOsjfKs",
        country: ["Nigeria", "Equatorial Guinea", "Cameroon"],
        region: "West Africa",
        subgroups: [
            {
                id: "5-1",
                name: "Nri",
                image: "",
                dialect_block: "Northern Igbo",
                region_states: ["Anambra", "Enugu"],
                kingdom_or_center: "Nri Kingdom"
            },
            {
                id: "5-2",
                name: "Aro",
                image: "",
                dialect_block: "Southern Igbo",
                region_states: ["Abia", "Imo"],
                kingdom_or_center: "Aro Confederacy"
            }
        ]
    }
];


export const myths_dummy: Myth[] = [
    {
        id: 'm1',
        title: 'Anansi the Spider',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCj_ycqC_BZ5QZvfGf0_10AIUTGdRge8ZyKgooM4u0rTYZvSKwV6gbs-mu4hMq3QkVqhvXGEr-vscAW48E0TeMEtQSFKsO47z4iZGLDFBjVFnzhLaX-RgYAY45rCq6jyWIAWmfmeC8K4eXE4Lsiyrqh-VWxB3AXNe9XQQk7gMyG3hTGPMpjOw7iouBe-udxGynvTdG4Ti0KGUPES0qtwuqcHyNZsRzvIUF0vlxwYwzdLo_FV5HhYSxS61y__tLW-fwi3krXIdyKr0',
        culture: {
            id: 'ashanti',
            name: 'Ashanti',
            region: 'West Africa',
            country: ['Ghana'],
            image: 'https://example.com/ashanti.jpg', // Placeholder image URL
            subgroups: []
        }
    },
    {
        id: 'm2',
        title: 'The Legend of the Mossi',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW1a0qZVmAdIRI4r2ioAZM1hImLFRcndkMMg2bRA7WgFOhkwzURjtgffzkN-rn3TTiIOY-xQsB8q3fzbR_kYvDjDfaKFGI8t6_8Z4-ZJa_JjjPxv6EjjXrF5WBdyVb2ysv50NOPqwGQ8B4xxMTCAu_bS3JNbbUb-E-YyKg1fJlmda05nAGg8DUxRlTgDkfr3xwiTT9xc5YkD6FCZT_ouJzeKawS6Pm-PlhE7sp1cE_dc-umIBEC4GdRLPMO38GJJeIQ6nAojHAepE',
        culture: {
            id: 'mossi',
            name: 'Mossi',
            region: 'West Africa',
            country: ['Burkina Faso'],
            image: 'https://example.com/mossi.jpg', // Placeholder image URL
            subgroups: []
        }
    },
    {
        id: 'm3',
        title: 'The Epic of Sundiata',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfyxvbUjJWUdSMJnDRlVURwQMrkyELsVfdAbyCpZfkG1kGrujtdpU8y3WJ0RC6h99swXGu7Jo8BNwNe-hkLssqX52KZ7oqMclx0RQyV_MRWmUx01bPPTdwefSmvQnJG-_Bg12OHvyioJ6lYtSKka1Fp0YYhXsYa0FouJ2_v54SQxOoLYBikVslXOu_X4BbcuWK7o2qtH9He332PZKrfsTy9GuE8JCneHG9r2286QKGEeVnIxw3jCtrBqnW6Fyee9iL6v8ldqeLAhw',
        culture: {
            id: 'mandinka',
            name: 'Mandinka',
            region: 'West Africa',
            country: ['Mali'],
            image: 'https://example.com/mandinka.jpg', // Placeholder image URL
            subgroups: []
        }
    },
    {
        id: 'm4',
        title: 'The Tale of Mami Wata',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCj_ycqC_BZ5QZvfGf0_10AIUTGdRge8ZyKgooM4u0rTYZvSKwV6gbs-mu4hMq3QkVqhvXGEr-vscAW48E0TeMEtQSFKsO47z4iZGLDFBjVFnzhLaX-RgYAY45rCq6jyWIAWmfmeC8K4eXE4Lsiyrqh-VWxB3AXNe9XQQk7gMyG3hTGPMpjOw7iouBe-udxGynvTdG4Ti0KGUPES0qtwuqcHyNZsRzvIUF0vlxwYwzdLo_FV5HhYSxS61y__tLW-fwi3krXIdyKr0',
        culture: {
            id: 'yoruba',
            name: 'Yoruba',
            region: 'West Africa',
            country: ['Nigeria', 'Benin', 'Togo'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACORViDaqEe17QWQbWGV8MBFsV8RrRZx6OwHJwQUnAy6FofpwIr-8GFBGR6Ea4M4O8ggKxUt9itf6a3-tnOhGpI1hWBhcpIM6szxE4Zqd5sBEVASqbKSFbJgqiiTkYfX8pRGHVbfjWeLE8gazaomC8StRF8K6Nnk_NuuqAUuQV88ZbJQntsm5sNxlD54zCpU4PmPiFlOkwM11LkcwVvDi6OkykXEHebLn3DwqXKOOTfvPMT6Fsy2j9g47FRzrKTUEjL1Z-36KzPsA',
            subgroups: []
        }
    }
];

// In dummy.tsx
export const collections_dummy: Collection[] = [
    {
        id: 'col1',
        name: 'Creation Myths',
        description: 'Stories of how the world and humanity began, from diverse cultural perspectives.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsdHftdenLIODN6g43E15SeSyV1bdTVek7YAemHHYlikWQ_tQ_gpa2eqyQYdM-alKBFE46XwH2yQJWErIbJlUS4I3Ytipjlvu_HwJvVyNjc5yFEjXwqmtn3jjFZJG5xBsaucOaOtKYjHTCug5I36hQYv8AJNfqd9bU2pfKNUKIGkxB8duYz8IZpB-a0KTG9nTJryba3yGHAcD87Tsiqz6_-GZkOxmsITRhv0vTbfnjJbbVaiIvJRNhql-QbT-uvCb3V-XU6P9hg8',
        myths: [] // You can populate this with relevant myth IDs if needed
    },
    {
        id: 'col2',
        name: 'Heroic Epics',
        description: 'Tales of legendary heroes, their great deeds, and their impact on history and culture.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_mDmjHw70Pgd6MaqMlxEjvxtYoNlO4ZpiwT9nFAXPdi25iiOG_-MlOLRn_uu3-xx1nkAXquaNzhaQI4w-W49lW8Eu7HU7KWVNQK8Lj_2hVeHwPScIH6FlI6JlC8dojBKSqdCxkB7Fhosa6mgpg8g3qit-cVDT-sAbHg9y_XEPE2fuK6VFuePy45pl0KHGteX31zUXMjQdouZokelo2eKnD6nQ6AfvKvyp_C4amB8KVMPKI3SOrzHb7ahcPqEFzANrqPRCDq2z9yU',
        myths: []
    },
    {
        id: 'col3',
        name: 'Trickster Tales',
        description: 'Follow the clever and mischievous characters who use their wits to outsmart others.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKhtMYAsCOVmj1yaj9idF3fBzaHLKdOuQ2Hk0l3WOIlFotmE5QB95MEDBaCfaXLXsOUHpQhq0SOvXFPkvcz4Z1-ih1LwM_2ezqYTt0fzA_2c4V5NO0cKNw31ReGksGy-iOfwqgfNo7x7iEHxQd4CVmeSB2P2N9a22w1nNVFT6jz7YF85OzfdJr8VYvfBzalaq7e7I1f6qRklOY72LhsX45C87gRMUI9kehOby-hCiCCNHtYw9_V-Q-VajRRiIognwTIrOA6A87Dt8',
        myths: []
    },
    {
        id: 'col4',
        name: 'Animal Fables',
        description: 'Stories where animals speak and act like humans, teaching valuable moral lessons.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy0EZ9-r3thavhuI7462nT6Tx2TjJhz-gZWTqOeYOa5eKpDElZXWExnuStS2eONQs4NPmCgTAL51OSKZixOToZOES2qyBP23mif9y5RCcECOXB-VB39ok9JdVk_i7ZuDWituEqrrHsLAmtPy1AOPfvX72M6g9zU0pTZnsNBI-aTpZQ2bbK2f_OrJ2Mkx_6DILzeFpduQ2EsxeNZ7TtXgV_4iD14CoFs0KjqTHPk-XwuOZXCJWlU16N__7nNrKu88PKttJX4z97d8Y',
        myths: []
    },
    {
    id: 'col5',
    name: 'Ancestral Wisdom',
    description: 'Timeless proverbs and sayings that have guided generations with their profound wisdom.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfyxvbUjJWUdSMJnDRlVURwQMrkyELsVfdAbyCpZfkG1kGrujtdpU8y3WJ0RC6h99swXGu7Jo8BNwNe-hkLssqX52KZ7oqMclx0RQyV_MRWmUx01bPPTdwefSmvQnJG-_Bg12OHvyioJ6lYtSKka1Fp0YYhXsYa0FouJ2_v54SQxOoLYBikVslXOu_X4BbcuWK7o2qtH9He332PZKrfsTy9GuE8JCneHG9r2286QKGEeVnIxw3jCtrBqnW6Fyee9iL6v8ldqeLAhw',
    myths: []
}
];