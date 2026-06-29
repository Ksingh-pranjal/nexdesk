const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: [
                'incident',
                'service_request',
                'change_request',
                'project_implementation',
                'preventive_maintenance',
                'site_survey',
                'sdm_activity'
            ],
            required: true
        },
        issueType: {
            type: String,
            enum: [
                'hardware_issue',
                'software_issue',
                'network_issue',
                'database_issue',
                'project_related',
                'user_access',
                'configuration',
                'other'
            ],
            default: 'other'
        },

        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open'
        },
        priority: {
            type: String,
            enum: ['critical', 'major', 'minor'],
            default: null
        },
        supportMode: {
            type: String,
            enum: ['physical', 'remote'],
            default: 'remote'
        },
        technologyArea: {
            type: String,
            enum: [
                'resilient_connectivity',
                'transformed_infrastructure',
                'zero_trust_security',
                'business_aligned_applications'
            ],
            default: null
        },
        team: {
            type: String,
            enum: [
                'TSE - resilient_connectivity',
                'TSE - transformed_infrastructure',
                'TSE - zero_trust_security',
                'TSE - business_aligned_applications',
                'TSME - resilient_connectivity',
                'TSME - transformed_infrastructure',
                'TSME - zero_trust_security',
                'TSME - business_aligned_applications',
                'Service Desk'
            ],
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        satisfactionComment: {
            type: String,
            default: ''
        },
        jobCard: {
            item: { type: String, default: '' },           // e.g. "CPM"
            makeModel: { type: String, default: '' },      // e.g. "DF70"
            serialNumber: { type: String, default: '' },   // e.g. "DF70N00368"
            assetNumber: { type: String, default: '' },
            installDate: { type: Date, default: null },
            technicianFindings: { type: String, default: '' }, // engineer fills after job
            workDate: { type: Date, default: null },
            arrivalTime: { type: String, default: '' },    // stored as "HH:MM" string
            finishTime: { type: String, default: '' },
            travelTime: { type: String, default: '' }
        },
        slaStartTime: {
            type: Date,
            default: Date.now
        },

        slaDueTime: {
            type: Date,
            default: null
        },

        slapaused: {
            type: Boolean,
            default: false
        },

        slaPausedAt: {
            type: Date,
            default: null
        },
        totalPausedTime: {
            type: Number,
            default: 0
        },

        slaPauseReason: {
            type: String,
            enum: ['rma', 'waiting_for_client', 'client_dependency', null],
            default: null
        },

        slaBreach: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true 
    }
);

ticketSchema.pre('save', function () {
    if(this.type === 'incident' && !this.priority){
        throw new Error('Priority is required for incident tickets');
    }
    if(this.type !== 'incident'){
        this.priority = null;
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);