/**
 * Advanced Thumbnail Templates
 * Extended template library for Michelle's Thumbnail Creator
 */

const advancedTemplates = {
    // Gaming Templates
    gaming: {
        fps: {
            name: 'FPS Gaming',
            background: 'gradient4',
            elements: [
                { type: 'text', text: 'INSANE', x: 640, y: 200, fontSize: 100, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'CLUTCH PLAY', x: 640, y: 320, fontSize: 80, font: 'Oswald', color: '#fbbf24', align: 'center' },
                { type: 'rect', x: 440, y: 400, width: 400, height: 4, color: '#fbbf24' },
                { type: 'text', text: 'Watch till the end!', x: 640, y: 480, fontSize: 30, font: 'Inter', color: '#ffffff', align: 'center' }
            ]
        },
        minecraft: {
            name: 'Minecraft',
            background: ['#10b981', '#059669'],
            elements: [
                { type: 'text', text: 'I BUILT', x: 640, y: 250, fontSize: 90, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'THE IMPOSSIBLE', x: 640, y: 380, fontSize: 70, font: 'Oswald', color: '#fbbf24', align: 'center' },
                { type: 'circle', x: 200, y: 500, radius: 100, color: 'rgba(16, 185, 129, 0.3)' }
            ]
        },
        reaction: {
            name: 'Gaming Reaction',
            background: ['#ef4444', '#dc2626'],
            elements: [
                { type: 'text', text: 'WAIT...', x: 640, y: 200, fontSize: 100, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'WHAT?!', x: 640, y: 350, fontSize: 120, font: 'Oswald', color: '#fbbf24', align: 'center' },
                { type: 'text', text: '(shocked)', x: 640, y: 500, fontSize: 40, font: 'Inter', color: '#ffffff', align: 'center' }
            ]
        }
    },

    // Business/Tech Templates
    business: {
        review: {
            name: 'Product Review',
            background: ['#3b82f6', '#1d4ed8'],
            elements: [
                { type: 'text', text: 'HONEST', x: 640, y: 200, fontSize: 80, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'REVIEW', x: 640, y: 320, fontSize: 100, font: 'Bebas Neue', color: '#fbbf24', align: 'center' },
                { type: 'rect', x: 540, y: 420, width: 200, height: 3, color: '#ffffff' },
                { type: 'text', text: 'Is it worth it?', x: 640, y: 480, fontSize: 28, font: 'Inter', color: '#bfdbfe', align: 'center' }
            ]
        },
        tutorial: {
            name: 'Tutorial',
            background: ['#8b5cf6', '#7c3aed'],
            elements: [
                { type: 'text', text: 'HOW TO', x: 640, y: 220, fontSize: 70, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'MASTER THIS', x: 640, y: 340, fontSize: 80, font: 'Bebas Neue', color: '#fbbf24', align: 'center' },
                { type: 'text', text: 'Step-by-step guide', x: 640, y: 450, fontSize: 26, font: 'Inter', color: '#ddd6fe', align: 'center' }
            ]
        },
        comparison: {
            name: 'Comparison',
            background: ['#0f172a', '#1e293b'],
            elements: [
                { type: 'rect', x: 0, y: 0, width: 640, height: 720, color: 'rgba(59, 130, 246, 0.2)' },
                { type: 'rect', x: 640, y: 0, width: 640, height: 720, color: 'rgba(239, 68, 68, 0.2)' },
                { type: 'text', text: 'OPTION A', x: 320, y: 360, fontSize: 50, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'OPTION B', x: 960, y: 360, fontSize: 50, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'VS', x: 640, y: 360, fontSize: 80, font: 'Bebas Neue', color: '#fbbf24', align: 'center' }
            ]
        }
    },

    // Lifestyle/Vlog Templates
    lifestyle: {
        vlog: {
            name: 'Daily Vlog',
            background: ['#f59e0b', '#d97706'],
            elements: [
                { type: 'text', text: 'A DAY IN', x: 640, y: 220, fontSize: 80, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'MY LIFE', x: 640, y: 350, fontSize: 100, font: 'Bebas Neue', color: '#fef3c7', align: 'center' },
                { type: 'circle', x: 1100, y: 150, radius: 60, color: 'rgba(255, 255, 255, 0.2)' }
            ]
        },
        challenge: {
            name: 'Challenge',
            background: ['#ec4899', '#db2777'],
            elements: [
                { type: 'text', text: 'I TRIED', x: 640, y: 200, fontSize: 70, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'FOR 30 DAYS', x: 640, y: 320, fontSize: 80, font: 'Bebas Neue', color: '#fbcfe8', align: 'center' },
                { type: 'text', text: 'Here\'s what happened', x: 640, y: 450, fontSize: 30, font: 'Inter', color: '#fce7f3', align: 'center' }
            ]
        },
        transformation: {
            name: 'Transformation',
            background: ['#10b981', '#059669'],
            elements: [
                { type: 'text', text: 'BEFORE', x: 320, y: 360, fontSize: 50, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'AFTER', x: 960, y: 360, fontSize: 50, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: '→', x: 640, y: 360, fontSize: 100, font: 'Inter', color: '#fbbf24', align: 'center' }
            ]
        }
    },

    // Educational Templates
    educational: {
        facts: {
            name: 'Amazing Facts',
            background: ['#6366f1', '#4f46e5'],
            elements: [
                { type: 'text', text: 'DID YOU', x: 640, y: 220, fontSize: 80, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'KNOW?', x: 640, y: 360, fontSize: 100, font: 'Bebas Neue', color: '#fbbf24', align: 'center' },
                { type: 'circle', x: 150, y: 150, radius: 80, color: 'rgba(255, 255, 255, 0.1)' },
                { type: 'circle', x: 1130, y: 570, radius: 100, color: 'rgba(255, 255, 255, 0.1)' }
            ]
        },
        explainer: {
            name: 'Explainer',
            background: ['#14b8a6', '#0d9488'],
            elements: [
                { type: 'text', text: 'THE TRUTH', x: 640, y: 220, fontSize: 80, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'ABOUT', x: 640, y: 340, fontSize: 60, font: 'Oswald', color: '#ccfbf1', align: 'center' },
                { type: 'text', text: '[TOPIC]', x: 640, y: 460, fontSize: 70, font: 'Oswald', color: '#fbbf24', align: 'center' }
            ]
        },
        list: {
            name: 'Top List',
            background: ['#f97316', '#ea580c'],
            elements: [
                { type: 'text', text: 'TOP 10', x: 640, y: 200, fontSize: 90, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'THAT WILL', x: 640, y: 320, fontSize: 60, font: 'Oswald', color: '#ffedd5', align: 'center' },
                { type: 'text', text: 'BLOW YOUR MIND', x: 640, y: 440, fontSize: 50, font: 'Oswald', color: '#fbbf24', align: 'center' }
            ]
        }
    },

    // News/Commentary Templates
    news: {
        breaking: {
            name: 'Breaking News',
            background: ['#dc2626', '#991b1b'],
            elements: [
                { type: 'rect', x: 0, y: 0, width: 1280, height: 100, color: '#dc2626' },
                { type: 'text', text: 'BREAKING', x: 640, y: 65, fontSize: 60, font: 'Bebas Neue', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'NEWS', x: 640, y: 300, fontSize: 100, font: 'Oswald', color: '#fecaca', align: 'center' },
                { type: 'text', text: 'You need to see this', x: 640, y: 480, fontSize: 35, font: 'Inter', color: '#ffffff', align: 'center' }
            ]
        },
        opinion: {
            name: 'Opinion/Hot Take',
            background: ['#0f172a', '#1e293b'],
            elements: [
                { type: 'text', text: 'UNPOPULAR', x: 640, y: 220, fontSize: 70, font: 'Oswald', color: '#ffffff', align: 'center' },
                { type: 'text', text: 'OPINION', x: 640, y: 350, fontSize: 90, font: 'Bebas Neue', color: '#fbbf24', align: 'center' },
                { type: 'text', text: '(controversial)', x: 640, y: 480, fontSize: 28, font: 'Inter', color: '#94a3b8', align: 'center' }
            ]
        }
    }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = advancedTemplates;
}