const getProductRecommendations = async (userId, productId) => {
    try {
        // Get user's purchase history
        const userOrders = await Order.find({ user: userId })
            .populate('items.product')
            .exec();

        // Get user's browsing history
        const userHistory = await BrowsingHistory.find({ user: userId })
            .populate('product')
            .exec();

        // Collect categories and tags from user's interactions
        const userInterests = new Set();
        [...userOrders, ...userHistory].forEach(interaction => {
            if (interaction.items) {
                interaction.items.forEach(item => {
                    if (item.product) {
                        userInterests.add(item.product.category);
                        item.product.tags?.forEach(tag => userInterests.add(tag));
                    }
                });
            } else if (interaction.product) {
                userInterests.add(interaction.product.category);
                interaction.product.tags?.forEach(tag => userInterests.add(tag));
            }
        });

        // Find similar products
        const recommendations = await Product.find({
            $and: [
                { _id: { $ne: productId } }, // Exclude current product
                {
                    $or: [
                        { category: { $in: Array.from(userInterests) } },
                        { tags: { $in: Array.from(userInterests) } }
                    ]
                }
            ]
        })
        .limit(10)
        .exec();

        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return [];
    }
};

module.exports = {
    getProductRecommendations
};
