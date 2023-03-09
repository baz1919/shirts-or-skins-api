import { Matches } from "../../db.js";
import { rejectIf } from "../../utils/index.js";

export const queryResolvers = () => ({
  matches: (_root, _args, { userId }) => {
    rejectIf(!userId);
    return Matches.findAll();
  },
});
