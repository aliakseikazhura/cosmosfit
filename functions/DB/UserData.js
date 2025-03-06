class UserData {
    constructor(dbConnection) {
        this.map = {};
        if (!UserData.instance) {
            this.db = dbConnection;
            UserData.instance = this;
        }
        return UserData.instance;
    }

    async getUserById(userId) {
        try {
            const result = {
                userId: "testUser",
                email: "s.bogdaaanova@gmail.com",
                password: "a1483719",
                hash: ""
            };

            // const result = {
            //     userId: "testUser",
            //     email: "leshakazhuro@mail.ru",
            //     password: "1111",
            //     hash: ""
            // };

            this.map[userId] = result;

            return result;

        } catch (error) {
            console.error('Error fetching user data:', error.message);
            throw error;
        }
    }

    async updateUserInfo(userInfo) {

    }
}

module.exports = UserData;
