// async getAccessToken() {
//     try {
//         console.log('start getAccessToken');

//         if (!this.email || !this.password) {
//             const {email, password, hash} = await UserData.getUserById(this.userId);
//             this.email = email;
//             this.password = password;
//             this.hash = hash;
//         }

//         if (this.hash) {
//             return this.hash;
//         }

//         const form = FormDataHelper.createFormData({
//             email: this.email,
//             password: this.password,
//             version: Constants.VERSION
//         });

//         const response = await axios.post(Constants.LOGIN, form);

//         console.log('finish getAccessToken', JSON.stringify(response.data));

//         this.hash = response.data?.user?.hash;
        
//         UserData.updateUserInfo({userId: this.userId, hash: this.hash});
        
//         return this.hash;
//     } catch (error) {
//         console.error('Error getting access token:', error.response?.data || error.message);
//         throw error;
//     }
// }


// async getRequests4User() {
//     try {
//         logger.info("start getRequests4User")
        
//         const dateToBook = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
//         logger.info("dateToBook = ", dateToBook)
//         const needToBookRequests = await UserData.geRequestsToBook(this.userId, dateToBook);
//         const listOfAppointmentsByDate = await this.cosmosFitService.getListAppointmentsByDate(dateToBook);
//         // logger.info("needToBookRequests= ", JSON.stringify(needToBookRequests))
//         // logger.info("listOfAppointmentsByDate= ", JSON.stringify(listOfAppointmentsByDate))
        
//         const appointmentsToBook = needToBookRequests.map(request => {
//             const appointmentToBook = listOfAppointmentsByDate.find(appointment => appointment.date === request.date && 
//                 appointment.time === request.time &&
//                 appointment.type.includes(request.title));
//             // logger.info("appointmentToBook = ", appointmentToBook)
//             if (!appointmentToBook) {
//                 logger.info("Appointment Not Found")
//                 return;
//             }
//             return {
//                 booking_id: appointmentToBook.id,
//                 date: appointmentToBook.date,
//                 time: appointmentToBook.time,
//                 email: this.cosmosFitService.auth.email,
//                 hash: this.cosmosFitService.auth.hash
//             };

//         })
//         logger.info("appointmentsToBook= ", JSON.stringify(appointmentsToBook))

//         return appointmentsToBook;
        
//     } catch (error) {
//         logger.info("error getRequests4User")
//         logger.info(error)
//     }
// }


// async getListAppointmentsByDate(date) {
//     if (!this.auth.hash) {
//         await this.auth.getAccessToken();
//     }
//     console.error('start getListAppointmentsByDate:');

//     try {
//         const form = FormDataHelper.createFormData({
//             establishment: 1,
//             date,
//             email: this.auth.email,
//             hash: this.auth.hash,
//             version: Constants.VERSION
//         });

//         const response = await axios.post(Constants.GET_BOOKINGS_LIST, form, {
//             headers: {
//                 ...form.getHeaders(),
//             }
//         });
//         // console.error('response getListAppointmentsByDate:', JSON.stringify(response.data));

//         return response.data?.booking?.reserves;
//     } catch (error) {
//         console.error('Error getListByDate:', error.response?.data || error.message);
//         throw error;
//     }
// }
