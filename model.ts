import { Schema as S } from "effect"
 
export const Model = S.Struct({
  counter: S.Int,
})
export type Model = typeof Model.Type
 
export const initModel = Model.make({
  counter: 0
})