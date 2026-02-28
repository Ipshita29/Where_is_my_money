/**
 * Categorizes a merchant based on predefined rules/keywords.
 * @param {string} merchant - The merchant name or description.
 * @returns {string} - The assigned category.
 */
exports.categorizeMerchant = (merchant) => {
    if (!merchant) return 'Other';

    const m = merchant.toLowerCase();

    // Food
    if (m.includes('swiggy') || m.includes('zomato') || m.includes('dominos') ||
        m.includes('pizza') || m.includes('cafe') || m.includes('restaurant') ||
        m.includes('starbucks')) {
        return 'Food';
    }

    // Transport
    if (m.includes('uber') || m.includes('ola') || m.includes('metro') ||
        m.includes('irctc') || m.includes('rapido') || m.includes('petrol') ||
        m.includes('shell')) {
        return 'Transport';
    }

    // Shopping
    if (m.includes('amazon') || m.includes('flipkart') || m.includes('myntra') ||
        m.includes('ajio') || m.includes('blinkit') || m.includes('zepto') ||
        m.includes('grocery')) {
        return 'Shopping';
    }

    // Entertainment
    if (m.includes('netflix') || m.includes('spotify') || m.includes('youtube') ||
        m.includes('prime video') || m.includes('hotstar') || m.includes('bookmyshow') ||
        m.includes('pvr')) {
        return 'Entertainment';
    }

    // UPI/Transfers
    if (m.includes('upi/') || m.includes('upi-') || m.includes('@oksbi') ||
        m.includes('@ybl') || m.includes('@paytm') || m.includes('transfer')) {
        return 'UPI';
    }

    return 'Other';
};
