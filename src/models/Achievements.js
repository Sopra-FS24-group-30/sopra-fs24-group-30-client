

class Achievements{
    constructor(data = {}) {
        this.userId = null;
        this.baron1 = false;
        this.baron2 = false;
        this.baron3 = false;
        this.noMoney = false;
        this.noUltimate = false;
        this.endurance1 = false;
        this.endurance2 = false;
        this.endurance3 = false;
        this.gamer = false;
        this.doingYourBest = false;
        this.totalWins = null;
        this.maxMoneyInGame = null;
        this.winStreak = null;
        this.loseStreak = null;


        Object.assign(this,data);
    }

    checkDone(){
        return this.baron1;
    }
}

export default Achievements;