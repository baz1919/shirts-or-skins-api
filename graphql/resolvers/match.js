import { User } from "../../db.js";

export const matchResolvers = () => ({
  players: ({ players }) => ({
    unassigned: players.unassigned.map((id) => User.findById(id)),
    team1: players.team1.map((id) => User.findById(id)),
    team2: players.team2.map((id) => User.findById(id)),
  })
});
