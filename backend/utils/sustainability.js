class SustainabilityTracker {
    constructor() {
        this.packagingEmissions = {
            PAPER: 0.5,      // kg CO2 per kg
            PLASTIC: 2.5,    // kg CO2 per kg
            CARDBOARD: 0.8,  // kg CO2 per kg
            ECO_FRIENDLY: 0.3 // kg CO2 per kg
        };

        this.transportEmissions = {
            BIKE: 0.08,      // kg CO2 per km
            SCOOTER: 0.12,   // kg CO2 per km
            CAR: 0.2,        // kg CO2 per km
            VAN: 0.25        // kg CO2 per km
        };
    }

    calculateOrderEmissions(order) {
        const packagingEmissions = this.calculatePackagingEmissions(order);
        const deliveryEmissions = this.calculateDeliveryEmissions(order);
        
        return {
            packaging: packagingEmissions,
            delivery: deliveryEmissions,
            total: packagingEmissions + deliveryEmissions
        };
    }

    calculatePackagingEmissions(order) {
        const { packagingType, packagingWeight } = order;
        return this.packagingEmissions[packagingType] * packagingWeight;
    }

    calculateDeliveryEmissions(order) {
        const { deliveryMethod, distance } = order;
        return this.transportEmissions[deliveryMethod] * distance;
    }

    generateSustainabilityReport(orders) {
        let totalEmissions = 0;
        let packagingByType = {};
        let deliveryByMethod = {};

        orders.forEach(order => {
            const emissions = this.calculateOrderEmissions(order);
            totalEmissions += emissions.total;

            // Track packaging usage
            packagingByType[order.packagingType] = (packagingByType[order.packagingType] || 0) + 1;

            // Track delivery methods
            deliveryByMethod[order.deliveryMethod] = (deliveryByMethod[order.deliveryMethod] || 0) + 1;
        });

        return {
            totalEmissions,
            packagingStats: packagingByType,
            deliveryStats: deliveryByMethod,
            treesNeeded: this.calculateTreesNeeded(totalEmissions),
            recommendations: this.generateRecommendations(packagingByType, deliveryByMethod)
        };
    }

    calculateTreesNeeded(emissions) {
        // Average tree absorbs 22kg CO2 per year
        return Math.ceil(emissions / 22);
    }

    generateRecommendations(packagingStats, deliveryStats) {
        const recommendations = [];

        // Analyze packaging usage
        if (packagingStats.PLASTIC > packagingStats.ECO_FRIENDLY) {
            recommendations.push('Consider switching to more eco-friendly packaging options');
        }

        // Analyze delivery methods
        const totalDeliveries = Object.values(deliveryStats).reduce((a, b) => a + b, 0);
        if (deliveryStats.VAN > totalDeliveries * 0.5) {
            recommendations.push('Consider using more bikes/scooters for short-distance deliveries');
        }

        return recommendations;
    }

    calculateEcoScore(order) {
        const emissions = this.calculateOrderEmissions(order);
        const baseScore = 100;
        const emissionsPenalty = emissions.total * 2; // 2 points per kg of CO2
        
        let score = baseScore - emissionsPenalty;
        
        // Bonus points for eco-friendly choices
        if (order.packagingType === 'ECO_FRIENDLY') score += 10;
        if (order.deliveryMethod === 'BIKE') score += 10;
        
        return Math.max(0, Math.min(100, score)); // Keep score between 0 and 100
    }
}

module.exports = new SustainabilityTracker();
