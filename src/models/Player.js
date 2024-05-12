class Player{
    constructor(data = {}){
        this.playerId = null;
        this.username = null;
        this.gameId = null;
        this.coins = null;
        this.wincondition = null;
        this.ultimateattack = null;
        this.items = null;
        this.cards = null;

        Object.assign(this, data);
    }
}
export default Player;