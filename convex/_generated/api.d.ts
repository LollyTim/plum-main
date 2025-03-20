/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as carts from "../carts.js";
import type * as customers from "../customers.js";
import type * as insertDummyData from "../insertDummyData.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as userAddresses from "../userAddresses.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  carts: typeof carts;
  customers: typeof customers;
  insertDummyData: typeof insertDummyData;
  orders: typeof orders;
  products: typeof products;
  userAddresses: typeof userAddresses;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
