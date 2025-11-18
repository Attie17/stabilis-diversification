// External Research Service - Tavily Web Search Integration
// Priority #5: Search web for business intelligence, competitor analysis, industry trends

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class ExternalResearchService {
    constructor() {
        this.apiKey = process.env.TAVILY_API_KEY;
        this.cacheDir = path.join(__dirname, '../cache/research');
        this.cacheEnabled = true;
    }

    // Search web with Tavily
    async search(query, options = {}) {
        const {
            max_results = 5,
            search_depth = 'basic',
            include_answer = true,
            include_raw_content = false
        } = options;

        console.log(`🔍 Searching web: "${query}"`);

        // Check cache first
        if (this.cacheEnabled) {
            const cached = await this.getFromCache(query);
            if (cached) {
                console.log('   ✅ Using cached result');
                return cached;
            }
        }

        try {
            // Tavily API search
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    query,
                    max_results,
                    search_depth,
                    include_answer,
                    include_raw_content
                })
            });

            if (!response.ok) {
                throw new Error(`Tavily API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Format results
            const results = {
                query,
                answer: data.answer || null,
                sources: data.results ? data.results.map(r => ({
                    title: r.title,
                    url: r.url,
                    content: r.content,
                    score: r.score,
                    published_date: r.published_date
                })) : [],
                searched_at: new Date().toISOString()
            };

            // Cache result
            if (this.cacheEnabled) {
                await this.saveToCache(query, results);
            }

            console.log(`   ✅ Found ${results.sources.length} sources`);
            return results;
        } catch (error) {
            console.error(`   ❌ Search error: ${error.message}`);
            return {
                query,
                error: error.message,
                sources: []
            };
        }
    }

    // Competitor analysis
    async analyzeCompetitor(companyName) {
        const query = `${companyName} business model revenue products services market position analysis`;
        
        const results = await this.search(query, {
            max_results: 10,
            search_depth: 'advanced',
            include_answer: true
        });

        return {
            company: companyName,
            summary: results.answer,
            sources: results.sources,
            analyzed_at: new Date().toISOString()
        };
    }

    // Industry trends
    async getIndustryTrends(industry) {
        const query = `${industry} industry trends 2024 2025 market analysis future outlook`;
        
        const results = await this.search(query, {
            max_results: 10,
            search_depth: 'advanced',
            include_answer: true
        });

        return {
            industry,
            trends: results.answer,
            sources: results.sources,
            analyzed_at: new Date().toISOString()
        };
    }

    // Business intelligence
    async getBusinessIntelligence(topic) {
        const query = `${topic} business intelligence market data statistics report`;
        
        const results = await this.search(query, {
            max_results: 7,
            search_depth: 'basic',
            include_answer: true
        });

        return {
            topic,
            intelligence: results.answer,
            sources: results.sources,
            analyzed_at: new Date().toISOString()
        };
    }

    // Cache management
    async getFromCache(query) {
        try {
            const filename = this.getCacheFilename(query);
            const content = await fs.readFile(filename, 'utf-8');
            const cached = JSON.parse(content);

            // Check if cache is fresh (24 hours)
            const age = Date.now() - new Date(cached.searched_at).getTime();
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (age < maxAge) {
                return cached;
            }

            // Cache expired
            await fs.unlink(filename).catch(() => {});
            return null;
        } catch (error) {
            return null;
        }
    }

    async saveToCache(query, results) {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
            const filename = this.getCacheFilename(query);
            await fs.writeFile(filename, JSON.stringify(results, null, 2));
        } catch (error) {
            console.error('Cache save error:', error.message);
        }
    }

    getCacheFilename(query) {
        // Create safe filename from query
        const safe = query
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 100);
        return path.join(this.cacheDir, `${safe}.json`);
    }

    // Clear cache
    async clearCache() {
        try {
            const files = await fs.readdir(this.cacheDir);
            await Promise.all(
                files.map(file => fs.unlink(path.join(this.cacheDir, file)))
            );
            console.log(`✅ Cleared ${files.length} cached searches`);
        } catch (error) {
            console.log('No cache to clear');
        }
    }
}

// Test if run directly
if (require.main === module) {
    (async () => {
        const research = new ExternalResearchService();

        console.log('\n🔍 Testing External Research Service...\n');

        // Test 1: Basic search
        const search1 = await research.search('corporate turnaround strategies 2024');
        console.log('\n📊 Search Result:', search1.answer?.substring(0, 200), '...\n');

        // Test 2: Industry trends
        const trends = await research.getIndustryTrends('wellness programmes corporate');
        console.log('\n📈 Industry Trends:', trends.trends?.substring(0, 200), '...\n');

        // Test 3: Cached search (should be instant)
        console.log('Testing cache...');
        const search2 = await research.search('corporate turnaround strategies 2024');
        console.log('Cache working:', search1.searched_at === search2.searched_at ? 'YES' : 'NO');
    })();
}

module.exports = ExternalResearchService;
