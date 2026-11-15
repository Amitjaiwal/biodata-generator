-- Minimal record of each purchase. No biodata content and no payer details are stored.
CREATE TABLE payment_order (
    id                  UUID         PRIMARY KEY,
    razorpay_order_id   VARCHAR(64)  NOT NULL,
    razorpay_payment_id VARCHAR(64),
    product_code        VARCHAR(32)  NOT NULL,
    template_id         VARCHAR(40),
    amount              INTEGER      NOT NULL,
    currency            VARCHAR(3)   NOT NULL,
    status              VARCHAR(16)  NOT NULL,
    demo                BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP    NOT NULL,
    paid_at             TIMESTAMP,
    expires_at          TIMESTAMP,
    CONSTRAINT uq_payment_order_rzp_order UNIQUE (razorpay_order_id),
    CONSTRAINT uq_payment_order_rzp_payment UNIQUE (razorpay_payment_id)
);

CREATE INDEX idx_payment_order_status ON payment_order (status);
