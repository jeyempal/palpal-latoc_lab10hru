import { Schema as S } from "effect"

export const pokemonDataStruct = {
        "name": "",
        "types": [],
        "height": null,
        "weight": null,
    }

export const Model = S.Struct({
    pokemonData: S.Object,
    isFetching: S.Boolean,
    error: S.String,
    text: S.String
})
export type Model = typeof Model.Type

export const initModel = Model.make({
    pokemonData: pokemonDataStruct,
    isFetching: false,
    error: "",
    text: ""
})