import { Product as PrismaProduct, Transaction as PrismaTransaction } from "@/src/generated/prisma/client"

export interface Product extends PrismaProduct {
    categoryName: string;
    associationName?: string;
}

export interface FormDataType {
    id?: string;
    name: string;
    description: string;
    price: number;
    quantity?: number;
    storageLocation?: string;
    owner?: string;
    categoryId?: string;
    categoryName?: string;
    imageUrl?: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    imageUrl: string;
    name: string;
    availableQuantity: number;
};

export interface Transaction extends PrismaTransaction {
    categoryName: string;
    productName: string;
    imageUrl?: string;
    price: number;
}

export interface ProductOverviewStats {
    totalProducts: number;
    totalCategories: number;
    totalTransactions: number;
    stockValue: number;
}

export interface ChartData {
    name: string;
    value: number;
}

export interface StockSummary {
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    criticalProducts: Product[];
}

export interface BasketItemView {
    id: string;
    productId: string;
    quantity: number;
    productName: string;
    price: number;
    imageUrl: string;
    availableQuantity: number;
    associationName: string;
}

export interface OrderView {
    id: string;
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "denied";
    createdAt: Date;
    buyerName?: string;
    sellerName?: string;
}

export interface NotificationView {
    id: string;
    message: string;
    read: boolean;
    createdAt: Date;
}