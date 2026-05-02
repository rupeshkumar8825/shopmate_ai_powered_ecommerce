-- DropForeignKey
ALTER TABLE "ShippingInfo" DROP CONSTRAINT "ShippingInfo_order_id_fkey";

-- AddForeignKey
ALTER TABLE "ShippingInfo" ADD CONSTRAINT "ShippingInfo_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
