import { HashMap, Schema as S } from "effect"

export type Msg = typeof Msg.Type
export const Msg = S.Union(
  S.TaggedStruct("MsgFetchPokemon", {
    pokemon: S.String
  }),
  S.TaggedStruct("MsgGotPokemon", {
    name: S.String,
    types: S.String,
    height: S.Number,
    weight: S.Number,
    imgLink: S.String,
  }),
  S.TaggedStruct("MsgError", {
    error: S.String
  }),
  S.TaggedStruct("MsgType", {
    text: S.String,
  }),
)

export const [MsgFetchPokemon, MsgGotPokemon, MsgError, MsgType] = Msg.members