# ShopMate — Database ER Diagram

A clean, visual reference of the ShopMate database schema. Renders automatically
on GitHub/GitLab and in VS Code (with a Mermaid preview extension).

> Source of truth: [`server/prisma/schema.prisma`](../server/prisma/schema.prisma) (PostgreSQL).
> For the full annotated reference (column notes, enums, cascade rules), see
> [`server/prisma/ER_DIAGRAM.md`](../server/prisma/ER_DIAGRAM.md).

```mermaid
erDiagram
    User ||--o{ Product       : "creates"
    User ||--o{ Reviews       : "writes"
    User ||--o{ Order         : "places"

    Product ||--o{ Reviews    : "receives"
    Product ||--o{ OrderItem  : "appears in"

    Order ||--o{ Payments     : "has"
    Order ||--o{ OrderItem    : "contains"
    Order ||--o| ShippingInfo : "ships to"

    User {
        uuid     id PK
        varchar  name
        varchar  email UK
        string   password
        Role     role
        json     avatar
        datetime createdAt
    }

    Product {
        uuid     id PK
        varchar  name
        decimal  price
        varchar  category
        decimal  ratings
        json     images
        int      stock
        uuid     created_by FK
    }

    Order {
        uuid        id PK
        uuid        buyer_id FK
        decimal     total_price
        decimal     tax_price
        decimal     shipping_price
        OrderStatus order_status
        datetime    paid_at
    }

    OrderItem {
        uuid    id PK
        uuid    order_id FK
        uuid    product_id FK
        int     quantity
        decimal price
        string  title
    }

    ShippingInfo {
        uuid    id PK
        uuid    order_id "FK, UK"
        varchar full_name
        varchar city
        varchar country
        varchar pincode
        varchar phone
    }

    Payments {
        uuid          id PK
        uuid          order_id FK
        PaymentType   payment_type
        PaymentStatus payment_status
        varchar       payment_intent_id UK
    }

    Reviews {
        uuid    id PK
        uuid    product_id FK
        uuid    user_id FK
        decimal rating
        string  comment
    }
```

**Legend:** `PK` primary key · `FK` foreign key · `UK` unique ·
`||` one · `o{` zero-or-many · `o|` zero-or-one.
