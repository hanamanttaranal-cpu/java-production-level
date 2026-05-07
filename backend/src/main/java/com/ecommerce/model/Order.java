package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "orders")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default private List<OrderItem> items = new ArrayList<>();
    @ManyToOne @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;
    @Enumerated(EnumType.STRING) @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    @Enumerated(EnumType.STRING) @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private String paymentMethod;
    private String paymentIntentId;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String trackingNumber;
    private LocalDateTime estimatedDelivery;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;

    public enum OrderStatus { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED, REFUNDED }
    public enum PaymentStatus { PENDING, PAID, FAILED, REFUNDED }
}
