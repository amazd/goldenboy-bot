// No third party module required: https is part of the Node.js API
const https = require('https');
const {rtm} = require('./bot');
const url = 'https://cfo-event-parking.herokuapp.com/events';


function getToday() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if(dd < 10) {
        dd = '0' + dd;
    }
    if(mm < 10) {
        mm = '0' + mm;
    }
    const todayString = yyyy + '-' + mm + '-' + dd;
    return todayString;
}

function getParkingDates(message) {
    const today = getToday();
    https.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
            body += data;
        });
        res.on('end', () => {
            body = JSON.parse(body);
            let datesForMessage = '';
            for(let i = 0; i < body.length; i++) {
                console.log('i', i);
                console.log('body[i]', body[i]);
                datesForMessage = datesForMessage + body[i] + '\n ';
            }
            rtm.sendMessage('Here are all the event parking dates I have!\n\n' + datesForMessage, message.channel);
            return;
        });
    });
}


function thereIsParkingToday(message) {
    https.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
            body += data;
        });
        res.on('end', () => {
            body = JSON.parse(body);
            let datesForMessage = '';
            for(let i = 0; i < body.length; i++) {
                datesForMessage = datesForMessage + body[i] + '\n ';
            }
            const today = getToday();
            if(datesForMessage.indexOf(today) > -1) {
                rtm.sendMessage('event parking...today...yes...', message.channel);
            } else {
                rtm.sendMessage('no evEnt PARKING. NO EVENT PARKING NO EVENT PARKING NO eVENT PARKING', message.channel);
            }
            return;
        });
    });
}

function checkParking(command, message) {
    switch(command) {
        case 'parking:':
            thereIsParkingToday(message);
            break;
        case 'parking this month:':
            getParkingDates(message);
            break;
        default:
            return;
    }
}

module.exports = {
    checkParking
};
