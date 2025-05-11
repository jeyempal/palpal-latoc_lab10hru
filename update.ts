import { Match, Array, String } from "effect"
import { Msg, MsgGotPokemon, MsgError } from "./msg"
import { Model, pokemonDataStruct } from "./model"
import { Cmd } from "cs12242-mvu/src"

export const update = (msg: Msg, model: Model): Model | { model: Model; cmd: Cmd<Msg> } =>
    Match.value(msg).pipe(
        Match.tag("MsgFetchPokemon", ({ pokemon }) => {
            return ({
            model: Model.make({
                ...model,
                isFetching: true,
                error: "",
                pokemonData: null
            }),
            cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                try {

                    const resp = await fetch(
                        `https://pokeapi.upd-dcs.work/api/v2/pokemon/${String.toLowerCase(pokemon)}`,
                    )
                    const data = await resp.text()
                    const obj = JSON.parse(data)

                    let stringType = ""
                    for (const type of obj.types) {
                        if (type.slot === 1) {
                            stringType = String.concat(stringType, type.type.name)
                        } else {
                            stringType = String.concat(stringType, ` | ${type.type.name}`)
                        }
                    }



                    const imgLink = obj.sprites.front_default

                    dispatch(MsgGotPokemon.make({ 
                        name: obj.name,
                        types: stringType,
                        height: obj.height / 10,
                        weight: obj.weight / 10,
                        imgLink: imgLink
                     }))
                } catch (e) {
                    dispatch(MsgError.make({ error: `${e}` }))
                }
            }),
        })}),
        Match.tag("MsgGotPokemon", ({ name, types, height, weight, imgLink }) => 
            Model.make({
                ...model,
                isFetching: false,
                pokemonData: pokemonDataStruct.make({
                    name: name,
                    types: types,
                    height: height,
                    weight: weight,
                    imgLink: imgLink
                }),
            })
        ),
        Match.tag("MsgError", ({ error }) =>
            Model.make({
                ...model,
                pokemonData: null,
                isFetching: false,
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