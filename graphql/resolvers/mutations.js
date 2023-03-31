import { Matches, User } from "../../db.js";
import { checkPlayerInMatch, rejectIf } from "../../utils/index.js";

const defaultMatch = {
  players: {
    team1: [],
    team2: [],
    unassigned: [],
  },
  status: "pending",
};

export const mutationResolvers = () => ({
  createMatch: (_root, { matchDate }, { userId }) => {
    rejectIf(!userId);
    return Matches.create({ ...defaultMatch, date: matchDate });
  },

  addPlayer: async (_root, { matchId }, { userId }) => {
    rejectIf(!userId);
    const match = await Matches.findById(String(matchId));
    rejectIf(!match, "Match does not exist");
    const user = await User.findOne(({ username }) => username === userId);
    rejectIf(
      checkPlayerInMatch(match, user.id),
      "Player already assigned to this match"
    );

    match.players.unassigned.push(user.id);
    return Matches.update(match);
  },
});
