class UserData1 {
    static async getUserById(userId) {
        try {
            // const result = {
            //     userId: "testUser",
            //     email: "s.bogdaaanova@gmail.com",
            //     password: "a1483719",
            //     hash: ""
            // };

            const result = {
                userId: "testUser",
                email: "leshakazhuro@mail.ru",
                password: "1111",
                hash: ""
            };

            this.map[userId] = result;

            return result;

        } catch (error) {
            console.error('Error fetching user data:', error.message);
            throw error;
        }
    }

    static async geRequestsToBook(userId, date) {
        const booking = {
            "testUser" : [{
                date: "2025-03-14",
                time: "19:00",
                title: "TotalBody"
            },
            // {
            //     date: "2025-03-14",
            //     time: "14:00",
            //     title: "Intensive"
            // }
        ]
        }
        // return booking[userId];
        return booking[userId].filter(booking => booking.date === date);
    }

    static async updateUserInfo(userInfo) {

    }
}
UserData1.map = {};

module.exports = UserData1;
