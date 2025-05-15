import { Schema as S } from "effect"

export type Msg = typeof Msg.Type
export const Msg = S.Union(
    S.TaggedStruct("MsgFetchPokemon", {
        text: S.String,
        generations: S.HashSet(S.Number)
    }),
    S.TaggedStruct("MsgGotPokemon", {
        pokemonDataList: S.Array(S.Object)
    }),
    S.TaggedStruct("MsgError", {
        error: S.String
    }),
    S.TaggedStruct("MsgType", {
        text: S.String,
    }),
    S.TaggedStruct("MsgFilter", {
        generationNumber: S.Number
    }),
    S.TaggedStruct("MsgGenerations", {
        generations: S.HashSet(S.Number),
        checkboxes: S.HashMap({
            key: S.Number,
            value: S.Boolean
        })
    })
  )

export const [MsgFetchPokemon, MsgGotPokemon, MsgError, MsgType, MsgFilter, MsgGenerations] = Msg.members