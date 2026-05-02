// service layer class to handle all the admin related apis

import prisma from "../config/prisma";
import { StatusCodes } from "../error/statusCodes";
import AppError from "../middlware/errorHandler";
import { CloudinaryService } from "./cloudinary.service";

export class AdminService {
    static async getAllUsersService(pages : number | undefined) {
        if(!pages){
            pages = 1;
        }

        const offset = (pages - 1) * 10;
        const allUsers = await prisma.user.findMany();

        const totalUsersCount = allUsers.length;


        const userList = await prisma.user.findMany({
            where : {role : "User"},
            skip : offset, 
            orderBy : {createdAt : "desc"}, 
            take : 10
        });

        // say everything went fine 
        return [totalUsersCount, userList];
    }

    static async deleteUserService(adminUserId : string | undefined, userIdToDelete : string | undefined) {
        // validation of the inputs to be done here 
        if(!adminUserId || !userIdToDelete){
            // throw error here 
            throw new AppError("Invalid admin user or invalid user to delete", StatusCodes.BAD_REQUEST_400);
        }

        /**
         * Actions to take in order to delete the user : 
         *      1. Delete all the products and all the reviews given by that particular user
         *      2. Then finally delete the user itself.
         *      3. After the deletion of the user we will delete its avatar from the cloudinary itself
         * Need to check the cascading effect itself of the database tables. 
         * 
         */

        const deleteUserResponse = await prisma.user.delete({
            where : {id : userIdToDelete}
        });

        if(!deleteUserResponse){
            // some error happened 
            throw new AppError("User deletion failed", StatusCodes.INTERNAL_ERROR_500);
        }

        const avatar = deleteUserResponse.avatar as {public_id? : string, url?:string} | null;
        // lets delete the user's avatar
        if(avatar?.public_id){
            // this means that the user do have the avatar uploaded on the cloudinary
            // lets delete that 
            await CloudinaryService.deleteFromCloudinaryService(avatar.public_id);
        }

        // else return this to the 
        return deleteUserResponse;

    }


    // service layer function to return the different dashboard stats
    static async getDashboardStatsService () {
        /**
         * Following data we need to return for showing on to the dashboard 
         *      1. Total revenue all time
         *      2. Today's Revenue 
         *      3. Yesterday's Revenue
         *      4. Total Users Count 
         *      5. Order status counts 
         *      6. Total Monthly Sales 
         *      7. Current Monthly Sales 
         *      8. Top Selling Products 
         *      9. Low stock products 
         *      10. Revenue Growth 
         *      11. New users this month
         */

        // lets start the implementation for the same 
        const today = new Date();
        const todayDate = today.toISOString().split("T")[0];
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split("T")[0];
        
        
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        // const 
        // lets print everything here for surety and to understand what is actually happening
        // and whether it is happening what we are expecting it or not. 
        const dateDebugObject = {
            currentMonthStart, 
            currentMonthEnd, 
            previousMonthStart, 
            previousMonthEnd
        };

        console.log(`(${new Date()})[AdminService, getDashboardStatsService] :- below are all the dates that we calculated : ${dateDebugObject}`);

        const totalRevenueAllTimeResponse = await prisma.order.aggregate({
            where : {
                payments : {
                    some : {payment_status : "Paid"}
                }
            }, 
            _sum : {total_price : true}, 
            _count : {id : true}
        });
        
        const allTimeRevenue = totalRevenueAllTimeResponse._sum.total_price ?? 0;
        const totalPaidOrdersCount = totalRevenueAllTimeResponse._count.id ?? 0;

        
        const totalUsersCountResponse = await prisma.user.aggregate({
            where : {role : "User"}, 
            _count : {id : true}
        });
        const totalUsersCount = totalUsersCountResponse._count.id ?? 0;

        const countsByStatus = await prisma.order.groupBy({
            by : ["order_status"], 
            _count: {
                // please note that _all here signifies that it will consider all the fields 
                // while counting the elements of the group by 
                // if we would used _id then it would calculate all the entries whose 
                // _id field is not null for this purpose. 
                _all : true,
            }
        });

        const orderStatusCounts = {
            Processing : 0, 
            Shipped : 0, 
            Delivered : 0, 
            Cancelled : 0
        };

        // now lets fill this up
        countsByStatus.forEach(element => {
            orderStatusCounts[element.order_status] = element._count._all;
        });

        console.log(`(${new Date()})[AdminService, getDashboardStatsService] :- the order status counts are as follows :\n ${orderStatusCounts}`);
        const now = new Date();
        const todayStart =  new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        console.log(`(${new Date()})[AdminService, getDashboardStatsService] : - the value of start od today and end of today is ${todayStart} and ${todayEnd}`);
        const todayRevenueQuery = await prisma.order.aggregate({
            // we need to find the sum of all the total price in the order whose payment status was Paid 
            // but we need to find the sum only for those whose successfull payment was done today itself. 
            // please note that we have created_at in order table but that is for when the order was creaed/ 
            // but it may happen that for that particular order the payment got cancelled and then user 
            // made another payment for the same order on next day. Hence it makes sense to filter the time
            // from the payments table itself 
            where : {
                paid_at : {gte : todayStart, lt : todayEnd},
                payments : {
                    some : {payment_status : "Paid"} 
                }, 
            }, 
            _sum : {total_price : true},
        });

        const todaysRevenue = todayRevenueQuery._sum.total_price ?? 0;

        const yesterdayStart = new Date(now);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);

        const yesterdayEnd = new Date(yesterdayStart);
        yesterdayEnd.setDate(yesterdayStart.getDate() + 1);
        
        console.log(`(${new Date()})[AdminService, getDashboardStatsService] : - the value of the yesterday start and yesterday end is ${yesterdayStart}, and ${yesterdayEnd} respectively`);
        // now lets write the similar query to find the yesterdays revenue for this purpose 
        const yesterRevenueQueryResponse = await prisma.order.aggregate({
            where : {
                paid_at : {gte : yesterdayStart, lt : yesterdayEnd}, 
                payments : {some : {payment_status : "Paid"}}
            }, 
            _sum : {total_price : true}
        });

        const yesterdayRevenue = yesterRevenueQueryResponse._sum.total_price ?? 0;
        
        // lets find out the monthly sales and then return this data to the client 
        // so that we can show this data as well on the admin dashboard for this purpose 
        // since this would be a complex query for the prisma hence we will have to write 
        // the query into the Raw SQL itself
        const monthlyRevenueResponse = await prisma.$queryRaw<Array<{month : Date; revenue : string }>>`
            SELECT 
                date_trunc('month', o.paid_at) AS month, 
                COALESCE(SUM(o.total_price), 0) AS revenue
            FROM "order" o
            WHERE 
                o.paid_at IS NOT NULL 
                AND o.paid_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
                AND EXISTS (
                    SELECT 1 
                    FROM "payments" p 
                    WHERE p.order_id = o.id
                        AND p.payment_status = 'Paid'
                )
            GROUP BY 1 
            ORDER BY 1;
        `

        // monthlyRevenueResponse example:
        // [
        //   { month: 2026-06-01T00:00:00.000Z, revenue: "15300.50" },
        //   { month: 2026-07-01T00:00:00.000Z, revenue: "9800.00"  },
        //   ...
        // ]

        // lets find the top selling products 
        const topSellingProductsResponse = await prisma.orderItem.groupBy({
            by: ["product_id"], 
            // first write the conditions on which products to look for
            where : {
                order : {payments : {some : {payment_status : "Paid"}}}
            },
            
            // once we have found such products then we will tell to sum the quantities. 
            _sum : {quantity : true}, 
            // define the order here
            orderBy : {_sum : {quantity : "desc"}},
            // define the limit here
            take : 10
        });

        
        // lets now find out the exact product details 
        let topSellingProductDetails = [];
        for (var currProductSellingDetails of topSellingProductsResponse) {
            const currentProduct = await prisma.product.findUnique({
                where : {id : currProductSellingDetails.product_id}
            });
            const currentProductDetails = {
                product : currentProduct, 
                quantitySold : currProductSellingDetails._sum.quantity ?? 0,
            }
            topSellingProductDetails.push(currentProductDetails);
        }
        
        console.log(`(${new Date()})[AdminService, getDashboardStatsService] : - the list of top selling products are as follows : - \n ${topSellingProductDetails}`);


        //lets now find the current month sales 
        const monthStart = new Date(now);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthStart.getMonth() + 1);
        monthEnd.setDate(1);
        monthEnd.setHours(0, 0, 0, 0);

        // lets write the query 
        const revenueOfLastMonthQueryResponse = await prisma.order.aggregate({
            where : {
                payments : {
                    some : {payment_status : "Paid"}
                }, 
                paid_at : {gte : monthStart, lt : monthEnd}
            }, 

            _sum : {total_price : true}
        });

        const revenueOfLastMonth = revenueOfLastMonthQueryResponse._sum.total_price ?? 0;

        // lets now find out the low stock products for this purpose
        const lowStockProductListQueryResponse = await prisma.product.findMany({
            where : {stock : {lte : 5}}
        });

        // lets find out the last month revenue query itself 
        // we already had this month start 
        // this will act as the lastMonthEnd
        const lastMonthEnd = new Date(monthStart)
        const lastMonthStart = new Date(monthStart);
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

        // write the actual query to find this 
        const lastMonthRevenueQueryResponse = await prisma.order.aggregate({
            where : {
                payments : {some : {payment_status : "Paid"}},
                paid_at : {gte : lastMonthStart, lt : lastMonthEnd}
            }, 

            _sum : {total_price : true}
        });

        const lastMonthRevenue = lastMonthRevenueQueryResponse._sum.total_price ?? 0;
        
        // lets find the new users that registered on this platform 
        const newUserRegisteredThisMonthQueryResponse = await prisma.user.aggregate({
            where : {
                createdAt : {gte : monthStart}
            }, 
            _count : {id : true}
        });

        const newUserRegisteredThisMonth = newUserRegisteredThisMonthQueryResponse._count.id ?? 0;


        // lets say everything went fine 
        return {
            allTimeRevenue, 
            totalPaidOrdersCount, 
            totalUsersCount,
            orderStatusCounts, 
            todaysRevenue,
            yesterdayRevenue,
            monthlyRevenueResponse, 
            topSellingProductDetails, 
            revenueOfLastMonth,
            lowStockProductListQueryResponse,
            lastMonthRevenue,
            newUserRegisteredThisMonth,
        }
        
    }
}