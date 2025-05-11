import { Schema as S } from "effect"

export const pokemonDataStruct = S.Struct({
    name: S.String,
    types: S.String,
    height: S.Union(S.Number, S.Null),
    weight: S.Union(S.Number, S.Null),
    imgLink: S.Union(S.String, S.Null)
})
export type pokemonDataStruct = typeof pokemonDataStruct

export const Model = S.Struct({
    pokemonData: S.Union(pokemonDataStruct, S.Null),
    isFetching: S.Boolean,
    error: S.String,
    text: S.String
})
export type Model = typeof Model.Type

export const initModel = Model.make({
    pokemonData: null,
    isFetching: false,
    error: "",
    text: ""
})

