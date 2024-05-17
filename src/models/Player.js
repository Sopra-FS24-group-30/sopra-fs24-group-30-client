class Player{
    constructor(data = {}){
        this.playerId = null;
        this.userId = null;
        this.username = null;
        this.teammateId = null;
        this.cash = null;
        this.wincondition = null;
        this.ultimateattack = null;
        this.usables = null;

        Object.assign(this, data);
    }
}

export default Player;