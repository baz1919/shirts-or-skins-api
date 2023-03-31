import { Matches, User } from "../../db.js";
import { rejectIf, checkPlayerInMatch } from "../../utils/index.js";

export const queryResolvers = () => ({
  match: (_root, { id }, { userId }) => {
    rejectIf(!userId);
    return Matches.findById(id);
  },
  matches: (_root, _args, { userId }) => {
    rejectIf(!userId);
    return Matches.findAll();
  },
  myMatches: async (_root, _args, { userId }) => {
    rejectIf(!userId);
    const allMatches = await Matches.findAll();
    const user = await User.findOne(({ username }) => username === userId);

    return allMatches.filter((match) => checkPlayerInMatch(match, user.id));
  },
  player: (_root, { id }) => {
    rejectIf(!id);
    return User.findById(id);
  },
});
