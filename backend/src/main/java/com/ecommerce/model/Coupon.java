package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "coupons")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Coupon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false) private String code;
    @Enumerated(EnumType.STRING) private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private BigDecimal maximumDiscount;
    private Integer usageLimit;
    @Builder.Default private Integer usedCount = 0;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Builder.Default private boolean active = true;
    @CreationTimestamp private LocalDateTime createdAt;
    public enum DiscountType { PERCENTAGE, FIXED_AMOUNT }
}
