import { Match, Array, pipe, Order, HashSet, HashMap } from "effect"
import { Msg, MsgGotPokemon, MsgError, MsgFetchPokemon, MsgGenerations } from "./msg"
import { Model, pokemonDataStruct } from "./model"
import { fetchPokemonByGeneration, fetchPokemon } from "./fetch"
import { Cmd } from "cs12242-mvu/src"

export const update = (msg: Msg, model: Model): Model | { model: Model; cmd: Cmd<Msg> } =>
    Match.value(msg).pipe(
        Match.tag("MsgFetchPokemon", ({ text, generations }) => {
            return ({
            model: Model.make({
                ...model,
                isFetching: true,
                error: "",
                pokemonData: []
            }),
            cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                try {
                    const pokemonList = await fetchPokemonByGeneration(generations, text)
                    const pokemonDataList = await fetchPokemon(pokemonList)
                    dispatch(MsgGotPokemon.make({ 
                            pokemonDataList
                        }))
                } catch (e) {
                    console.log(e)
                    dispatch(MsgError.make({ error: `${e}` }))
                }
            }),
        })}),
        Match.tag("MsgGotPokemon", ({ pokemonDataList }) => 
            Model.make({
                ...model,
                isFetching: false,
                pokemonData: pipe(
                    pokemonDataList,
                    Array.sortBy(
                        Order.mapInput(Order.number, (p: (typeof pokemonDataStruct)[number]) => p.id)
                    )
                ),
            })
        ),
        Match.tag("MsgError", ({ error }) =>
            Model.make({
                ...model,
                pokemonData: [],
                isFetching: false,
                error: error,
            })
        ),
        Match.tag("MsgType", ({ text }) => {
            return ({
            model: Model.make({
                ...model,
                text: text,}),
            cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                dispatch(MsgFetchPokemon.make({ text: text, generations: model.generations }))
            })
            })
        }),
        Match.tag("MsgFilter", ({ generationNumber }) => {
            return ({
                model: Model.make({
                ...model,
            }),
                cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                    const newCheckboxes = HashMap.set(model.checkboxes, generationNumber, !HashMap.unsafeGet(model.checkboxes, generationNumber))
                    const newGenerations = HashSet.make(...Array.filter(Array.range(1, 9), (n) => HashMap.unsafeGet(newCheckboxes, n)))
                    dispatch(MsgGenerations.make({ generations: newGenerations, checkboxes: newCheckboxes }))
            })
            })
        }
        ),
        Match.tag("MsgGenerations", ({ generations, checkboxes }) => {
            return ({
            model: Model.make({
                ...model,
                generations: generations,
                checkboxes: checkboxes,
            }),
            cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                dispatch(MsgFetchPokemon.make({ text: model.text, generations: generations }))
            })
            })
        }
        ),
        Match.exhaustive,
    )
