import { Database } from "fakebase";

const db = new Database("./data");

export const User = db.table("users");
export const Matches = db.table("matches");