const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_KEY = 'MRCOACH_SUPPORT_KEY';
const BASE_URL = 'http://localhost:5000/api/external';

async function testWebsiteTicket() {
    console.log('--- Testing Website Ticket ---');
    try {
        const response = await axios.post(BASE_URL + '/client-ticket', {
            name: 'Rahul Client',
            email: 'rahul@example.com',
            phone: '9876543210',
            subject: 'Unable to book session',
            message: 'Booking page not loading correctly.'
        }, {
            headers: { 'x-support-api-key': API_KEY }
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function testCoachTicket() {
    console.log('\n--- Testing Coach App Ticket ---');
    try {
        const formData = new FormData();
        formData.append('coachId', 'COA-45');
        formData.append('coachName', 'Arun Coach');
        formData.append('subject', 'Client session issue');
        formData.append('description', 'Client missed session, need to reschedule.');
        formData.append('priority', 'High');
        formData.append('gdriveLink', 'https://drive.google.com/drive/u/0/my-drive');
        // formData.append('attachments', fs.createReadStream('./package.json')); // Uncomment to test file upload

        const response = await axios.post(BASE_URL + '/coach-ticket', formData, {
            headers: { 
                'x-support-api-key': API_KEY,
                ...formData.getHeaders()
            }
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function runTests() {
    await testWebsiteTicket();
    await testCoachTicket();
}

runTests();