class LoyaltyProgram {
    constructor() {
        this.pointsMultiplier = 10; // Points per rupee spent
        this.tiers = {
            BRONZE: { min: 0, discount: 0 },
            SILVER: { min: 1000, discount: 5 },
            GOLD: { min: 5000, discount: 10 },
            PLATINUM: { min: 10000, discount: 15 }
        };
    }

    calculatePoints(orderAmount) {
        return Math.floor(orderAmount * this.pointsMultiplier);
    }

    getTier(points) {
        if (points >= this.tiers.PLATINUM.min) return 'PLATINUM';
        if (points >= this.tiers.GOLD.min) return 'GOLD';
        if (points >= this.tiers.SILVER.min) return 'SILVER';
        return 'BRONZE';
    }

    getDiscountPercentage(points) {
        const tier = this.getTier(points);
        return this.tiers[tier].discount;
    }

    calculateDiscount(orderAmount, points) {
        const discountPercentage = this.getDiscountPercentage(points);
        return (orderAmount * discountPercentage) / 100;
    }

    async processOrder(user, orderAmount) {
        const pointsEarned = this.calculatePoints(orderAmount);
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
        
        const newTier = this.getTier(user.loyaltyPoints);
        const tierChanged = user.loyaltyTier !== newTier;
        user.loyaltyTier = newTier;

        await user.save();

        return {
            pointsEarned,
            totalPoints: user.loyaltyPoints,
            currentTier: newTier,
            tierChanged
        };
    }

    generateReferralCode(userId) {
        const prefix = 'NEENA';
        const userPart = userId.substring(0, 6);
        const timestamp = Date.now().toString(36);
        return `${prefix}-${userPart}-${timestamp}`;
    }

    async processReferral(referringUser, newUser) {
        const referralPoints = 500;
        referringUser.loyaltyPoints += referralPoints;
        await referringUser.save();

        return {
            referralPoints,
            totalPoints: referringUser.loyaltyPoints
        };
    }
}

module.exports = new LoyaltyProgram();
