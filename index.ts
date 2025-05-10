import { initModel } from "./model"
import { view } from "./view"
import { update } from "./update"
import { startModelCmd } from "cs12242-mvu/src"
 
const root = document.getElementById("app")!
 
startModelCmd(root, initModel, update, view)