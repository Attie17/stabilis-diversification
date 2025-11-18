// Change Detection Service - File Monitoring (Priority #3)
// Watches data files for changes and logs diffs

require('dotenv').config();
const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const { diffLines } = require('diff');

class ChangeDetectionService {
    constructor(supabase = null) {
        this.supabase = supabase;
        this.changes = []; // In-memory storage
        this.fileContents = new Map(); // Cache previous file states
        this.watcher = null;
    }

    // Files to watch
    getWatchPatterns() {
        return [
            'web/js/data.js',
            'web/js/turnaround-data.js',
            'web/js/wellness-data.js',
            'web/js/**/*.js',
            'phases/**/*.md',
            'tracking/**/*.md',
            'docs/**/*.md',
            '*.md'
        ];
    }

    // Start watching files
    async start() {
        console.log('👁️  Starting Change Detection Service...\n');

        const watchPatterns = this.getWatchPatterns().map(p => path.join(__dirname, '..', p));

        // Initialize file contents cache
        for (const pattern of this.getWatchPatterns()) {
            const fullPath = path.join(__dirname, '..', pattern);
            if (!pattern.includes('*')) {
                try {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    this.fileContents.set(fullPath, content);
                } catch (error) {
                    // File might not exist yet
                }
            }
        }

        this.watcher = chokidar.watch(watchPatterns, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            }
        });

        this.watcher
            .on('add', path => this.handleFileAdded(path))
            .on('change', path => this.handleFileChanged(path))
            .on('unlink', path => this.handleFileDeleted(path));

        console.log('✅ Watching files:');
        this.getWatchPatterns().forEach(p => console.log(`   - ${p}`));
        console.log('\n⏳ Waiting for changes...\n');

        return this.watcher;
    }

    // Stop watching
    async stop() {
        if (this.watcher) {
            await this.watcher.close();
            console.log('🛑 Change detection stopped');
        }
    }

    // Handle new file
    async handleFileAdded(filePath) {
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);
        console.log(`\n📄 File Added: ${relativePath}`);

        const change = {
            type: 'added',
            file_path: relativePath,
            timestamp: new Date().toISOString(),
            details: {
                size: (await fs.stat(filePath)).size
            }
        };

        await this.logChange(change);

        // Cache content for future diffs
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            this.fileContents.set(filePath, content);
        } catch (error) {
            console.error(`   ❌ Error caching file: ${error.message}`);
        }
    }

    // Handle file change
    async handleFileChanged(filePath) {
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);
        console.log(`\n✏️  File Changed: ${relativePath}`);

        try {
            const newContent = await fs.readFile(filePath, 'utf-8');
            const oldContent = this.fileContents.get(filePath) || '';

            // Calculate diff
            const diff = diffLines(oldContent, newContent);
            const additions = diff.filter(d => d.added).reduce((sum, d) => sum + d.count, 0);
            const deletions = diff.filter(d => d.removed).reduce((sum, d) => sum + d.count, 0);

            console.log(`   +${additions} lines added, -${deletions} lines removed`);

            // Detect milestone changes in data files
            const milestoneChanges = this.detectMilestoneChanges(filePath, oldContent, newContent);
            if (milestoneChanges.length > 0) {
                console.log(`   🎯 Milestone Changes Detected:`);
                milestoneChanges.forEach(mc => {
                    console.log(`      - ${mc.milestone_id}: ${mc.change_type}`);
                });
            }

            const change = {
                type: 'modified',
                file_path: relativePath,
                timestamp: new Date().toISOString(),
                details: {
                    additions,
                    deletions,
                    milestone_changes: milestoneChanges,
                    diff_summary: this.summarizeDiff(diff)
                }
            };

            await this.logChange(change);

            // Update cache
            this.fileContents.set(filePath, newContent);
        } catch (error) {
            console.error(`   ❌ Error processing change: ${error.message}`);
        }
    }

    // Handle file deletion
    async handleFileDeleted(filePath) {
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);
        console.log(`\n🗑️  File Deleted: ${relativePath}`);

        const change = {
            type: 'deleted',
            file_path: relativePath,
            timestamp: new Date().toISOString()
        };

        await this.logChange(change);

        // Remove from cache
        this.fileContents.delete(filePath);
    }

    // Detect milestone-specific changes in data files
    detectMilestoneChanges(filePath, oldContent, newContent) {
        if (!filePath.includes('data.js') && !filePath.includes('turnaround-data.js') && !filePath.includes('wellness-data.js')) {
            return [];
        }

        const changes = [];

        // Simple pattern matching for milestone changes
        const milestoneIdPattern = /id:\s*['"]([^'"]+)['"]/g;
        const statusPattern = /status:\s*['"]([^'"]+)['"]/g;

        // Extract milestone IDs
        const oldIds = [...oldContent.matchAll(milestoneIdPattern)].map(m => m[1]);
        const newIds = [...newContent.matchAll(milestoneIdPattern)].map(m => m[1]);

        // New milestones
        newIds.forEach(id => {
            if (!oldIds.includes(id)) {
                changes.push({
                    milestone_id: id,
                    change_type: 'created'
                });
            }
        });

        // Deleted milestones
        oldIds.forEach(id => {
            if (!newIds.includes(id)) {
                changes.push({
                    milestone_id: id,
                    change_type: 'deleted'
                });
            }
        });

        // Status changes (simplified - would need more sophisticated parsing)
        if (oldContent !== newContent && changes.length === 0) {
            // If no creation/deletion but content changed, assume status/details update
            const commonIds = oldIds.filter(id => newIds.includes(id));
            if (commonIds.length > 0) {
                changes.push({
                    milestone_id: 'multiple',
                    change_type: 'updated'
                });
            }
        }

        return changes;
    }

    // Summarize diff for storage
    summarizeDiff(diff) {
        const summary = [];
        diff.forEach((part, index) => {
            if (part.added) {
                summary.push({ type: 'added', lines: part.count, preview: part.value.substring(0, 100) });
            } else if (part.removed) {
                summary.push({ type: 'removed', lines: part.count, preview: part.value.substring(0, 100) });
            }
        });
        return summary.slice(0, 10); // Keep only first 10 changes
    }

    // Log change to database or memory
    async logChange(change) {
        if (this.supabase) {
            const { error } = await this.supabase
                .from('change_log')
                .insert(change);

            if (error) {
                console.error('   ❌ Error saving to database:', error);
                this.changes.push(change); // Fallback
            }
        } else {
            this.changes.push(change);
        }
    }

    // Get recent changes
    async getRecentChanges(limit = 50) {
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('change_log')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(limit);

            return data || this.changes.slice(-limit);
        }

        return this.changes.slice(-limit).reverse();
    }

    // Get changes by file
    async getChangesByFile(filePath) {
        const changes = await this.getRecentChanges(1000);
        return changes.filter(c => c.file_path === filePath);
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const changeService = new ChangeDetectionService();
        await changeService.start();

        // Keep running
        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Shutting down...');
            await changeService.stop();
            process.exit(0);
        });
    })();
}

module.exports = ChangeDetectionService;
