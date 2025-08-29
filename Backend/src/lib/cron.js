import cron from "cron";
import http from "https";

const job = new cron.CronJob('*/14 * * * *', function () {

    http.get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) {
            console.log('Cron job running every 14 minutes');
        }
        else {
            console.log('Get request failed', res.statusCode);
        }
    }).on('error', (e) => {
        console.log('Error occurred:', e.message);
    });
});

export default job;