import { Array, String, HashSet } from "effect"
import { pokemonDataStruct } from "./model"

export async function fetchPokemonByGeneration(generations: HashSet.HashSet<number>, text: string) {
    let promises: Promise<any>[] = []
    let pokemonList: any[] = []

    for (const g of generations) {
        const promise = fetch(`https://pokeapi.co/api/v2/generation/${g}`)
        promises = [...promises, promise]
    }

    const responses = await Promise.all(promises)
    for (const resp of responses) {
        const data = await resp.json()
        let pokemon: any[] = []
        if (text === "") {
            pokemon = data.pokemon_species
        } else {
            pokemon = Array.filter(data.pokemon_species, (s: any) => String.startsWith(text, 0)(s.name))
        }
        pokemonList = [...pokemonList, ...pokemon]
    }
    return pokemonList
}

export async function fetchPokemon(pokemonList: any[]) {
    let promisesPokemon: Promise<any>[] = []
    let pokemonDataList: any[] = []
    for (const pokemon of pokemonList) {
        const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        promisesPokemon = [...promisesPokemon, promise]
    }
    const responsesPokemon = await Promise.all(promisesPokemon)
    for (const resp of responsesPokemon) {
        const data = await resp.json()
        
        let stringType = ""
        for (const type of data.types) {
            if (type.slot === 1) {
                stringType = String.concat(stringType, type.type.name)
            } else {
                stringType = String.concat(stringType, ` | ${type.type.name}`)
            }
        }

        const imgLink = data.sprites.front_default

        pokemonDataList = [
            ...pokemonDataList,
            pokemonDataStruct.make({
                name: String.capitalize(data.name),
                types: stringType,
                height: data.height / 10,
                weight: data.weight / 10,
                imgLink: imgLink,
                id: data.id
            })
        ]
    }
    return pokemonDataList
}