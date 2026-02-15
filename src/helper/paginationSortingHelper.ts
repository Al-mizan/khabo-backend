type iOptions = {
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

type iOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

const sortableFields = [
    'created_at',
    'price',
    'name',
    'updated_at',
    'rating_avg',
] as const;

type SortField = typeof sortableFields[number];


const paginationSortingHelper = (options: iOptions): iOptionsResult => {
    const page: number = Number(options.page ?? 1);
    if (Number.isNaN(page) || page < 1) {
        throw new Error("Invalid page");
    }
    const limit: number = Number(options.limit ?? 10);
    if (Number.isNaN(limit) || limit < 0) {
        throw new Error("Invalid limit");
    }
    const skip: number = (page - 1) * limit;

    const sortBy: SortField =
        sortableFields.includes(options.sortBy as SortField)
            ? (options.sortBy as SortField)
            : 'created_at';

    const sortOrder: "asc" | "desc" =
        options.sortOrder === 'asc' ? 'asc' : 'desc';

    return { page, limit, skip, sortBy, sortOrder };
}

export default paginationSortingHelper;