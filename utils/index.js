export const rejectIf = (condition, reason = "Unauthorized") => {
  if (condition) {
    throw new Error(reason);
  }
};

export const checkPlayerInMatch = (match, userId) => {
  const { unassigned, team1, team2 } = match.players;
  const players = unassigned.concat(team1, team2);

  return players.some((player) => player === userId);
};
