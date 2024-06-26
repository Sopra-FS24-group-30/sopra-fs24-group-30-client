import Achievements from "./Achievements";

/**
 * User model
 */
class User {
    constructor(data = {}) {
        this.id = null;
        this.name = null;
        this.username = null;
        this.password = null;
        this.token = null;
        this.status = null;
        this.creationDate = null;
        this.birthdday = null;
        this.achievement = null;
        Object.assign(this, data);
    }
}

export default User;
