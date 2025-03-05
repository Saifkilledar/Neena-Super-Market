const Product = require('../models/product');
const Order = require('../models/order');

class InventoryManager {
    async updateStock(productId, quantity, operation = 'decrease') {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const newQuantity = operation === 'decrease' 
                ? product.stock - quantity
                : product.stock + quantity;

            if (newQuantity < 0) {
                throw new Error('Insufficient stock');
            }

            product.stock = newQuantity;
            if (newQuantity <= product.lowStockThreshold) {
                this.notifyLowStock(product);
            }

            await product.save();
            return product;
        } catch (error) {
            console.error('Stock update error:', error);
            throw error;
        }
    }

    async notifyLowStock(product) {
        // In a real implementation, this would send notifications
        console.log(`Low stock alert for ${product.name}: ${product.stock} units remaining`);
    }

    async generateStockReport() {
        try {
            const products = await Product.find({});
            return products.map(product => ({
                id: product._id,
                name: product.name,
                currentStock: product.stock,
                lowStockThreshold: product.lowStockThreshold,
                status: this.getStockStatus(product)
            }));
        } catch (error) {
            console.error('Stock report generation error:', error);
            throw error;
        }
    }

    getStockStatus(product) {
        if (product.stock === 0) return 'OUT_OF_STOCK';
        if (product.stock <= product.lowStockThreshold) return 'LOW_STOCK';
        return 'IN_STOCK';
    }

    async predictReorderPoint(productId) {
        try {
            // Get last month's orders
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const orders = await Order.find({
                'items.product': productId,
                createdAt: { $gte: lastMonth }
            });

            // Calculate average daily sales
            let totalSold = 0;
            orders.forEach(order => {
                const productOrder = order.items.find(item => 
                    item.product.toString() === productId.toString()
                );
                if (productOrder) {
                    totalSold += productOrder.quantity;
                }
            });

            const averageDailySales = totalSold / 30; // Assuming 30 days
            const reorderPoint = Math.ceil(averageDailySales * 7); // 7 days safety stock

            return {
                averageDailySales,
                recommendedReorderPoint: reorderPoint
            };
        } catch (error) {
            console.error('Reorder point calculation error:', error);
            throw error;
        }
    }
}

module.exports = new InventoryManager();
