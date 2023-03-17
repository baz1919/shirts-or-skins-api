import { Matches, User } from "../../db.js"
import { rejectIf } from "../../utils/index.js";

const defaultMatch = {
  "players": {
      "team1": [],
      "team2": [],
      "unassigned": []
  },
  "status": "pending"
}

export const mutationResolvers = () => ({
  createMatch: (_root, { matchDate }, { userId }) => {
    rejectIf(!userId);
    return Matches.create({...defaultMatch, date: matchDate});
  },
  addPlayer: async (_root, { matchId }, { userId }) => {
    rejectIf(!userId);
    const match = await Matches.findById(matchId);
    const user = await User.findOne(({ username }) => username === userId);
    match.players.unassigned.push(user.id);
    return Matches.update(match);
    // return Matches.update({...match, players: {...players, unassigned: [...unassigned, user.Id]}});
  }
});
