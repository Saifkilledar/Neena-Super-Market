const paginateResults = async (model, query = {}, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = '',
        select = ''
    } = options;

    try {
        const skip = (page - 1) * limit;
        
        // Get total count for pagination info
        const totalDocs = await model.countDocuments(query);
        
        // Get paginated data
        const data = await model.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(populate)
            .select(select);
        
        // Calculate pagination info
        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            data,
            pagination: {
                total: totalDocs,
                page: parseInt(page),
                totalPages,
                hasNextPage,
                hasPrevPage,
                limit: parseInt(limit)
            }
        };
    } catch (error) {
        console.error('Pagination error:', error);
        throw error;
    }
};

module.exports = { paginateResults };
