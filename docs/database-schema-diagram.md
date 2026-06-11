# ShopMate — Database Schema Diagram (Plain Text)

A complete, self-contained ER diagram of the ShopMate database rendered as plain
ASCII text. Unlike Mermaid, this needs no special renderer — it displays exactly
as drawn in any Markdown viewer, plain text editor, or terminal.

> Source of truth: [`server/prisma/schema.prisma`](../server/prisma/schema.prisma) (PostgreSQL).

**Legend:** `PK` = primary key · `FK` = foreign key · `UK` = unique · `?` = nullable ·
`(1:N)` = one-to-many · `(1:0..1)` = one-to-zero-or-one.

---

## 1. Relationship Overview

How the seven tables connect. All foreign keys cascade on delete (deleting a
parent row deletes its children).

```text
                                       +-----------+
                       writes (1:N)    |  Reviews  |    receives (1:N)
                   +------------------>|           |<------------------+
                   |                   +-----------+                   |
                   |                                                   |
             +-----+-----+   creates (1:N)    +-----------+            |
             |   User    |------------------->|  Product  |------------+
             |           |                    |           |
             +-----+-----+                    +-----+-----+
                   |                                |
                   | places (1:N)                   | appears in (1:N)
                   v                                v
             +-----------+   contains (1:N)   +-----------+
             |   Order   |------------------->| OrderItem |
             |           |                    +-----------+
             +-----+-----+
                   |
                   | has (1:N)               +------------+
                   +------------------------>|  Payments  |
                   |                         +------------+
                   |
                   | ships to (1:0..1)       +--------------+
                   +------------------------>| ShippingInfo |
                                             +--------------+
```

---

## 2. Tables (Full Columns)

```text
+------------------------------------------+
| User                                     |
+------------------------------------------+
| PK    id                    uuid         |
| UK    email                 varchar(100) |
|       name                  varchar(100) |
|       password              text         |
|       role                  Role (enum)  |
|       avatar                json?        |
|       resetPasswordToken    text?        |
|       resetPasswordExpires  datetime?    |
|       createdAt             datetime     |
+------------------------------------------+

+------------------------------------+
| Product                            |
+------------------------------------+
| PK    id           uuid            |
|       name         varchar(100)    |
|       description  text            |
|       price        decimal(10,2)   |
|       category     varchar(100)    |
|       ratings      decimal(3,2)    |
|       images       json[]          |
|       stock        int             |
| FK    created_by   uuid -> User.id |
|       created_at   datetime        |
+------------------------------------+

+------------------------------------------+
| Order                                    |
+------------------------------------------+
| PK    id              uuid               |
| FK    buyer_id        uuid -> User.id    |
|       total_price     decimal(10,2)      |
|       tax_price       decimal(10,2)      |
|       shipping_price  decimal(10,2)      |
|       order_status    OrderStatus (enum) |
|       paid_at         datetime?          |
|       created_at      datetime           |
+------------------------------------------+

+--------------------------------------+
| OrderItem                            |
+--------------------------------------+
| PK    id          uuid               |
| FK    order_id    uuid -> Order.id   |
| FK    product_id  uuid -> Product.id |
|       quantity    int                |
|       price       decimal(10,2)      |
|       image       text               |
|       title       text               |
|       created_at  datetime           |
+--------------------------------------+

+-----------------------------------+
| ShippingInfo                      |
+-----------------------------------+
| PK    id         uuid             |
| FK,UK order_id   uuid -> Order.id |
|       full_name  varchar(100)     |
|       state      varchar(100)     |
|       city       varchar(100)     |
|       country    varchar(100)     |
|       address    text             |
|       pincode    varchar(20)      |
|       phone      varchar(20)      |
+-----------------------------------+

+-----------------------------------------------+
| Payments                                      |
+-----------------------------------------------+
| PK    id                 uuid                 |
| FK    order_id           uuid -> Order.id     |
|       payment_type       PaymentType (enum)   |
|       payment_status     PaymentStatus (enum) |
| UK    payment_intent_id  varchar(255)         |
|       created_at         datetime             |
+-----------------------------------------------+

+--------------------------------------+
| Reviews                              |
+--------------------------------------+
| PK    id          uuid               |
| FK    product_id  uuid -> Product.id |
| FK    user_id     uuid -> User.id    |
|       rating      decimal(3,2)       |
|       comment     text               |
|       created_at  datetime           |
+--------------------------------------+
```

---

## 3. Relationship Reference

```text
PARENT        CHILD          FK COLUMN                  CARDINALITY   ON DELETE
-----------   ------------   ------------------------   -----------   ---------
User          Product        Product.created_by         1 : N         Cascade
User          Order          Order.buyer_id             1 : N         Cascade
User          Reviews        Reviews.user_id            1 : N         Cascade
Product       Reviews        Reviews.product_id         1 : N         Cascade
Product       OrderItem      OrderItem.product_id       1 : N         Cascade
Order         OrderItem      OrderItem.order_id         1 : N         Cascade
Order         Payments       Payments.order_id          1 : N         Cascade
Order         ShippingInfo   ShippingInfo.order_id (UK) 1 : 0..1      Cascade
```

---

## 4. Enums

```text
Role           : User | Admin                          (default: User)
OrderStatus    : Processing | Shipped | Delivered | Cancelled  (default: Processing)
PaymentType    : Online | Offline                      (default: Online)
PaymentStatus  : Paid | Pending | Failed               (default: Pending)
```
