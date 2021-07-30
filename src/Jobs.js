const { Database } = require('./Database');
const DeferredRegister = require('./DeferredRegister');
const Job = require('./Job');

const REGISTER_PREFIX = 'job';

class Jobs {
    static jobs = new DeferredRegister(REGISTER_PREFIX);

    static registerJobs() {
        this.jobsList = require('./jobs.json');
        for (let j in this.jobsList) {
            let job = new Job(j, this.jobsList[j]);
            this.jobs.register(j, job);
        }
    }

    static getJobList() {
        return this.jobsList;
    }

    static workInterval = setInterval(async () => {
        let jobs = await Database.getAllJobs();

        DeferredRegister.grab(r => {
            let jid = r[0]
            let j = r[1];
        }, REGISTER_PREFIX);

        jobs.forEach(job => {
            if (Date.now() < job.stopDate) return;
        });
    }, 500);

    static async startWorking(user, job_id) {
        let now = Date.now();
        let endTime = now + (1000 * 60);

        let dJob = Database.createJob({
            job_id: job_id,
            user_id: user._id,
            stopDate: endTime
        });

        dJob.job_id = job_id;
        dJob.user_id = user_id;
        dJob.stopDate = endTime;

        dJob.save();
    }
}

module.exports = Jobs;
