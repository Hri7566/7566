const Database = require('./Database');
const DeferredRegister = require('./DeferredRegister');
const Job = require('./Job');

const REGISTER_PREFIX = 'job';

class Jobs {
    static jobs = new DeferredRegister(REGISTER_PREFIX);

    static registerJobs() {
        let jobsList = require('./jobs.json');
        for (let j in jobsList) {
            let job = new Job(jobsList[j]);
            this.jobs.register(j, job);
        }
    }

    static workInterval = setInterval(async () => {
        let jobs = await Database.getAllJobs();

        DeferredRegister.grab(j => {
            console.log(j);
        }, REGISTER_PREFIX);

        jobs.forEach(job => {
            if (Date.now() < job.stopDate) return;
        });
    }, 500);

    static async startWorking(p, job_id) {
        let now = Date.now();
        let endTime = now + (1000 * 60);

        
    }
}

module.exports = Jobs;
