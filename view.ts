import { Match } from "effect"
import { Msg, MsgFetchPokemon, MsgType } from "./msg"
import { Model } from "./model"
import { h } from "cs12242-mvu/src"
 
export const view = (model: Model, dispatch: (msg: Msg) => void) =>
  h("div", [
    // input test
    h("input", {
      type: "text",
      on: {
        input: (e) =>
          dispatch(
            MsgType.make({
              text: (e.target as HTMLInputElement).value,
            }),
          ),
      },
    }),
    // search button
    h("button", {
      on: {
        click: () => dispatch(MsgFetchPokemon.make({ pokemon: model.text })),
      }
    }, "Search"),
    // image of pokemon
    h("div", [
      (!Match.null(model.pokemonData)) && model.error === "" ? h("img", {
        props: {
          src: model.pokemonData.imgLink,
        }})
      : h("img", {
        props: {
          src: ""
        }
      })
    ]),
    // information of pokemon
    h("div", 
      model.error !== "" ? [
        h("pre", "Failed to fetch data")
      ]
      : model.isFetching ? [
        h("pre", "Loading...")
      ]
      : !Match.null(model.pokemonData) ? [
        h("h1", model.pokemonData.name),
        h("code", model.pokemonData.types),
        h("p", `Height: ${model.pokemonData.height} m`),
        h("p", `Weight: ${model.pokemonData.weight} kg`)
      ]
      : []
    ),
  ])