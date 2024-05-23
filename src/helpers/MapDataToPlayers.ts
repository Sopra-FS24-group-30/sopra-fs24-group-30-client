import { Player } from "../models/Player";

export function mapDataToPlayers(data: { players?: { [key: string]: any } }): Player[] {
    if (data.players && typeof data.players === "object") {
        // Use Object.values to get an array of player objects directly
        return Object.entries(data.players).map(([key,player]): Player => ({
            playerId: parseInt(key, 10), // Ensure playerId is a number, if not already
            userId: player.userId,
            username: player.username,
            teammateId: player.teammateId,
            cash: player.cash,
            usables: player.usables || []
        }));
    } else {
        // Log an error if players is not an object or is undefined
        console.error("Expected data.players to be an object, received:", data.players);

        return [];
    }
}