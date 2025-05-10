import { Msg, MsgIncrement, MsgDecrement } from "./msg"
import { Model } from "./model"
import { h } from "cs12242-mvu/src"
 
export const view = (model: Model, dispatch: (msg: Msg) => void) =>
  h("div", [
    h("button", {
      on: {
        click: () => dispatch(MsgIncrement.make()),
      }
    }, "+"),
    h("h2", `${model.counter}`),
    h("button", {
      on: {
        click: () => dispatch(MsgDecrement.make()),
      }
    }, "-"),
  ])