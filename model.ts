import { Schema as S, HashSet, HashMap } from "effect"

export const pokemonDataStruct = S.Struct({
    name: S.String,
    types: S.String,
    height: S.Number,
    weight: S.Number,
    imgLink: S.String,
    id: S.Number
})
export type pokemonDataStruct = typeof pokemonDataStruct

export const Model = S.Struct({
    pokemonData: S.Array(S.Object),
    isFetching: S.Boolean,
    error: S.String,
    text: S.String,
    generations: S.HashSet(S.Number),
    checkboxes: S.HashMap({
        key: S.Int,
        value: S.Boolean
    }),
})
export type Model = typeof Model.Type

export const initModel = Model.make({
    pokemonData: [],
    isFetching: false,
    error: "",
    text: "",
    generations: HashSet.make(1),
    checkboxes: HashMap.make(
        [1, true], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false], 
    ),
})

