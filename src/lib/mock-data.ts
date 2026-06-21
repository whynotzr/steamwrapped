import mockData from "@/data/mockData.json";

export type MockWrappedData = typeof mockData;

/** SteamID64 fictif — à utiliser pour la route démo (`/u/demo` à brancher plus tard). */
export const MOCK_STEAM_ID = mockData.profile.steamId;

export const MOCK_DEMO_SLUG = "demo";

export { mockData };
