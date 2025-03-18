const axios = require('axios');
const logger = require('../logger');
const FormDataHelper = require('./FormDataHelper');

class ExecutionService {
    static async executePostRequest(data, path) {
        try {
            data = FormDataHelper.createFormData(data);
            // logger.info(`Execution service start sending at: ${new Date().toISOString()}`);
            // logger.info(`Execution service start sending at: ${new Date().toISOString()}; request = ${JSON.stringify(data)}`);
            const response = await axios.post(path, data);
            // logger.info(`response = ${JSON.stringify(response.data)} at: ${new Date().toISOString()}`)
            return response.data;
        } catch (err) {
            logger.info("executePostRequest", err)
            return {};
        }
    }
}


module.exports = ExecutionService;
