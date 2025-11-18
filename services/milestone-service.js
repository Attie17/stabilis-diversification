// Milestone Management Service
// Handles adding, editing, and deleting milestones in project data files

const fs = require('fs').promises;
const path = require('path');

class MilestoneService {
    constructor() {
        this.dataFiles = {
            diversification: path.join(__dirname, '../web/js/data.js'),
            turnaround: path.join(__dirname, '../web/js/turnaround-data.js'),
            wellness: path.join(__dirname, '../web/js/wellness-data.js')
        };
    }

    // Read project data file
    async readProjectData(project) {
        const filePath = this.dataFiles[project];
        if (!filePath) {
            throw new Error(`Unknown project: ${project}`);
        }

        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extract the data object using regex (since it's a JS file, not JSON)
        const dataMatch = content.match(/const\s+\w+Data\s*=\s*({[\s\S]+?});?\s*$/m);
        if (!dataMatch) {
            throw new Error('Could not parse project data');
        }

        // Use eval to parse the object (safe in this controlled context)
        const data = eval(`(${dataMatch[1]})`);
        return { data, originalContent: content };
    }

    // Write project data file
    async writeProjectData(project, data, originalContent) {
        const filePath = this.dataFiles[project];
        
        // Convert data back to JavaScript format
        const dataString = JSON.stringify(data, null, 4)
            .replace(/"(\w+)":/g, '$1:') // Remove quotes from keys
            .replace(/"/g, "'"); // Use single quotes
        
        // Replace the data in the original content
        const varName = project === 'diversification' ? 'projectData' :
                       project === 'turnaround' ? 'turnaroundData' :
                       'wellnessProject';
        
        const newContent = originalContent.replace(
            /const\s+\w+Data\s*=\s*{[\s\S]+?};?\s*$/m,
            `const ${varName} = ${dataString};`
        );
        
        await fs.writeFile(filePath, newContent, 'utf-8');
        console.log(`✅ Updated ${project} project data`);
    }

    // Add a new milestone to a phase
    async addMilestone(project, phaseId, milestone) {
        try {
            const { data, originalContent } = await this.readProjectData(project);
            
            // Find the phase
            const phase = data.phases.find(p => p.id === phaseId);
            if (!phase) {
                return {
                    success: false,
                    error: `Phase ${phaseId} not found in ${project} project`
                };
            }

            // Check if milestone ID already exists
            const exists = phase.milestones.some(m => m.id === milestone.id);
            if (exists) {
                return {
                    success: false,
                    error: `Milestone ${milestone.id} already exists in phase ${phaseId}`
                };
            }

            // Add default fields
            const newMilestone = {
                id: milestone.id,
                title: milestone.title,
                owner: milestone.owner,
                due: milestone.due,
                status: milestone.status || 'planned',
                description: milestone.description || ''
            };

            // Add milestone to phase
            phase.milestones.push(newMilestone);

            // Write back to file
            await this.writeProjectData(project, data, originalContent);

            return {
                success: true,
                milestone: newMilestone,
                message: `Added milestone ${milestone.id} to ${phaseId} in ${project} project`
            };
        } catch (error) {
            console.error('Error adding milestone:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Edit an existing milestone
    async editMilestone(project, milestoneId, updates) {
        try {
            const { data, originalContent } = await this.readProjectData(project);
            
            // Find the milestone across all phases
            let foundMilestone = null;
            let foundPhase = null;

            for (const phase of data.phases) {
                const milestone = phase.milestones.find(m => m.id === milestoneId);
                if (milestone) {
                    foundMilestone = milestone;
                    foundPhase = phase;
                    break;
                }
            }

            if (!foundMilestone) {
                return {
                    success: false,
                    error: `Milestone ${milestoneId} not found in ${project} project`
                };
            }

            // Apply updates
            const allowedFields = ['title', 'description', 'owner', 'due', 'status'];
            const appliedUpdates = {};

            for (const [key, value] of Object.entries(updates)) {
                if (allowedFields.includes(key)) {
                    foundMilestone[key] = value;
                    appliedUpdates[key] = value;
                }
            }

            // Write back to file
            await this.writeProjectData(project, data, originalContent);

            return {
                success: true,
                milestone: foundMilestone,
                updates: appliedUpdates,
                message: `Updated milestone ${milestoneId} in ${project} project`
            };
        } catch (error) {
            console.error('Error editing milestone:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Delete a milestone
    async deleteMilestone(project, milestoneId) {
        try {
            const { data, originalContent } = await this.readProjectData(project);
            
            // Find and remove the milestone
            let removed = false;
            let removedMilestone = null;
            let removedFromPhase = null;

            for (const phase of data.phases) {
                const index = phase.milestones.findIndex(m => m.id === milestoneId);
                if (index !== -1) {
                    removedMilestone = phase.milestones[index];
                    phase.milestones.splice(index, 1);
                    removedFromPhase = phase.id;
                    removed = true;
                    break;
                }
            }

            if (!removed) {
                return {
                    success: false,
                    error: `Milestone ${milestoneId} not found in ${project} project`
                };
            }

            // Write back to file
            await this.writeProjectData(project, data, originalContent);

            return {
                success: true,
                milestone: removedMilestone,
                phase: removedFromPhase,
                message: `Deleted milestone ${milestoneId} from ${removedFromPhase} in ${project} project`
            };
        } catch (error) {
            console.error('Error deleting milestone:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get all milestones from a project
    async getMilestones(project, phaseId = null) {
        try {
            const { data } = await this.readProjectData(project);
            
            if (phaseId) {
                const phase = data.phases.find(p => p.id === phaseId);
                return phase ? phase.milestones : [];
            }

            // Return all milestones from all phases
            return data.phases.flatMap(phase => 
                phase.milestones.map(m => ({ ...m, phase_id: phase.id }))
            );
        } catch (error) {
            console.error('Error getting milestones:', error);
            return [];
        }
    }
}

module.exports = MilestoneService;
