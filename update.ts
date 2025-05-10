import { Match, Array, String } from "effect"
import { Msg, MsgGotPokemon, MsgError } from "./msg"
import { Model } from "./model"
import { Cmd } from "cs12242-mvu/src"

export const update = (msg: Msg, model: Model): Model | { model: Model; cmd: Cmd<Msg> } =>
    Match.value(msg).pipe(
        Match.tag("MsgFetchPokemon", ({ pokemon }) => {
            return ({
            model: Model.make({
                ...model,
                isFetching: true,
                error: ""
            }),
            cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                try {
                    const resp = await fetch(
                        `https://pokeapi.upd-dcs.work/api/v2/pokemon/${String.toLowerCase(pokemon)}`,
                    )
                    const data = await resp.text()
                    const obj = JSON.parse(data)

                    let types: string[] = []
                    for (const type of obj.types) {
                        types = Array.append(types, type.type.name)
                    }

                    const newPokemonData = {
                        "name": obj.name,
                        "types": types,
                        "height": obj.height,
                        "weight": obj.weight,
                    }

                    dispatch(MsgGotPokemon.make({ pokemonData: newPokemonData }))
                } catch (e) {
                    dispatch(MsgError.make({ error: `Error: ${e}` }))
                }
            }),
        })}),
        Match.tag("MsgGotPokemon", ({ pokemonData }) => 
            Model.make({
                ...model,
                isFetching: false,
                pokemonData: pokemonData,
            })
        ),
        Match.tag("MsgError", ({ error }) =>
            Model.make({
                ...model,
                error: error,
            })
        ),
        Match.tag("MsgType", ({ text }) =>
            Model.make({
                ...model,
                text,
            }),
        ),
        Match.exhaustive,
    )