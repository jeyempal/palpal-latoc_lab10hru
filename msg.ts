import { Schema as S } from "effect"
 
export const Msg = S.Union(
  S.TaggedStruct("MsgIncrement", {}),
  S.TaggedStruct("MsgDecrement", {}),
)
export type Msg = typeof Msg.Type
export const [
  MsgIncrement,
  MsgDecrement,
] = Msg.members