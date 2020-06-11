
const helperFunctions = {};

helperFunctions.paginateConetnt = async (model, page, limit, query) => {
    const searchQuery = query === undefined ? {} : query;
    page = parseInt(page);
    limit = parseInt(limit);

    try {
        const modelList = await model.find(searchQuery).sort({ endDate: -1 });
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedItems = modelList.slice(startIndex, endIndex);

        const response = {};

        response.items = paginatedItems;
        response.prev = startIndex > 1 ? page - 1 : undefined;
        response.next = modelList.length > page * limit ? page + 1 : undefined;

        return response;
    } catch (error) {
        return [];
    }
};

module.exports = helperFunctions;
