import { Equal, pipe, Array, HashMap } from "effect"
import { Msg, MsgType, MsgFilter } from "./msg"
import { Model } from "./model"
import { h } from "cs12242-mvu/src"

export const view = (model: Model, dispatch: (msg: Msg) => void) =>
    h("div", [
        // input test
        h("input", {
            type: "text",
            on: { input: (e) => dispatch(MsgType.make({ text: (e.target as HTMLInputElement).value, })) },
            props: {
                placeholder: "Enter pokemon name",
                id: "search"
            },
        }),

        // checkboxes
        h("div", {
            class: {
                card: true
            }
        }, pipe(
            Array.range(1, 9),
            Array.map((n) => h("div", [
                h("input", {
                    props: { type: "checkbox", id: `gen${n}`, checked: HashMap.unsafeGet(model.checkboxes, n) },
                    on: { change: () => dispatch(MsgFilter.make({ generationNumber: n })) }
                }),
                h("label", {
                    props: {
                    for: `gen${n}`
                    }
                }, `Gen ${n}`)
                ]))
        )),

        // error and loading text
        h("div", {
            style: {
                textAlign: "center",
            }
        }, 
            model.error !== "" ? [ h("h3", "Failed to fetch data") ]
            : model.isFetching ? [ h("h3", "Loading...") ]
            : []
        ),
    
        // data
        h("div", {
            class: {
                deck: true,
            }
        },
        !Equal.equals(model.pokemonData, []) ? pipe(
            model.pokemonData,
            Array.map((pokemon: any) => h(
            "div", {
                class: {
                    card: true
                },
            },
            [
                h("img", {
                props: {
                    src: pokemon.imgLink,
                    width: 100,
                }
                }),
                h("div",[
                    h("h1", pokemon.name),
                    h("code", pokemon.types),
                    h("p", `Height: ${pokemon.height} m`),
                    h("p", `Weight: ${pokemon.weight} kg`)
                ])
            ]))
        )
        : []
        ),
    ])