export interface GetMealsParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    name?: string | undefined;
    cuisine?: string | string[] | undefined;
    price?: number | undefined;
    [key: string]: any;
}