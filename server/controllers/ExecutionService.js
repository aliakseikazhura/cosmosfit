const axios = require('axios');
const logger = require('../logger');
const FormDataHelper = require('./FormDataHelper');

class ExecutionService {
    static async executePostRequest(data, path) {
        try {
            data = FormDataHelper.createFormData(data);
            const response = await axios.post(path, data);
            return response.data;
        } catch (err) {
            logger.info("executePostRequest", err)
            return {};
        }
    }
}


module.exports = ExecutionService;
