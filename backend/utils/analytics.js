const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

class AnalyticsManager {
    async getDashboardStats(dateRange = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);

        try {
            const [
                totalOrders,
                totalRevenue,
                totalCustomers,
                topProducts,
                salesByDay
            ] = await Promise.all([
                this.getTotalOrders(startDate),
                this.getTotalRevenue(startDate),
                this.getTotalCustomers(startDate),
                this.getTopProducts(startDate),
                this.getSalesByDay(startDate)
            ]);

            return {
                totalOrders,
                totalRevenue,
                totalCustomers,
                topProducts,
                salesByDay
            };
        } catch (error) {
            console.error('Analytics error:', error);
            throw error;
        }
    }

    async getTotalOrders(startDate) {
        return await Order.countDocuments({
            createdAt: { $gte: startDate }
        });
    }

    async getTotalRevenue(startDate) {
        const result = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: 'COMPLETED'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        return result[0]?.total || 0;
    }

    async getTotalCustomers(startDate) {
        return await User.countDocuments({
            createdAt: { $gte: startDate }
        });
    }

    async getTopProducts(startDate) {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
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
                    totalSold: 1,
                    revenue: 1
                }
            },
            {
                $sort: { revenue: -1 }
            },
            {
                $limit: 5
            }
        ]);
    }

    async getSalesByDay(startDate) {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    sales: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);
    }

    async generateCustomReport(options) {
        const {
            startDate,
            endDate,
            metrics = ['sales', 'orders', 'customers'],
            groupBy = 'day'
        } = options;

        const matchStage = {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        };

        const groupByFormat = {
            day: '%Y-%m-%d',
            week: '%Y-W%V',
            month: '%Y-%m'
        };

        const groupStage = {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: groupByFormat[groupBy],
                            date: '$createdAt'
                        }
                    }
                },
                sales: { $sum: '$totalAmount' },
                orders: { $sum: 1 }
            }
        };

        const result = await Order.aggregate([
            matchStage,
            groupStage,
            { $sort: { '_id.date': 1 } }
        ]);

        return result;
    }
}

module.exports = new AnalyticsManager();
