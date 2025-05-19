import { Array, String, HashSet } from "effect"
import { pokemonDataStruct } from "./model"

export async function fetchPokemonByGeneration(generations: HashSet.HashSet<number>, text: string) {
    let pokemonList: any[] = []
    let promisesGen: Promise<any>[] = []
    for (const g of generations) {
        try {
            const promise = fetch(`https://pokeapi.co/api/v2/generation/${g}/`) // code works best with pokeapi.co
            // const promise = fetch(`https://pokeapi.upd-dcs.work/api/v2/generation/${g}/`)
            promisesGen = Array.append(promisesGen, promise)
        } catch (e) {
            continue
        }
    }
    const responsesGen = await Promise.all(promisesGen)

    for (const resp of responsesGen) {
        try {
            const data = await resp.json()
            let pokemon: any[] = []
            if (text === "") {
                pokemon = data.pokemon_species
            } else {
                pokemon = Array.filter(data.pokemon_species, (s: any) => String.startsWith(text, 0)(s.name))
            }
            pokemonList = [...pokemonList, ...pokemon]
        } catch (e) {
            continue
        }
    }
    return pokemonList
}

export async function fetchPokemon(pokemonList: any[]) {
    let promisesPokemon: Promise<any>[] = []
    let pokemonDataList: any[] = []
    for (const pokemon of pokemonList) {
        try {
            const promise = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`) // code works best with pokeapi.co
            // const promise = fetch(`https://pokeapi.upd-dcs.work/api/v2/pokemon/${pokemon.name}`)
            promisesPokemon = [...promisesPokemon, promise]
        } catch (e) {
            continue
        }
    }
    const responsesPokemon = await Promise.all(promisesPokemon)

    for (const resp of responsesPokemon) {
        try {
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
                name: data.name,
                types: stringType,
                height: data.height / 10,
                weight: data.weight / 10,
                imgLink: imgLink,
                id: data.id
            })
        ]
        } catch(e) {
            continue;
        }
    }
    return pokemonDataList
}