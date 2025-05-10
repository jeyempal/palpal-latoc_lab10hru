import { initModel } from "./model"
import { view } from "./view"
import { update } from "./update"
import { startSimple } from "cs12242-mvu/src"
 
const root = document.getElementById("app")!
 
startSimple(root, initModel, update, view)