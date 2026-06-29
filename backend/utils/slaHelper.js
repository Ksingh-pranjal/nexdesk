const SLA_DURATIONS = {
    incident: {
        critical: 4*60*60*1000,
        major: 8*60*60*1000,
        minor: 10*60*60*1000
    },
    service_request: 8*60*60*1000,
    change_request: 8*60*60*1000,
    project_implementation: null,
    preventive_maintenance: null,
    site_survey: null,
    sdm_activity: null
};

const calculateSLADueTime = (type, priority) => {
    const duration = SLA_DURATIONS[type];
    if(!duration) return null;
    const ms= typeof duration === 'object'
        ? duration[priority]                            //incident -> priority based, service, change -> flat 
        : duration;

        if (!ms) return null;
        return new Date(Date.now() + ms);
};

const getRemainingTime = (ticket) => {
    if(!ticket.slaDueTime){
        return { timeLeft: null, isBreached: false, hasSLA: false };
    }

    const now = Date.now();
    const currentPauseTime = ticket.slapaused
        ? now - ticket.slaPausedAt.getTime()
        : 0;

    const effectiveNow = now - ticket.totalPausedTime - currentPauseTime;
    const timeLeft = ticket.slaDueTime.getTime() - effectiveNow;

    return {
        hasSLA: true,
        timeLeft,
        isBreached: timeLeft <= 0
    };
};

module.exports = { calculateSLADueTime, getRemainingTime };