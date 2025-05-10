import { Equal } from "effect"
import { Msg, MsgFetchPokemon, MsgType } from "./msg"
import { Model, pokemonDataStruct } from "./model"
import { h } from "cs12242-mvu/src"
 
export const view = (model: Model, dispatch: (msg: Msg) => void) =>
  h("div", [
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
    h("button", {
      on: {
        click: () => dispatch(MsgFetchPokemon.make({ pokemon: model.text })),
      }
    }, "Search"),
    h("pre", 
      model.error !== "" ? `Failed to fetch data (Error: ${model.error})`
      : model.isFetching ? "Loading..."
      : Equal.equals(model.pokemonData, pokemonDataStruct) ? ""
      : JSON.stringify(model.pokemonData, null, 4))
  ])