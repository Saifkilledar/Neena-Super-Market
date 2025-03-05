const crypto = require('crypto');

class PaymentProcessor {
    constructor() {
        this.supportedMethods = ['COD', 'BANK_TRANSFER', 'UPI'];
        this.supportedCurrencies = ['INR', 'USD', 'EUR'];
    }

    async processPayment(orderDetails) {
        const { amount, currency, method, details } = orderDetails;

        if (!this.supportedMethods.includes(method)) {
            throw new Error('Unsupported payment method');
        }

        if (!this.supportedCurrencies.includes(currency)) {
            throw new Error('Unsupported currency');
        }

        // Generate unique transaction ID
        const transactionId = crypto.randomBytes(16).toString('hex');

        // Simulate payment processing
        const paymentResult = await this._processPaymentMethod(method, amount, details);

        return {
            success: paymentResult.success,
            transactionId,
            timestamp: new Date(),
            details: paymentResult.details
        };
    }

    async _processPaymentMethod(method, amount, details) {
        switch (method) {
            case 'COD':
                return {
                    success: true,
                    details: {
                        method: 'COD',
                        amount,
                        status: 'PENDING_DELIVERY'
                    }
                };

            case 'BANK_TRANSFER':
                return {
                    success: true,
                    details: {
                        method: 'BANK_TRANSFER',
                        amount,
                        bankRef: crypto.randomBytes(8).toString('hex'),
                        status: 'PENDING_VERIFICATION'
                    }
                };

            case 'UPI':
                return {
                    success: true,
                    details: {
                        method: 'UPI',
                        amount,
                        upiRef: crypto.randomBytes(12).toString('hex'),
                        status: 'PENDING_CONFIRMATION'
                    }
                };

            default:
                throw new Error('Invalid payment method');
        }
    }

    calculateTotalWithTax(amount, taxRate = 0.18) {
        const tax = amount * taxRate;
        return {
            subtotal: amount,
            tax,
            total: amount + tax
        };
    }

    generateInvoice(paymentDetails) {
        return {
            invoiceNumber: `INV-${Date.now()}`,
            date: new Date(),
            ...paymentDetails,
            status: 'GENERATED'
        };
    }
}

module.exports = new PaymentProcessor();
