export interface GetAllProvidersParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    searchTerm?: string | undefined;
    isOpen?: boolean | undefined;
}

export interface GetProviderMealsParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    name?: string | undefined;
    cuisine?: string | string[] | undefined;
    price?: number | undefined;
}
