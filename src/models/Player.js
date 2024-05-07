class Player{
    constructor(data = {}){
        this.id = null;
        this.username = null;
        this.gameId = null;
        this.wincondition = null;
        this.ultimateattack = null;
        this.items = null;
        this.cards = null;
        this.teammate = null;

        Object.assign(this, data);
    }
}
export default Player;