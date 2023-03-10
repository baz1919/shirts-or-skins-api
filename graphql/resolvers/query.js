import { Matches, User } from "../../db.js";
import { rejectIf } from "../../utils/index.js";

export const queryResolvers = () => ({
  match: (_root, { id }, { userId }) => {
    rejectIf(!userId);
    return Matches.findById(id);
  },
  matches: (_root, _args, { userId }) => {
    rejectIf(!userId);
    return Matches.findAll();
  },
  player: (_root, { id }) => {
    rejectIf(!id);
    return User.findById(id);
  }
});
