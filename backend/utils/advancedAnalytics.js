const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

class AdvancedAnalytics {
    async generateFullReport(startDate, endDate) {
        try {
            const [
                salesMetrics,
                customerMetrics,
                productMetrics,
                performanceMetrics
            ] = await Promise.all([
                this.getSalesMetrics(startDate, endDate),
                this.getCustomerMetrics(startDate, endDate),
                this.getProductMetrics(startDate, endDate),
                this.getPerformanceMetrics(startDate, endDate)
            ]);

            return {
                salesMetrics,
                customerMetrics,
                productMetrics,
                performanceMetrics,
                generatedAt: new Date()
            };
        } catch (error) {
            console.error('Report generation error:', error);
            throw error;
        }
    }

    async getSalesMetrics(startDate, endDate) {
        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    maxOrderValue: { $max: '$totalAmount' },
                    minOrderValue: { $min: '$totalAmount' }
                }
            }
        ]);

        const salesByCategory = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $group: {
                    _id: '$product.category',
                    totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    totalItems: { $sum: '$items.quantity' }
                }
            }
        ]);

        return {
            overview: salesData[0],
            byCategory: salesByCategory
        };
    }

    async getCustomerMetrics(startDate, endDate) {
        const newCustomers = await User.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const customerRetention = await this.calculateCustomerRetention(startDate, endDate);
        const customerSegmentation = await this.segmentCustomers(startDate, endDate);

        return {
            newCustomers,
            customerRetention,
            customerSegmentation
        };
    }

    async calculateCustomerRetention(startDate, endDate) {
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate - startDate) / (1000 * 60 * 60 * 24));

        const [previousCustomers, repeatCustomers] = await Promise.all([
            Order.distinct('user', { createdAt: { $gte: previousPeriodStart, $lt: startDate } }),
            Order.distinct('user', { 
                createdAt: { $gte: startDate, $lte: endDate },
                user: { $in: await Order.distinct('user', { createdAt: { $gte: previousPeriodStart, $lt: startDate } }) }
            })
        ]);

        return {
            retentionRate: previousCustomers.length ? (repeatCustomers.length / previousCustomers.length) * 100 : 0,
            previousCustomers: previousCustomers.length,
            repeatCustomers: repeatCustomers.length
        };
    }

    async segmentCustomers(startDate, endDate) {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            },
            {
                $project: {
                    segment: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$totalSpent', 10000] }, then: 'VIP' },
                                { case: { $gte: ['$totalSpent', 5000] }, then: 'Premium' },
                                { case: { $gte: ['$totalSpent', 1000] }, then: 'Regular' }
                            ],
                            default: 'New'
                        }
                    },
                    totalSpent: 1,
                    orderCount: 1,
                    averageOrderValue: 1
                }
            },
            {
                $group: {
                    _id: '$segment',
                    customerCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalSpent' },
                    averageSpend: { $avg: '$totalSpent' }
                }
            }
        ]);
    }

    async getProductMetrics(startDate, endDate) {
        const productPerformance = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $project: {
                    name: '$product.name',
                    category: '$product.category',
                    totalSold: 1,
                    revenue: 1,
                    orderCount: 1,
                    averageOrderSize: { $divide: ['$totalSold', '$orderCount'] }
                }
            },
            {
                $sort: { revenue: -1 }
            }
        ]);

        return {
            topProducts: productPerformance.slice(0, 10),
            productPerformance
        };
    }

    async getPerformanceMetrics(startDate, endDate) {
        const orderProcessingTime = await this.calculateOrderProcessingTime(startDate, endDate);
        const stockouts = await this.getStockoutMetrics(startDate, endDate);
        
        return {
            orderProcessingTime,
            stockouts
        };
    }

    async calculateOrderProcessingTime(startDate, endDate) {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: 'COMPLETED'
                }
            },
            {
                $project: {
                    processingTime: {
                        $divide: [
                            { $subtract: ['$deliveredAt', '$createdAt'] },
                            1000 * 60 // Convert to minutes
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    averageTime: { $avg: '$processingTime' },
                    maxTime: { $max: '$processingTime' },
                    minTime: { $min: '$processingTime' }
                }
            }
        ]);
    }

    async getStockoutMetrics(startDate, endDate) {
        return await Product.aggregate([
            {
                $match: {
                    stock: 0
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
    }
}

module.exports = new AdvancedAnalytics();
